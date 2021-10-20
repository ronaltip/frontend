import React, { Component, forwardRef } from 'react';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Link } from 'react-router-dom';
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
import MultilineChartTwoToneIcon from '@material-ui/icons/MultilineChartTwoTone';
import Remove from '@material-ui/icons/Remove';
import PlaylistAddSharpIcon from '@material-ui/icons/PlaylistAddSharp'; 
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

import Cookies from 'universal-cookie';
import SideBar from "../componentes/sidebar";
import Cabecera from "../componentes/cabecera";
import '../css/styles.css';
const cookies = new Cookies();

const url = "http://localhost:9000/template_config";
const urlAuxiliar1 = "http://localhost:9000/template_track_config"; 
const urlAuxiliar3= "http://localhost:9000/tipo_curvas";
 

const columns = [
    { title: 'Pozo', field: 'nombre_pozo' },
    { title: 'Archivo .Las', field: 'nombre_archivo' },
    { title: 'DATETIME', field: 'datetime' },
    { title: 'DBTM', field: 'dbtm' },
    { title: 'DMEA', field: 'dmea' },
    { title: 'MFIA', field: 'mfia' },
    { title: 'RPM', field: 'rpm' },
    { title: 'ROPA', field: 'ropa' },
    { title: 'TQA', field: 'tqa' },
    { title: 'WOB', field: 'wob' },
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
    Multiline: forwardRef((props, ref) => <MultilineChartTwoToneIcon {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
    PlaylistAddSharpIcon: forwardRef((props, ref) => <PlaylistAddSharpIcon {...props} ref={ref} />)
}


class viewVisualConfigLista extends Component {

    state = {
        data: [],
        data1: [],
        dataTipoTrack: [],
        dataTipoCurva: [],
        modalInsertar: false,     
        modalEliminar: false,       
        nombreck:'',
        form: { id: '', wells_id: '', archivo_encabezado_id: '', datetime: '', dmea: '', dbtm: '', rpm: '', ropa: '', mfia: '', tqa: '', wob: '', pkuser: '' },
        form2: { id: '', template_config_id: '', tipo_track_id: '', tipo_curva_id: '', origen:'', pkuser: '' }
    }

    peticionGet = async () => {
        axios.get(url).then(response => {
            this.setState({ data: response.data });
        }).catch(error => {
            console.log(error.message);
        })
    };

    peticionGetTipoCurva = async (registro) => {  
        axios.get(urlAuxiliar3 + "?id=" + registro.id).then(response => {
            this.setState({ dataTipoCurva: response.data });            
        }).catch(error => {
            console.log(error.message);
        })        
    };

    peticionGetTrack = async (registro) => {
        axios.get(urlAuxiliar1+"?id="+registro.id).then(response => {
            this.setState({ data1: response.data });
        }).catch(error => {
            console.log(error.message);
        })   
    };
     

    useEffect = () => {
        //this.peticionGet();
    };

    peticionDeleteTemplateTrack = (template_track_config) => {

        var datos = {
            'id': template_track_config.template_track_config_id,
            'pkuser': cookies.get('pk_usuario_sesion')
        };
         
                
         axios.delete(urlAuxiliar1, { params: datos }).then(response => {
             this.peticionGetTrack(this.state.form);
        }) 
    }


    peticionAInsetarTemplateTrack = async (ttc) => {      

        delete this.state.form2.id; 
        this.state.form2.template_config_id = ttc.template_config_id;
        this.state.form2.tipo_track_id = ttc.tipo_track_id;
        this.state.form2.tipo_curva_id = ttc.tipo_curva_id;
        this.state.form2.origen = ttc.origen;
        this.state.form2.pkuser = cookies.get('pk_usuario_sesion');

         
        await axios.post(urlAuxiliar1, this.state.form2 ).then(response => {
            this.peticionGetTrack(this.state.form);
        }).catch(error => {
            console.log(error.message);
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

    IrAEditar = (templateconfig) => {
        this.props.history.push('/visual_config_edi'+templateconfig.id);          
    }

    IrAGraficar = (templateconfig) => {
        this.props.history.push('/visual_historicos_dp' + templateconfig.id);
    }
    IrAGraficarComp = (templateconfig) => {
        this.props.history.push('/visual_historicos_dc/' + 1);
    }

    modalInsertar = () => {
        this.setState({ modalInsertar: !this.state.modalInsertar });
    }

    seleccionarRegistro = (templateconfig) => {
        this.setState({
            tipoModal: 'actualizar',
            form: {
                id: templateconfig.id,
                wells_id: templateconfig.wells_id,
                archivo_encabezado_id: templateconfig.archivo_encabezado_id,
                datetime: templateconfig.datetime,
                dmea: templateconfig.dmea,
                dbtm: templateconfig.dbtm,
                rpm:  templateconfig.rpm,
                ropa: templateconfig.ropa,
                mfia: templateconfig.mfia,
                tqa:  templateconfig.tqa,
                wob:  templateconfig.wob 
            },
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
    }

    modalEliminar = () => {
        this.setState({ modalEliminar: !this.state.modalEliminar });
    }


    render() {

        const { form, form2 } = this.state;
        
        return (
            <div className="App">
                <Cabecera />
                <SideBar pageWrapId={"page-wrap"} outerContainerId={"App"} />

                <div className="containerCuatro">                    
                    <Link className="btn btn-success" to="/visual_config"> <AddBox icon={tableIcons.Add} /> Agregar Configuraci&oacute;n </Link>
                </div>
                <div className="form-group col-12" style={{ float: 'left' }} >
                    
                    <Materialtable
                        title={"Listado de visualizaciones configuradas [Datos Historicos]"}
                        columns={columns}
                        data={this.state.data}
                        icons={tableIcons}
                        actions={[
                            {
                                icon: tableIcons.PlaylistAddSharpIcon,                                
                                tooltip: 'Configurar Tracks Time/Depth',
                                onClick: (event, rowData) => { this.seleccionarRegistro(rowData); this.peticionGetTrack(rowData);  this.modalInsertar() }
                            },
                            {
                                icon: tableIcons.Multiline,
                                tooltip: 'Ver Grafica',
                                onClick: (event, rowData) => { this.IrAGraficar(rowData); }
                            },
                            {
                                icon: tableIcons.Multiline,
                                tooltip: 'Ver Grafica Componente',
                                onClick: (event, rowData) => { this.IrAGraficarComp(rowData); }
                            },
                            {
                                icon: tableIcons.Edit,
                                tooltip: 'Editar',
                                onClick: (event, rowData) => { this.IrAEditar(rowData); }
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
                    <br />
                 * - T: Dato leido de telemetr&iacute;a           - A: Dato leido de archivo .las
                </div>


                <Modal isOpen={this.state.modalInsertar} contentClassName="custom-modal-style">
                    <ModalHeader style={{ display: 'block' }}>
                        <span style={{ float: 'right' }} onClick={() => this.modalInsertar()}><CancelIcon icon={tableIcons.CancelIcon} /> </span>
                        <label htmlFor="nombre">Configuracion de Track</label>  
                    </ModalHeader>
                    <ModalBody>  
                        <div className="form-group">
                            <input className="form-control" type="hidden" name="pkuser" id="pkuser" readOnly onChange={this.handleChange} value={form2 ? form2.id : cookies.get('id_usuario_sesion')} />
                            <input className="form-control" type="hidden" name="id" id="id" readOnly onChange={this.handleChange} value={form2 ? form2.id : this.state.data.length + 1} />

                            <div className="form-group"   > 
                                Seleccione las curvas adicionar en los track (Horizontal y Vertical)<br /><br />
                                <table className="table table-responsive-lg">
                                    <thead>
                                        <tr>   
                                            <th>Origen de Curva</th>
                                            <th>Tipo de Curva</th>
                                            <th>Tipo de Track</th>
                                            <th>Estado</th>
                                            <th>Acciones </th>                                                                                  
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.data1.map(elemento => (
                                            <tr>
                                                <td>{elemento.nombre_origen}</td>
                                                <td>{elemento.nombre_tipo_curva}</td>
                                                <td>{elemento.nombre_track}</td>
                                                <td>{elemento.resultado}</td>
                                                <td>{elemento.resultado === 'ASIGNADA' ?
                                                    (<button className="btn btn-outline-secondary" onClick={() => this.peticionDeleteTemplateTrack(elemento)}> <DeleteOutline icon={tableIcons.Remove} /> Eliminar </button>) :
                                                    (<button className="btn btn-outline-secondary" onClick={() => this.peticionAInsetarTemplateTrack(elemento)}> <AddBox icon={tableIcons.Add} /> Asignar </button>)} </td>
                                            </tr>

                                        ))}
                                        
                                    </tbody>
                                </table>
                            </div>                                                          
                        </div>
                    </ModalBody>

                    <ModalFooter> 
                        <button className="btn  btn-outline-secondary" onClick={() => this.modalInsertar()}> <CancelIcon icon={tableIcons.CancelIcon} /> Salir</button>
                    </ModalFooter>
                </Modal>


                <Modal isOpen={this.state.modalEliminar}>
                    <ModalBody>
                        <DeleteOutline /> Est&aacute; seguro que deseas eliminar el registro seleccionado?
                        <div className="form-group">
                            <br />
                            <input className="form-control" type="hidden" name="id" id="id" readOnly onChange={this.handleChange} value={form ? form.id : this.state.data.length + 1} />                            
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-danger" onClick={() => this.peticionDelete()}>Si</button>
                        <button className="btn btn-secundary" onClick={() => this.modalEliminar()}>No</button>
                    </ModalFooter>
                </Modal>
            </div>

           

        );
    }
}
export default viewVisualConfigLista;