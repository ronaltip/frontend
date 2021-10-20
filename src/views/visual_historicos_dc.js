import React, { Fragment } from 'react';
//import ReactDOM from 'react-dom';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
//import Cookies from 'universal-cookie';
import SideBar from "../componentes/sidebar";
import Cabecera from "../componentes/cabecera";
import Loader from '../componentes/Loader';

import '../css/styles.css';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

import Plotly from 'plotly.js';
import Plot from 'react-plotly.js';
import hexRgb from 'hex-rgb';
import { TextField, Checkbox } from '@material-ui/core'


import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import SaveIcon from '@material-ui/icons/Save'
import DeleteIcon from '@material-ui/icons/Delete';
import EventNoteIcon from '@material-ui/icons/EventNote';
import CloseIcon from '@material-ui/icons/Close';

import HorizontalSplitIcon from '@material-ui/icons/HorizontalSplit';
import VerticalSplitIcon from '@material-ui/icons/VerticalSplit';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';


import { Simplify } from 'curvereduce';
import {AlgoritmoOperaciones} from '../util/utilities';

const URL = process.env.REACT_APP_API_HOST; 
//const url = "http://localhost:9000/datos_entrada";
//const urlAuxiliar1 = "http://localhost:9000/template_track_config"; 
//const urlAuxiliar2 = "http://localhost:9000/eventos";
//const urlAuxiliar3 = "http://localhost:9000/template_config";
//const urlAuxiliar4 = "http://localhost:9000/tipo_eventos"; 
//const urlAuxiliar5 = "http://localhost:9000/operaciones"; 
//const urlAuxiliar6 = "http://localhost:9000/archivolas"; 

const PORCENTAJE_INCREMENTO_TRACK_VERTICAL = 0.70;


var datosGraficaPrincipal = [];
var maxDMEA = 0;  
//var simbolo = ["circle", "square", "diamond", "cross", "x", "triangle-up", "triangle-down", "start", "octagon", "hexagon"]

class viewVisualHistoricoDC extends React.Component {
    
   
    constructor(props) {
        super(props);
        this.state = {
            openModaTemplate: false,
            isLoaded: false,
            isLoadedPrincipal: false,
            isLoadedVertical: false,
            isLoadedHorizontal: false,
            dataEntrada: [],
            dataEntrada2: [],
            dataEventos: [],
            dataOperaciones: [],
            dataTemplateConfig: [],
            dataConfigTrack: [],
            dataRta: [],
            dataArchivo: [],          

            form1: {
                id: '',
                wells_id: '',
                archivo_encabezado_id: '',
                datetime: '', dmea: '', dbtm: '', rpm: '', ropa: '', mfia: '', tqa: '', wob: '',
                nombre_template: '',
                nombre_archivo: '',
                nombre_pozo: '',
                pkuser: '',
                validar:''
            },

            formoperaciones: {
                datos_entrada_id: '', datetime: '', dmea: '', dbtm: '', rpm: '', ropa: '', mfia: '', tqa: '', wob: '', dmeacorregida: '', dbtmcorregida: '', operacion: '', puntero: ''
            },

            showing: false,
            openModalEvento: false,
            insertar: false,
            openModalDeleteEvento: false,
            dataTipoEvento: [],
            evento: {
                id: 0, wells_id: 0, tipo_evento_id: 0, fecha_inicial: '', hora_inicial: '', fecha_final: '', hora_final: '', 
                profundidad_inicial: '', profundidad_final: '',
                TipoEvento: '', color: '', descripcion:'', causa: '', solucion: '', tipo_tiempo: 1, pkuser: 0
            },
            eventoAnterior: {
                tipo_evento_id: 0, TipoEvento: '', tipo_tiempo: 1,
                fecha_inicial: '', hora_inicial: '', fecha_final: '', hora_final: '', 
                profundidad_inicial: '', profundidad_final: '',
            },
            
            openModalOperacion: false,
            operacion: {
                id: 0, desde: '', hasta: '', md_from: 0, md_to: 0, operacion: ''
            },
            dataOperacion:[],
            dataGP: [], layoutGP: {}, framesGP: [], configGP: {},
            dataGH: [], dataTH: [], layoutTH: {}, 
            dataGV: [], layoutTV: {},
            menuEmergente : {
                x:0, y:0, showMenu: false,
                fecha: '', prof: 0
            },
            
            openModalTH: false,
            openModalTV: false,
            checkedStateTH: [],
            checkedStateTV: [],

            dataBK_GH: [],
            tracksHor: [],
            tracksVer: [],
            
        };
    }
     
    //https://www.youtube.com/watch?v=3juYY9dzz3w&ab_channel=WintellectNOW
    getTipoCurvasByTemplate = async () => {
        let id = this.props.match.params.id;
        
        //Plantilla de Cero
        if (id === 0)
        {
            //const requestDatos  = axios.get(URL + "datos_wits/wells/" );
            axios.get(URL  + "templates_wells/" + id).then(response => {

            }).catch(error => {
                console.log(error.message);
            })


            
        }
        else
        {
        // Plantilla establecida
            axios.get(URL  + "templates_wells/" + id).then(response => {
                let template = response.data[0];
                
                this.setState({
                    form1: {
                        nombre_pozo:        template.wells_nombre,
                        nombre_template:    template.template_nombre
                    }
                })
                
                //Tipos de curvas que tiene ese template
                const requestCurvas = axios.get(URL + "tipo_curvas/templates/" + template.template_id);
                //Datos Del Pozo
                const requestDatos  = axios.get(URL + "datos_wits/wells/" + template.wells_id);
                //Conveción de colores de las operaciones
                const requestConvencion = axios.get(URL + "convencion_datos_operacion");
                //Archivos asociados
                //const requestArchivos = axios.get(URL + "archivo_encabezado/" + template.wells_id);

                axios.all([requestCurvas, requestDatos, requestConvencion]).then(axios.spread((...response) => {
                    const curvas     = response[0];   
                    const dataWits   = response[1].data.filter(d=>Number(d.DBTM) < 15000 && Number(d.DMEA) < 15000  && Number(d.DBTM) > 0 && Number(d.DMEA) > 0) ;
                    const convencion = response[2].data;   

                    // Para Ejecutar el cálculo algoritmo de operaciones
                    //'DATETIME','DMEA','RPM','DBTM','ROPA','MFIA','TQA','WOB'

                    const datosToSimplyfy = dataWits.map( obj => ({x: Number(obj.id), y: Number(obj.DBTM)}) ).sort(x => x.id);
                    let dataRta = Simplify(datosToSimplyfy, 0.9075); 
                    
                    this.creaGraficaPrincipal_Full_v2(convencion, dataRta, dataWits);
                    this.crearCF_LayoutHorizontal();
                    this.crearCF_LayoutVertical();

                    console.log('FIN')
                    this.setState({ isLoaded: true });
                })).catch(error => {
                    console.log(error.message);
                })

                
            // this.setState({ dataTemplateConfig: response.data });
                

                this.peticionGetEventos(template.wells_id);              
                this.peticionGetOperaciones(template.wells_id);
            

            }).catch(errors => {
                console.log(errors.message);
            })
        }
    }
     
    //Template by Pozo
    peticionGetTemplateConfigId = async () => {
        axios.get(URL  + "tipo_curvas/template", { params:{ id: this.props.match.params.id} }).then(response => {
            
            this.setState({ dataTemplateConfig: response.data });
            console.log('OK TemplateConfig');
          
            this.peticionGetEventos();              
            this.peticionGetOperaciones();
          
            if (this.state.form1.validar === 1) {
                                
                this.peticionDataEntradaGet();
              
            } 
            else
            {
            
                //this.peticionGetDetalleLas();
            }
            
            
        }).catch(error => {
            console.log(error.message);
        })
    };
    //Fin Template

    seleccionarRegistro = (templateconfig) => {

        var datetimeest = 0;
        var dmeaest = 0;
        var dbtmest = 0;
        var rpmest = 0;
        var ropaest = 0;
        var mfiaest = 0;
        var tqaest = 0;
        var wobest = 0;
        var tmpVal = 1; 

        if (templateconfig[0].datetime  === 'T') { datetimeest  = 1; } else { datetimeest   = 2; tmpVal = 0;}
        if (templateconfig[0].dmea      === "T") { dmeaest      = 1; } else { dmeaest       = 2; tmpVal = 0;}
        if (templateconfig[0].dbtm      === "T") { dbtmest      = 1; } else { dbtmest       = 2; tmpVal = 0;}
        if (templateconfig[0].rpm       === "T") { rpmest       = 1; } else { rpmest        = 2; tmpVal = 0;}
        if (templateconfig[0].ropa      === "T") { ropaest      = 1; } else { ropaest       = 2; tmpVal = 0;}
        if (templateconfig[0].mfia      === "T") { mfiaest      = 1; } else { mfiaest       = 2; tmpVal = 0;}
        if (templateconfig[0].tqa       === "T") { tqaest       = 1; } else { tqaest        = 2; tmpVal = 0;}
        if (templateconfig[0].wob       === "T") { wobest       = 1; } else { wobest        = 2; tmpVal = 0;}


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
                validar : tmpVal ,
            },
        })
         
    }

    //Eventos puntuales y en el tiempo
    peticionGetEventos = async (id) => {
        axios.get(URL + "eventos/wells/" + id).then(response => {
            console.log('OK Eventos');
            this.setState({ dataEventos: response.data }); 
        }).catch(error => {
            console.log(error.message);
        })
    };
    peticionTipoEventosGet = () => {
        let tiposEvento = []
        axios.get(URL + 'tipo_eventos').then(response => {
            response.data.forEach((item) => {
                tiposEvento.push({value: item.id, label: item.nombre, color: item.color})
            })
            this.setState({ dataTipoEvento: tiposEvento });
        }).catch(error => {
            console.log(error.message);
        })
    }
    //Fin Eventos
     
    // Operaciones
    //Campo N/P = N
    peticionGetOperaciones = async (id) => {
        axios.get(URL + "operaciones/wells/" + id).then(response => {
            console.log('OK Operaciones');
            this.setState({ dataOperaciones: response.data }); 
        }).catch(error => {
            console.log(error.message);
        })
    };
    //Fin Operaciones

    /* 
        Escenario 1:
        si todas las variables son de telemetria, consulta el campo de datos_operaciones 
        tabla datos_entrada 
    */
    peticionDataEntradaGet_OLD = () => {
        //trae todos los datos de datos_entrada (datos, datos_operaciones)
        axios.get( '?iddp2=' + this.state.form1.wells_id).then(response => {
            this.setState({ dataEntrada2: response.data }); 
            console.log('OK datosEntrada2 ');
            /* Ejecuta el algoritmo de douglas y crea la grafica principal */
            // trae el x, y = ID, DBTM
            axios.get( '?iddp=' + this.state.form1.wells_id).then(response => {
                this.setState({ dataEntrada: response.data });
                if (this.state.dataEntrada.length > 0)
                {
                    console.log('OK datosEntrada ');

                    // epsilon al 90%
                    let dataRta = Simplify(this.state.dataEntrada.sort(), 0.9075); 
                    //console.log(dataRta);
                    this.setState({dataRta: dataRta});
                    console.log('OK Simplify ');

                    // trae la configuración de los track
                    axios.get('urlAuxiliar1' + "?idt=" + this.state.form1.id).then(response => {
                        this.setState({ dataConfigTrack: response.data });
                        console.log('OK ConfigTracks ');
                       
                        this.creaGraficaPrincipal_Full(this.state.dataRta, this.state.dataEntrada2);
                        this.crearCF_LayoutHorizontal();
                        this.crearCF_LayoutVertical();


                        console.log(this.now() + ' Fin');
                        this.setState({ isLoaded: true });
                    }).catch(error => {
                        console.log(error.message);
                    })
                    
                    
                }
                else
                { console.log('error'); } 
            }).catch(error => {
               console.log(error.message);
            })
             

        }).catch(error => {
            console.log(error.message);
        })
    } 

    //Tracks Horizontales
    crearCF_LayoutHorizontal = () => {
        console.log(this.now() + ' Inicio Tracks Horizontales ');
        //axios.get(urlAuxiliar1 + "?idt=" + id).then(response => {
        //    this.setState({ dataConfigTrack: response.data });
            if (this.state.dataConfigTrack.length > 0) {
                
                let referencia = this.state.dataConfigTrack.filter(item => item.referencia_id === 1)

                let layout = {
                    autosize: true,
                    uirevision: 'true',
                    margin: { l: 60, r: 10, t: 30, b: 40 }, 
                    dragmode: 'zoom',
                    hovermode: 'closest',
                    plot_bgcolor: 'white',
                    paper_bgcolor: 'rgb(233,233,233)',
                    font: { family: 'verdana', size: 11},
                    showlegend: false,
                    grid:  { rows: referencia.length, columns: 1, pattern: 'independent', subplots:[], roworder: 'top to bottom'},
                    xaxis: { fixedrange: false, showspikes: true, spikemode: 'across', type: 'time', tickformat: '%d %b %Y \n %H:%M:%S ', title: 'Tiempo', nticks: 5  },
                    datarevision: 1
                };

                let trazas = []
                let tracks = []
                let checks = []
                let i  = 1;
                referencia.forEach( ref => {
                    let traza = {
                        name : ref.tag,
                        x: this.state.dataTH.DATETIME,
                        y: this.state.dataTH[ref.tag],
                        xaxis: 'x',
                        yaxis: 'y' + ((i > 1) ? String(i) : '')
                    }
                    
                    let propertyAxi = "yaxis" + ((i > 1) ? String(i) : '')
                    layout[propertyAxi] = { title: ref.tag, autorange: 'reversed', titlefont: { size: 10, color: 'blue', }, tickfont: { size: 8.0 } }
                    
                    let subplot = ['xy' + ((i > 1) ? String(i) : '') ]
                    layout.grid.subplots.push(subplot);

                    trazas.push(traza);
                    i++;
                    checks.push(true);
                    tracks.push(traza.name)
                })
                
                this.setState({
                    checkedStateTH: checks,
                    layoutTH: layout,
                    dataGH: trazas,
                    dataBK_GH: trazas,
                    tracksHor: tracks,
                    isLoadedHorizontal: true
                });
                
            }
            else { console.log('No hay tracks horizontales'); }
        console.log(this.now() + ' Fin Tracks Horizontales ');

        //}).catch(error => {
        //    console.log(error.message);
        //})   
    }
    //Fin Tracks Horizontales
        
    //Track Verticales
    crearCF_LayoutVertical = () => {
        console.log(this.now() + ' Inicio Tracks Verticales ');
        
        //let maxDMEAVertical = maxDMEA + Math.floor(maxDMEA * PORCENTAJE_INCREMENTO_TRACK_VERTICAL)
        /*
        let P1X1 = 0
        let P2X1 = 60
        let P1Y1 = -200
        let P2Y1 = maxDMEA
        let punto = 100
        let pendiente = (P2Y1-P1Y1)/(P2X1-P1X1)
        let corte = P1Y1 - pendiente * P1X1
        let newMax = pendiente * punto + corte
        */
        let newMax = this.maxTrackVertical(-200, maxDMEA)
        if (this.state.dataConfigTrack.length > 0) {
            
            let referencia = this.state.dataConfigTrack.filter(item => item.referencia_id === 2)
            
            let layout = {
                autosize: true,
                uirevision: 'true',
                margin: { l: 40, r: 20, t: 80, b: 5 }, 
                dragmode: 'zoom',
                hovermode: 'closest',
                plot_bgcolor: 'white',
                paper_bgcolor: 'rgb(233,233,233)',
                font: { family: 'verdana', size: 11},
                showlegend: false,
                grid:  { columns: referencia.length, rows: 1, pattern: 'independent', subplots:[]},
                yaxis: { fixedrange: false, autorange: false, range: [newMax, -200], nticks: 15},
                datarevision: 1
            };
            let checks = []
            let tracks = []
            let trazas = []
            let subplots = []
            if (referencia.length > 0)
            {
                axios.get('urlAuxiliar6' + '?eid=' + this.state.form1.archivo_encabezado_id).then( response => {
        
                    let i  = 1;                 
                    //Para cada tipo de curva, agregar los registros
                    referencia.forEach( ref => {
                            
                        let x = response.data.filter( filtro => {
                            return filtro[ref.tag] !=  -999.250;
                        }).map ( function (filtro){
                            return filtro[ref.tag];
                        });
                        let y = response.data.filter( filtro => {
                            return filtro[ref.tag] !=  -999.250;
                        }).map ( function (filtro){
                            return filtro['DEPT'];
                        });
                        
                        let traza = {
                            name : ref.tag,
                            x: x,
                            y: y,
                            yaxis: 'y',
                            xaxis: 'x' + ((i > 1) ? String(i) : ''),
                        }
                        let propertyAxi = "xaxis" + ((i > 1) ? String(i) : '')
                        layout[propertyAxi] = { title: ref.tag, autorange: 'reversed', titlefont: { size: 10, color: 'red', }, tickfont: { size: 8.0 }, fixedrange: false, showspikes: true , side: 'top', showticklabels: true, textposition: 'top center'}
                        
                        let subplot = 'x' + ((i > 1) ? String(i) : '')  + 'y'
                        subplots.push(subplot)
                        checks.push(true);
                        tracks.push(traza.name)

                        trazas.push(traza);
                        i++;
                                
                    });
                    layout.grid.subplots.push(subplots);

                    this.setState({
                        checkedStateTV: checks,
                        tracksVer: tracks,
                        layoutTV: layout,
                        dataGV: trazas,
                        dataBK_GV: trazas,
                        isLoadedVertical: true
                    });


                }).catch(error => {
                    console.log(error.message);
                })  
                        
            }
            
        }
        else { console.log('No hay tracks verticales'); }

        console.log(this.now() + ' Fin Tracks Verticales ');
        
    } 
    //Tracks

    //Grafica Principal
    creaGraficaPrincipal_Full = (rsDouglas, rsTabla) => {
        console.log(this.now() + ' Inicio Gráfica Principal ');
        var config_general = {
            showSendToCloud: false,
            editable: false,
            displayModeBar: true,
            locale: 'es',
            displaylogo: false,
            responsive: true,
            modeBarButtonsToRemove: ['hoverClosestGl2d', 'hoverClosestPie', 'toggleHover', 'resetViews', 'zoom2d', 'select2d', 'lasso2d', 'toggleSpikelines'],  // , 'hoverClosestCartesian','hoverCompareCartesian', 'pan2d', 
            toImageButtonOptions: {
                format: 'png',
                filename: 'archivo_',
                height: 800,
                width: 800,
                scale: 1
            }
        };

       
        var DATETIME = [];      
        var DBTM = [], DMEA = [], MFIA = [], ROPA = [], RPM = [], TQA = [], WOB  = [];

        var operacion_0  = [], operacion_2  = [], operacion_3  = [], operacion_4  = [], operacion_7  = [], operacion_8 = [], operacion_9 = [];
        var operacion_35 = [], operacion_36 = [], operacion_37 = [], operacion_38 = [], operacion_39 = [];
        var operacion_40 = [], operacion_41 = []; 

     
        var fec1 = ''; var fec2 = ''; var pro1 = ''; var pro2 = '';
           
        rsDouglas.forEach(function (row) {
            let indice = rsTabla.filter(item => item.datos_entrada_id === row.x)
            if (indice.length > 0) {
                indice = indice[0];
                DATETIME.push(indice.DATETIME);
                DBTM.push(indice.DBTM);
                DMEA.push(indice.DMEA);
                MFIA.push(indice.MFIA);
                ROPA.push(indice.ROPA);
                RPM.push(indice.RPM);
                TQA.push(indice.TQA);
                WOB.push(indice.WOB);

                if (indice.operacion === 0)  { operacion_0.push(indice.DBTM)}  else { operacion_0.push(null) }
                if (indice.operacion === 2)  { operacion_2.push(indice.DBTM)}  else { operacion_2.push(null) }
                if (indice.operacion === 3)  { operacion_3.push(indice.DBTM)}  else { operacion_3.push(null) }
                if (indice.operacion === 4)  { operacion_4.push(indice.DBTM)}  else { operacion_4.push(null) }
                if (indice.operacion === 7)  { operacion_7.push(indice.DBTM)}  else { operacion_7.push(null) }
                if (indice.operacion === 8)  { operacion_8.push(indice.DBTM)}  else { operacion_8.push(null) }
                if (indice.operacion === 9)  { operacion_9.push(indice.DBTM)}  else { operacion_9.push(null) }
                if (indice.operacion === 35) { operacion_35.push(indice.DBTM)} else { operacion_35.push(null) }
                if (indice.operacion === 36) { operacion_36.push(indice.DBTM)} else { operacion_36.push(null) }
                if (indice.operacion === 37) { operacion_37.push(indice.DBTM)} else { operacion_37.push(null) }
                if (indice.operacion === 38) { operacion_38.push(indice.DBTM)} else { operacion_38.push(null) }
                if (indice.operacion === 39) { operacion_39.push(indice.DBTM)} else { operacion_39.push(null) }
                if (indice.operacion === 40) { operacion_40.push(indice.DBTM)} else { operacion_40.push(null) }
                if (indice.operacion === 41) { operacion_41.push(indice.DBTM)} else { operacion_41.push(null) }
            }
        });
       

        datosGraficaPrincipal.push( { x: DATETIME, y: DBTM,          mode: "lines+markers",  type: "scatter", name: "DBTM" } );
        datosGraficaPrincipal.push( { x: DATETIME, y: operacion_0,   mode: "markers",  type: "scatter", name: "0-Undef status" , marker : {color: hexRgb('#FFFF00', {format: 'css'}) }} );
        datosGraficaPrincipal.push( { x: DATETIME, y: operacion_2,   mode: "markers",  type: "scatter", name: "2-Drilling"     , marker : {color: hexRgb('#8497B0', {format: 'css'}) }} );
        datosGraficaPrincipal.push( { x: DATETIME, y: operacion_3,   mode: "markers",  type: "scatter", name: "3-Connection"   , marker : {color: hexRgb('#00B050', {format: 'css'}) }} );
        datosGraficaPrincipal.push( { x: DATETIME, y: operacion_4,   mode: "markers",  type: "scatter", name: "4-Reaming"      , marker : {color: hexRgb('#BF9000', {format: 'css'}) }} );
        datosGraficaPrincipal.push( { x: DATETIME, y: operacion_7,   mode: "markers",  type: "scatter", name: "7-Circulating"  , marker : {color: hexRgb('#FF0000', {format: 'css'}) }} );
        datosGraficaPrincipal.push( { x: DATETIME, y: operacion_8,   mode: "markers",  type: "scatter", name: "8-RIH"          , marker : {color: hexRgb('#00FFFF', {format: 'css'}) }} );
        datosGraficaPrincipal.push( { x: DATETIME, y: operacion_9,   mode: "markers",  type: "scatter", name: "9-POOH"         , marker : {color: hexRgb('#548235', {format: 'css'}) }} );
        datosGraficaPrincipal.push( { x: DATETIME, y: operacion_35,  mode: "markers",  type: "scatter", name: "35-OnSurface"   , marker : {color: hexRgb('#767171', {format: 'css'}) }} );
        datosGraficaPrincipal.push( { x: DATETIME, y: operacion_36,  mode: "markers",  type: "scatter", name: "36-Sliding"     , marker : {color: hexRgb('#FF00FF', {format: 'css'}) }} );
        datosGraficaPrincipal.push( { x: DATETIME, y: operacion_37,  mode: "markers",  type: "scatter", name: "37-POOHW/Pump"  , marker : {color: hexRgb('#FF9933', {format: 'css'}) }} );
        datosGraficaPrincipal.push( { x: DATETIME, y: operacion_38,  mode: "markers",  type: "scatter", name: "38-RIHW/Pump"   , marker : {color: hexRgb('#D6DCE5', {format: 'css'}) }} );
        datosGraficaPrincipal.push( { x: DATETIME, y: operacion_39,  mode: "markers",  type: "scatter", name: "39-BackReaming" , marker : {color: hexRgb('#DBDBDB', {format: 'css'}) }} );
        datosGraficaPrincipal.push( { x: DATETIME, y: operacion_40,  mode: "markers",  type: "scatter", name: "40-Working Pipe", marker : {color: hexRgb('#FBE5D6', {format: 'css'}) }} );
        datosGraficaPrincipal.push( { x: DATETIME, y: operacion_41,  mode: "markers",  type: "scatter", name: "41-Unregister"  , marker : {color: hexRgb('#FFE699', {format: 'css'}) }} );
       
        let datosGraficasHorizontales = {
            DATETIME:   DATETIME,
            DBTM:       DBTM,
            DMEA:       DMEA,
            MFIA:       MFIA,
            ROPA:       ROPA,
            RPM:        RPM,
            TQA:        TQA,
            WOB:        WOB
        };
        
        maxDMEA = Math.max(...DMEA) + 500;

        var layout_Principal = {
            autosize: true,
            uirevision: 'true',
            margin: { l: 60, r: 10, t: 80, b: 5 }, 
            dragmode: 'zoom',
            hovermode: 'closest',
            plot_bgcolor: 'white',
            paper_bgcolor: 'rgb(233,233,233)',
            xaxis: {
                fixedrange: false,
                showspikes: true,
                spikemode: 'across',
                textposition: 'top center',
                side: 'top',
                type: 'time',
                tickformat: '%d %b %Y \n %H:%M:%S ',
                title: 'Tiempo',
                nticks: 10,
            },
            yaxis: {
                fixedrange: false,
                autorange: false,
                range: [maxDMEA, -200],
                title: 'Profundidad [ft]',
                nticks: 10,
            },
            font: { family: 'verdana', size: 11},
            showlegend: false,
            shapes: [],
            datarevision: 1
        }

        //EVENTOS
        var rsEventos = this.state.dataEventos;
        var eventShapes = [];
        var tracesEvents = [];
        if (rsEventos.length > 0) {
            
            for (let k = 0; k < rsEventos.length; k++) {

                fec1 = rsEventos[k].fecha_inicial;
                fec2 = rsEventos[k].fecha_final;
                let idEvento = rsEventos[k].id;
                if (rsEventos[k].tipo_tiempo === 1)
                {   
                    //Eventos Puntuales
                    pro1 = rsEventos[k].profundidad_inicial.replace(',', '.');
                    let color = hexRgb(rsEventos[k].color, {format: 'css'});

                    let trace = {
                        t: idEvento, name: rsEventos[k].TipoEvento, x: fec1, y: pro1, c: color
                    }
                    tracesEvents.push(trace)
                }
                else
                {
                    //Eventos en el tiempo
                    let numberFecI = new Date(fec1).getTime();
                    let numberFecF = new Date(fec2).getTime();
                    pro1 = rsEventos[k].profundidad_inicial.replace(',', '.');                       
                    pro2 = rsEventos[k].profundidad_final.replace(',', '.');

                    let color = hexRgb(rsEventos[k].color, {format: 'css'});
                    let shape = { name: idEvento, type: 'rect', xref: 'x', yref: 'y', 
                         x0: numberFecI, y0: pro1, x1: numberFecF, y1: pro2 ,
                         line: {color: color , width: 1}
                    };
                    eventShapes.push(shape);
                    
                    let trace = {
                        t: idEvento, name: rsEventos[k].TipoEvento, x: fec1, y: pro1, c: color
                    }
                    tracesEvents.push(trace)
                }
            }
            if (tracesEvents.length > 0)
            {              
                let grupos = tracesEvents.reduce((r, a)=>{
                    r[a.name] = [...r[a.name] || [], a];
                    return r;
                },{})
               
                for(let grupo in  grupos) 
                {
                    let x = [], y = [], c = '', t = [];
                    for (let item in grupos[grupo])
                    {
                        x.push( grupos[grupo][item].x );
                        y.push( grupos[grupo][item].y );
                        c = grupos[grupo][item].c ;
                        t.push( grupos[grupo][item].t );
                    }
                    let traceEvento = {
                        x: x, y: y, name: grupo, mode: 'markers', type: 'scatter', marker: { symbol: '303', size: 10, color: c }, hovertemplate:'%{x}, %{y}', text: t
                    }
                    datosGraficaPrincipal.push(traceEvento);
                }
                if (eventShapes.length > 0)
                {
                    eventShapes.forEach(sh => {
                        layout_Principal.shapes.push( sh );
                    });
                }
                    
            }
        }

        //OPERACIONES
        var operacionesShapes = [];
        let rsOperaciones = this.state.dataOperaciones;
        if (rsOperaciones.length > 0)
        {
            let x = [], y = [], t = [];
            rsOperaciones.forEach( item => {
                if (item.desde === item.hasta)
                {
                    x.push(item.desde)
                    y.push(item.md_from.replace(',','.'))
                    t.push(item.id)
                }
                else
                {
                    x.push(item.desde)
                    y.push(item.md_from.replace(',','.'))
                    t.push(item.id)

                    let numberFecI = new Date(item.desde).getTime();
                    let numberFecF = new Date(item.hasta).getTime();
                    pro1 = item.md_from.replace(',', '.');                       
                    pro2 = item.md_to.replace(',', '.');
                    let shape = { type: 'rect', xref: 'x', yref: 'y', name: 0,
                        x0: numberFecI, y0: pro1, x1: numberFecF, y1: pro2 ,
                        line: {color: 'Gray' , width: 1 }
                    }
                    operacionesShapes.push(shape);
                }               
            });

            if (x.length > 0)
            {
                let traceOperaciones = {
                    x: x, y: y, name: 'Operaciones', mode: 'markers', type: 'scatter', marker: { symbol: '303', size: 10, color: 'Gray' }, hovertemplate:'%{x}, %{y}', text: t
                }
                datosGraficaPrincipal.push(traceOperaciones);
            }
            if (operacionesShapes.length > 0)
            {
                operacionesShapes.forEach(sh => {
                    layout_Principal.shapes.push( sh );
                });
            }

        }        
        
        this.setState({
            isLoadedPrincipal:true,
            dataTH: datosGraficasHorizontales,
            dataGP: datosGraficaPrincipal,
            configGP: config_general,
            layoutGP: layout_Principal,
        });
        console.log(this.now() + ' Fin Grafica Principal');

    }
    //Fin Grafica Principal
   
    //Grafica Principal
    creaGraficaPrincipal_Full_v2 = (convencion, rsDouglas, rsTabla) => {
        console.log(this.now() + ' Inicio Gráfica Principal ');
        var config_general = {
            showSendToCloud: false,
            editable: false,
            displayModeBar: true,
            locale: 'es',
            displaylogo: false,
            responsive: true,
            modeBarButtonsToRemove: ['hoverClosestGl2d', 'hoverClosestPie', 'toggleHover', 'resetViews', 'zoom2d', 'select2d', 'lasso2d', 'toggleSpikelines'],  // , 'hoverClosestCartesian','hoverCompareCartesian', 'pan2d', 
            toImageButtonOptions: {
                format: 'png',
                filename: 'archivo_',
                height: 800,
                width: 800,
                scale: 1
            }
        };

       
        var DATETIME = [];      
        var DBTM = [], DMEA = [], MFIA = [], ROPA = [], RPM = [], TQA = [], WOB  = [];

        var operacion_0  = [], operacion_2  = [], operacion_3  = [], operacion_4  = [], operacion_7  = [], operacion_8 = [], operacion_9 = [];
        var operacion_35 = [], operacion_36 = [], operacion_37 = [], operacion_38 = [], operacion_39 = [];
        var operacion_40 = [], operacion_41 = []; 

     
        var fec1 = ''; var fec2 = ''; var pro1 = ''; var pro2 = '';
        let DBTM_0 = 0;
        rsDouglas.forEach(function (row) {
            let indice = rsTabla.filter(item => Number(item.id) === row.x)
            if (indice.length > 0) {
                indice = indice[0];
                DATETIME.push(indice.DATETIME);
                DBTM.push(indice.DBTM);
                DMEA.push(indice.DMEA);
                MFIA.push(indice.MFIA);
                ROPA.push(indice.ROPA);
                RPM.push(indice.RPM);
                TQA.push(indice.TQA);
                WOB.push(indice.WOB);

                indice.operacion = AlgoritmoOperaciones(DBTM_0, indice.DMEA, indice.DBTM, indice.RPM, indice.ROPA, indice.MFIA, indice.TQA, indice.WOB).Operacion;

                if (indice.operacion === 0)  { operacion_0.push(indice.DBTM)}  else { operacion_0.push(null) }
                if (indice.operacion === 2)  { operacion_2.push(indice.DBTM)}  else { operacion_2.push(null) }
                if (indice.operacion === 3)  { operacion_3.push(indice.DBTM)}  else { operacion_3.push(null) }
                if (indice.operacion === 4)  { operacion_4.push(indice.DBTM)}  else { operacion_4.push(null) }
                if (indice.operacion === 7)  { operacion_7.push(indice.DBTM)}  else { operacion_7.push(null) }
                if (indice.operacion === 8)  { operacion_8.push(indice.DBTM)}  else { operacion_8.push(null) }
                if (indice.operacion === 9)  { operacion_9.push(indice.DBTM)}  else { operacion_9.push(null) }
                if (indice.operacion === 35) { operacion_35.push(indice.DBTM)} else { operacion_35.push(null) }
                if (indice.operacion === 36) { operacion_36.push(indice.DBTM)} else { operacion_36.push(null) }
                if (indice.operacion === 37) { operacion_37.push(indice.DBTM)} else { operacion_37.push(null) }
                if (indice.operacion === 38) { operacion_38.push(indice.DBTM)} else { operacion_38.push(null) }
                if (indice.operacion === 39) { operacion_39.push(indice.DBTM)} else { operacion_39.push(null) }
                if (indice.operacion === 40) { operacion_40.push(indice.DBTM)} else { operacion_40.push(null) }
                if (indice.operacion === 41) { operacion_41.push(indice.DBTM)} else { operacion_41.push(null) }

                DBTM_0 = indice.DBTM;
            }
        });
       

        let [Op_0]  = convencion.filter( c => c.id === 0  ).map( p => ({ nombre: p.nombre, color: p.color }) );
        let [Op_2]  = convencion.filter( c => c.id === 2  ).map( p => ({ nombre: p.nombre, color: p.color }) );
        let [Op_3]  = convencion.filter( c => c.id === 3  ).map( p => ({ nombre: p.nombre, color: p.color }) );
        let [Op_4]  = convencion.filter( c => c.id === 4  ).map( p => ({ nombre: p.nombre, color: p.color }) );
        let [Op_7]  = convencion.filter( c => c.id === 7  ).map( p => ({ nombre: p.nombre, color: p.color }) );
        let [Op_8]  = convencion.filter( c => c.id === 8  ).map( p => ({ nombre: p.nombre, color: p.color }) );
        let [Op_9]  = convencion.filter( c => c.id === 9  ).map( p => ({ nombre: p.nombre, color: p.color }) );
        let [Op_35] = convencion.filter( c => c.id === 35 ).map( p => ({ nombre: p.nombre, color: p.color }) );
        let [Op_36] = convencion.filter( c => c.id === 36 ).map( p => ({ nombre: p.nombre, color: p.color }) );
        let [Op_37] = convencion.filter( c => c.id === 37 ).map( p => ({ nombre: p.nombre, color: p.color }) );
        let [Op_38] = convencion.filter( c => c.id === 38 ).map( p => ({ nombre: p.nombre, color: p.color }) );
        let [Op_39] = convencion.filter( c => c.id === 39 ).map( p => ({ nombre: p.nombre, color: p.color }) );
        let [Op_40] = convencion.filter( c => c.id === 40 ).map( p => ({ nombre: p.nombre, color: p.color }) );
        let [Op_41] = convencion.filter( c => c.id === 41 ).map( p => ({ nombre: p.nombre, color: p.color }) );
        
        datosGraficaPrincipal.push( { x: DATETIME, y: DBTM,          mode: "lines+markers",  type: "scatter", name: "DBTM" } );
        
        datosGraficaPrincipal.push( { x: DATETIME, y: operacion_0,   mode: "markers",  type: "scatter", name: Op_0.nombre , marker : {color: hexRgb(Op_0.color, {format: 'css'}) }} );
        datosGraficaPrincipal.push( { x: DATETIME, y: operacion_2,   mode: "markers",  type: "scatter", name: Op_2.nombre , marker : {color: hexRgb(Op_2.color, {format: 'css'}) }} );
        datosGraficaPrincipal.push( { x: DATETIME, y: operacion_3,   mode: "markers",  type: "scatter", name: Op_3.nombre , marker : {color: hexRgb(Op_3.color, {format: 'css'}) }} );
        datosGraficaPrincipal.push( { x: DATETIME, y: operacion_4,   mode: "markers",  type: "scatter", name: Op_4.nombre , marker : {color: hexRgb(Op_4.color, {format: 'css'}) }} );
        datosGraficaPrincipal.push( { x: DATETIME, y: operacion_7,   mode: "markers",  type: "scatter", name: Op_7.nombre , marker : {color: hexRgb(Op_7.color, {format: 'css'}) }} );
        datosGraficaPrincipal.push( { x: DATETIME, y: operacion_8,   mode: "markers",  type: "scatter", name: Op_8.nombre , marker : {color: hexRgb(Op_8.color, {format: 'css'}) }} );
        datosGraficaPrincipal.push( { x: DATETIME, y: operacion_9,   mode: "markers",  type: "scatter", name: Op_9.nombre , marker : {color: hexRgb(Op_9.color, {format: 'css'}) }} );
        datosGraficaPrincipal.push( { x: DATETIME, y: operacion_35,  mode: "markers",  type: "scatter", name: Op_35.nombre, marker : {color: hexRgb(Op_35.color, {format: 'css'}) }} );
        datosGraficaPrincipal.push( { x: DATETIME, y: operacion_36,  mode: "markers",  type: "scatter", name: Op_36.nombre, marker : {color: hexRgb(Op_36.color, {format: 'css'}) }} );
        datosGraficaPrincipal.push( { x: DATETIME, y: operacion_37,  mode: "markers",  type: "scatter", name: Op_37.nombre, marker : {color: hexRgb(Op_37.color, {format: 'css'}) }} );
        datosGraficaPrincipal.push( { x: DATETIME, y: operacion_38,  mode: "markers",  type: "scatter", name: Op_38.nombre, marker : {color: hexRgb(Op_38.color, {format: 'css'}) }} );
        datosGraficaPrincipal.push( { x: DATETIME, y: operacion_39,  mode: "markers",  type: "scatter", name: Op_39.nombre, marker : {color: hexRgb(Op_39.color, {format: 'css'}) }} );
        datosGraficaPrincipal.push( { x: DATETIME, y: operacion_40,  mode: "markers",  type: "scatter", name: Op_40.nombre, marker : {color: hexRgb(Op_40.color, {format: 'css'}) }} );
        datosGraficaPrincipal.push( { x: DATETIME, y: operacion_41,  mode: "markers",  type: "scatter", name: Op_41.nombre, marker : {color: hexRgb(Op_41.color, {format: 'css'}) }} );
       
        let datosGraficasHorizontales = {
            DATETIME:   DATETIME,
            DBTM:       DBTM,
            DMEA:       DMEA,
            MFIA:       MFIA,
            ROPA:       ROPA,
            RPM:        RPM,
            TQA:        TQA,
            WOB:        WOB
        };
        
        maxDMEA = Math.max(...DMEA) + 500;

        var layout_Principal = {
            autosize: true,
            uirevision: 'true',
            margin: { l: 60, r: 10, t: 80, b: 5 }, 
            dragmode: 'zoom',
            hovermode: 'closest',
            plot_bgcolor: 'white',
            paper_bgcolor: 'rgb(233,233,233)',
            xaxis: {
                fixedrange: false,
                showspikes: true,
                spikemode: 'across',
                textposition: 'top center',
                side: 'top',
                type: 'time',
                tickformat: '%d %b %Y \n %H:%M:%S ',
                title: 'Tiempo',
                nticks: 10,
            },
            yaxis: {
                fixedrange: false,
                autorange: false,
                range: [maxDMEA, -200],
                title: 'Profundidad [ft]',
                nticks: 10,
            },
            font: { family: 'verdana', size: 11},
            showlegend: false,
            shapes: [],
            datarevision: 1
        }

        //EVENTOS
        var rsEventos = this.state.dataEventos;
        var eventShapes = [];
        var tracesEvents = [];
        if (rsEventos.length > 0) {
            
            for (let k = 0; k < rsEventos.length; k++) {

                fec1 = rsEventos[k].fecha_inicial;
                fec2 = rsEventos[k].fecha_final;
                let idEvento = rsEventos[k].id;
                if (rsEventos[k].tipo_tiempo === 1)
                {   
                    //Eventos Puntuales
                    pro1 = rsEventos[k].profundidad_inicial.replace(',', '.');
                    let color = hexRgb(rsEventos[k].color, {format: 'css'});

                    let trace = {
                        t: idEvento, name: rsEventos[k].TipoEvento, x: fec1, y: pro1, c: color
                    }
                    tracesEvents.push(trace)
                }
                else
                {
                    //Eventos en el tiempo
                    let numberFecI = new Date(fec1).getTime();
                    let numberFecF = new Date(fec2).getTime();
                    pro1 = rsEventos[k].profundidad_inicial.replace(',', '.');                       
                    pro2 = rsEventos[k].profundidad_final.replace(',', '.');

                    let color = hexRgb(rsEventos[k].color, {format: 'css'});
                    let shape = { name: idEvento, type: 'rect', xref: 'x', yref: 'y', 
                         x0: numberFecI, y0: pro1, x1: numberFecF, y1: pro2 ,
                         line: {color: color , width: 1}
                    };
                    eventShapes.push(shape);
                    
                    let trace = {
                        t: idEvento, name: rsEventos[k].TipoEvento, x: fec1, y: pro1, c: color
                    }
                    tracesEvents.push(trace)
                }
            }
            if (tracesEvents.length > 0)
            {              
                let grupos = tracesEvents.reduce((r, a)=>{
                    r[a.name] = [...r[a.name] || [], a];
                    return r;
                },{})
               
                for(let grupo in  grupos) 
                {
                    let x = [], y = [], c = '', t = [];
                    for (let item in grupos[grupo])
                    {
                        x.push( grupos[grupo][item].x );
                        y.push( grupos[grupo][item].y );
                        c = grupos[grupo][item].c ;
                        t.push( grupos[grupo][item].t );
                    }
                    let traceEvento = {
                        x: x, y: y, name: grupo, mode: 'markers', type: 'scatter', marker: { symbol: '303', size: 10, color: c }, hovertemplate:'%{x}, %{y}', text: t
                    }
                    datosGraficaPrincipal.push(traceEvento);
                }
                if (eventShapes.length > 0)
                {
                    eventShapes.forEach(sh => {
                        layout_Principal.shapes.push( sh );
                    });
                }
                    
            }
        }

        //OPERACIONES
        var operacionesShapes = [];
        let rsOperaciones = this.state.dataOperaciones;
        if (rsOperaciones.length > 0)
        {
            let x = [], y = [], t = [];
            rsOperaciones.forEach( item => {
                if (item.desde === item.hasta)
                {
                    x.push(item.desde)
                    y.push(item.md_from.replace(',','.'))
                    t.push(item.id)
                }
                else
                {
                    x.push(item.desde)
                    y.push(item.md_from.replace(',','.'))
                    t.push(item.id)

                    let numberFecI = new Date(item.desde).getTime();
                    let numberFecF = new Date(item.hasta).getTime();
                    pro1 = item.md_from.replace(',', '.');                       
                    pro2 = item.md_to.replace(',', '.');
                    let shape = { type: 'rect', xref: 'x', yref: 'y', name: 0,
                        x0: numberFecI, y0: pro1, x1: numberFecF, y1: pro2 ,
                        line: {color: 'Gray' , width: 1 }
                    }
                    operacionesShapes.push(shape);
                }               
            });

            if (x.length > 0)
            {
                let traceOperaciones = {
                    x: x, y: y, name: 'Operaciones', mode: 'markers', type: 'scatter', marker: { symbol: '303', size: 10, color: 'Gray' }, hovertemplate:'%{x}, %{y}', text: t
                }
                datosGraficaPrincipal.push(traceOperaciones);
            }
            if (operacionesShapes.length > 0)
            {
                operacionesShapes.forEach(sh => {
                    layout_Principal.shapes.push( sh );
                });
            }

        }        
        
        this.setState({
            isLoadedPrincipal:true,
            dataTH: datosGraficasHorizontales,
            dataGP: datosGraficaPrincipal,
            configGP: config_general,
            layoutGP: layout_Principal,
        });
        console.log(this.now() + ' Fin Grafica Principal');

    }
    //Fin Grafica Principal

    EsEvento(name) {
        let existe = false; 
        this.state.dataTipoEvento.forEach((item) => {
            if (name === item.label) {existe = true; return existe;}
        })
        return existe;
    }

    // Handle Grafica
    PlotClick = (e) => {
        let infoData = e.points.map ( function (data) {
            let trace = {x: data.x, y: data.y, text: data.text, name: data.data.name}
            return trace;
        });
        let id = infoData[0].text;

        //Eventos
        if ( this.EsEvento(infoData[0].name) )
        {
            axios.get(URL + 'eventos/' + id ).then( (response) => {
                let row = response.data[0];
                
                this.setState({ 
                    showing: row.tipo_tiempo == 1 ? false: true,
                    evento: {
                        id: row.id,
                        tipo_evento_id: row.tipo_evento_id,
                        color: row.color,
                        fecha_inicial: row.fecha_inicial,
                        hora_inicial:  row.hora_inicial,
                        fecha_final: row.fecha_final,
                        hora_final:  row.hora_final,
                        profundidad_inicial: String(row.profundidad_inicial),
                        profundidad_final: String(row.profundidad_final),
                        descripcion: row.descripcion,
                        causa: row.causa,
                        solucion: row.solucion,
                        tipo_tiempo: row.tipo_tiempo,
                        TipoEvento: row.TipoEvento
                    }, 
                    eventoAnterior: {
                        fecha_inicial: row.fecha_inicial,
                        hora_inicial:  row.hora_inicial,
                        fecha_final: row.fecha_final,
                        hora_final:  row.hora_final,
                        profundidad_inicial: String(row.profundidad_inicial),
                        profundidad_final: String(row.profundidad_final),
                        tipo_evento_id: row.tipo_evento_id,
                        TipoEvento: row.TipoEvento,
                        tipo_tiempo: row.tipo_tiempo
                    },
                    insertar: false,                
                    openModalEvento: true
                });
            }).catch(error => {
                console.log(error.message);
            })     

        }
        else
        {
            //Operaciones
            if (infoData[0].name === 'Operaciones')
            {
                axios.get(URL + 'operaciones/' + id).then( (response) => {
                    let row = response.data[0];
                    let fechaInicio = row.desde.split(' ');
                    let hora = fechaInicio[1];
                    fechaInicio = fechaInicio[0].split('-');
                    fechaInicio = fechaInicio[2]+'/'+fechaInicio[1]+'/'+fechaInicio[0]+ ' '+hora;

                    let fechaFinal = row.hasta.split(' ');
                    hora = fechaFinal[1];
                    fechaFinal = fechaFinal[0].split('-');
                    fechaFinal = fechaFinal[2]+'/'+fechaFinal[1]+'/'+fechaFinal[0]+' '+hora;
                    this.setState({ 
                        operacion: {
                            id: row.id,
                            desde: fechaInicio,
                            hasta: fechaFinal,
                            md_from: row.md_from.replace(',','.'),
                            md_to: row.md_to.replace(',','.'),
                            operacion: row.operacion
                        },
                        openModalOperacion: true
                    });
                
                }).catch(error => {
                    console.log(error.message);
                })   
            }
            else
            {
                this.setState({ menuEmergente: {
                    x: e.event.clientX, y: e.event.clientY, showMenu: true,
                    fecha: infoData[0].x, prof: infoData[0].y
                    }
                });
                //console.log('x=' + e.event.clientX + ' y=' + e.event.clientY)
            }
                
        }
    }   
    PlotOnHover = (e) => {
        
        //let infoData = e.points.map ( function (data) {
        //    let point = {x: data.x, y: data.y}
        //    return point;
        //});
           
        var points = e.points[0], pointNum = points.pointNumber;
        if (this.state.isLoadedHorizontal)
        {   
           
            let nt_h = this.state.dataGH.length;           
            let curves_h = []
            let coords_h = []
            for(let i=0; i<nt_h; i++) {
                curves_h.push({curveNumber: i, pointNumber: pointNum})
                coords_h.push('xy' + ((i>0)? String(i+1) : ''))
            }
           
            Plotly.Fx.hover('plotTracksHorizontal', curves_h, coords_h);
        }

        if (this.state.isLoadedVertical)
        {
            let nt_v = this.state.dataGV.length;
            let coords_v = []
            let curves_v = []
            for(let i=0; i<nt_v; i++) {
                curves_v.push({curveNumber: i, yval: e.yvals[0]})
                coords_v.push('x' + ((i>0)? String(i+1) : '') + 'y')
            }
            Plotly.Fx.hover('plotTracksVertical', curves_v, coords_v);
        }
    }
    PlotOnUnHover = () => {
        if (this.state.isLoadedHorizontal)
            Plotly.Fx.unhover('plotTracksHorizontal')
        if (this.state.isLoadedVertical)
            Plotly.Fx.unhover('plotTracksVertical')
    }

    PlotOnRelayout = (eventdata) => {
                
        let layout_hor = {...this.state.layoutTH}
        let layout_ver = {...this.state.layoutTV}
        
        if (eventdata['xaxis.range[0]'] !== undefined)
        {
            layout_hor.xaxis = {
                range: [ eventdata['xaxis.range[0]'], eventdata['xaxis.range[1]'] ], nticks: 5
            }

        }
        else
        {
            layout_hor.xaxis = {
                autorange: true
            }
        }

        if (eventdata['yaxis.range[0]'] !== undefined) 
        {
            /*
            let P1X1 = 0
            let P2X1 = 60
            let P1Y1 = eventdata['yaxis.range[1]']
            let P2Y1 = eventdata['yaxis.range[0]']
            let punto = 100
            let pendiente = (P2Y1-P1Y1)/(P2X1-P1X1)
            let corte = P1Y1 - pendiente * P1X1          
            let newMax = pendiente * punto + corte
            */
            let newMax = this.maxTrackVertical(eventdata['yaxis.range[1]'], eventdata['yaxis.range[0]'])

            layout_ver.yaxis = {
                range: [ newMax, eventdata['yaxis.range[1]'] ], nticks: 15
            }
            
        }
        
        layout_hor.datarevision++
        layout_ver.datarevision++

        this.setState({
            layoutTH: layout_hor,
            layoutTV: layout_ver
        })
    }

    PlotTrackHorizontalOnHover  = (e) => {      
        var points = e.points[0], pointNum = points.pointNumber;
        let nt = this.state.dataGH.length;
        
        let curves = []
        let coords = []
        for(let i=0; i<nt; i++) {
            curves.push({curveNumber: i, pointNumber: pointNum})
            coords.push('xy' + ((i>0)? String(i+1) : ''))
        }
        Plotly.Fx.hover('plotTracksHorizontal', curves, coords);

        Plotly.Fx.hover('plotDept', [
            { curveNumber: 0, pointNumber: pointNum }
        ], ['xy']);

        
    }
    PlotTrackHorizontalOnUnHover = () => {
        Plotly.Fx.unhover('plotDept')
    }

    PlotTrackVerticalOnHover  = (e) => {      
        
        let nt = this.state.dataGV.length;
        
        let curves = []
        let coords = []
        for(let i=0; i<nt; i++) {
            curves.push({curveNumber: i,  yval: e.yvals[0]})
            coords.push('x' + ((i>0)? String(i+1) : '') + 'y')
        }
        Plotly.Fx.hover('plotTracksVertical', curves, coords);

        Plotly.Fx.hover('plotDept', [
            { curveNumber: 0, yval: e.yvals[0]}
        ], ['xy']);
        
    }
    PlotTrackVerticalOnUnHover = () => {
        Plotly.Fx.unhover('plotDept')
    }

    //

    //HANDLES
    handleChangeEvento = (e) => {
        this.setState({
            evento: {
                ...this.state.evento,
                [e.target.name]: e.target.value
            }
        });
    } 

    handleChangeTipoEvento = (e) => {
        let tipoEvento = this.state.dataTipoEvento.find(item => item.value === Number(e.target.value));
        let ev = {...this.state.evento}
        if (tipoEvento !== undefined)
        {
            ev.tipo_evento_id = e.target.value;
            ev.TipoEvento = tipoEvento.label;
            ev.color = tipoEvento.color;
        }
        else
        {
            ev.tipo_evento_id = 0
            ev.color = '#FFFFFF';
        }
        this.setState({ 
            evento: { 
                ...ev                 
            },
            showing: false 
        });
    }
   
    handleChangeOperacion = (e) => {
        this.setState({
            operacion: {
                ...this.state.operacion,
                [e.target.name]: e.target.value
            }
        });
    }

    handleClose = () => {
        this.setState({menuEmergente: {
            showMenu: false, x: 0, y: 0
            }
        });
    }
    //

  
    //Api
    UpdateEvent = () => {
       
        let fechaInicio = this.state.evento.fecha_inicial + ' ' + this.state.evento.hora_inicial;
        let fechaFinal = this.state.evento.fecha_final + ' ' + this.state.evento.hora_final;
        let numberFecI = new Date(fechaInicio).getTime();
        let numberFecF = new Date(fechaFinal).getTime();
        let profundidadInicio = this.state.evento.profundidad_inicial.replace(',', '.');
        let profundidadFinal = this.state.evento.profundidad_final.replace(',', '.');

        if (this.state.showing)
            this.state.evento.tipo_tiempo = 2;
        else
        {
            this.state.evento.tipo_tiempo = 1;
            this.state.evento.fecha_final = this.state.evento.fecha_inicial;
            this.state.evento.hora_final = this.state.evento.hora_inicial;
            this.state.evento.profundidad_final = this.state.evento.profundidad_inicial;
        }
        const evento   = {...this.state.evento}
        const anterior = {...this.state.eventoAnterior}
        
        //Actualizar
        axios.put(URL + 'eventos', this.state.evento)
            .then( response => {
                
                
                let updateGrafica = false;
                let newData = [...this.state.dataGP]
                let index = this.state.dataGP.findIndex((item) => item.name === anterior.TipoEvento);

                const newLayout = Object.assign({}, this.state.layoutGP)
                
                //console.log(anterior);
                //console.log(evento);
                // Es el mismo tipo de evento (traza) ?
                if (anterior.tipo_evento_id === evento.tipo_evento_id)
                {
                    
                    //Evento Puntual (Anterior)
                    if (anterior.tipo_tiempo === 1)
                    {
                        if (
                            (anterior.fecha_inicial !== evento.fecha_inicial) || 
                            (anterior.hora_inicial  !== evento.hora_inicial) || 
                            (anterior.profundidad_inicial !== evento.profundidad_inicial)
                        )
                        {
                            //Actualizar el punto
                            newData[index].x.splice(0, 1, fechaInicio);
                            newData[index].y.splice(0, 1, profundidadInicio);            
                            updateGrafica = true;
                            
                        }

                        // De Puntual a En el tiempo
                        if (evento.tipo_tiempo === 2)
                        {
                            //Agegar shape
                            let color = hexRgb(evento.color, {format: 'css'});
                            let shape = { name: evento.id, type: 'rect', xref: 'x', yref: 'y', 
                                x0: numberFecI, y0: profundidadInicio, x1: numberFecF, y1: profundidadFinal ,
                                line: {color: color , width: 1}
                            };
                            newLayout.shapes.push(shape);
                            updateGrafica = true;
                            console.log('De puntual a en el Tiempo')
                        }
                    }
                    else
                    {
                    // Evento en tiempo (Anterior)
                        if (
                            (anterior.fecha_inicial !== evento.fecha_inicial) || 
                            (anterior.hora_inicial  !== evento.hora_inicial) || 
                            (anterior.profundidad_inicial !== evento.profundidad_inicial) ||
                            (anterior.fecha_final !== evento.fecha_final) || 
                            (anterior.hora_final  !== evento.hora_final) || 
                            (anterior.profundidad_final !== evento.profundidad_final)
                        )
                        {
                            //Actualizar el punto
                            newData[index].x.splice(0, 1, fechaInicio);
                            newData[index].y.splice(0, 1, profundidadInicio);      
                            
                        }
                        if (evento.tipo_tiempo === 2)
                        {
                            //Actualizar el shape
                            let indexLayout = newLayout.shapes.findIndex((shape) => shape.name === evento.id);                          
                        
                            newLayout.shapes[indexLayout].x0 = numberFecI;
                            newLayout.shapes[indexLayout].y0 = profundidadInicio;
                            newLayout.shapes[indexLayout].x1 = numberFecF;
                            newLayout.shapes[indexLayout].y1 = profundidadFinal;
                        }
                        else
                        {
                            //Remover el shape  anterior
                            let indexLayout = newLayout.shapes.findIndex((shape) => shape.name === evento.id);
                            newLayout.shapes.splice(indexLayout, 1)                               
                        }
                        updateGrafica = true;

                    }

                    
                }
                else
                {
                    //Remover punto anterior de ese tipo de evento
                    let nextIndex = newData[index].text.findIndex((subitem) => subitem === evento.id)
                                        
                        //si es único registro, remover la traza
                    if (newData[index].x.length === 0)
                        newData.splice(0, 1)
                    else
                    {
                        //Si no, remover el elemento de la traza
                        newData[index].text.splice(nextIndex,1)
                        newData[index].x.splice(nextIndex,1)
                        newData[index].y.splice(nextIndex,1)
                    }
                    
                    //Agregar punto a traza nueva
                    let indexNew = newData.findIndex((item) => item.name === evento.TipoEvento);
                    

                    if (indexNew >= 0)
                    {
                        //Agrega la data en traza existente
                        newData[indexNew].x.push(fechaInicio);
                        newData[indexNew].y.push(profundidadInicio);            
                        newData[indexNew].text.push(evento.id);
                    }
                    else
                    {
                        //Agregar data en traza nueva
                        let color = hexRgb(evento.color, {format: 'css'});
                        let x = [], y = [], t = [];
                        x.push(fechaInicio);
                        y.push(profundidadInicio);
                        t.push(evento.id);
                        let traceEvento = {
                            x: x, y: y, name: evento.TipoEvento, mode: 'markers', type: 'scatter', 
                            marker: { symbol: '303', size: 10, color: color }, hovertemplate:'%{x}, %{y}', text: t
                        }
                        newData.push(traceEvento)
                    }

                    
                    if (anterior.tipo_tiempo === 2)
                    {
                        //Remover shape anterior
                        let indexLayout = newLayout.shapes.findIndex((shape) => shape.name === evento.id);
                        newLayout.shapes.splice(indexLayout, 1)

                    } 
                    if (evento.tipo_tiempo === 2)
                    {
                        //Agegar nuevo shape
                      
                        let color = hexRgb(evento.color, {format: 'css'});
                        let shape = { name: evento.id, type: 'rect', xref: 'x', yref: 'y', 
                            x0: numberFecI, y0: profundidadInicio, x1: numberFecF, y1: profundidadFinal ,
                            line: {color: color , width: 2}
                        };
                        newLayout.shapes.push(shape);
                    }
                    
                    updateGrafica = true;
                }

                if (updateGrafica)
                {
                    newLayout.datarevision++;
                    this.setState(
                        {
                            dataGP : newData,
                            layoutGP: newLayout,
                            openModalEvento: false
                        }
                    )
                }
                else
                    this.setState({ openModalEvento: false });

                console.log('OK Update')
                
            })
            .catch( error => console.log('Error Actualizar Evento: ' + error.message))
       
    }

    DeleteEvent = () => {
        const evento   = {...this.state.evento}
        var datos = {
            'id': evento.id,
            'pkuser': 2
        };
        
        axios.delete(URL + 'eventos', { data: datos }).then( response => {
            this.setState({ openModalDeleteEvento: false, openModalEvento: false });
            
            let newData = [...this.state.dataGP]
            let index = this.state.dataGP.findIndex((item) => item.name === evento.TipoEvento);
            const newLayout = Object.assign({}, this.state.layoutGP)
            
            if (index >= 0)
            {
                //si es único registro, remover la traza
                if (newData[index].x.length === 0)
                    newData.splice(0, 1)
                else
                {
                //Si no, remover el elemento de la traza
                    let nextIndex = newData[index].text.findIndex((subitem) => subitem === evento.id)
                    newData[index].text.splice(nextIndex,1)
                    newData[index].x.splice(nextIndex,1)
                    newData[index].y.splice(nextIndex,1)
                }

                //Si es en el tiempo, remover shape
                if (evento.tipo_tiempo == 2)
                {
                    
                    let indexLayout = newLayout.shapes.findIndex((shape) => shape.name === evento.id);
                    newLayout.shapes.splice(indexLayout, 1)
                }

                newLayout.datarevision++;
                this.setState(
                    {
                        dataGP : newData,
                        layoutGP: newLayout
                    }
                )

            }
            console.log('OK Delete')

        })
        .catch( error => console.log('Error Eliminar Evento: ' + error.message))
    }

    InsertEvent = () => {
        delete this.state.evento.id
        this.state.evento.wells_id =  this.state.form1.wells_id;
        this.state.evento.pkuser = 2;

        let fechaInicio = this.state.evento.fecha_inicial + ' ' + this.state.evento.hora_inicial;
        let fechaFinal = ''
        let numberFecI = new Date(fechaInicio).getTime();
        let numberFecF = 0;
        let profundidadInicio = this.state.evento.profundidad_inicial.replace(',', '.');
        let profundidadFinal = '';
        if (this.state.showing)
        {
            fechaFinal = this.state.evento.fecha_final + ' ' + this.state.evento.hora_final;
            numberFecF = new Date(fechaFinal).getTime();
            profundidadFinal = this.state.evento.profundidad_final.replace(',', '.');
            this.state.evento.tipo_tiempo = 2;
        }
        else
        {
            fechaFinal = this.state.evento.fecha_inicial + ' ' + this.state.evento.hora_inicial;
            numberFecF = new Date(fechaInicio).getTime();
            profundidadFinal = this.state.evento.profundidad_inicial.replace(',', '.');
            this.state.evento.fecha_final = this.state.evento.fecha_inicial;
            this.state.evento.hora_final = this.state.evento.hora_inicial;
            this.state.evento.profundidad_final = this.state.evento.profundidad_inicial;
            this.state.evento.tipo_tiempo = 1; 
        }
          

        const evento   = {...this.state.evento}
        
        axios.post(URL + 'eventos', this.state.evento).then( response => {
            evento.id = response.data[0].id;
           
            let newData = [...this.state.dataGP]
            let index = newData.findIndex((item) => item.name === evento.TipoEvento);

            const newLayout = Object.assign({}, this.state.layoutGP)

            //Si existe traza, incluir punto
            if (index >= 0)
            {
                newData[index].x.push(fechaInicio);
                newData[index].y.push(profundidadInicio);            
                newData[index].text.push(evento.id);      
            }
            else
            {
            //no existe traza, crear
                let color = hexRgb(evento.color, {format: 'css'});
                let x = [], y = [], t = [];
                x.push(fechaInicio);
                y.push(profundidadInicio);
                t.push(evento.id);
                let traceEvento = {
                    x: x, y: y, name: evento.TipoEvento, mode: 'markers', type: 'scatter', 
                    marker: { symbol: '303', size: 10, color: color }, hovertemplate:'%{x}, %{y}', text: t
                }
                newData.push(traceEvento)
            }
            
            //Si es en el tiempo
            if (evento.tipo_tiempo == 2)
            {
                let color = hexRgb(evento.color, {format: 'css'});
                let shape = { name: evento.id, type: 'rect', xref: 'x', yref: 'y', 
                    x0: numberFecI, y0: profundidadInicio, x1: numberFecF, y1: profundidadFinal ,
                    line: {color: color , width: 2}
                };
                newLayout.shapes.push(shape);
            }
            
            newLayout.datarevision++;
            this.setState(
                {
                    dataGP : newData,
                    layoutGP: newLayout,
                    openModalEvento: false
                }
            )
            console.log('OK Evento '+ evento.id)
            
        }).catch(error => {
            console.log('Error Insertar Evento: ' + error.message);
        })
    }

    
   
    handlePlot=() => {
        let punto = this.state.menuEmergente;
        let fecha = punto.fecha.split(' ');
        this.setState({evento: {color: '#FFFFFF', fecha_inicial: fecha[0], hora_inicial: fecha[1], profundidad_inicial: String(punto.prof), profundidad_final: ''}});
        this.setState({menuEmergente: {showMenu : false}, insertar: true, openModalEvento: true});
    }
   
    handleOnChangeTH = (position) => {
        const updatedCheckedState = this.state.checkedStateTH.map((item, index) =>
            index === position ? !item : item
        )

        let layout = {
            autosize: true,
            uirevision: 'true',
            margin: { l: 60, r: 10, t: 30, b: 40 }, 
            dragmode: 'zoom',
            hovermode: 'closest',
            plot_bgcolor: 'white',
            paper_bgcolor: 'rgb(233,233,233)',
            font: { family: 'verdana', size: 11},
            showlegend: false,
            grid:  { rows: 0, columns: 1, pattern: 'independent', subplots:[], roworder: 'top to bottom'},
            xaxis: { fixedrange: false, showspikes: true, spikemode: 'across', type: 'time', tickformat: '%d %b %Y \n %H:%M:%S ', title: 'Tiempo', nticks: 5  },
            datarevision: this.state.layoutTH.datarevision++
        };
        let i = 1;
        let trazas = []
        updatedCheckedState.forEach ( (item, index) => {
            if (item)
            {
                let data = this.state.dataBK_GH.filter( (subitem, subindex) => {
                    return index == subindex;
                }) 

                let traza = {
                    name :  data[0].name,
                    x: data[0].x,
                    y: data[0].y,
                    xaxis: 'x',
                    yaxis: 'y' + ((i > 1) ? String(i) : '')
                }

                let propertyAxi = "yaxis" + ((i > 1) ? String(i) : '');
                layout[propertyAxi] = { title: data[0].name, autorange: 'reversed', titlefont: { size: 10, color: 'blue', }, tickfont: { size: 8.0 } }
                
                let subplot = ['xy' + ((i > 1) ? String(i) : '') ]
                layout.grid.subplots.push(subplot);
                
                trazas.push(traza);
                i++;
            }
        })
        layout.grid.rows = i;

        this.setState({
            checkedStateTH : updatedCheckedState,
            layoutTH: layout,
            dataGH: trazas,
        });
    }

    handleOnChangeTV = (position) => {
        const updatedCheckedState = this.state.checkedStateTV.map((item, index) =>
          index === position ? !item : item
        )
        this.setState({checkedStateTV : updatedCheckedState})
        
        //let maxDMEAVertical = maxDMEA + Math.floor(maxDMEA * PORCENTAJE_INCREMENTO_TRACK_VERTICAL)
        /*
        let P1X1 = 0
        let P2X1 = 60
        let P1Y1 = -200
        let P2Y1 = maxDMEA
        let punto = 100
        let pendiente = (P2Y1-P1Y1)/(P2X1-P1X1)
        let corte = P1Y1 - pendiente * P1X1       
        let newMax = pendiente * punto + corte
        */
        let newMax = this.maxTrackVertical(-200, maxDMEA)

        let layout = {
            autosize: true,
            uirevision: 'true',
            margin: { l: 40, r: 20, t: 80, b: 5 }, 
            dragmode: 'zoom',
            hovermode: 'closest',
            plot_bgcolor: 'white',
            paper_bgcolor: 'rgb(233,233,233)',
            font: { family: 'verdana', size: 11},
            showlegend: false,
            grid:  { columns: 0, rows: 1, pattern: 'independent', subplots:[]},
            yaxis: { fixedrange: false, autorange: false, range: [newMax, -200], nticks: 15},
            datarevision: this.state.layoutTV.datarevision++
        };

        let i = 1;
        let trazas = []
        let subplots = []
        updatedCheckedState.forEach ( (item, index) => {
            if (item)
            {
                let data = this.state.dataBK_GV.filter( (subitem, subindex) => {
                    return index == subindex;
                }) 

                let traza = {
                    name :  data[0].name,
                    x: data[0].x,
                    y: data[0].y,
                    yaxis: 'y',
                    xaxis: 'x' + ((i > 1) ? String(i) : '')
                }

                let propertyAxi = "xaxis" + ((i > 1) ? String(i) : '');
                layout[propertyAxi] = { title: data[0].name, autorange: 'reversed', titlefont: { size: 10, color: 'red', }, tickfont: { size: 8.0 }, fixedrange: false, showspikes: true , side: 'top', showticklabels: true, textposition: 'top center'}

                let subplot = 'x' + ((i > 1) ? String(i) : '')  + 'y'
                subplots.push(subplot)
                trazas.push(traza);
                i++;
            }
        })
        layout.grid.subplots.push(subplots);
        layout.grid.columns = i - 1;

        this.setState({
            checkedStateTV : updatedCheckedState,
            layoutTV: layout,
            dataGV: trazas,
        });
    }

   
    componentDidMount() {
        this.getTipoCurvasByTemplate();
        this.peticionTipoEventosGet();
    }     

    setFechaFinal(){
        this.setState({ showing: !this.state.showing });
    }
    
    now() {
        let ahora = new Date();
        return ahora.getHours() + ':' + ahora.getMinutes() + ':' + ahora.getSeconds() + '.' + ahora.getMilliseconds();
    }

    maxTrackVertical = (P1Y1, P2Y1) => {
        let P1X1 =  0
        let P2X1 = 60

        let punto = 99.5
        
        let pendiente = (P2Y1-P1Y1)/(P2X1-P1X1)
        let corte = P1Y1 - pendiente * P1X1
        
        let newMax = pendiente * punto + corte
        return newMax
    }
    render() { 
               
        return (
            <div className="">
               
                <SideBar pageWrapId={"page-wrap"} outerContainerId={"App"} />
                          
                <div className="container-fluid">
                    <div className="row" style={{'backgroundColor': 'rgb(200,200,200)'}}>
                        <div className="col-md-12 col-lg-12 text-center">
                            <label><b>Datos históricos Pozo:</b> {this.state.form1.nombre_pozo}</label>
                            {this.state.isLoaded ? '' : <Loader /> } 
                        </div>
                    </div>
            
                    {this.state.isLoaded ? 
                        <Fragment>
                          
                            <div className="row" style={{'backgroundColor': 'rgb(233,233,233)'}} >
                                <div className="col-md-9">
                                    <div className="row">
                                        <div className="col-md-12">
                                            {this.state.isLoadedPrincipal ?
                                            <Plot
                                                divId="plotDept"
                                                data={this.state.dataGP}
                                                layout={this.state.layoutGP}
                                                config={this.state.configGP}
                                                useResizeHandler={true}
                                                style={{width:"100%", height:"60vh"}}
                                                onClick={(e) => this.PlotClick(e)}
                                                onHover={(e) => this.PlotOnHover(e)}
                                                onUnhover={(e) => this.PlotOnUnHover(e)}
                                                onRelayout={(e) => this.PlotOnRelayout(e)}
                                                onInitialized={(figure) => this.setState(figure)}
                                                onUpdate={(figure) => this.setState(figure)}
                                            />
                                            : '' }
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12">
                                            
                                            
                                            <div className="row">
                                                <div className="col-md-12">
                                                    {this.state.isLoadedHorizontal ?
                                                    <>
                                                    <Plot
                                                        divId="plotTracksHorizontal"
                                                        data={this.state.dataGH}
                                                        layout={this.state.layoutTH}
                                                        config={this.state.configGP}
                                                        useResizeHandler={true}
                                                        style={{width:"100%", height:"35vh"}}
                                                        onHover={(e) => this.PlotTrackHorizontalOnHover(e)}
                                                        onUnhover={(e) => this.PlotTrackHorizontalOnUnHover(e)}
                                                    />
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                           <button className="btn btn-sm btn-primary"  onClick={() => this.setState({openModalTH: true})}  style={{"position": "fixed", "bottom": "4px", "left": "2px"}} title="Activar/Desactivar Tracks Horizontales" ><HorizontalSplitIcon fontSize="small"/></button>
                                                        </div>
                                                    </div>
                                                    </>
                                                    : '' }
                                                </div>
                                            </div>
                                            
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="row">
                                        <div className="col-md-12">
                                            {this.state.isLoadedVertical ?
                                            <>
                                            <Plot
                                                divId="plotTracksVertical"
                                                data={this.state.dataGV}
                                                layout={this.state.layoutTV}
                                                config={this.state.configGP}
                                                useResizeHandler={true}
                                                style={{width:"100%", height:"95vh"}}
                                                onHover={(e) => this.PlotTrackVerticalOnHover(e)}
                                                onUnhover={(e) => this.PlotTrackVerticalOnUnHover(e)}
                                            />
                                            <div className="row">
                                                <div className="col-md-12 mt-2">
                                                    <button className="btn btn-sm btn-danger" style={{"position": "fixed", "bottom": "4px", "left": "75%"}} onClick={() => this.setState({openModalTV: true})} title="Activar/Desactivar Tracks Verticales" ><VerticalSplitIcon fontSize="small" /></button>
                                                </div>
                                            </div>
                                            </>
                                            : '' }
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                          
                        </Fragment>
                    : ''}
                    
                </div>
                <Menu
                    open={this.state.menuEmergente.showMenu}
                    anchorReference="anchorPosition"
                    anchorPosition={
                    this.state.menuEmergente.y !== 0 && this.state.menuEmergente.x !== 0
                        ? { top: this.state.menuEmergente.y + 10, left: this.state.menuEmergente.x + 10 }
                        : undefined
                    }
                >
                    <MenuItem key={'MI1'} onClick={this.handlePlot}><EventNoteIcon /> Agregar Evento</MenuItem>
                    <MenuItem key={'MI2'} onClick={this.handleClose}><CloseIcon /> Cerrar </MenuItem>
                </Menu>

                <Modal isOpen={this.state.openModalEvento} size="lg">
                    <ModalBody>
                        <div className="row">
                            <div className="col-md-10">
                                <div className="form-group">
                                    <label><b>Tipo de Evento: </b></label>
                                    <select name="tipo_evento_id" id="tipo_evento_id" className="form-control" 
                                        onChange={this.handleChangeTipoEvento} 
                                        defaultValue={this.state.evento ? this.state.evento.tipo_evento_id : ''}>
                                        {this.state.insertar ? <option key="0" value="0">Seleccione</option> : ''}
                                        {this.state.dataTipoEvento.map(elemento => (<option key={elemento.value} value={elemento.value}>{elemento.label}</option>))}
                                    </select>
                                </div>
                            </div>
                            <div className="col-md-2">
                                <div className="form-group">
                                    <br/>
                                    <TextField
                                        id="color"
                                        name="color"
                                        type="color"
                                        value={this.state.evento.color}
                                        onChange={this.handleChangeEvento}
                                        disabled
                                        className="form-control"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label><b>Fecha Inicial: </b></label>
                                    <TextField
                                        id="fecha_inicial"
                                        name="fecha_inicial"
                                        type="date"
                                        defaultValue={this.state.evento ? this.state.evento.fecha_inicial : ''}
                                        className="form-control"
                                        onChange={this.handleChangeEvento} 
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label><b>Hora Inicial: </b></label>
                                    <TextField
                                        id="hora_inicial"
                                        name="hora_inicial"
                                        type="time"
                                        defaultValue={this.state.evento ? this.state.evento.hora_inicial : ''}
                                        className="form-control"
                                        onChange={this.handleChangeEvento} 
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label><b>Profundidad Inicial: </b></label>
                                    <TextField
                                        id="profundidad_inicial"
                                        name="profundidad_inicial"
                                        type="text"
                                        pattern="^\d*(\.\d{0,2})?$" 
                                        defaultValue={this.state.evento ? this.state.evento.profundidad_inicial : ''}
                                        className="form-control"
                                        onChange={this.handleChangeEvento} 
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row" onClick={() => this.setFechaFinal()} >
                            <div className="col-md-12 text-center">
                                <div className="form-group">
                                    <CalendarTodayIcon style={{cursor: 'pointer'}}/>  Click para {(this.state.showing ? "inactivar" : "activar")} fecha final 
                                </div>
                            </div>
                        </div> 
                        <div style={{ display: (this.state.showing ? "block" : "none"),}}>
                            <div className="row" >
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label><b>Fecha Final: </b></label>
                                        <TextField
                                            id="fecha_final"
                                            name="fecha_final"
                                            type="date"
                                            defaultValue={this.state.evento ? this.state.evento.fecha_final : ''}
                                            className="form-control"
                                            onChange={this.handleChangeEvento} 
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label><b>Hora Final: </b></label>
                                        <TextField
                                            id="hora_final"
                                            name="hora_final"
                                            type="time"
                                            defaultValue={this.state.evento ? this.state.evento.hora_final : ''}
                                            className="form-control"
                                            onChange={this.handleChangeEvento} 
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label><b>Profundidad Final: </b></label>
                                        <TextField
                                            id="profundidad_final"
                                            name="profundidad_final"
                                            type="text"
                                            pattern="^\d*(\.\d{0,2})?$" 
                                            defaultValue={this.state.evento ? this.state.evento.profundidad_final : ''}
                                            className="form-control"
                                            onChange={this.handleChangeEvento} 
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="form-group">
                                    <label htmlFor="descripcion"><b>Descripción: </b></label>
                                    <textarea rows="3"
                                        id="descripcion"
                                        name="descripcion"
                                        value={this.state.evento ? this.state.evento.descripcion : ''}
                                        className="form-control"
                                        onChange={this.handleChangeEvento} 
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="form-group">
                                    <label htmlFor="causa"><b>Causa: </b></label>
                                    <textarea  row="3" 
                                        id="causa"
                                        name="causa"
                                        value={this.state.evento ? this.state.evento.causa : ''}
                                        className="form-control"
                                        onChange={this.handleChangeEvento} 
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="form-group">
                                    <label htmlFor="solucion"><b>Solución: </b></label>
                                    <textarea  rows="3"
                                        id="solucion"
                                        name="solucion"
                                        value={this.state.evento ? this.state.evento.solucion : ''}
                                        className="form-control"
                                        onChange={this.handleChangeEvento} 
                                    />
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        { this.state.insertar ? <button className="btn btn-success" onClick={() => this.InsertEvent()}><SaveIcon /> Insertar </button> : <button className="btn btn-primary" onClick={() => this.UpdateEvent()}><SaveIcon /> Actualizar </button>}
                        { this.state.insertar ?  '' : <button className="btn btn-danger" onClick={() => this.setState({ openModalDeleteEvento: true })}><DeleteIcon /> Eliminar </button> }
                        <button className="btn btn-secondary" onClick={() => this.setState({ openModalEvento: false })}><CloseIcon /> Cerrar</button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.openModalDeleteEvento}>
                    <ModalBody>
                            <div className="form-group text-center">
                                Est&aacute;s seguro de eliminar el evento ?
                            </div>
                            <br/>
                            <div className="form-group">
                                
                                <b><label >Tipo de Evento:&nbsp;</label></b>
                                    <span>{ this.state.evento.TipoEvento } </span>
                                <br />
                                <b><label>Fecha:&nbsp;</label></b>
                                { this.state.evento.fecha_inicial + ' ' + this.state.evento.hora_inicial}
                                { (this.state.evento.tipo_tiempo == 2) ? ' ~ ' + this.state.evento.fecha_final + ' ' + this.state.evento.hora_final : ''} 
                                <br />
                                <b><label>Profundidad:&nbsp;</label></b>
                                { this.state.evento.profundidad_inicial }
                                { (this.state.evento.tipo_tiempo == 2) ? ' ~ ' + this.state.evento.profundidad_final : '' } 
                                <br />
                                <b><label>Descripción:&nbsp;</label></b>
                                { this.state.evento.descripcion} 
                            
                            </div>
                    </ModalBody>
                    <ModalFooter>
                        <br />
                        <button className="btn btn-danger" onClick={() => this.DeleteEvent()}>Si</button>
                        <button className="btn btn-secondary" onClick={() => this.setState({ openModalDeleteEvento: false })}> No</button>
                    </ModalFooter>
                </Modal>
                
                <Modal isOpen={this.state.openModalOperacion} size="lg">
                    <ModalBody>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label><b>Fecha Inicial: </b></label>
                                    <TextField
                                        id="desde"
                                        name="desde"
                                        type="text"
                                        disabled
                                        defaultValue={this.state.operacion ? this.state.operacion.desde : ''}
                                        className="form-control"
                                        onChange={this.handleChangeOperacion} 
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label><b>Profundidad Inicial: </b></label>
                                    <TextField
                                        id="md_from"
                                        name="md_from"
                                        type="text"
                                        disabled
                                        defaultValue={this.state.operacion ? this.state.operacion.md_from : ''}
                                        className="form-control"
                                        onChange={this.handleChangeOperacion} 
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label><b>Fecha Final: </b></label>
                                    <TextField
                                        id="hasta"
                                        name="hasta"
                                        type="text"
                                        disabled
                                        defaultValue={this.state.operacion ? this.state.operacion.hasta : ''}
                                        className="form-control"
                                        onChange={this.handleChangeOperacion} 
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label><b>Profundidad Final: </b></label>
                                    <TextField
                                        id="md_to"
                                        name="md_to"
                                        type="text"
                                        disabled
                                        defaultValue={this.state.operacion ? this.state.operacion.md_to : ''}
                                        className="form-control"
                                        onChange={this.handleChangeOperacion} 
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="form-group">
                                    <label htmlFor="operacion"><b>Operación: </b></label>
                                    <textarea rows="3"
                                        id="operacion"
                                        name="operacion"
                                        disabled
                                        value={this.state.operacion ? this.state.operacion.operacion : ''}
                                        className="form-control"
                                        onChange={this.handleChangeOperacion} 
                                    />
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-secondary" onClick={() => this.setState({ openModalOperacion: false })}>Cerrar</button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.openModalTH}>
                    <ModalHeader>
                        <div><label>Activar / Desactivar Track Horizontal</label></div>
                    </ModalHeader>
                    <ModalBody>

                    { this.state.isLoadedHorizontal ? 
                         
                    ( this.state.tracksHor.map ( 
                        (t , index) => 
                            ( <div key={`div_th_${index}`} className="row"><div className="col-md-12">
                                <input
                                key={`chk_th_${index}`}
                                type="checkbox"
                                id={`chk_th_${index}`}
                                name={t}
                                value={t} 
                                checked={this.state.checkedStateTH[index]}
                                onChange={() => this.handleOnChangeTH(index)}
                            /> <label>{t}</label></div></div> )
                        ) 
                    )  
                    : '' }
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-secondary" onClick={() => this.setState({ openModalTH: false })}> Cerrar</button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.openModalTV}>
                    <ModalHeader>
                        <div><label>Activar / Desactivar Track Vertical</label></div>
                    </ModalHeader>
                    <ModalBody>
                        { this.state.isLoadedVertical ? 
                            
                        ( this.state.tracksVer.map ( 
                            (t , index) => 
                                ( <div key={`div_tv_${index}`} className="row"><div className="col-md-12">
                                    <input
                                    key={`chk_tv_${index}`}
                                    type="checkbox"
                                    id={`chk_tv_${index}`}
                                    name={t}
                                    value={t} 
                                    checked={this.state.checkedStateTV[index]}
                                    onChange={() => this.handleOnChangeTV(index)}
                                /> <label>{t}</label></div></div> )
                            ) 
                        )  
                        : '' }
                   
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-secondary" onClick={() => this.setState({ openModalTV: false })}> Cerrar</button>
                    </ModalFooter>
                </Modal>

                
            </div>
        );

    }
}
export default viewVisualHistoricoDC;
