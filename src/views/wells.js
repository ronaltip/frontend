import React, { Component, forwardRef } from 'react';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import Materialtable from 'material-table';

import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import CancelIcon from '@material-ui/icons/Cancel';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import Save from '@material-ui/icons/Save';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

import Cookies from 'universal-cookie';
import SideBar from "../componentes/sidebar";
import Cabecera from "../componentes/cabecera";
import '../css/styles.css';
const cookies = new Cookies();

const URL = process.env.REACT_APP_API_HOST;
//const url = "http://localhost:9000/wells";
//const urlAuxiliar = "http://localhost:9000/estructuras";

const columns = [
    { title: 'Campo', field: 'campo' },
    { title: 'Nombre', field: 'nombre' },
    { title: 'Tag', field: 'tag' },
    { title: 'IP', field: 'ip' },
    { title: 'Puerto', field: 'puerto' },
    { title: 'Url', field: 'url' }
];


const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
}



class viewWells extends Component {

    state = {
        data: [],
        dataFields: [],
        modalInsertar: false,
        modalEliminar: false,
        tipoModal: '',
        form: { id: '', nombre: '', tag: '', ip: '', puerto: '', url: '', usuario: '', clave: '',  estado_id: '',  pkuser: '', field_id: '' }
    }



    peticionGet = async () => {
        axios.get(URL + 'wells').then(response => {
            this.setState({ data: response.data });
        }).catch(error => {
            console.log(error.message);
        })
    };

    useEffect = () => {
        this.peticionGet();
    };


    peticionCamposGet = () => {
        axios.get(URL + 'fields').then(response => {
            this.setState({ dataFields: response.data });
        }).catch(error => {
            console.log(error.message);
        })
    }


    peticionPost = async () => { 
        delete this.state.form.id;
        await axios.post(URL + 'wells', this.state.form).then(response => {
            this.modalInsertar();
            this.peticionGet();
        }).catch(error => {
            console.log(error.message);
        })
    }


    peticionPut = () => { 
        axios.put(URL + 'wells', this.state.form).then(response => {
            this.modalInsertar();
            this.peticionGet();
        })
    }

    peticionDelete = () => {        
        var datos = {
            'id': this.state.form.id,
            'pkuser': cookies.get('pk_usuario_sesion')
        };

        axios.delete(URL + 'wells', { data: datos }).then(response => {
            this.setState({ modalEliminar: false });
            this.peticionGet();
        })
    }



    modalInsertar = () => {
        this.setState({ modalInsertar: !this.state.modalInsertar });
    }



    seleccionarRegistro = (wells) => {
        this.setState({
            tipoModal: 'actualizar',
            form: {
                id: wells.id,
                nombre: wells.nombre,
                tag: wells.tag,
                ip: wells.ip,
                puerto: wells.puerto,
                url: wells.url,
                usuario: wells.usuario,
                clave: wells.clave, 
                estado_id: wells.estado_id,
                field_id: wells.field_id
            }
        })
    }

    handleChange = async e => {
        e.persist();
        await this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        });
        //console.log(this.state.form);
        this.state.form.pkuser = cookies.get('pk_usuario_sesion');
    }

    componentDidMount() {
        this.peticionGet();
        this.peticionCamposGet();
    }


    render() {
        const { form } = this.state;
        
        return (
            <div className="App">
                <Cabecera />
                <SideBar pageWrapId={"page-wrap"} outerContainerId={"App"} />

                <div className="containerCuatro">
                    <button className="btn btn-success" onClick={() => { this.setState({ form: null, tipoModal: 'insertar' }); this.modalInsertar() }}> <AddBox icon={tableIcons.Add} /> Agregar Pozo</button>
                </div>
                <div className="form-group col-11" style={{ float: 'left', padding: '30px 0 0 30px' }} >
                <Materialtable
                    title={"Listado de Pozos"}
                    columns={columns}
                    data={this.state.data}
                    icons={tableIcons}
                    actions={[
                        {
                            icon: tableIcons.Edit,
                            tooltip: 'Editar',
                            onClick: (event, rowData) => { this.seleccionarRegistro(rowData); this.modalInsertar() }
                        },
                        {
                            icon: tableIcons.Delete,
                            tooltip: 'Eliminar',
                            onClick: (event, rowData) => { this.seleccionarRegistro(rowData); this.setState({ modalEliminar: true }) }
                        }
                    ]}
                    options={{
                        actionsColumnIndex: -1
                    }}
                    localization={{
                        header: { actions: 'Acciones' }
                    }}
                />
                </div>

                <Modal isOpen={this.state.modalInsertar}>
                    <ModalHeader style={{ display: 'block' }}>
                        <span style={{ float: 'right', cursor: 'pointer' }} onClick={() => this.modalInsertar()}><CancelIcon /> </span>
                        {this.state.tipoModal === 'insertar' ?
                            <label htmlFor="nombre">Nuevo Pozo</label> :
                            <label htmlFor="nombre">Editar Pozo</label>
                        }
                    </ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <label htmlFor="field_id">Campo</label>
                            <select name="field_id" id="wells_id" className="form-control" onChange={this.handleChange} defaultValue={form ? form.field_id : ''}>
                                <option key="0" value="0">Seleccionar</option>
                                {this.state.dataFields.map(elemento => (<option key={elemento.id} value={elemento.id}>{elemento.nombre}</option>))}
                            </select>
                            <br />
                            <input className="form-control" type="hidden" name="id" id="id" readOnly onChange={this.handleChange} value={form ? form.id : this.state.data.length + 1} />
                            <label htmlFor="nombre">Nombre</label>
                            <input className="form-control" type="text" name="nombre" id="nombre" onChange={this.handleChange} value={form ? form.nombre : ''} />
                            <br />
                            <label htmlFor="tag">Tag</label>
                            <input className="form-control" type="text" name="tag" id="tag" onChange={this.handleChange} value={form ? form.tag : ''} />
                            <br />
                            <label htmlFor="ip">Direcci&oacute;n IP</label>
                            <input className="form-control" type="text" name="ip" id="ip" onChange={this.handleChange} value={form ? form.ip : ''} />
                            <br />
                            <label htmlFor="puerto">Puerto</label>
                            <input className="form-control" type="text" name="puerto" id="puerto" onChange={this.handleChange} value={form ? form.puerto : ''} />
                            <br />
                            <label htmlFor="url">URL</label>
                            <input className="form-control" type="text" name="url" id="url" onChange={this.handleChange} value={form ? form.url : ''} />
                            <br />
                            {/* <label htmlFor="usuario">Usuario</label>
                            <input className="form-control" type="text" name="usuario" id="usuario" onChange={this.handleChange} value={form ? form.usuario : ''} />
                            <br />
                            <label htmlFor="clave">Clave</label>
                            <input className="form-control" type="text" name="clave" id="clave" onChange={this.handleChange} value={form ? form.clave : ''} />
                            <br /> */}

                        </div>
                    </ModalBody>

                    <ModalFooter>
                        {this.state.tipoModal === 'insertar' ?
                            <button className="btn btn-success" onClick={() => this.peticionPost()}><Save  /> Insertar </button> :
                            <button className="btn btn-primary" onClick={() => this.peticionPut()}> <Save  /> Actualizar </button>
                        }
                        <button className="btn btn-danger" onClick={() => this.modalInsertar()}> <CancelIcon /> Cancelar</button>
                    </ModalFooter>
                </Modal>


                <Modal isOpen={this.state.modalEliminar}>
                    <ModalBody>
                        <DeleteOutline /> Est&aacute;s seguro que deseas eliminar el registro?
                        <div className="form-group">
                            <br />
                            <input className="form-control" type="hidden" name="id" id="id" readOnly onChange={this.handleChange} value={form ? form.id : this.state.data.length + 1} />
                            <label htmlFor="nombre">Nombre</label> &nbsp;  {form ? form.nombre : '' }  
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-danger" onClick={() => this.peticionDelete()}>Si</button>
                        <button className="btn btn-secundary" onClick={() => this.setState({ modalEliminar: false })}>No</button>
                    </ModalFooter>
                </Modal>
            </div>



        );
    }
}
export default viewWells;