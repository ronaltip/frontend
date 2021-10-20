import React, { Component, forwardRef } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";  
 

import Cookies from 'universal-cookie';
import SideBar from "../componentes/sidebar";
import Cabecera from "../componentes/cabecera";
import '../css/styles.css'; 

import AddBox from '@material-ui/icons/AddBox';
import Save from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';

const cookies = new Cookies();
  
const urlAuxiliar1 = "http://localhost:9000/archivolas";
const urlAuxiliar2 = "http://localhost:9000/datos_entrada";
const urlAuxiliar3 = "http://localhost:9000/template_config"; 
 
 

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />), 
}

 
 
class viewVisualConfigEdi extends Component {
    
     state = { 
         isLoaded: false,
         dataWells: [],
         dataVariables: [],
         dataArchivo: [],
         dataTelemetria: [],
         dataTemplateConfig: [],
         select_archivo: false,
         select_telemetria: false, 
         form: {
             wells_id: '',
             archivo_encabezado_id: '',
             datetime: '', dmea: '', dbtm: '', rpm: '', ropa: '', mfia: '', tqa: '', wob: '', nmenonicosarcs:'',
             datetime_est: false, dmea_est: false, dbtm_est: false, rpm_est: false, ropa_est: false, mfia_est: false, tqa_est: false, wob_est: false,
             datetime_estt: false, dmea_estt: false, dbtm_estt: false, rpm_estt: false, ropa_estt: false, mfia_estt: false, tqa_estt: false, wob_estt: false,
             pkuser: '' 
         },

         form1: {
             id: '',
             wells_id: '',
             archivo_encabezado_id: '', 
             datetime: '', dmea: '', dbtm: '', rpm: '', ropa: '', mfia: '', tqa: '', wob: '',
             nombre_archivo: '',
             nombre_pozo: '',
             pkuser: ''  
         },


         auxWellsid: '',
         auxArchsid: '',

     };



    peticionPut = () => {
        axios.put(urlAuxiliar3, this.state.form1).then(response => { 
            this.props.history.push('/visual_config_lista')
        })
    }

 
    componentDidMount() { 
        this.peticionGetId(); 
         
    }     


    peticionGetId = async () => { 
        axios.get(urlAuxiliar3 + "?id=" + this.props.match.params.id).then(response => {
            this.setState({ dataTemplateConfig: response.data });
            this.seleccionarRegistro(this.state.dataTemplateConfig);
            this.peticionDatosEntradaGet(this.state.dataTemplateConfig[0].wells_id);
            this.peticionArchivoLasGet(this.state.dataTemplateConfig[0].wells_id);
         
        }).catch(error => {
            console.log(error.message);
        }) 
    };


    peticionArchivoLasGet3 = (ida, idr) => {
        var nmenonicosarc = '';

        var datetimeest = false;
        var dmeaest = false;
        var dbtmest = false;
        var rpmest = false;
        var ropaest = false;
        var mfiaest = false;
        var tqaest = false;
        var wobest = false;

        let contadorvariables = this.state.form.contador;

        axios.get(urlAuxiliar1 + '?idar=' + ida + '&idr=' + idr).then(response => {
            this.setState({ dataVariables: response.data });

            for (let k = 0; k < this.state.dataVariables.length; k++) {
                if (this.state.dataVariables[k].campos === "DATETIME") { datetimeest = true; contadorvariables = contadorvariables + 1; }
                if (this.state.dataVariables[k].campos === "DMEA") { dmeaest = true; contadorvariables = contadorvariables + 1; }
                if (this.state.dataVariables[k].campos === "DBTM") { dbtmest = true; contadorvariables = contadorvariables + 1; }
                if (this.state.dataVariables[k].campos === "RPM") { rpmest = true; contadorvariables = contadorvariables + 1; }
                if (this.state.dataVariables[k].campos === "ROPA") { ropaest = true; contadorvariables = contadorvariables + 1; }
                if (this.state.dataVariables[k].campos === "MFIA") { mfiaest = true; contadorvariables = contadorvariables + 1; }
                if (this.state.dataVariables[k].campos === "TQA") { tqaest = true; contadorvariables = contadorvariables + 1; }
                if (this.state.dataVariables[k].campos === "WOB") { wobest = true; contadorvariables = contadorvariables + 1; }
                nmenonicosarc = nmenonicosarc + this.state.dataVariables[k].campos + ',';
            }

            this.setState({
                form: {
                    nmenonicosarcs: nmenonicosarc.substring(nmenonicosarc.length - 1, 1),
                    datetime_est: datetimeest,
                    dmea_est: dmeaest,
                    dbtm_est: dbtmest,
                    rpm_est: rpmest,
                    ropa_est: ropaest,
                    mfia_est: mfiaest,
                    tqa_est: tqaest,
                    wob_est: wobest,

                    datetime_estt: this.state.form.datetime_estt,
                    dmea_estt: this.state.form.dmea_estt,
                    dbtm_estt: this.state.form.dbtm_estt,
                    rpm_estt: this.state.form.rpm_estt,
                    ropa_estt: this.state.form.ropa_estt,
                    mfia_estt: this.state.form.mfia_estt,
                    tqa_estt: this.state.form.tqa_estt,
                    wob_estt: this.state.form.wob_estt,

                    contador: contadorvariables

                }
            });



            ReactDOM.render();
        }).catch(error => {
            console.log(error.message);
        })
    }

    peticionArchivoLasGet = (idw) => {
        axios.get(urlAuxiliar1 + '?idw=' + idw).then(response => {
            this.setState({ dataArchivo: response.data });
            if (this.state.dataArchivo.length > 0)
            { this.setState({ visual_ajax2: true }); }
            else
            { this.setState({ visual_ajax2: false }); }
            ReactDOM.render();
        }).catch(error => {
            console.log(error.message);
        })
    }

    peticionDatosEntradaGet = (idw) => {

        var datetimeestt = false;
        var dmeaestt = false;
        var dbtmestt = false;
        var rpmestt = false;
        var ropaestt = false;
        var mfiaestt = false;
        var tqaestt = false;
        var wobestt = false;

        axios.get(urlAuxiliar2 + '?id=' + idw).then(response => {
            this.setState({ dataTelemetria: response.data });

            let contadorvariables = 0;
            if (this.state.dataTelemetria.length > 0) {
                this.setState({ campost: this.state.dataTelemetria[0].nameMnemonic });
                var cadena = this.state.campost.split(',');

                for (let k = 0; k < cadena.length; k++) {
                    if (cadena[k] === "DATETIME") { datetimeestt = true; contadorvariables = contadorvariables + 1; }
                    if (cadena[k] === "DMEA") { dmeaestt = true; contadorvariables = contadorvariables + 1; }
                    if (cadena[k] === "DBTM") { dbtmestt = true; contadorvariables = contadorvariables + 1; }
                    if (cadena[k] === "RPM") { rpmestt = true; contadorvariables = contadorvariables + 1; }
                    if (cadena[k] === "ROPA") { ropaestt = true; contadorvariables = contadorvariables + 1; }
                    if (cadena[k] === "MFIA") { mfiaestt = true; contadorvariables = contadorvariables + 1; }
                    if (cadena[k] === "TQA") { tqaestt = true; contadorvariables = contadorvariables + 1; }
                    if (cadena[k] === "WOB") { wobestt = true; contadorvariables = contadorvariables + 1; }
                }

                this.setState({
                    form: {
                        datetime_estt: datetimeestt,
                        dmea_estt: dmeaestt,
                        dbtm_estt: dbtmestt,
                        rpm_estt: rpmestt,
                        ropa_estt: ropaestt,
                        mfia_estt: mfiaestt,
                        tqa_estt: tqaestt,
                        wob_estt: wobestt,
                        contador: contadorvariables,
                    },
                    auxContador: contadorvariables,
                    visual_ajax1: true,
                });
            }
            else {
                this.setState({
                    visual_ajax1: false,
                });
            }
        }).catch(error => {
            console.log(error.message);
        })
    }

    useEffect = () => {
        this.peticionGet();
    };


    seleccionarRegistro = (templateconfig) => { 

        var datetimeest = 0;
        var dmeaest = 0;
        var dbtmest = 0;
        var rpmest = 0;
        var ropaest = 0;
        var mfiaest = 0;
        var tqaest = 0;
        var wobest = 0; 

        if (templateconfig[0].datetime === 'T') { datetimeest = 1;  } else { datetimeest = 2; }
        if (templateconfig[0].dmea === "T") { dmeaest = 1; } else { dmeaest = 2; }
        if (templateconfig[0].dbtm === "T") { dbtmest = 1; } else { dbtmest = 2; }
        if (templateconfig[0].rpm === "T") { rpmest = 1; } else { rpmest = 2; }
        if (templateconfig[0].ropa === "T") { ropaest = 1; } else { ropaest = 2; }
        if (templateconfig[0].mfia === "T") { mfiaest = 1; } else { mfiaest = 2; }
        if (templateconfig[0].tqa === "T") { tqaest = 1; } else { tqaest = 2; }
        if (templateconfig[0].wob === "T") { wobest = 1; } else { wobest = 2; } 
           
       
        this.setState({ 
            form1: {
                id: templateconfig[0].id,
                wells_id: templateconfig[0].wells_id,
                archivo_encabezado_id: templateconfig[0].archivo_encabezado_id,
                datetime: datetimeest,
                dmea: dmeaest,
                dbtm: dbtmest,
                rpm: rpmest,
                ropa: ropaest,
                mfia: mfiaest,
                tqa: tqaest,
                wob: wobest,
                nombre_archivo: templateconfig[0].nombre_archivo,
                nombre_pozo: templateconfig[0].nombre_pozo,
            },
        })   

        console.log(this.state.form1);
    }



    handleChange2 = async e => {
        e.persist();
        await this.setState({
            form1: {
                ...this.state.form1,
                [e.target.name]: e.target.value,
            }
        }); 

        this.peticionArchivoLasGet3(this.state.form1.archivo_encabezado_id, 2);


        if (this.state.form1.archivo_encabezado_id > 0) {
            this.setState({ select_archivo: true });
        }

        if (this.state.dataTelemetria.length > 0) {
            this.setState({ select_telemetria: true });
        }
        console.log(this.state.select_archivo);
    }


    handleChange21 = async e => {
        e.persist();
        await this.setState({
            form1: {
                ...this.state.form1,
                [e.target.name]: e.target.value,
            }
        });

        this.state.form1.pkuser = cookies.get('pk_usuario_sesion');
        console.log(this.state.form1);
    }


       
    render() { 
        const { form1, form } = this.state;        
         
        return (
            <div className="App">
                <Cabecera />
                <SideBar pageWrapId={"page-wrap"} outerContainerId={"App"} />

                <div className="containerCuatro">
                    <Link className="btn btn-outline-secondary" to="/visual_config_lista"><CancelIcon icon={tableIcons.Add} /> Regresar</Link>
                </div> 

                <div className="form-group col-8" style={{ float: 'left', padding: '0 0 0 70px' }}>  
                    <h5> Actualizaci&oacute;n parametrizaci&oacute;n de la visualizaci&oacute;n de la gr&aacute;fica principal</h5>                      
                        <hr></hr>
                    <h6>   <AddBox icon={tableIcons.Add} />  1: Definici&oacute;n del Pozo y fuente de origen de datos </h6>
                        <hr></hr>        
                </div>                  
                <div style={{ float: 'left', padding: '0 0 0 100px' }} className="form-group col-8">                               
                    <label htmlFor="archivo_encabezado_idt">Pozo:   </label>
                    <input className="form-control" type="text" name="nombre_pozo" id="nombre_pozo" readOnly value={form1 ? form1.nombre_pozo : ''} />

                    <input className="form-control" type="hidden" name="id" id="id" value={form ? form.id : ''} />  
                    <label htmlFor="archivo_encabezado_idt">Archivos .Las encontrados</label>
                    <select name="archivo_encabezado_id" id="archivo_encabezado_id" className="form-control" value={form1 ? form1.archivo_encabezado_id : ''} onChange={this.handleChange2} >
                        <option key="0" value="0">Seleccionar el archivo</option>
                        {this.state.dataArchivo.map(elemento => (<option key={elemento.id} value={elemento.id}>{elemento.nombre_archivo}  </option>))}
                    </select>
                    {this.state.select_archivo ? (
                        <div><span className="badge badge-success"> Datos de archivo .las: Encontrados con los Mnemonicos: {this.state.form.nmenonicosarcs}</span></div>
                    ) : (<div></div>)}
                </div> 
                     
                <div className="form-group col-8" style={{ float: 'left', padding: '0 0 0 70px' }}>
                    <hr></hr>
                    <h6>   <AddBox icon={tableIcons.Add} /> 2: Parametrizaci&oacute;n de la Gr&aacute;fica Principal  </h6>
                    <hr></hr>
                </div>

                     
                <div style={{ float: 'left', padding: '15px 0 0 30px' }} className="form-group col-12">
                    {this.state.visual_ajax1 || this.state.visual_ajax2 ? (
                        <div style={{ float: 'left', padding: '15px 0 0 60px' }} className="form-group col-12">
                            <div className="container">
                                <div className="row">
                                    <div className="col-2">VARIABLE</div>
                                    <div className="col-3">FUENTES DE ORIGEN</div>
                                </div>

                                <div className="row">
                                    <div className="col-2">DATETIME</div>
                                    {this.state.visual_ajax1 && this.state.form.datetime_estt ? (
                                    <div className="col-3"> 
                                        { this.state.form1.datetime === 1 ?
                                            (<input type="radio" value="1" name="datetime" onChange={this.handleChange21} checked />) :
                                            (<input type="radio" value="1" name="datetime" onChange={this.handleChange21}  />)                                                 
                                        }
                                    Telemetria</div>) : (<div className="col-2"></div>)}
                                    {this.state.visual_ajax2 && this.state.select_archivo && this.state.form.datetime_est ? (
                                    <div className="col-3">
                                        { this.state.form1.datetime === 2 ?
                                            (<input type="radio" value="2" name="datetime" onChange={this.handleChange21} checked />) :
                                            (<input type="radio" value="2" name="datetime" onChange={this.handleChange21} />)
                                        }                                            
                                    Archivo .Las</div>) : (<div className="col-2"></div>)}
                                </div>

                                <div className="row">
                                    <div className="col-2">DMEA</div>
                                    {this.state.visual_ajax1 && this.state.form.dmea_estt ? (
                                        <div className="col-3">
                                            { this.state.form1.dmea === 1 ?
                                                (<input type="radio" value="1" name="dmea" onChange={this.handleChange21} checked />) :
                                                (<input type="radio" value="1" name="dmea" onChange={this.handleChange21} />)
                                            } 
                                            Telemetria</div>) : (<div className="col-2"></div>)}
                                    {this.state.visual_ajax2 && this.state.select_archivo && this.state.form.dmea_est ? (
                                        <div className="col-3">
                                            { this.state.form1.dmea === 2 ?
                                                (<input type="radio" value="2" name="dmea" onChange={this.handleChange21} checked />) :
                                                (<input type="radio" value="2" name="dmea" onChange={this.handleChange21} />)
                                            }
                                        Archivo .Las</div>) : (<div className="col-2"></div>)}
                                </div>

                                <div className="row">
                                    <div className="col-2">DBTM</div>
                                    {this.state.visual_ajax1 && this.state.form.dbtm_estt ? (
                                        <div className="col-3">
                                            { this.state.form1.dbtm === 1 ?
                                                (<input type="radio" value="1" name="dbtm" onChange={this.handleChange21} checked />) :
                                                (<input type="radio" value="1" name="dbtm" onChange={this.handleChange21} />)
                                            }
                                        Telemetria</div>) : (<div className="col-2"></div>)}
                                    {this.state.visual_ajax2 && this.state.select_archivo && this.state.form.dbtm_est ? (
                                        <div className="col-3">
                                            {this.state.form1.dbtm === 2 ?
                                                (<input type="radio" value="2" name="dbtm" onChange={this.handleChange21} checked />) :
                                                (<input type="radio" value="2" name="dbtm" onChange={this.handleChange21} />)
                                            }
                                            Archivo .Las</div>) : (<div className="col-2"></div>)}
                                </div>

                                <div className="row">
                                    <div className="col-2">RPM</div>
                                    {this.state.visual_ajax1 && this.state.form.rpm_estt ? (
                                        <div className="col-3">
                                        {this.state.form1.rpm === 1 ?
                                            (<input type="radio" value="1" name="rpm" onChange={this.handleChange21} checked />) :
                                            (<input type="radio" value="1" name="rpm" onChange={this.handleChange21} />)
                                        }
                                        Telemetria</div>) : (<div className="col-2"></div>)}
                                    {this.state.visual_ajax2 && this.state.select_archivo && this.state.form.rpm_est ? (
                                        <div className="col-3">
                                            {this.state.form1.rpm === 2 ?
                                                (<input type="radio" value="2" name="rpm" onChange={this.handleChange21} checked />) :
                                                (<input type="radio" value="2" name="rpm" onChange={this.handleChange21} />)
                                            }
                                        Archivo .Las</div>) : (<div className="col-2"></div>)}
                                </div>

                                <div className="row">
                                    <div className="col-2">ROPA</div>
                                    {this.state.visual_ajax1 && this.state.form.ropa_estt ? (
                                        <div className="col-3">
                                            {this.state.form1.ropa === 1 ?
                                                (<input type="radio" value="1" name="ropa" onChange={this.handleChange21} checked />) :
                                                (<input type="radio" value="1" name="ropa" onChange={this.handleChange21} />)
                                            }
                                            Telemetria</div>) : (<div className="col-2"></div>)}
                                    {this.state.visual_ajax2 && this.state.select_archivo && this.state.form.ropa_est ? (
                                        <div className="col-3">
                                        {this.state.form1.ropa === 2 ?
                                            (<input type="radio" value="2" name="ropa" onChange={this.handleChange21} checked />) :
                                            (<input type="radio" value="2" name="ropa" onChange={this.handleChange21} />)
                                        }
                                        Archivo .Las</div>) : (<div className="col-2"></div>)}
                                </div>

                                <div className="row">
                                    <div className="col-2">MFIA</div>
                                    {this.state.visual_ajax1 && this.state.form.mfia_estt ? (
                                        <div className="col-3">
                                            {this.state.form1.mfia === 1 ?
                                                (<input type="radio" value="1" name="mfia" onChange={this.handleChange21} checked />) :
                                                (<input type="radio" value="1" name="mfia" onChange={this.handleChange21} />)
                                            }
                                            Telemetria</div>) : (<div className="col-2"></div>)}
                                    {this.state.visual_ajax2 && this.state.select_archivo && this.state.form.mfia_estt ? (
                                        <div className="col-3">
                                            {this.state.form1.mfia === 2 ?
                                                (<input type="radio" value="2" name="mfia" onChange={this.handleChange21} checked />) :
                                                (<input type="radio" value="2" name="mfia" onChange={this.handleChange21} />)
                                            }
                                            Archivo .Las</div>) : (<div className="col-2"></div>)}
                                </div>

                                <div className="row">
                                    <div className="col-2">TQA</div>
                                    {this.state.visual_ajax1 && this.state.form.tqa_estt ? (
                                        <div className="col-3">
                                            {this.state.form1.tqa === 1 ?
                                                (<input type="radio" value="1" name="tqa" onChange={this.handleChange21} checked />) :
                                                (<input type="radio" value="1" name="tqa" onChange={this.handleChange21} />)
                                            }
                                            Telemetria</div>) : (<div className="col-2"></div>)}
                                    {this.state.visual_ajax2 && this.state.select_archivo && this.state.form.tqa_est ? (
                                        <div className="col-3">
                                            {this.state.form1.tqa === 2 ?
                                                (<input type="radio" value="2" name="tqa" onChange={this.handleChange21} checked />) :
                                                (<input type="radio" value="2" name="tqa" onChange={this.handleChange21} />)
                                            }
                                        Archivo .Las</div>) : (<div className="col-2"></div>)}
                                </div>

                                <div className="row">
                                    <div className="col-2">WOB</div>
                                    {this.state.visual_ajax1 && this.state.form.wob_estt ? (
                                        <div className="col-3">
                                            {this.state.form1.wob === 1 ?
                                                (<input type="radio" value="1" name="wob" onChange={this.handleChange21} checked />) :
                                                (<input type="radio" value="1" name="wob" onChange={this.handleChange21} />)
                                            }
                                            Telemetria</div>) : (<div className="col-2"></div>)}
                                    {this.state.visual_ajax2 && this.state.select_archivo && this.state.form.wob_est ? (
                                        <div className="col-3">
                                            {this.state.form1.wob === 2 ?
                                                (<input type="radio" value="2" name="wob" onChange={this.handleChange21} checked />) :
                                                (<input type="radio" value="2" name="wob" onChange={this.handleChange21} />)
                                            }
                                            Archivo .Las</div>) : (<div className="col-2"></div>)}
                                </div>

                            </div>
                        </div>)
                        :
                        (<div></div>)
                    }  
                </div> 
                                          
                  
                <div style={{ float: 'left', padding: '05px 0 0 150px' }} className="form-group col-8">
                        <hr></hr>
                        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <button className="btn btn-success" onClick={() => this.peticionPut()} style={{ float: 'center' }} ><Save icon={tableIcons.Save} /> Actualizar  </button>                            
                        &nbsp;&nbsp; 
                        <Link className="btn btn-danger" to="/visual_config_lista"  > <CancelIcon icon={tableIcons.Add} /> Cancelar</Link>
                        <hr></hr>
                </div>
                        
            </div>                 
            
        );

    }
}
export default viewVisualConfigEdi;
 
