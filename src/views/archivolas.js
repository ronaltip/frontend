import React, { Component, forwardRef } from 'react';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import Materialtable from 'material-table'; 
import { CSVReader } from 'react-papaparse';

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
import ComboLabelHomologacionLas from "../componentes/combolabel2";
import Cabecera from "../componentes/cabecera";
import '../css/styles.css';
const cookies = new Cookies();

const url = "http://localhost:9000/archivolas";
const urlAuxiliar = "http://localhost:9000/wells";
const urlAuxilir2 = "http://localhost:9000/notificaciones";

const buttonRef = React.createRef();

const columns = [
    { title: 'Pozo', field: 'nombre_wells' },    
    { title: 'Encabezados', field: 'columnas' }, 
    { title: 'Fecha de Cargue', field: 'fecha_creacion' }, 
];

var ArrayD = []; 

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



class viewArchivoLas extends Component {

    state = {
        data: [],
        data2: [],
        dataWells: [],
        campos: [],
        dataArray : [],
        modalInsertar: false,
        modalEliminar: false,
        form: { id: '', wells_id: '', estado_id: '', pkuser: '', filedato: '', random: '', orden: '', nombre_wells: '', campo:[]} ,
        form2: { tipo_notificacion_id: '', pkuser: '' } ,
        archivo_las_encabezado_pk:'',
        tipoModal: 'insertar'
    }


  

    peticionGet = async () => {
        axios.get(url).then(response => {
            this.setState({ data: response.data });
        }).catch(error => {
            console.log(error.message);
        })
    };

    useEffect = () => {
        this.peticionGet();
    };


    peticionWellsGet = () => {
        axios.get(urlAuxiliar).then(response => {
            this.setState({ dataWells: response.data });
        }).catch(error => {
            console.log(error.message);
        })
    }


 

    peticionPost  = async () => {      
        var datos = '';
        delete this.state.form.id;  
        this.state.form.random = Math.random()  ;
        for (let i = 1; i < ArrayD.value.length-1; i++) {
            datos = ArrayD.value[i].data; 
            this.state.form.filedato = datos.join();  
            this.state.form.orden = i; 
            await axios.post(url, this.state.form).then(response => {                
            }).catch(error => {
                console.log(error.message);
            })
        }

         
        this.state.form2.pkuser = cookies.get('pk_usuario_sesion');
        this.state.form2.tipo_notificacion_id = 2;
        await axios.post(urlAuxilir2, this.state.form2).then(response => {
        }).catch(error => {
            console.log(error.message);
        })

        this.modalInsertar();
        this.peticionGet();
        
    }



    peticionPut = () => {
        console.log(this.state.form)
        axios.put(url, this.state.form).then(response => {
            this.modalInsertar();
            this.peticionGet();
        })
    }



    peticionDelete = () => { 
        var datos = {
            'id': this.state.form.id,
            'pkuser': cookies.get('pk_usuario_sesion')
        };
         
        axios.delete(url, { params: datos }).then(response => {
            this.setState({ modalEliminar: false });
            this.peticionGet();
        })
    }



    modalInsertar = () => {
        this.setState({ modalInsertar: !this.state.modalInsertar });
    }



    seleccionarRegistro = (ardhivolas) => {

        axios.get(url + '?od=' + ardhivolas.id).then(response => {
            this.setState({ data2: response.data });
            this.setState({ archivo_las_encabezado_pk: ardhivolas.id})
        }).catch(error => {
            console.log(error.message);
        }) 



        this.setState({
            tipoModal: 'actualizar',
            form: {
                id: ardhivolas.id,  
                wells_id: ardhivolas.wells_id, 
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
        console.log(this.state.form);         
    }
      

    componentDidMount() {
        this.peticionGet();
        this.peticionWellsGet();
    }
     
    handleOpenDialog = (e) => {
        if (buttonRef.current) {
            buttonRef.current.open(e);
        }
    };

    handleOnFileLoad = (data) => {         
        ArrayD.value = data;     
    };

    handleOnError = (err, file, inputElem, reason) => {
        console.log(err);
    };


    getResponse(reg) { 
        this.state.campos.push(reg);
        //this.state.form.campo = this.state.campos;
        //this.state.form.pkuser = cookies.get('pk_usuario_sesion');
        this.setState({ 
            form: {
                campo : this.state.campos,
                pkuser:cookies.get('pk_usuario_sesion') 
            }
        });

        console.log(this.state.form);
    }


    render() {
        const { form } = this.state;
        
        return (
            <div className="App">
                <Cabecera />
                <SideBar pageWrapId={"page-wrap"} outerContainerId={"App"} />

                 <div className="containerCuatro">
                    <button className="btn btn-success" onClick={() => { this.setState({ form: null, tipoModal: 'insertar' }); this.modalInsertar() }}> <AddBox icon={tableIcons.Add} /> Agregar .las</button>
                 </div>
                 <div className="form-group col-11" style={{ float: 'left', padding: '30px 0 0 30px' }} >
                    <Materialtable
                        title={"Listado de Archivo .Las"}
                        columns={columns}
                        data={this.state.data}
                        icons={tableIcons}
                        actions={[ 
                         
                            {
                                icon: tableIcons.ViewColumn,
                                tooltip: 'Actualizar',
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
                            <label htmlFor="nombre">Nuevo Archivo .las</label> :
                            <label htmlFor="nombre">Editar Archivo de .las</label>
                        }
                    </ModalHeader>
                    <ModalBody>
                        {this.state.tipoModal === 'insertar' ?
                            <div className="form-group">
                                <input className="form-control" type="hidden" name="id" id="id" readOnly onChange={this.handleChange} value={form ? form.id : this.state.data.length + 1} />
                                <label htmlFor="nombre">Adjunte el Archivo .Las (.las)</label>
                                <br />
                                <label htmlFor="wells_id">Wells</label>
                                <select name="wells_id" id="wells_id" className="form-control" onChange={this.handleChange} defaultValue={form ? form.wells_id : ''}>
                                    <option key="0" value="0">Seleccionar</option>
                                    {this.state.dataWells.map(elemento => (<option key={elemento.id} value={elemento.id}>{elemento.tag} - {elemento.nombre}  </option>))}
                                </select>
                                <br />
                                <CSVReader
                                    ref={buttonRef}
                                    onFileLoad={this.handleOnFileLoad}
                                    onError={this.handleOnError}
                                    noClick
                                    noDrag
                                >
                                    {({ file }) => (
                                        <aside
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                marginBottom: 10,
                                            }}
                                        >
                                            <button
                                                className="form-control"
                                                type="button"
                                                onClick={this.handleOpenDialog}
                                                style={{
                                                    borderRadius: 0,
                                                    marginLeft: 0,
                                                    marginRight: 0,
                                                    width: '30%',
                                                    paddingLeft: 0,
                                                    paddingRight: 0,
                                                }}
                                            >
                                                Adjuntar archivo
                                        </button>
                                            <div
                                                style={{
                                                    borderWidth: 1,
                                                    borderStyle: 'solid',
                                                    borderColor: '#ccc',
                                                    height: 37,
                                                    lineHeight: 2.0,
                                                    marginTop: 2,
                                                    marginBottom: 5,
                                                    paddingLeft: 13,
                                                    paddingTop: 3,
                                                    width: '70%',
                                                }}
                                            >
                                                {file && file.name}
                                            </div>

                                        </aside>
                                    )}
                                </CSVReader>

                            </div>
                            :
                            <div className="form-group">
                                <input className="form-control" type="hidden" name="id" id="id" readOnly onChange={this.handleChange} value={form ? form.id : this.state.data.length + 1} />
                                <label htmlFor="nombre">Adjunte el Archivo .Las (.las)</label>
                                <br />
                                <label htmlFor="wells_id">Wells</label>
                                <select name="wells_id" id="wells_id" className="form-control" onChange={this.handleChange} defaultValue={form ? form.wells_id : ''}>
                                    <option key="0" value="0">Seleccionar</option>
                                    {this.state.dataWells.map(elemento => (<option key={elemento.id} value={elemento.id}>{elemento.tag} - {elemento.nombre}  </option>))}
                                </select>
                                <br /> 
                                {this.state.data2.map(elemento => (<ComboLabelHomologacionLas id={form.id} campo={elemento.campos}  callback={this.getResponse.bind(this)} />))}

                            </div>
                            }
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
                        <DeleteOutline/> Est&aacute;s seguro que deseas eliminar el registro?
                            <div className="form-group">
                            <br />
                            <input className="form-control" type="hidden" name="id" id="id" readOnly onChange={this.handleChange} value={form ? form.id : this.state.data.length + 1} />
                            <label htmlFor="nombre">Nombre: &nbsp; </label>
                            {form ? form.nombre_wells : ''}  
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <br />
                        <button className="btn btn-danger" onClick={() => this.peticionDelete()}>Si</button>
                        <button className="btn btn-secundary" onClick={() => this.setState({ modalEliminar: false })}>No</button>
                    </ModalFooter>
                </Modal>
            </div>

        );
    }
}
export default viewArchivoLas;