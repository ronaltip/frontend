import React from 'react';
//import ReactDOM from 'react-dom';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
//import Cookies from 'universal-cookie';
import SideBar from "../componentes/sidebar";
import Cabecera from "../componentes/cabecera";
import '../css/styles.css';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';


import Plotly from 'plotly.js';


import { Simplify } from 'curvereduce';



const url = "http://localhost:9000/datos_entrada";
const urlAuxiliar1 = "http://localhost:9000/template_track_config"; 
const urlAuxiliar2 = "http://localhost:9000/eventos";
const urlAuxiliar3 = "http://localhost:9000/template_config";


var datosGraficaPrincipal_Aux = '';  
var datosGraficaPrincipal_Aux2 = '';
var datosGraficaPrincipal_EventosPuntual = '';  
var datosGraficaPrincipal_EventosShape = '';  

var datosgrafHorizont_Aux = '';


//var color = new Array(30);
var simbolo = new Array(30);

//color = ["blue", "green", "orange", "yellow", "black", "red", "cyan", "gray", "pink", "violet", "yellowgreen", "greenyellow", "olive", "skyblue", "brown", "chocolate", "navy", "aquamarine", "lime", "indigo", "lightgray"];
simbolo = ["circle", "square", "diamond", "cross", "x", "triangle-up", "triangle-down", "start", "octagon", "hexagon"]

 


class viewVisualHistoricoDP extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            isLoadedPrincipal: false,
            isLoadedVertical: false,
            isLoadedHorizontal: false,
            dataEntrada: [],
            dataEntrada2: [],
            dataEventos: [],
            dataTemplateConfig: [],
            dataConfigTrack: [],
            dataRta: [],

            datosParaGraficaPrincipal: '',
            datosParaGraficaAuxiliares: '',
            datosConfiglayout_Horizontal: '',
            datosParaGraficaHorizontal: '',
             

            form: { x: '', y: '' },

            form1: {
                id: '',
                wells_id: '',
                archivo_encabezado_id: '',
                datetime: '', dmea: '', dbtm: '', rpm: '', ropa: '', mfia: '', tqa: '', wob: '',
                nombre_archivo: '',
                nombre_pozo: '',
                pkuser: '',
                validar:''
            },

            formoperaciones: {
                datos_entrada_id: '', datetime: '', dmea: '', dbtm: '', rpm: '', ropa: '', mfia: '', tqa: '', wob: '', dmeacorregida: '', dbtmcorregida: '', operacion: '', puntero: ''
            },

            shapes: '',
            openModalEvento: false
        };
        this.ShowModal = this.ShowModal.bind(this);
    }
     
     

    peticionGetTemplateConfigId = async () => {
        axios.get(urlAuxiliar3 + "?id=" + this.props.match.params.id).then(response => {
            
            console.log('OK TemplateConfig');
            
            this.setState({ dataTemplateConfig: response.data });
            this.seleccionarRegistro(this.state.dataTemplateConfig); 
            if (this.state.form1.validar === 1) {
                //si todas las variables son de telemetria consulta el campo de operaciones
                this.peticionGetEventos();
                this.peticionDataEntradaGet();
                this.setState({ isLoadedPrincipal: true });
            } 
            else
            {
                //Calcular las variables tipo 2
            }
            
            
        }).catch(error => {
            console.log(error.message);
        })
    };


     
    //Traer los eventos de la tabla Eventos + la tabla Operaciones
    //Campo N/P = N
    //Arreglar la fecha
    //Las cruces en el visualizador
    peticionGetEventos = async () => {
        axios.get(urlAuxiliar2 + "?id=" + this.state.form1.wells_id).then(response => {
            
            console.log('OK Eventos');

            this.setState({ dataEventos: response.data }); 
        }).catch(error => {
            console.log(error.message);
        })
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

    /* 
        Escenario 1:
        si todas las variables son de telemetria, consulta el campo de datos_operaciones 
        tabla datos_entrada 
    */
    peticionDataEntradaGet = () => {
        //trae todos los datos de datos_entrada (datos, datos_operaciones)
        axios.get(url + '?iddp2=' + this.state.form1.wells_id).then(response => {
            this.setState({ dataEntrada2: response.data }); 
            console.log('OK datosEntrada2 ');
            /* Ejecuta el algoritmo de douglas y crea la grafica principal */
            // trae el x, y = ID, DBTM
            axios.get(url + '?iddp=' + this.state.form1.wells_id).then(response => {
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
                    axios.get(urlAuxiliar1 + "?idt=" + this.state.form1.id).then(response => {
                        this.setState({ dataConfigTrack: response.data });
                        console.log('OK ConfigTrack ');

                        this.creaGraficaPrincipal(this.state.dataRta.sort(), this.state.dataEntrada2.sort());
                        this.crearCF_LayoutHorizontal(this.state.form1.id);

                    }).catch(error => {
                        console.log(error.message);
                    })
                    
                    /* axios.get(urlAuxiliar2 + "?id=" + this.state.form1.wells_id).then(responses => {
                        this.setState({ dataEventos: responses.data }); 
                    
                    }).catch(error => {
                        console.log(error.message);
                    }) */
                   
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


   

    crearCF_LayoutHorizontal = (id) => {


        var layout_Horizontal = "";
        var referencia = [];

        let rows_tmp = null;
        let ind = 0
        var subplot_tmp = "";
        var yaxis_tmp = "";

        var DATETIME = "";
        var DBTM = "";
        var DMEA = "";
        var MFIA = "";
        var ROPA = "";
        var RPM = "";
        var TQA = "";
        var WOB = "";


       

        axios.get(urlAuxiliar1 + "?idt=" + id).then(response => {
            this.setState({ dataConfigTrack: response.data });
            if (this.state.dataConfigTrack.length > 0) {
                            
                referencia = this.state.dataConfigTrack.filter(item => item.referencia_id === 1)

                rows_tmp = referencia.length; 
                  

                if (rows_tmp > 0) {

                    layout_Horizontal = "[{ autosize: true, uirevision: true, margin: { l: 60, r: 10, t: 10, b: 30 }, dragmode: 'zoom',showlegend: false, plot_bgcolor: 'white', paper_bgcolor: 'lightgray', xaxis: { fixedrange: false, showspikes: true, spikemode: 'across', type: 'time', tickformat: '%d %b %Y \\n %H:%M:%S ', title: 'Tiempo', nticks: 5  },";        
                    datosgrafHorizont_Aux = "";

                     DATETIME="";   DBTM = "";  DMEA = ""; MFIA = "";     ROPA = "";  RPM = "";     TQA = "";       WOB = "";

                    var auxiliar2 = '';
                    var auxiliar = this.state.datosParaGraficaAuxiliares.split('|'); 
                    for (let i = 0; i < auxiliar.length; i++) {
                        auxiliar2 = auxiliar[i].split('=');
                        switch (auxiliar2[0]) {
                            case "DATETIME": DATETIME = auxiliar2[1]; break;
                            case "DBTM": DBTM = auxiliar2[1]; break;
                            case "DMEA": DMEA = auxiliar2[1]; break;
                            case "MFIA": MFIA = auxiliar2[1]; break;
                            case "ROPA": ROPA = auxiliar2[1]; break;
                            case "RPM": RPM = auxiliar2[1]; break;
                            case "TQA": TQA = auxiliar2[1]; break;
                            case "WOB": WOB = auxiliar2[1]; break; 
                            default: 
                             break;
                        }     
                    }
                    



                    for (let k = 0; k < rows_tmp; k++) {

                        if (ind === 0) {
                            subplot_tmp = subplot_tmp + "['xy'],";
                            ind = ind + 1;
                        }
                        else {                            
                            subplot_tmp = subplot_tmp + "['xy" + ind + "'],";
                            ind = ind + 1;
                        }
                        
                        yaxis_tmp = yaxis_tmp + " yaxis" + (k+1) + ": { title: '" + referencia[k].tag + "', autorange: 'reversed', titlefont: { size: 10, color: 'blue', }, tickfont: { size: 8.0 } },"
                         
                        datosgrafHorizont_Aux = datosgrafHorizont_Aux + "{ x: [" + DATETIME + "],";

                        switch (referencia[k].tag) { 
                            case 'DBTM': datosgrafHorizont_Aux = datosgrafHorizont_Aux + " y: [" + DBTM + "], "; break;    
                            case 'DMEA': datosgrafHorizont_Aux = datosgrafHorizont_Aux + " y: [" + DMEA + "], "; break;                               
                            case 'MFIA': datosgrafHorizont_Aux = datosgrafHorizont_Aux + " y: [" + MFIA + "], "; break;                                
                            case 'ROPA': datosgrafHorizont_Aux = datosgrafHorizont_Aux + " y: [" + ROPA + "], "; break;                                
                            case 'RPM' : datosgrafHorizont_Aux = datosgrafHorizont_Aux + " y: [" + RPM + "], "; break;                                
                            case 'TQA' : datosgrafHorizont_Aux = datosgrafHorizont_Aux + " y: [" + TQA + "], "; break;                                
                            case 'WOB' : datosgrafHorizont_Aux = datosgrafHorizont_Aux + " y: [" + WOB + "], "; break; 
                            default: break;                               
                        }
                     
                        datosgrafHorizont_Aux = datosgrafHorizont_Aux + " mode: 'lines + markers', type: 'scatter', name: '" + referencia[k].tag + "', text: '" + referencia[k].tag + "', xaxis: 'x', yaxis: 'y" + (k + 1) +"' },";
                         
                    }

                    subplot_tmp = subplot_tmp.substring(subplot_tmp.length - 1, 0);
                    yaxis_tmp = yaxis_tmp.substring(yaxis_tmp.length - 1, 0);
                    //layout_Horizontal = layout_Horizontal + " grid: { rows: " + rows_tmp + ", columns: 1, subplots: [" + subplot_tmp + "], roworder: 'top to bottom' }," + yaxis_tmp + "}]";
                    layout_Horizontal = layout_Horizontal + " grid: { rows: 10, columns: 1, subplots: [['xy'],['xy2'], ['xy3'], ['xy4'], ['xy5'],['xy6'], ['xy7'],['xy8'], ['xy9']], roworder: 'top to bottom' }," + yaxis_tmp + "}]";
                }
                  
                datosgrafHorizont_Aux = "[" + datosgrafHorizont_Aux.substring(datosgrafHorizont_Aux.length - 1, 0) + "]";
                 

                this.setState({
                    datosConfiglayout_Horizontal: eval(layout_Horizontal),
                    datosParaGraficaHorizontal: eval(datosgrafHorizont_Aux),
                    isLoadedHorizontal: true
                });
                  
            }
            else { console.log('error'); }

        }).catch(error => {
            console.log(error.message);
        })   

         


    }

    creaGraficaPrincipal = (rsDouglas, rsTabla) => {
        console.log('Inicio Gráfica Principal ');
       
        var wells_id = '';      var indice = []; 
        var DATETIME = '';      var DBTM = '';      //var MFIA = '';
        var DMEA = '';          var MFIA = '';      var ROPA = '';
        var RPM = '';           var TQA = '';       var WOB = '';

        var operacion_0 = '';   var operacion_2 = '';   var operacion_3 = '';
        var operacion_4 = '';   var operacion_7 = '';   var operacion_8 = '';
        var operacion_9 = '';   var operacion_35 = '';  var operacion_36 = '';
        var operacion_37 = '';  var operacion_38 = '';  var operacion_39 = '';
        var operacion_40 = '';  var operacion_41 = ''; 

        var datosfecIni_Eve_Aux = '';   
        var datosproIni_Eve_Aux = '';
        var datosdescrp_Eve_Aux = '';

        var datosfecIni_EveShape_Aux = '';   
        var datosproIni_EveShape_Aux = '';
        var datosdescrp_EveShape_Aux = '';

        var fec1 = ''; var fec2 = ''; var pro1 = ''; var pro2 = '';
   
        
        if (rsDouglas.length > 0) {
            wells_id = rsTabla[0].wells_id;
            for (let k = 0; k < rsDouglas.length - 1; k++) {
                indice = rsTabla.filter(item => item.datos_entrada_id === rsDouglas[k].x)

                if (indice.length > 0) {
               
                    DATETIME = DATETIME + '\'' + indice[0].DATETIME  + '\',';
                    DBTM = DBTM + '\'' + indice[0].DBTMCorregida + '\',';
                    DMEA = DMEA + '\'' + indice[0].DMEACorregida + '\',';
                    MFIA = MFIA + '\'' + indice[0].MFIA + '\',';
                    ROPA = ROPA + '\'' + indice[0].ROPA + '\',';
                    RPM = RPM + '\'' + indice[0].RPM + '\',';
                    TQA = TQA + '\'' + indice[0].TQA + '\',';
                    WOB = WOB + '\'' + indice[0].WOB + '\',';

                    if (indice[0].operacion === 0) { operacion_0 = operacion_0 + '\'' + indice[0].DBTMCorregida + '\',' } else { operacion_0 = operacion_0 + 'null,' }
                    if (indice[0].operacion === 2) { operacion_2 = operacion_2 + '\'' + indice[0].DBTMCorregida + '\',' } else { operacion_2 = operacion_2 + 'null,' }
                    if (indice[0].operacion === 3) { operacion_3 = operacion_3 + '\'' + indice[0].DBTMCorregida + '\',' } else { operacion_3 = operacion_3 + 'null,' }
                    if (indice[0].operacion === 4) { operacion_4 = operacion_4 + '\'' + indice[0].DBTMCorregida + '\',' } else { operacion_4 = operacion_4 + 'null,' }
                    if (indice[0].operacion === 7) { operacion_7 = operacion_7 + '\'' + indice[0].DBTMCorregida + '\',' } else { operacion_7 = operacion_7 + 'null,' }
                    if (indice[0].operacion === 8) { operacion_8 = operacion_8 + '\'' + indice[0].DBTMCorregida + '\',' } else { operacion_8 = operacion_8 + 'null,' }
                    if (indice[0].operacion === 9) { operacion_9 = operacion_9 + '\'' + indice[0].DBTMCorregida + '\',' } else { operacion_9 = operacion_9 + 'null,' }
                    if (indice[0].operacion === 35) { operacion_35 = operacion_35 + '\'' + indice[0].DBTMCorregida + '\',' } else { operacion_35 = operacion_35 + 'null,' }
                    if (indice[0].operacion === 36) { operacion_36 = operacion_36 + '\'' + indice[0].DBTMCorregida + '\',' } else { operacion_36 = operacion_36 + 'null,' }
                    if (indice[0].operacion === 37) { operacion_37 = operacion_37 + '\'' + indice[0].DBTMCorregida + '\',' } else { operacion_37 = operacion_37 + 'null,' }
                    if (indice[0].operacion === 38) { operacion_38 = operacion_38 + '\'' + indice[0].DBTMCorregida + '\',' } else { operacion_38 = operacion_38 + 'null,' }
                    if (indice[0].operacion === 39) { operacion_39 = operacion_39 + '\'' + indice[0].DBTMCorregida + '\',' } else { operacion_39 = operacion_39 + 'null,' }
                    if (indice[0].operacion === 40) { operacion_40 = operacion_40 + '\'' + indice[0].DBTMCorregida + '\',' } else { operacion_40 = operacion_40 + 'null,' }
                    if (indice[0].operacion === 41) { operacion_41 = operacion_41 + '\'' + indice[0].DBTMCorregida + '\',' } else { operacion_41 = operacion_41 + 'null,' }
                }
            }
            
            DATETIME = DATETIME.substring(DATETIME.length - 1, 0);
            DBTM = DBTM.substring(DBTM.length - 1, 0);
            DMEA = DMEA.substring(DMEA.length - 1, 0);
            ROPA = ROPA.substring(ROPA.length - 1, 0);
            RPM = RPM.substring(RPM.length - 1, 0);
            TQA = TQA.substring(TQA.length - 1, 0);
            MFIA = MFIA.substring(MFIA.length - 1, 0);
            WOB = WOB.substring(WOB.length - 1, 0);

            operacion_0 = operacion_0.substring(operacion_0.length - 1, 0);
            operacion_2 = operacion_2.substring(operacion_2.length - 1, 0);
            operacion_3 = operacion_3.substring(operacion_3.length - 1, 0);
            operacion_4 = operacion_4.substring(operacion_4.length - 1, 0);
            operacion_7 = operacion_7.substring(operacion_7.length - 1, 0);
            operacion_8 = operacion_8.substring(operacion_8.length - 1, 0);
            operacion_9 = operacion_9.substring(operacion_9.length - 1, 0);
            operacion_35 = operacion_35.substring(operacion_35.length - 1, 0);
            operacion_36 = operacion_36.substring(operacion_36.length - 1, 0);
            operacion_37 = operacion_37.substring(operacion_37.length - 1, 0);
            operacion_38 = operacion_38.substring(operacion_38.length - 1, 0);
            operacion_39 = operacion_39.substring(operacion_39.length - 1, 0);
            operacion_40 = operacion_40.substring(operacion_40.length - 1, 0);
            operacion_41 = operacion_41.substring(operacion_41.length - 1,);


            datosGraficaPrincipal_Aux = '{   x: [' + DATETIME + '], y: [' + DBTM + '],  mode: "lines+markers",  type: "scatter", name: "DBTM" },' +
                '{ x: [' + DATETIME + '], y: [' + operacion_0 + '],  mode: "markers",  type: "scatter", name: "0-Undef status" },' +
                '{ x: [' + DATETIME + '], y: [' + operacion_2 +  '],  mode: "markers",  type: "scatter", name: "2-Drilling" },' +
                '{ x: [' + DATETIME + '], y: [' + operacion_3 +  '],  mode: "markers",  type: "scatter", name: "3-Connection" },' +
                '{ x: [' + DATETIME + '], y: [' + operacion_4 +  '],  mode: "markers",  type: "scatter", name: "4-Reaming" },' +
                '{ x: [' + DATETIME + '], y: [' + operacion_7 +  '],  mode: "markers",  type: "scatter", name: "7-Circulating" },' +
                '{ x: [' + DATETIME + '], y: [' + operacion_8 +  '],  mode: "markers",  type: "scatter", name: "8-RIH" },' +
                '{ x: [' + DATETIME + '], y: [' + operacion_9 +  '],  mode: "markers",  type: "scatter", name: "9-POOH" },' +
                '{ x: [' + DATETIME + '], y: [' + operacion_35 + '],  mode: "markers",  type: "scatter", name: "35-OnSurface" },' +
                '{ x: [' + DATETIME + '], y: [' + operacion_36 + '],  mode: "markers",  type: "scatter", name: "36-Sliding" },' +
                '{ x: [' + DATETIME + '], y: [' + operacion_37 + '],  mode: "markers",  type: "scatter", name: "37-POOHW/Pump" },' +
                '{ x: [' + DATETIME + '], y: [' + operacion_38 + '],  mode: "markers",  type: "scatter", name: "38-RIHW/Pump" },' +
                '{ x: [' + DATETIME + '], y: [' + operacion_39 + '],  mode: "markers",  type: "scatter", name: "39-BackReaming" },' +
                '{ x: [' + DATETIME + '], y: [' + operacion_40 + '],  mode: "markers",  type: "scatter", name: "40-Working Pipe" },' +
                '{ x: [' + DATETIME + '], y: [' + operacion_41 + '],  mode: "markers",  type: "scatter", name: "41-Unregister" }';
            
             
            datosGraficaPrincipal_Aux2 = "DATETIME=" + DATETIME + "|DBTM=" + DBTM + "|DMEA=" + DMEA + "|MFIA=" + MFIA + "|ROPA=" + ROPA + "|RPM=" + RPM + "|TQA=" + TQA + "|WOB=" + WOB + "|";
             

            var rsEventos = this.state.dataEventos;

            var eventShapes = '';
            if (rsEventos.length > 0) {
                
                for (let k = 0; k < rsEventos.length; k++) {

                    fec1 = rsEventos[k].fecha_inicial;
                    fec2 = rsEventos[k].fecha_final;

                    if (fec1 === fec2)
                    {   
                        //Eventos Puntuales
                        datosfecIni_Eve_Aux = datosfecIni_Eve_Aux + ',' + '\'' + fec1 + '\'';
                        pro1 = rsEventos[k].profundidad_inicial.replace(',', '.');
                      
                        datosproIni_Eve_Aux = datosproIni_Eve_Aux + '\'' + pro1 + '\'' + ',';
                        datosdescrp_Eve_Aux = datosdescrp_Eve_Aux + '\'' + rsEventos[k].descripcion + '\'' + ',';

                    }
                    else
                    {
                        //Eventos en el tiempo
                        let numberFecI = new Date(fec1).getTime();
                        let numberFecF = new Date(fec2).getTime();
                        pro1 = rsEventos[k].profundidad_inicial.replace(',', '.');                       
                        pro2 = rsEventos[k].profundidad_final.replace(',', '.');

                        let shape = "{type: 'rect', xref: 'x', yref: 'y', "
                         + "x0: "+numberFecI+", y0: "+pro1+", x1: "+numberFecF+", y1: "+pro2+","
                         + "line: {color: 'rgba(128, 0, 128, 1)', width: 1}},";

                        eventShapes += shape;
                        
                        datosfecIni_EveShape_Aux = datosfecIni_EveShape_Aux + ',' + '\'' + numberFecI + '\'';
                        datosproIni_EveShape_Aux = datosproIni_EveShape_Aux + '\'' + pro1 + '\'' + ',';
                        datosdescrp_EveShape_Aux = datosdescrp_EveShape_Aux + '\'' + rsEventos[k].descripcion + '\'' + ',';
                    }
                }
               
                if (datosfecIni_Eve_Aux.length > 0)
                {
                    datosfecIni_Eve_Aux = datosfecIni_Eve_Aux.substring(1, datosfecIni_Eve_Aux.length);
                    datosproIni_Eve_Aux = datosproIni_Eve_Aux.substring(datosproIni_Eve_Aux.length - 1, 1);
                    datosdescrp_Eve_Aux = datosdescrp_Eve_Aux.substring(datosdescrp_Eve_Aux.length - 1, 1);
                }
                if (datosfecIni_EveShape_Aux.length > 0)
                {
                    datosfecIni_EveShape_Aux = datosfecIni_EveShape_Aux.substring(1, datosfecIni_EveShape_Aux.length);
                    datosproIni_EveShape_Aux = datosproIni_EveShape_Aux.substring(datosproIni_EveShape_Aux.length - 1, 1);
                    datosdescrp_EveShape_Aux = datosdescrp_EveShape_Aux.substring(datosdescrp_EveShape_Aux.length - 1, 1);
                }


                datosGraficaPrincipal_EventosPuntual =
                    '{ x: [' + datosfecIni_Eve_Aux + '],' +
                    'y: [' + '\'' + datosproIni_Eve_Aux + '], ' +
                    'text: [' + '\'' + datosdescrp_Eve_Aux + '],  marker: { symbol:"' + simbolo[3] + '", size: 10 }, ' +
                    'name: "Eventos", mode: "markers", type: "scatter", legend: {orientation: "h", y: -0.3}, hovertemplate:"%{x} , %{y}" }';
                //<br>%{text}
                if (eventShapes !== '')
                {
                    this.setState({ shapes: eventShapes.substring(eventShapes.length - 1, 0)}); 
                    datosGraficaPrincipal_EventosShape = 
                    ',{ x: [' + datosfecIni_EveShape_Aux + '],' +
                    'y: [' + '\'' + datosproIni_EveShape_Aux + '], ' +
                    'text: [' + '\'' + datosdescrp_EveShape_Aux + '],  marker: { symbol:"' + simbolo[3] + '", size: 10 }, ' +
                    'name: "Eventos", mode: "markers", type: "scatter", legend: {orientation: "h", y: -0.3}, hovertemplate:"%{x} , %{y}" }';
                }
                //<br>%{text}
                datosGraficaPrincipal_Aux = '[' + datosGraficaPrincipal_Aux + ',' + datosGraficaPrincipal_EventosPuntual +  datosGraficaPrincipal_EventosShape + ']';
               
            }

            else {
                datosGraficaPrincipal_Aux = '[' + datosGraficaPrincipal_Aux + ']';
            }
        }

        this.setState({
            datosParaGraficaPrincipal: eval(datosGraficaPrincipal_Aux),
            datosParaGraficaAuxiliares:  datosGraficaPrincipal_Aux2,
            isLoadedPrincipal:true 
        });
        
    }

    ShowModal = () => {
        this.setState({openModalEvento: true})
    }

    componentDidMount() {
        this.peticionGetTemplateConfigId();
    }     


    render() { 

        document.getElementById("graficas0").style.display = "block";
        document.getElementById("graficas1").style.display = "block";
        //#region Layout-------------------------------------------------------------------------------------------------------------------------------------------------------------------------

        var config_general = {
            showSendToCloud: false,
            editable: false,
            displayModeBar: true,
            locale: 'es',
            displaylogo: false,
            responsive: true,
            modeBarButtonsToRemove: ['hoverClosestGl2d', 'hoverClosestPie', 'toggleHover', 'resetViews', 'zoom2d', 'select2d', 'lasso2d', 'toggleSpikelines', 'hoverClosestCartesian'],  //,'hoverCompareCartesian', 'pan2d', 
            toImageButtonOptions: {
                format: 'png',
                filename: 'archivo_',
                height: 600,
                width: 1800,
                scale: 1
            }
        };


        var layout_Principal = {
            autosize: true,
            uirevision: 'true',
            margin: { l: 60, r: 10, t: 50, b: 10 }, 
            dragmode: 'zoom',
            hovermode: 'closest',
            plot_bgcolor: 'white',
            paper_bgcolor: 'lightgray',
            xaxis: {
                fixedrange: false,
                showspikes: true,
                spikemode: 'across',
                textposition: 'top center',
                side: 'top',
                type: 'time',
                tickformat: '%d %b %Y \n %H:%M:%S ',
                title: 'Tiempo',
                nticks: 5,
            },
            yaxis: {
                fixedrange: false,
                autorange: 'reversed',
                title: 'Profundidad',
                nticks: 5,
            },
            showlegend: false,

        }
        //Agregar figuras de eventos en el tiempo 
        //console.log('los shapes:' + this.state.shapes);
        if (this.state.shapes.length > 1)
            layout_Principal["shapes"] = eval("[" + this.state.shapes + "]");
        //console.log('los shapes:' + this.state.shapes);

        var layout_Horizontal = this.state.datosConfiglayout_Horizontal[0];
     
         
        //#region Datos-------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         

        var dataPrincipal_01 = []; 
        dataPrincipal_01 = (this.state.datosParaGraficaPrincipal); 


        var data_Horizontal = [];
        data_Horizontal = (this.state.datosParaGraficaHorizontal); 

        //#region Ejecucion de Grafica-------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        
        Plotly.newPlot('graphDiv', dataPrincipal_01, layout_Principal, config_general);

        //Frame Horizontales (Tiempos)
        Plotly.newPlot('myDiv_H', data_Horizontal, layout_Horizontal, config_general);

        //Plotly.react('myDiv_V', data_Vertical, layout_Vertical, config_general);


        var hoverlayer_P = document.getElementById("graphDiv").querySelector(".hoverlayer");
        //var hoverlayer_V = document.getElementById("myDiv_V").querySelector(".hoverlayer");
        var hoverlayer_H = document.getElementById("myDiv_H").querySelector(".hoverlayer");


        //labb  graphDiv.on("plotly_hover", function (d) { 
         var PlotPrincipal = document.getElementById("graphDiv");
        //var hoverInfo = document.getElementById("myDiv_V");
        PlotPrincipal.on('plotly_hover', function (data) {
            var infoData = data.points.map ( function (d){
                let obj = {x:d.x, y:d.y, text:d.text, name: d.data.name}
                return obj;
            });
           
            if (infoData[0].name !== 'Eventos')
            {
                var points = data.points[0],
                    pointNum = points.pointNumber;

                Plotly.Fx.hover('myDiv_H', [
                    { curveNumber: 0, pointNumber: pointNum },
                    { curveNumber: 1, pointNumber: pointNum },
                    { curveNumber: 2, pointNumber: pointNum },
                    { curveNumber: 3, pointNumber: pointNum },
                    { curveNumber: 4, pointNumber: pointNum },
                ], ['xy', 'xy2', 'xy3', 'xy4', 'xy5']);
            }
           
        }); 

        PlotPrincipal.on('plotly_click', function(data){
            var infoData = data.points.map ( function (d){
                let obj = {x:d.x, y:d.y, text:d.text, name: d.data.name}
                return obj;
            });
            if (infoData[0].name === 'Eventos')
            {
                console.log(infoData[0].text);
                
            }
           
                
        });

        document.getElementById("graphDiv").on("plotly_unhover", function (d) {
            hoverlayer_H.innerHTML = "";
        });

        document.getElementById("myDiv_H").on("plotly_hover", function (d) {

            var points = d.points[0],
                pointNum = points.pointNumber;

            Plotly.Fx.hover('myDiv_H', [
                { curveNumber: 0, pointNumber: pointNum },
                { curveNumber: 1, pointNumber: pointNum },
                { curveNumber: 2, pointNumber: pointNum },
                { curveNumber: 3, pointNumber: pointNum },
                { curveNumber: 4, pointNumber: pointNum }, 
            ], ['xy',   'xy2', 'xy3', 'xy4', 'xy5' ]);

            Plotly.Fx.hover('graphDiv', [
                { curveNumber: 0, pointNumber: pointNum }
            ], ['xy']);

        });

        document.getElementById("myDiv_H").on("plotly_unhover", function (d) {
            hoverlayer_P.innerHTML = "";
        });

        document.getElementById("graphDiv").on('plotly_relayout',
            function (eventdata) {

                Plotly.relayout('myDiv_H', {
                    xaxis: {
                        range: [eventdata['xaxis.range[0]'], eventdata['xaxis.range[1]']], nticks: 5,
                    }
                });

                /*
                Plotly.relayout('myDiv_V', {
                    yaxis: {
                        range: [eventdata['yaxis.range[0]'], eventdata['yaxis.range[1]']], title: 'Profundidad', nticks: 5,
                    }
                });
                */

                if (eventdata['yaxis.range[0]'] == undefined) {

                /*
                    Plotly.relayout('myDiv_V', {
                        yaxis: {
                            autorange: 'reversed', nticks: 5,
                        }
                    });
                    */

                    Plotly.relayout('myDiv_H', {
                        xaxis: {
                            range: [layout_Principal.xaxis.range[0], layout_Principal.xaxis.range[1]], nticks: 5,
                        },
                    });

                }
            }
        );

        //window.onresize = resize;

        function resize() {

            var valor1 = document.getElementById('graphDiv').style.width;
            var valor2 = document.getElementById("myDiv_V").style.width;

            var valorW1 = valor1;
            var valorW2 = valor2;

            var valorH1 = ((window.outerHeight - 200) * 0.70).toFixed(0);
            var valorH2 = ((window.outerHeight - 200) * 0.30).toFixed(0);

            layout_Principal.width = valorW1;
           //*lb2 layout_Vertical.width = valorW2;
            layout_Horizontal.width = valorW1;


            layout_Principal.height = valorH1;
           //*lb2 layout_Vertical.height = valorH1;
            layout_Horizontal.height = valorH2;


            layout_Principal.autosize = true;
            //*lb2layout_Vertical.autosize = true;
            layout_Horizontal.autosize = true;

            Plotly.relayout('graphDiv', layout_Principal);
            Plotly.relayout('myDiv_H', layout_Horizontal);
           //*lb2 Plotly.relayout('myDiv_V', layout_Vertical);


        }  



        return (
            <div className="App">
                <Cabecera />
                <SideBar pageWrapId={"page-wrap"} outerContainerId={"App"} />
                    
                {/* this.state.isLoaded ? (this.state.dataRta.map(elemento => (<div><label key={elemento.x}>{elemento.x + ',' + elemento.y}</label> </div>))) :
                    (<label>Esperando respuesta</label>)*/}

                
               <Modal isOpen={this.state.openModalEvento}>
                    <ModalBody>
                        <div className="row">
                            <div className="form-group">
                            
                                <label><b>Fecha Inicial: </b></label>
                                
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        {/* <button className="btn btn-danger" onClick={() => this.peticionDelete()}>Si</button> */}
                        <button className="btn btn-secundary" onClick={() => this.setState({ openModalEvento: false })}>No</button>
                    </ModalFooter>
                </Modal>
                

            </div>
        );

    }
}
export default viewVisualHistoricoDP;