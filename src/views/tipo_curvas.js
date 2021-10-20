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
//const url = "http://localhost:9000/tipo_curvas";
//const urlAuxiliar = "http://localhost:9000/referencias";
//const urlAuxilir2 = "http://localhost:9000/grupocurvas";
//const urlAuxilir3 = "http://localhost:9000/unidades";

const columns = [
    { title: 'Nombre', field: 'nombre' },
    { title: 'Tag', field: 'tag' },
    { title: 'Unidad', field: 'unidad_nombre' },
    //{ title: 'Curva de referencia', field: 'referencia_nombre' },
    //{ title: 'Agrupada en', field: 'grupo_curva_nombre' }
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


class viewTiposCurvas extends Component {

    state = {
        data: [],
        dataReferencia: [],
        dataGrupoCurva: [],
        dataUnidad: [],
        modalInsertar: false,
        modalEliminar: false,
        tipoModal: '', 
        form: { id: '', nombre: '', tag: '', unidad_id: '', referencia_id: '', grupo_curva_id: '', estado_id: '', referencia_nombre: '', grupo_curva_nombre: '', unidad_nombre: '', pkuser: ''  }
    }


    peticionGet = async () => {
        axios.get(URL + 'tipo_curvas').then(response => {
            this.setState({ data: response.data });
        }).catch(error => {
            console.log(error.message);
        })
    };


    useEffect = () => {
        this.peticionGet();
    };

    /*
    peticionReferenciasGet = () => {
        axios.get(urlAuxiliar).then(response => {
            this.setState({ dataReferencia: response.data });
        }).catch(error => {
            console.log(error.message);
        })
    }

    peticionGrupoCurvasGet = () => {
        axios.get(urlAuxilir2).then(response => {
            this.setState({ dataGrupoCurva: response.data });
        }).catch(error => {
            console.log(error.message);
        })
    }
    */
    
    peticionUnidadesGet = () => {
        axios.get(URL + 'unidades').then(response => {
            this.setState({ dataUnidad: response.data });
        }).catch(error => {
            console.log(error.message);
        })
    }


    peticionPost = async () => { 
        delete this.state.form.id;
        await axios.post(URL + 'tipo_curvas', this.state.form).then(response => {
            this.modalInsertar();
            this.peticionGet();
        }).catch(error => {
            console.log(error.message);
        })
    }


    peticionPut = () => { 
        axios.put(URL + 'tipo_curvas', this.state.form).then(response => {
            this.modalInsertar();
            this.peticionGet();
        })
    }


    peticionDelete = () => { 
        var datos = {
            'id': this.state.form.id,
            'pkuser': cookies.get('pk_usuario_sesion')
        };
         
        axios.delete(URL + 'tipo_curvas', { data: datos }).then(response => {
            this.setState({ modalEliminar: false });
            this.peticionGet();
        })
    }


    modalInsertar = () => {
        this.setState({ modalInsertar: !this.state.modalInsertar });
    }


    seleccionarRegistro = (tipo_curvas) => {
        this.setState({
            tipoModal: 'actualizar', 
            form: {
                id: tipo_curvas.id,
                nombre: tipo_curvas.nombre,
                tag: tipo_curvas.tag,
                unidad_id: tipo_curvas.unidad_id,
                //referencia_id: tipo_curvas.referencia_id,
                //grupo_curva_id: tipo_curvas.grupo_curva_id,
                estado_id: tipo_curvas.estado_id
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
        this.state.form.pkuser = cookies.get('pk_usuario_sesion');
    }


    componentDidMount() {
        this.peticionGet();
        //this.peticionReferenciasGet();
        //this.peticionGrupoCurvasGet();
        this.peticionUnidadesGet();
    }


    render() {
        const { form } = this.state;
        return (
            <div className="App">
                
                <Cabecera />
                <SideBar pageWrapId={"page-wrap"} outerContainerId={"App"} />

                <div className="containerCuatro">
                    <button className="btn btn-success" onClick={() => { this.setState({ form: null, tipoModal: 'insertar' }); this.modalInsertar() }}> <AddBox icon={tableIcons.Add} /> Agregar Tipo</button>
                </div> 
                <div className="form-group col-11" style={{ float: 'left', padding: '30px 0 0 30px' }} >
                <Materialtable
                    title={"Listado de Tipos de Curvas"}
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
                        <span style={{ float: 'right' }} onClick={() => this.modalInsertar()}><CancelIcon icon={tableIcons.CancelIcon} /> </span>
                        {this.state.tipoModal === 'insertar' ?
                            <label htmlFor="nombre">Nuevo Tipo de Curva</label> :
                            <label htmlFor="nombre">Editar Tipo de Curva</label>
                        }
                    </ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <input className="form-control" type="hidden" name="id" id="id" readOnly onChange={this.handleChange} value={form ? form.id : this.state.data.length + 1} />
                            <label htmlFor="nombre">Nombre</label>
                            <input className="form-control" type="text" name="nombre" id="nombre" onChange={this.handleChange} value={form ? form.nombre : ''} />
                            <br />
                            <label htmlFor="tag">Tag</label>
                            <input className="form-control" type="text" name="tag" id="tag" onChange={this.handleChange} value={form ? form.tag : ''} />
                            <br />
                            <label htmlFor="unidad_id">Unidad de Medida</label>
                            <select name="unidad_id" id="unidad_id" className="form-control" onChange={this.handleChange} defaultValue={form ? form.unidad_id : ''}>
                                <option key="0" value="0">Seleccionar</option>
                                {this.state.dataUnidad.map(elemento => (<option key={elemento.id} value={elemento.id}>[{elemento.tag}] {elemento.nombre}</option>))}
                            </select>

                            {/* <br />
                            <label htmlFor="referencia_id">Referencia</label>
                            <select name="referencia_id" id="referencia_id" className="form-control" onChange={this.handleChange} defaultValue={form ? form.referencia_id : ''}>
                                <option key="0" value="0">Seleccionar</option>
                                {this.state.dataReferencia.map(elemento => (<option key={elemento.id} value={elemento.id}>{elemento.nombre}</option>))}
                            </select>
                            <br />
                            <label htmlFor="grupo_curva_id">Agrupada en</label>
                            <select name="grupo_curva_id" id="grupo_curva_id" className="form-control" onChange={this.handleChange} defaultValue={form ? form.grupo_curva_id : ''}>
                                <option key="0" value="0">Seleccionar</option>
                                {this.state.dataGrupoCurva.map(elemento => (<option key={elemento.id} value={elemento.id}>{elemento.nombre}</option>))}
                            </select> */}

                        </div>
                    </ModalBody>

                    <ModalFooter>
                        {this.state.tipoModal === 'insertar' ?
                            <button className="btn btn-success" onClick={() => this.peticionPost()}><Save icon={tableIcons.Save} /> Insertar </button> :
                            <button className="btn btn-primary" onClick={() => this.peticionPut()}> <Save icon={tableIcons.Save} /> Actualizar </button>
                        }
                        <button className="btn btn-danger" onClick={() => this.modalInsertar()}> <CancelIcon icon={tableIcons.CancelIcon} /> Cancelar</button>
                    </ModalFooter>
                </Modal>


                <Modal isOpen={this.state.modalEliminar}>
                    <ModalBody>
                        <DeleteOutline /> Est&aacute;s seguro que deseas eliminar el registro?
                        <div className="form-group">
                            <br />
                            <input className="form-control" type="hidden" name="id" id="id" readOnly onChange={this.handleChange} value={form ? form.id : this.state.data.length + 1} />
                            <label htmlFor="nombre">Nombre</label> &nbsp;  {form ? form.nombre : ''  }  
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
export default viewTiposCurvas;