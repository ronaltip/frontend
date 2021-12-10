import React, { Component } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader, Spinner } from 'reactstrap';
import { Accordion, Card } from "react-bootstrap";

import Plot from 'react-plotly.js';
import Plotly from 'plotly.js';
import axios from "axios";
import hexRgb from 'hex-rgb';
import { Simplify } from 'curvereduce';
import {AlgoritmoOperaciones} from '../util/utilities';

import "bootstrap/dist/css/bootstrap.min.css";
import "../css/button.css";

import SideBar from '../componentes/sidebar';

import {Save, HorizontalSplit, BarChart, Brush, CalendarToday, Delete, EventNote, Close, Home, PlaylistAddCheck, EventAvailable, PlayCircleOutline, MultilineChart, SlowMotionVideo, LayersClear, InvertColorsOff, CreateNewFolderOutlined } from '@material-ui/icons';
import { TextField, Menu, MenuItem } from '@material-ui/core'
import { message } from 'antd';

const URL = process.env.REACT_APP_API_HOST; 

const config_general = {
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

class Graficador extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userStorage: 0,
            form_template  : {
                tmpNombre: '',
                tmpDescripcion: '',
                wells_id: 0,
                pkuser: 0,
                id: 0
            },
            alert_algoritmo: {
                tipo: '',
                mensaje: '',
                show: false
            },

            template: {
                template_id: 0,
                template_nombre: '',
                template_descripcion: '',
                field_id: 0,
                field_nombre: '',
                wells_id: 0,
                wells_nombre: ''
            },
            template_well: {
                id: 0
            },
            openModalDeleteTemplate: false,
            formDeleteTemplate: {
                id: 0,
                nombre: '',
                descripcion: ''
            },

            curvasPrincipal: [],
            curvasTraksHorizontal: [],

            dataWitsDetalle: [],
            dataFields: [],
            dataWells: [],
            dataTemplates: [],
            dataCurvas: [],
            tmpDataCurvas: [],
            dataConvencion:[],
            dataArchivos: [],

            modalStart: false,
            modalNuevo: false,
            modalAlgoritmo: false,


            dataEventos:[],
            dataOperaciones:[],

            dataWits:[],
            dataTipoEvento: [],
            dataSimplyfy: [],
            
            dataGP:[], configGP: {}, layoutGP: {}, 
            dataTH:[], layoutTH: {},
            dataTV:[], layoutTV: {}, 

            toggleHorizontales: 0,
            togglePrincipal: false,
            toggleTrackHorizontal: false,
            toggleTrackVertical: false,
            toggleEventos: false,
            toggleOperaciones: false,

            plotDeptVH:  '95vh',
            plotTrackVH: '0vh',
            plotDeptCol: 'col-md-12',
            colVertical:    'col-md-12',
            colVerticalFEL: 'col-md-3',

            modalConfig: false,
            profundidadFinal: 0,

            principal: [],
            horizontal: [],
            archivos_las: [],
            fel: {},
            isLoadedPrincipal: false,
            isLoadedHorizontal:false,
            isLoadedVertical: false,
            isLoadedVerticalFEL: false,


            openModalOperacion: false,
            openModalEvento: false,
            insertar: false,
            openModalDeleteEvento: false,
            
            menuEmergente : {
                x:0, y:0, showMenu: false,
                fecha: '', prof: 0
            },
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
            operacion: {
                id: 0, desde: '', hasta: '', md_from: 0, md_to: 0, operacion: ''
            },
            loadingStart: false,
            loadingConfig: false,
            loadingTemplates:false,

            algoritmo: {
                wd_0108: '0',
                wd_0110: '0',
                wd_0113: '0',
                wd_0116: '0',
                wd_0118: '0',
                wd_0120: '0',
                wd_0130: '0'
            },
            optionsDetalle: [],
            loadingAlgoritmo: false,
            darkMode: false,
            showing:false,
            
            dataArchivosCurvas: [],

            layoutFEL: {},
            dataFEL: [],
        }
    }
    

    async SetAlgoritoOperaciones () {
       
        let data   = [...this.state.dataGP]
        let layout = {...this.state.layoutGP}

        const convencion = this.state.dataConvencion


        let DBTM_0 = 0
        let DBTM   = 0 //0108
        //let DMEA   = 0 //0110
        //let RPMA   = 0 //0120
        //let ROPA   = 0 //0113
        //let MFIA   = 0 //0130
        //let TQA    = 0 //0118
        //let WOBA   = 0 //0116
        
        let DATETIME = [];      
    
        let operacion_0  = [], operacion_2  = [], operacion_3  = [], operacion_4  = [], operacion_7  = [], operacion_8 = [], operacion_9 = [];
        let operacion_35 = [], operacion_36 = [], operacion_37 = [], operacion_38 = [], operacion_39 = [];
        let operacion_40 = [], operacion_41 = [];

        let datos   = this.state.dataWits
        let selects = this.state.algoritmo
        let algoritmo = {
            wd_0108: 0,
            wd_0110: 0,
            wd_0113: 0,
            wd_0116: 0,
            wd_0118: 0,
            wd_0120: 0,
            wd_0130: 0
        }
        datos.forEach( wits => {
            
            DATETIME.push( wits.DATETIME );

            let index = 0
            for (const opt in selects) {

                let origen = selects[opt].split('_')
                switch (origen[0])  //[wd, ls, cv]
                {
                    case 'wd':
                        algoritmo[index] = wits['_'+origen[1]] 
                        break;
                    case 'ls':
                        
                        const [datolas]  = this.state.dataArchivosCurvas.filter( c => c.id == origen[1] ).map( d => ({ datos: d.datos }) )
                        const [datosfilter] = datolas.datos.filter( e => e['DATETIME'] === wits.DATETIME )
                        if (datosfilter != undefined)
                        {
                            const dato = datosfilter['_'+origen[2]]
                            algoritmo[index] = dato
                        }
                        else
                            algoritmo[index] = -999.25
                        
                        break;
                    case 'cv':
                        
                        break;
                    default:

                        break;
                }
                index++
            }
            
            //let operacion = AlgoritmoOperaciones(DBTM_0, DMEA, DBTM, RPMA, ROPA, MFIA, TQA, WOBA).Operacion;
            let operacion = AlgoritmoOperaciones(DBTM_0, algoritmo[1], algoritmo[0], algoritmo[5], algoritmo[2], algoritmo[6], algoritmo[4], algoritmo[3]).Operacion;
            DBTM = algoritmo[1]

            if (operacion === 0)  { operacion_0.push(DBTM)}  else { operacion_0.push(null) }
            if (operacion === 2)  { operacion_2.push(DBTM)}  else { operacion_2.push(null) }
            if (operacion === 3)  { operacion_3.push(DBTM)}  else { operacion_3.push(null) }
            if (operacion === 4)  { operacion_4.push(DBTM)}  else { operacion_4.push(null) }
            if (operacion === 7)  { operacion_7.push(DBTM)}  else { operacion_7.push(null) }
            if (operacion === 8)  { operacion_8.push(DBTM)}  else { operacion_8.push(null) }
            if (operacion === 9)  { operacion_9.push(DBTM)}  else { operacion_9.push(null) }
            if (operacion === 35) { operacion_35.push(DBTM)} else { operacion_35.push(null) }
            if (operacion === 36) { operacion_36.push(DBTM)} else { operacion_36.push(null) }
            if (operacion === 37) { operacion_37.push(DBTM)} else { operacion_37.push(null) }
            if (operacion === 38) { operacion_38.push(DBTM)} else { operacion_38.push(null) }
            if (operacion === 39) { operacion_39.push(DBTM)} else { operacion_39.push(null) }
            if (operacion === 40) { operacion_40.push(DBTM)} else { operacion_40.push(null) }
            if (operacion === 41) { operacion_41.push(DBTM)} else { operacion_41.push(null) }


            DBTM_0 = DBTM;

        })

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

        data.push( { x: DATETIME, y: operacion_0,   mode: "markers",  type: "scatter", name: Op_0.nombre , marker : {color: hexRgb(Op_0.color,  {format: 'css'}), symbol: '100' }} );
        data.push( { x: DATETIME, y: operacion_2,   mode: "markers",  type: "scatter", name: Op_2.nombre , marker : {color: hexRgb(Op_2.color,  {format: 'css'}), symbol: '100' }} );
        data.push( { x: DATETIME, y: operacion_3,   mode: "markers",  type: "scatter", name: Op_3.nombre , marker : {color: hexRgb(Op_3.color,  {format: 'css'}), symbol: '100' }} );
        data.push( { x: DATETIME, y: operacion_4,   mode: "markers",  type: "scatter", name: Op_4.nombre , marker : {color: hexRgb(Op_4.color,  {format: 'css'}), symbol: '100' }} );
        data.push( { x: DATETIME, y: operacion_7,   mode: "markers",  type: "scatter", name: Op_7.nombre , marker : {color: hexRgb(Op_7.color,  {format: 'css'}), symbol: '100' }} );
        data.push( { x: DATETIME, y: operacion_8,   mode: "markers",  type: "scatter", name: Op_8.nombre , marker : {color: hexRgb(Op_8.color,  {format: 'css'}), symbol: '100' }} );
        data.push( { x: DATETIME, y: operacion_9,   mode: "markers",  type: "scatter", name: Op_9.nombre , marker : {color: hexRgb(Op_9.color,  {format: 'css'}), symbol: '100' }} );
        data.push( { x: DATETIME, y: operacion_35,  mode: "markers",  type: "scatter", name: Op_35.nombre, marker : {color: hexRgb(Op_35.color, {format: 'css'}), symbol: '100' }} );
        data.push( { x: DATETIME, y: operacion_36,  mode: "markers",  type: "scatter", name: Op_36.nombre, marker : {color: hexRgb(Op_36.color, {format: 'css'}), symbol: '100' }} );
        data.push( { x: DATETIME, y: operacion_37,  mode: "markers",  type: "scatter", name: Op_37.nombre, marker : {color: hexRgb(Op_37.color, {format: 'css'}), symbol: '100' }} );
        data.push( { x: DATETIME, y: operacion_38,  mode: "markers",  type: "scatter", name: Op_38.nombre, marker : {color: hexRgb(Op_38.color, {format: 'css'}), symbol: '100' }} );
        data.push( { x: DATETIME, y: operacion_39,  mode: "markers",  type: "scatter", name: Op_39.nombre, marker : {color: hexRgb(Op_39.color, {format: 'css'}), symbol: '100' }} );
        data.push( { x: DATETIME, y: operacion_40,  mode: "markers",  type: "scatter", name: Op_40.nombre, marker : {color: hexRgb(Op_40.color, {format: 'css'}), symbol: '100' }} );
        data.push( { x: DATETIME, y: operacion_41,  mode: "markers",  type: "scatter", name: Op_41.nombre, marker : {color: hexRgb(Op_41.color, {format: 'css'}), symbol: '100' }} );
        layout.datarevision++
       
        return { result: true, data: data, layout: layout}
    }
    
    delay = ms => new Promise(res => setTimeout(res, ms));

    async EjecutarAlgoritmo () {
        this.setState({ alert_algoritmo: { show: false } })
      

        let validar = true
        const selects = this.state.algoritmo
        for (const opt in selects) {
            if (selects[opt] === '0')           
                validar = false
        }
        
        if (validar)
        {
             //Limpiar Algoritmo
            this.LimparAlgoritmo();
            await this.delay(1000);

            this.setState({ loadingAlgoritmo: true, alert_algoritmo: {
                tipo: 'alert alert-info',
                mensaje: 'Ejecutando algoritmo de operaciones',
                show: true
            } });

            await this.delay(1000);

            let run = await this.SetAlgoritoOperaciones()
            if (run.result)
            {
                this.setState({dataGP: run.data, layoutGP: run.layout,  loadingAlgoritmo: false, modalAlgoritmo: false })
            }
            else
            {
                this.setState({
                    alert_algoritmo: {
                        tipo: 'alert alert-warning',
                        mensaje: 'Error ejecutando el algoritmo, intente de nuevo',
                        show: true
                    }
                })
            }
        }
        else
        {
            this.setState({
                alert_algoritmo: {
                    tipo: 'alert alert-danger',
                    mensaje: 'Seleccione todas las fuentes de datos',
                    show: true
                }
            })
        }
    }

    LimparAlgoritmo = () => {
        this.setState({ loadingAlgoritmo: true, alert_algoritmo: {
            tipo: 'alert alert-info',
            mensaje: 'Limpiando datos de operaciones',
            show: true
        } });
        
      
        const opx  = this.state.dataConvencion.map( con => (
            { name: con.nombre }
        ))
        const g_opx = this.state.dataGP.filter( c => { return  opx.find( x => x.name === c.name ) } )
        if (g_opx.length > 0)
        {
            let data = [...this.state.dataGP]
            let layout = {...this.state.layoutGP}
            g_opx.forEach( e => {
                let index_d = data.findIndex((item) => item.name === e.name);
                if (index_d >= 0)
                    data.splice(index_d, 1)                   
            })
            this.setState({
                dataGP: data,
                layoutGP: layout
            });
        }
        this.setState({ 
            loadingAlgoritmo: false, 
            alert_algoritmo: { 
                tipo: 'alert alert-info',
                mensaje: 'Datos de operaciones limpiados',
                show: true
                } 
        });

    }
 

    toggleModalTemplate = (open, upd) => {
        const dataCurvas  = [...this.state.dataCurvas]
        const p = [...dataCurvas.filter( c =>  c.grupo === null )]
        const h = [...dataCurvas.filter( c =>  c.grupo !== null )]
        const a = [...this.state.archivos_las]
        const f = {...this.state.fel}

        if (open)
        {

            sessionStorage.setItem('principal',    JSON.stringify(p) )
            sessionStorage.setItem('horizontal',   JSON.stringify(h) )
            sessionStorage.setItem('archivos_las', JSON.stringify(a) )
            sessionStorage.setItem('fel', JSON.stringify(f) )


            let principal    = JSON.parse( sessionStorage.getItem('principal') )
            let horizontal   = JSON.parse( sessionStorage.getItem('horizontal') )
            let archivos_las = JSON.parse( sessionStorage.getItem('archivos_las') )
            let fel = JSON.parse( sessionStorage.getItem('fel') )

            
            this.setState({ 
                principal:    principal,
                horizontal:   horizontal,
                archivos_las: archivos_las,
                fel:          fel,
                modalConfig:  open,
                loadingConfig: false,
            });
            
        }
        else
        {
            if (upd)
            {
                this.setState({ 
                    loadingConfig: true
                });
                let curvas = [...this.state.principal, ...this.state.horizontal]
                
                this.SetSerieGraficaPrincipal( curvas.filter(c=> c.grupo === null ) )
                this.SetSerieTrackHorizontal ( curvas.filter(c=> c.grupo !== null ) )
                
                this.SetSerieTrackVertical()

                this.setState({isLoadedVerticalFEL: this.state.fel.checked_fel})

                this.setState({ 
                    dataCurvas: curvas,
                    modalConfig: open,
                    loadingConfig: false
                });
            }
            else
            {
                this.setState({ 
                    principal:  [],
                    horizontal: [],
                    fel: {},
                    modalConfig: open,
                    loadingConfig: false
                });
            }
            sessionStorage.removeItem('principal');
            sessionStorage.removeItem('horizontal');
            sessionStorage.removeItem('archivos_las');
            sessionStorage.removeItem('fel');

        }
    } 

    toggleEventos = () =>  {
        this.setState({toggleEventos: !this.state.toggleEventos})
        
        const tvs  = this.state.dataTipoEvento.map( te => (
            { name: te.label }
        ))
        const evts = this.state.dataGP.filter( c => { return  tvs.find( x => x.name === c.name ) } )
                           
        if (this.state.toggleEventos)
        {
            if (this.state.template.wells_id !== 0)
                this.getEventos(this.state.template.wells_id)
            
        }
        else
        {
            if (evts.length > 0)
            {
                let data = [...this.state.dataGP]
                let layout = {...this.state.layoutGP}
                evts.forEach( e => {
                    let index_d = data.findIndex((item) => item.name === e.name);
                    if (index_d >= 0)
                        data.splice(index_d, 1)                   
                })
                let shapes = layout.shapes.filter( f => f.name !== 'Evento')
                layout.shapes = shapes

                this.setState({
                    dataGP: data,
                    layoutGP: layout    
                });
            }
        }
        
    }

    toggleOperaciones = () =>  {
        this.setState({toggleOperaciones: !this.state.toggleOperaciones})
   
        if (this.state.toggleOperaciones)
        {
            if (this.state.template.wells_id !== 0)
                this.getOperaciones(this.state.template.wells_id)
        }
        else
        {
            const ops = this.state.dataGP.filter( c => c.name === 'Operaciones') 
            if (ops.length > 0)
            {
                let data = [...this.state.dataGP]
                let layout = {...this.state.layoutGP}
                ops.forEach( e => {
                    let index_d = data.findIndex((item) => item.name === e.name);
                    if (index_d >= 0)
                        data.splice(index_d, 1)                   
                })
                let shapes = layout.shapes.filter( f => f.name !== 'Operación')
                layout.shapes = shapes

                this.setState({
                    dataGP: data,
                    layoutGP: layout
                });
            }
        }
        
    }

    toggleModalAlgoritmo = (show) => {
        if (show)
        {
            let op_wd = []
            let wd    = [...this.state.dataCurvas]
            if (wd.length > 0)
            {    
                wd.map( opt => 
                    op_wd.push( { value: 'wd_' + opt.codigo, text: '[' + opt.codigo + '] ' + opt.short_mnemonico + ' - ' + opt.descripcion } )
                )
            }

            let ls    = [...this.state.archivos_las]
            if (ls.length > 0)
            {    
                ls.map( opt => 
                    {
                        if (opt.es_tiempo === true)
                        {  
                            opt.homologacion.map( h => {
                                op_wd.push( { value: 'ls_' + opt.id + '_' + h.codigo, text: 'LAS ' + opt.id + ' - [' + h.codigo + '] ' + h.short_mnemonico + ' - ' + h.descripcion } )
                            })
                        }
                    }
                )
            }

            this.setState({ optionsDetalle : op_wd, alert_algoritmo: { show: false }  })
        }
        
        this.setState({ modalAlgoritmo : !this.state.modalAlgoritmo })
    }


    handleChangeAlgoritmo = (e) => {
        this.setState({
            algoritmo: {
                ...this.state.algoritmo,
                [e.target.name]: e.target.value
            }
        });
    }
  
    handleConfigChangePrincipal = (e) => {
        let ids = e.target.id.split('_');

        const p = [...this.state.principal]
        p.forEach((r) => {
            if (r.id == ids[1])
                r.mostrar = !r.mostrar
        });

        this.setState({
            principal: p
        });
    }

    handleConfigChangeHorizontal = (e, esCheck) => {
        let ids= e.target.id.split('_');

        const h = [...this.state.horizontal]
        h.forEach((r) => {
            if (r.id == ids[1])
            {
                if (esCheck)
                    r.mostrar = !r.mostrar
                else
                    r.grupo = e.target.value ? e.target.value : 1 
            }
        });

        this.setState({
            horizontal: h
        });
    }

    handleChange = async e => {
       
        if (e.target.name === 'field_id')
        {
            this.getWells(e.target.value)
            let campo = e.target.options[e.target.selectedIndex].text
            this.setState({
                template: {
                    ...this.state.template,
                    field_nombre: campo,
                    [e.target.name]: e.target.value,
                    wells_nombre: ''
                }, 
                dataTemplates: []
            })
        }
        if (e.target.name === 'wells_id')
        {
            let pozo = e.target.options[e.target.selectedIndex].text
            this.setState({
                template: {
                    ...this.state.template,
                    [e.target.name]: e.target.value,
                    wells_nombre: pozo
                },
                form_template: {
                    ...this.state.form_template,
                    wells_id: e.target.value
                },
                loadingTemplates: true
            })
            this.getTemplates(e.target.value)
        }
        

    }

    handleChangeLas = (e) => {
        let ids = e.target.id.split('_');

        const a = [...this.state.archivos_las]
        a.forEach((arc) => {
            if (arc.id == ids[1])
            {
                arc.homologacion.forEach( h => {
                    if (h.id == ids[2])
                        h.mostrar = !h.mostrar
                })
            }
        });
        this.setState({
            archivos_las: a
        })
        
    }

    handleChangeFel = (e) => {
        this.setState({ 
            fel: {
            ...this.state.fel, 
            checked_fel: e.target.checked
            }
        })
    }

    getFields = async () => {
        axios.get(URL + 'fields').then(response => {
            this.setState({ dataFields: response.data });
        }).catch(error => {
            console.log(error.message);
        })
    }
    getWells = (id) => {
        axios.get(URL + 'wells/field/' + id).then(response => {
            this.setState({ dataWells: response.data });
        }).catch(error => {
            console.log(error.message);
        })
    }
    getTemplates = (id) => {
        axios.get(URL + 'templates_wells/well/' + id ).then(response => {          
            this.setState({ dataTemplates: response.data, loadingTemplates: false });
        }).catch(error => {
            console.log(error.message);
        })
    }
    getTipoEventos = async () => {
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
    getConvencion = async () => {
        axios.get(URL + 'convencion_datos_operacion').then(response => {
            this.setState({ dataConvencion: response.data });
        }).catch(error => {
            console.log(error.message);
        })
    }
    getWitsDetalle = async () => {
        axios.get(URL + 'wits_detalle').then(response => {
            if (response.status === 200)
                this.setState({ dataWitsDetalle: response.data });
            else
                console.log(response);    
        }).catch(error => {
            console.log(error.message);
        })
    }
    getEventos = async (id) => {
        axios.get(URL + "eventos/wells/" + id).then(response => {
            console.log('OK Eventos');
            this.setState({ dataEventos: response.data }); 
            let dataEvents   = [...this.state.dataGP]
            let layout = {...this.state.layoutGP}

            const rsEvents = response.data;
            let eventShapes = [];
            let tracesEvents = [];
            
            if (rsEvents.length > 0) {
                
                let fec1 = ''; let fec2 = '';
                let pro1 = ''; let pro2 = '';
                for (let k = 0; k < rsEvents.length; k++) {

                    fec1 = rsEvents[k].fecha_inicial;
                    fec2 = rsEvents[k].fecha_final;
                    let idEvento = rsEvents[k].id;
                    if (rsEvents[k].tipo_tiempo === 1)
                    {   
                        //Eventos Puntuales
                        pro1 = rsEvents[k].profundidad_inicial.replace(',', '.');
                        let color = hexRgb(rsEvents[k].color, {format: 'css'});

                        let trace = {
                            t: idEvento, tipo: 'ev', name: rsEvents[k].TipoEvento, x: fec1, y: pro1, c: color
                        }
                        tracesEvents.push(trace)
                    }
                    else
                    {
                        //Eventos en el tiempo
                        let numberFecI = new Date(fec1).getTime();
                        let numberFecF = new Date(fec2).getTime();
                        pro1 = rsEvents[k].profundidad_inicial.replace(',', '.');                       
                        pro2 = rsEvents[k].profundidad_final.replace(',', '.');

                        let color = hexRgb(rsEvents[k].color, {format: 'css'});
                        let shape = { name: 'Evento', type: 'rect', xref: 'x', yref: 'y', 
                            x0: numberFecI, y0: pro1, x1: numberFecF, y1: pro2 ,
                            line: {color: color , width: 1},
                            id: idEvento, forma: 'Shape'
                        };
                        eventShapes.push(shape);
                        
                        let trace = {
                            t: idEvento, tipo: 'ev', name: rsEvents[k].TipoEvento, x: fec1, y: pro1, c: color
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
                
                    for(let grupo in grupos) 
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
                        dataEvents.push(traceEvento);
                    }
                    if (eventShapes.length > 0)
                    {
                        eventShapes.forEach(sh => {
                            layout.shapes.push( sh );
                        });
                    }
                    
                    layout.datarevision++
                }

                this.setState({
                    dataGP: dataEvents,
                    layoutGP: layout
                });
            }


        }).catch(error => {
            console.log(error.message);
        })
    }
    getOperaciones = async (id) => {
        axios.get(URL + "operaciones/wells/" + id).then(response => {
            console.log('OK Operaciones');
            this.setState({ dataOperaciones: response.data }); 
            let dataOpx   = [...this.state.dataGP]
            let layout = {...this.state.layoutGP}

            let operacionesShapes = [];
            let rsOperaciones = response.data;
            if (rsOperaciones.length > 0)
            {
                let x = [], y = [], t = [];
                let pro1 = ''; let pro2 = '';
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
                        let shape = { type: 'rect', xref: 'x', yref: 'y', name: 'Operación',
                            x0: numberFecI, y0: pro1, x1: numberFecF, y1: pro2,
                            line: {color: 'Gray' , width: 1 }, 
                            id: item.id, forma: 'Shape'
                        }
                        operacionesShapes.push(shape);
                    }               
                });

                if (x.length > 0)
                {
                    let traceOperaciones = {
                        x: x, y: y, name: 'Operaciones', mode: 'markers', type: 'scatter', marker: { symbol: '303', size: 10, color: 'Gray' }, hovertemplate:'%{x}, %{y}', text: t
                    }
                    dataOpx.push(traceOperaciones);
                }
                if (operacionesShapes.length > 0)
                {
                    operacionesShapes.forEach(sh => {
                        layout.shapes.push( sh );
                    });
                }

                this.setState({
                    dataGP:   dataOpx,
                    layoutGP: layout
                });
            }
        }).catch(error => {
            console.log(error.message);
        })
    }
    getArchivos = (id) => {
        return new Promise((resolve, reject) =>  {

            this.setState({ dataArchivosCurvas: [] });

            axios.get(URL + 'archivo_encabezado/well/' + id).then(response => {
                const data   = response.data;
                const archivos_caving = data.filter(tipo => tipo.tipo_archivo_id === 2)
                const archivos_las    = data.filter(tipo => tipo.tipo_archivo_id === 3)

                //Para cada archivo
                // Para cada curva homologada
                // Crear el check 
                archivos_las.forEach( row => {
                    //row.homologacion = JSON.parse(row.homologacion)
                    row.homologacion.forEach( h => {
                        const [curva] = this.GetDetalle(h.codigo)
                        h.descripcion = curva.descripcion
                        h.short_mnemonico = curva.short_mnemonico
                    })
   
                    this.setState( prev => ({  dataArchivosCurvas: [...prev.dataArchivosCurvas,  {id: row.id, datos: row.datos}] }));
                    //this.getDataArchivos(row.id, Number(row.es_tiempo)).then ( resp => {
                    //    this.setState( prev => ({  dataArchivosCurvas: [...prev.dataArchivosCurvas,  resp] }));
                    //})
                })
                console.log('Archivos LAS cargados')
                this.setState({ archivos_las: archivos_las });
                resolve(true)
            }).catch(error => {
                console.log(error.message);
                reject(error)
            })
        }) 
    }
    getDataArchivos = (id, tipo) => {
        return new Promise((resolve, reject) =>  {
            axios.get(URL + `archivo_encabezado/datawell/${id}/${tipo}`).then(response => {
                const datos = {
                    id: id,
                    datos: response.data
                }
                resolve(datos)
            }).catch(error => {
                console.log(error.message);
                reject(error)
            })
        }) 
    } 
    getFEL = async (id) => {
        axios.get(URL + 'archivo_encabezado_fel/well/' + id).then(response => {
            const [fel]   = response.data;
            
            if (fel !== undefined)
            {
                if (fel.archivo_imagen_recorte !== null)
                {
                    
                    const imagen = 'data:image/png;base64,' + fel.archivo_imagen_recorte;
                    const layout_FEL = {
                        autosize: true,
                        uirevision: 'true',
                        margin: { l: 0, r: 40, t: 80, b: 5 },
                        dragmode: 'zoom',
                        hovermode: 'closest',
                        plot_bgcolor: 'white',
                        paper_bgcolor: 'white',
                        font: { family: 'verdana', size: 11 },
                        showlegend: false,
                        xaxis: { fixedrange: false, autorange: false, range: [0, fel.inicio_recorte], nticks: 1 },   title: fel.id + '_FEL', titlefont: { size: 10, color: 'brown' }, side: 'top', textposition: 'top center',
                        yaxis: { fixedrange: false, autorange: false, range: [this.state.profundidadFinal, -20], nticks: 15, side: 'right', gridcolor: '#eee', gridwidth: 1 },
                        datarevision: 1,
                        images: [
                            {
                            "source": imagen,
                            "xref": "x",
                            "yref": "y",
                            "x": 0,
                            "y": fel.inicio_recorte,
                            "sizex": fel.inicio_recorte,
                            "sizey": fel.fin_recorte,
                            "xanchor": "left",
                            "yanchor": "top",
                            "sizing": "stretch"
                            }
                        ]
                    };
                    let y = []
                    let x = []

                    for (let i=fel.inicio_recorte; i<= fel.fin_recorte; i = i + fel.paso_recorte)
                    {
                        y.push(i)
                        x.push(0)
                    }
                    
                    const serie = {
                        x: x,
                        y, y,
                        name: fel.id + '_FEL',
                        type: 'scatter',
                        hovertemplate: '%{y}'
                    }
                    const data = [serie] 
                    this.setState ({ layoutFEL: layout_FEL, dataFEL: data, isLoadedVerticalFEL: true,
                        fel: {
                            id: fel.id,
                            inicio: fel.inicio_recorte,
                            fin: fel.fin_recorte,
                            paso: fel.paso_recorte,
                            checked_fel: true
                        },
                        colVertical: this.state.isLoadedVertical > 0 ?  'col-md-9 col-lg-9' : null ,
                        colVerticalFEL: this.state.isLoadedVertical > 0 ? 'col-md-3 col-lg-3' : 'col-md-3 col-lg-3'
                    })
                    
                }
                else
                {
                    this.setState ( {layoutFEL :  {}, dataFEL: [], isLoadedVerticalFEL: false })
                    message.info('Aún no se ha recortado el área del archivo FEL')
                }
            }
            else
                this.setState ( {layoutFEL :  {}, dataFEL: [], isLoadedVerticalFEL: false })
            
            console.log('FEL finalizado')
        }).catch(error => {
            console.log(error.message);
            message.error('Ocurrió un error consultando el archivo FEL, intente nuevamente ')
        })
    }

    // 95-0 55-45 0-95 vh
    // col-md-8 col-md-12
    ToggleDivHorizontales = () => {
        let tg = this.state.toggleHorizontales
        tg++
        if (tg > 3) tg = 1
        switch (tg)
        {
            case 1:
                this.setState( {
                    toggleHorizontales: 1,
                    togglePrincipal: true,
                    toggleTrackHorizontal: false,
                    plotDeptCol: this.state.toggleTrackVertical ? 'col-md-8' : 'col-md-12',
                    plotDeptVH:  '95vh',
                    plotTrackVH: '0vh'
                })
                break;
            case 2: 
                this.setState( {
                    toggleHorizontales: 2,
                    togglePrincipal: true,
                    toggleTrackHorizontal: true,
                    plotDeptCol: this.state.toggleTrackVertical ? 'col-md-8' : 'col-md-12',
                    plotDeptVH:  '55vh',
                    plotTrackVH: '40vh'
                })
                break;
            case 3:
                this.setState( {
                    toggleHorizontales: 3,
                    togglePrincipal: false,
                    toggleTrackHorizontal: true,
                    plotDeptCol: this.state.toggleTrackVertical ? 'col-md-8' : 'col-md-12',
                    plotDeptVH:  '0vh',
                    plotTrackVH: '95vh'
                })
                break
            default:
                break
        }
        return tg
    }

    AbrirTemplate = (id) => {
        console.log(this.now())
        let profundidadFinal_temporal = 1000
        let layout_Principal = {
            autosize: true,
            uirevision: 'true',
            margin: { l: 80, r: 40, t: 80, b: 5 }, 
            dragmode: 'zoom',
            hovermode: 'closest',
            plot_bgcolor:'white' ,
            paper_bgcolor: 'white',
            xaxis: {
                fixedrange: false,
                showspikes: true,
                spikemode: 'across',
                textposition: 'top center',
                side: 'top',
                type: 'time',
                tickformat: '%d %b %Y \n %H:%M:%S ',
                title: 'Tiempo',
                nticks: 10                
            },
            yaxis: {
                fixedrange: false,
                autorange: false,
                range: [profundidadFinal_temporal, -20],
                title: 'Profundidad',
                nticks: 10,
                gridcolor: '#eee',
                gridwidth: 1
            },
            font: { family: 'verdana', size: 11, color: 'black'},
            showlegend: false,
            shapes: [],
            datarevision: 1
        }
        let layout_Horizontal = {
            autosize: true,
            uirevision: 'true',
            margin: { l: 60, r: 40, t: 30, b: 40 }, 
            dragmode: 'zoom',
            hovermode: 'x',
            plot_bgcolor: 'white',
            paper_bgcolor: 'white',
            font: { family: 'verdana', size: 11, color: 'black'},
            showlegend: false,
            grid:  { rows: 0, columns: 1, pattern: 'independent', subplots:[]},
            xaxis: { fixedrange: false, showspikes: true, spikemode: 'across', type: 'time', tickformat: '%d %b %Y \n %H:%M:%S ', title: 'Tiempo', nticks: 5  },
            datarevision: 1
        };

        let layout_Vertical = {
            autosize: true,
            uirevision: 'true',
            margin: { l: 40, r: 40, t: 80, b: 5 },
            dragmode: 'zoom',
            hovermode: 'closest',
            plot_bgcolor: 'white',
            paper_bgcolor: 'white',
            font: { family: 'verdana', size: 11 },
            showlegend: false,
            grid:  { columns: 0, rows: 1, pattern: 'independent', subplots: []},
            yaxis: { fixedrange: false, autorange: false, range: [1000, -20], nticks: 15, side: 'right', gridcolor: '#eee',
            gridwidth: 1  },
            datarevision: 1
        };

        this.setState({
            loadingStart: true,

            configGP:   config_general,
            dataGP:     [],
            layoutGP:   layout_Principal,
            isLoadedPrincipal:  false,
            
            dataTH:     [],
            layoutTH:   layout_Horizontal,
            isLoadedHorizontal: false,

            layoutTV:   layout_Vertical,
            isLoadedVertical: false,
                       
            profundidadFinal: profundidadFinal_temporal,

            form_template: {
                ...this.state.form_template,
                id: id,
            }
            
        });

        const requestTemplatesWells         = axios.get(URL + "templates_wells/" + id);
        const requestTemplatesWellTipoCurva = axios.get(URL + "templates_wells_wits_detalle_secciones/template_well/" + id);       

        //Obtener template y sus curvas
        axios.all([requestTemplatesWells, requestTemplatesWellTipoCurva]).then(axios.spread((...response) => {
            const [template] = response[0].data;
            const curvas     = response[1].data;
           
            //Obtener Datos y Graficar
            if (this.state.template.wells_id == template.wells_id)
            {
                if (this.state.dataWits.length === 0)
                {    
                    //Archivos LAS, CAVING
                    this.getArchivos(template.wells_id).then( rta => {
                   
                        if (rta)
                        {
                            axios.get(URL + "datos_wits/wells/" + template.wells_id + '/0').then(response => {
                                if (response.status === 200)
                                {
                                    const data_Wits       = response.data;
                                    const datosToSimplyfy = data_Wits.map( e => ({x: e['id'], y: Number(e['_0108'])}) );
                                    const dataSimplyfy    = Simplify(datosToSimplyfy, 0.9075).map( prop => prop.x ); 
                                    
                                    const dataFilter_Wits = data_Wits.filter( item => dataSimplyfy.includes( item.id ) )

                                    this.setState({dataWits: dataFilter_Wits})
                                
                                    console.log('datos wits inicial')

                                    //Gráfica principal
                                    let curvasPrincipal = curvas.filter(c=>c.mostrar === true && c.grupo === null)
                                    this.SetSerieGraficaPrincipal(curvasPrincipal)
                                    //

                                    //Track Horizontal
                                    let curvasTraksHorizontal = curvas.filter(c=>c.mostrar === true && c.grupo !== null).sort(c=>c.grupo)
                                    this.SetSerieTrackHorizontal(curvasTraksHorizontal)
                                    //

                                    //Track Vertical
                                    this.SetSerieTrackVertical()

                                    //Archivo FEL
                                    this.getFEL(template.wells_id)

                                    this.setState({
                                        template:   {...template},
                                        dataCurvas: [...curvas],
                                        modalStart: false,
                                        loadingStart: false,
                                        toggleHorizontales: 0
                                    })
                                    
                                    this.ToggleDivHorizontales()
                                    console.log(this.now())
                                }
                                else
                                {
                                    console.log(response.data);
                                    message.error('Ocurrió un error consultando los datos de telemetría, recargue la página por favor')
                                }
                            }).catch(errors => {
                                console.log(errors.message);
                                message.error('Ocurrió un error consultando los datos de telemetría, recargue la página por favor')
                            })
                        }
                    })
                    .catch(err => {
                        message.error('Ocurrió un error consultando los archivos LAS, recargue la página por favor')
                        console.log(err.message);
                    })
                  
                    this.getEventos(template.wells_id)
                    this.getOperaciones(template.wells_id)
                }
                else
                {
                    console.log('datos wits existentes')
                    this.getArchivos(template.wells_id)
                   

                    //Gráfica principal
                    let curvasPrincipal = curvas.filter(c=>c.mostrar === true && c.grupo === null)
                    this.SetSerieGraficaPrincipal(curvasPrincipal)
                    //

                    //Track Horizontal
                    let traksHorizontales = curvas.filter(c=>c.mostrar === true && c.grupo !== null).sort(c=>c.grupo)
                    this.SetSerieTrackHorizontal(traksHorizontales)
                    //
            
                    //Track Vertical
                    this.SetSerieTrackVertical()

                    this.getEventos(template.wells_id)
                    this.getOperaciones(template.wells_id)
                    this.getFEL(template.wells_id)
                    
                    this.setState({
                        template:   {...template},
                        dataCurvas: [...curvas],
                        modalStart: false,
                        loadingStart: false,
                        toggleHorizontales: 0
                    })
                    this.ToggleDivHorizontales()
                    
                }
            }
            else
            {
                console.log('otro pozo')
                this.getArchivos(template.wells_id)

                //Gráfica principal
                let curvasPrincipal = curvas.filter(c=>c.mostrar === true && c.grupo === null)
                this.SetSerieGraficaPrincipal(curvasPrincipal)
                //

                //Track Horizontal
                let traksHorizontales = curvas.filter(c=>c.mostrar === true && c.grupo !== null).sort(c=>c.grupo)
                this.SetSerieTrackHorizontal(traksHorizontales)
                //

                //Track Vertical
                this.SetSerieTrackVertical()

                this.getEventos(template.wells_id)
                this.getOperaciones(template.wells_id)
                this.getFEL(template.wells_id)

                
                this.setState({
                    template:   {...template},
                    dataCurvas: [...curvas],
                    modalStart: false,
                    loadingStart: false,
                    toggleHorizontales: 0
                })
                this.ToggleDivHorizontales()
            }

        })).catch(error => {
            console.log(error.message);
        })
        
    }
    
    DarkSide = () => {
        let layout_p = {...this.state.layoutGP}
        let layout_h = {...this.state.layoutTH}
        let layout_v = {...this.state.layoutTV}
        let layout_f = {...this.state.layoutFEL}


        layout_p.plot_bgcolor  = this.state.darkMode ? 'white' : 'black'
        layout_h.plot_bgcolor  = this.state.darkMode ? 'white' : 'black'
        layout_v.plot_bgcolor  = this.state.darkMode ? 'white' : 'black'
        layout_f.plot_bgcolor  = this.state.darkMode ? 'white' : 'black'


        layout_p.paper_bgcolor = this.state.darkMode ? 'white' : 'black'
        layout_h.paper_bgcolor = this.state.darkMode ? 'white' : 'black'
        layout_v.paper_bgcolor = this.state.darkMode ? 'white' : 'black'
        layout_f.paper_bgcolor = this.state.darkMode ? 'white' : 'black'


        layout_p.font.color = this.state.darkMode ? 'black' : 'white' 
        layout_h.font.color = this.state.darkMode ? 'black' : 'white' 
        layout_v.font.color = this.state.darkMode ? 'black' : 'white' 
        layout_f.font.color = this.state.darkMode ? 'black' : 'white' 


        layout_p.datarevision++
        layout_h.datarevision++
        layout_v.datarevision++
        layout_f.datarevision++


        this.setState({darkMode: !this.state.darkMode, layoutGP: layout_p, layoutTH: layout_h, layoutTV: layout_v, layoutFEL: layout_f})

    }

    // Actualiza las curvas en la grafica principal
    SetSerieGraficaPrincipal = (curvas_p) => {
        
        let data   = [...this.state.dataGP]
        let layout = {...this.state.layoutGP}
        let profundidadFinal_temporal = layout.yaxis.range ? layout.yaxis.range[0] : 1000
        
        curvas_p.map( (c) => {
                        
            if (c.mostrar)
            {
                let index = data.findIndex((item) => item.name === c.descripcion);
                if (index === -1)
                {
                    //Agregar curva
                    const datos = this.state.dataWits.map( f => ({ x: f['DATETIME'], y: f['_'+c.codigo]}) );  
                    const x = datos.map(d=>d.x);
                    const y = datos.map(d=>d.y);
                    const serie = {
                        x: x,
                        y: y,
                        name: c.descripcion,
                        type: 'scatter',
                        text: '[' + c.codigo + '] ' + c.short_mnemonico + ' - ' + c.descripcion
                    }
                    data.push(serie)

                    let prof = Math.max(...y) + 500
                    profundidadFinal_temporal =  (prof > profundidadFinal_temporal) ? prof : profundidadFinal_temporal
                    layout.yaxis.range = [profundidadFinal_temporal, -20]
                    
                }
            }
            else
            {
                //Remover curva
                let index = data.findIndex((item) => item.name === c.descripcion);
                if (index >= 0)
                {
                    data.splice(index, 1)
                }
            }
           
        })  

        this.setState({
            isLoadedPrincipal: (data.length > 0) ? true : false,
            configGP: config_general,
            dataGP: data,
            layoutGP: layout,
            profundidadFinal: profundidadFinal_temporal
        });
        console.log('SetSerieGraficaPrincipal')

    } 

    // Actualizar las curvas de los tracks horizontales
    SetSerieTrackHorizontal = (curvas_h) => {
 
        let layout_Horizontal = {...this.state.layoutTH}
        layout_Horizontal.grid.subplots = []
        let datosGraficasHorizontales = []
        let i = 1
        let j = 0
        let grupo_anterior = 0  
        curvas_h.map(c => {
            
            if (c.mostrar)
            {
                const datos = this.state.dataWits.map( f => ({ x: f['DATETIME'], y: f['_'+c.codigo]}) );
                if (datos.length > 0)
                { 
                    const x = datos.map(d=>d.x);
                    const y = datos.map(d=>d.y);
                    let traza = {
                        name : c.descripcion,
                        x: x,
                        y: y,
                        xaxis: 'x',
                        yaxis: 'y' + ((i > 1) ? String(i) : ''),
                        text: '[' + c.codigo + '] ' + c.short_mnemonico + ' - ' + c.descripcion
                    }

                    let propertyAxi = "yaxis" + ((i > 1) ? String(i) : '')
                    if (c.grupo == grupo_anterior)
                        layout_Horizontal[propertyAxi] = { title: c.short_mnemonico, titlefont: { size: 10, color: '#3c5cf9', }, tickfont: { size: 8.0 }, overlaying: 'y' + ((i > 1) ? String(i - 1) : ''), side: 'right', gridcolor: '#eee' }
                    else
                    {
                        layout_Horizontal[propertyAxi] = { title: c.short_mnemonico, titlefont: { size: 10, color: '#3c5cf9', }, tickfont: { size: 8.0 }, gridcolor: '#eee' }
                    
                        let subplot = ['xy' + ((i > 1) ? String(i) : '') ]
                        layout_Horizontal.grid.subplots.push(subplot);
                        j++;
                    }
                    i++
                    grupo_anterior = c.grupo
                    datosGraficasHorizontales.push(traza);
                }
            }
           
        })
        console.log('Tracks dataWits')

        //Para DBTM o DMEA de un LAS en tiempo Homologado
        let data   = [...this.state.dataGP]
        let layout = {...this.state.layoutGP}
        let profundidadFinal_temporal = layout.yaxis.range ? layout.yaxis.range[0] : 1000
        let refreshPrincipal = false
        this.state.archivos_las.forEach ( ar => {
            
            if (ar.es_tiempo === true)
            {
                ar.homologacion.forEach( hm => {
                    if (hm.mostrar)
                    {
                            
                        const [curvas] = this.state.dataArchivosCurvas.filter( c => c.id === ar.id ).map( d => ({ datos: d.datos }))
                        const datos  = curvas.datos.map( f => ({ x: f['DATETIME'], y: f['_'+hm.codigo]}) )
                        if (datos.length > 0)
                        {
                            const x = datos.map(d=>d.x);
                            const y = datos.map(d=>d.y);
                            
                            //Si son DBTM o DMEA, van para gráfica principal
                            if (hm.codigo === '0108' || hm.codigo === '0110' )
                            {
                                const serie = {
                                    x: x,
                                    y: y,
                                    name: ar.id + '_' + hm.descripcion,
                                    type: 'scatter',
                                    text: '[' + hm.codigo + '] ' + hm.short_mnemonico + ' - ' + hm.descripcion
                                }
                                data.push(serie)

                                let prof = Math.max(...y) + 500
                                profundidadFinal_temporal =  (prof > profundidadFinal_temporal) ? prof : profundidadFinal_temporal
                                layout.yaxis.range = [profundidadFinal_temporal, -20]

                                refreshPrincipal = true
                            }
                            else
                            {
                                let traza = {
                                    name : ar.id+'_'+hm.short_mnemonico,
                                    x: x,
                                    y: y,
                                    xaxis: 'x',
                                    yaxis: 'y' + ((i > 1) ? String(i) : ''),
                                    text: '[' + hm.codigo + '] ' + hm.short_mnemonico + ' - ' + hm.descripcion
                                }
                
                                let propertyAxi = "yaxis" + ((i > 1) ? String(i) : '')
                                //if (0 == grupo_anterior)
                                //    layout_Horizontal[propertyAxi] = { title: ar.id+'_'+hm.short_mnemonico, titlefont: { size: 10, color: '#3c5cf9', }, tickfont: { size: 8.0 }, overlaying: 'y' + ((i > 1) ? String(i - 1) : ''), side: 'right', gridcolor: '#eee' }
                                //else
                                //{
                                    layout_Horizontal[propertyAxi] = { title: ar.id+'_'+hm.short_mnemonico, titlefont: { size: 10, color: '#3c5cf9', }, tickfont: { size: 8.0 }, gridcolor: '#eee' }
                                
                                    let subplot = ['xy' + ((i > 1) ? String(i) : '') ]
                                    layout_Horizontal.grid.subplots.push(subplot);
                                    j++;
                                //}
                                i++
                                //grupo_anterior = 0
                                datosGraficasHorizontales.push(traza);
                            }
                        }
                        
                    }
                    else
                    {
                        //Remover curva si es de un LAS DBTM o DMEA
                        if (hm.codigo === '0108' || hm.codigo === '0110' )
                        {
                            let index = data.findIndex((item) => item.name ===  ar.id + '_' + hm.descripcion);
                            if (index >= 0)
                            {
                                data.splice(index, 1)
                                refreshPrincipal = true
                            }
                        }
                    }
                })
            }
        })

        layout_Horizontal.grid.rows = j 
        
        this.setState({
            dataTH:     datosGraficasHorizontales,
            layoutTH:   layout_Horizontal,
            isLoadedHorizontal: datosGraficasHorizontales.length > 0 ? true : false
        });

        if (refreshPrincipal)
        {
            this.setState({
                dataGP: data,
                layoutGP: layout,
                profundidadFinal: profundidadFinal_temporal
            });
        }
        console.log('SetSerieTrackHorizontal')

    }

   
    
    //Actualizar las curvas de los tracks verticales
    SetSerieTrackVertical = () => {
        let newMax = 0
        if (this.state.toggleHorizontales === 1)
            newMax = this.state.profundidadFinal
        else
            newMax =  this.MaxTrackVertical(-20, this.state.profundidadFinal)

        let layout_Vertical = {...this.state.layoutTV}

        let subplots = [];
        layout_Vertical.grid.subplots = []
        layout_Vertical.yaxis.range = [newMax, -20]
        let datosGraficasVerticales = []
        
        let i = 1
        
        this.state.archivos_las.forEach ( ar => {
            if (ar.es_tiempo === false)
            {
                ar.homologacion.forEach( hm => {
                    if (hm.mostrar)
                    {
                        const [curvas] = this.state.dataArchivosCurvas.filter( c => c.id === ar.id ).map( d => ({ datos: d.datos }))
                        const datos  = curvas.datos.filter(x => x['_'+hm.codigo] !== "-999.25").map( f => ({ y: f['DEPTH'], x: f['_'+hm.codigo]}) )
                        const x = datos.map(d=>d.x);
                        const y = datos.map(d=>d.y);
                        
                        let traza = {
                            name : ar.id+'_'+hm.short_mnemonico,
                            x: x,
                            y: y,
                            yaxis: 'y',
                            xaxis: 'x' + (i > 1 ? String(i) : ''),
                            text: '[' + hm.codigo + '] ' + hm.short_mnemonico + ' - ' + hm.descripcion
                        }
        
                        let propertyAxi = 'xaxis' + (i > 1 ? String(i) : '');
                        layout_Vertical[propertyAxi] = {
                            title: ar.id+'_'+hm.short_mnemonico,
                            
                            titlefont: { size: 10, color: 'red' },
                            tickfont:  { size: 8.0 },
                            fixedrange: false,
                            showspikes: true,
                            side: 'top',
                            showticklabels: true,
                            textposition: 'top center',
                        };
                        let subplot = 'x' + (i > 1 ? String(i) : '') + 'y';
                        subplots.push(subplot);
                                  
                        i++;
                        //if (0 == grupo_anterior)
                        //    layout_Horizontal[propertyAxi] = { title: ar.id+'_'+hm.short_mnemonico, titlefont: { size: 10, color: '#3c5cf9', }, tickfont: { size: 8.0 }, overlaying: 'y' + ((i > 1) ? String(i - 1) : ''), side: 'right', gridcolor: '#eee' }
                        //else
                        //{
                        //    layout_Horizontal[propertyAxi] = { title: ar.id+'_'+hm.short_mnemonico, titlefont: { size: 10, color: '#3c5cf9', }, tickfont: { size: 8.0 }, gridcolor: '#eee' }
                        
                        //    let subplot = ['xy' + ((i > 1) ? String(i) : '') ]
                        //    layout_Horizontal.grid.subplots.push(subplot);
                        //    j++;
                        //}
                        //i++
                        //grupo_anterior = 0
                        datosGraficasVerticales.push(traza);
                    }
                })
                layout_Vertical.grid.columns = subplots.length
                layout_Vertical.grid.subplots.push(subplots);
            }
        })

        let layout_fel = {...this.state.layoutFEL}
        layout_fel.datarevision++

        this.setState({
            dataTV:     datosGraficasVerticales,
            layoutTV:   layout_Vertical,
            layoutFEL:   layout_fel,
            isLoadedVertical: datosGraficasVerticales.length > 0 ? true : false,
            colVertical: datosGraficasVerticales.length > 0 ?   (this.state.isLoadedVerticalFEL ?   'col-md-9 col-lg-9' : 'col-md-12 col-lg-9' ) : null,
            colVerticalFEL: datosGraficasVerticales.length > 0 ? 'col-md-3 col-lg-4' : 'col-md-3 col-lg-3'
        });
        console.log('SetSerieTrackVertical')
       
    }

    GetDetalle = (codigo) => {
        const curva = this.state.dataWitsDetalle.filter( f => f.codigo === codigo)
        return curva
    }

    EsEvento(name) {
        let existe = false; 
        this.state.dataTipoEvento.forEach((item) => {
            if (name === item.label) {existe = true; return existe;}
        })
        return existe;
    }

    MaxTrackVertical = (P1Y1, P2Y1) => {
        let P1X1 = 0;
        let P2X1 = 51.7;
    
        let punto = 99.5;
    
        let pendiente = (P2Y1 - P1Y1) / (P2X1 - P1X1);
        let corte = P1Y1 - pendiente * P1X1;
    
        let newMax = pendiente * punto + corte;
        return newMax;
    };

    // Eventos Gráfica
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
                    showing: row.tipo_tiempo === 1 ? false: true,
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
            }
                
        }
    }   
    PlotOnHover = (e) => {
                 
        var points = e.points[0], pointNum = points.pointNumber;
        if (this.state.isLoadedHorizontal && this.state.toggleTrackHorizontal)
        {   
           
            let nt_h = this.state.dataTH.length;           
            let curves_h = []
            let coords_h = []

            for(let i=0; i<nt_h; i++) {
                curves_h.push({curveNumber: i, pointNumber: pointNum}) 
                coords_h.push('xy' + ((i>0)? String(i+1) : ''))            
            }
            Plotly.Fx.hover('plotTracksHorizontal', curves_h, coords_h);
        }

        if (this.state.isLoadedVertical && this.state.toggleTrackVertical)
        {
            let nt_v = this.state.dataTV.length;
            let coords_v = []
            let curves_v = []
            for(let i=0; i<nt_v; i++) {
                curves_v.push({curveNumber: i, yval: e.yvals[0]})
                coords_v.push('x' + ((i>0)? String(i+1) : '') + 'y')
            }
            Plotly.Fx.hover('plotTracksVertical', curves_v, coords_v);
        }
        if (this.state.isLoadedVerticalFEL && this.state.toggleTrackVertical)
        {
            let nt_f = this.state.dataFEL.length;
            let coords_f = []
            let curves_f = []
            for(let i=0; i<nt_f; i++) {
                curves_f.push({curveNumber: i, yval: e.yvals[0]})
                coords_f.push('x' + ((i>0)? String(i+1) : '') + 'y')
            }
            Plotly.Fx.hover('plotFel', curves_f, coords_f);
        }
    }
    PlotOnUnHover = () => {
        if (this.state.isLoadedHorizontal && this.state.toggleTrackHorizontal)
            Plotly.Fx.unhover('plotTracksHorizontal')
        if (this.state.isLoadedVertical && this.state.toggleTrackVertical)
            Plotly.Fx.unhover('plotTracksVertical')
        if (this.state.isLoadedVerticalFEL && this.state.toggleTrackVertical)
            Plotly.Fx.unhover('plotFel')
    }
    PlotOnRelayout = (eventdata) => {
        
        let layout_hor = {...this.state.layoutTH}
        let layout_ver = {...this.state.layoutTV}
        let layout_fel = {...this.state.layoutFEL}
        
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
            let newMax = eventdata['yaxis.range[0]']
            if (this.state.toggleHorizontales === 2)
                newMax = this.MaxTrackVertical(eventdata['yaxis.range[1]'], eventdata['yaxis.range[0]'])

            layout_ver.yaxis = {
                range: [ newMax, eventdata['yaxis.range[1]'] ], autorange: false, fixedrange: false
            }
            layout_fel.yaxis = {
                range: [ newMax, eventdata['yaxis.range[1]'] ], autorange: false, fixedrange: false, side: 'right', gridcolor: '#eee', gridwidth: 1
            }
            
        }
        
        layout_hor.datarevision++
        layout_ver.datarevision++
        layout_fel.datarevision++


        this.setState({
            layoutTH: layout_hor,
            layoutTV: layout_ver,
            layoutFEL: layout_fel,
        })
    }
    // Fin Eventos Gráfica

    
    CollapseTrackHorizontal = () => {
        let tg = this.ToggleDivHorizontales()
        
        let newMax = this.state.profundidadFinal
        if (tg === 2)
            newMax =  this.MaxTrackVertical(-20, this.state.profundidadFinal)

        let layout_p = {...this.state.layoutGP}
        let layout_h = {...this.state.layoutTH}
        let layout_v = {...this.state.layoutTV}
        let layout_f = {...this.state.layoutFEL}

            
        layout_v.yaxis.range = [newMax, -20]
        layout_f.yaxis.range = [newMax, -20]


        layout_p.datarevision++
        layout_h.datarevision++
        layout_v.datarevision++
        layout_f.datarevision++


        this.setState({
            layoutGP: layout_p,
            layoutTH: layout_h,
            layoutTV: layout_v,
            layoutFEL: layout_f
        });
    }
    CollapseTrackVertical = () => {
        let layout_p = {...this.state.layoutGP}
        let layout_h = {...this.state.layoutTH}
        let layout_f = {...this.state.layoutFEL}


        layout_p.datarevision++
        layout_h.datarevision++
        layout_f.datarevision++


        this.setState({
            toggleTrackVertical: !this.state.toggleTrackVertical,
            plotDeptCol: this.state.toggleTrackVertical ? 'col-md-12' : 'col-md-8',
            layoutGP: layout_p,
            layoutTH: layout_h,
            layoutFEL: layout_f
        });
    }
   

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

    handlePlot = () => {
        let punto = this.state.menuEmergente;
        let fecha = punto.fecha.split(' ');
        this.setState({evento: {color: '#FFFFFF', fecha_inicial: fecha[0], hora_inicial: fecha[1], profundidad_inicial: String(punto.prof), profundidad_final: ''}});
        this.setState({menuEmergente: {showMenu : false}, insertar: true, openModalEvento: true});
    }

    handleChangeNuevo = (e) => {
        this.setState({
            form_template: {
                ...this.state.form_template,
                [e.target.name]: e.target.value,
                pkuser: this.state.userStorage.id_usuario_sesion
            }
        });
    }
  

    setFechaFinal(){
        this.setState({ showing: !this.state.showing });
    }
    
    now() {
        let ahora = new Date();
        return ahora.getHours() + ':' + ahora.getMinutes() + ':' + ahora.getSeconds() + '.' + ahora.getMilliseconds();
    }

    NuevoTemplate = () => {
        this.setState({modalStart: false, modalNuevo: true})
    }
    GuardarTemplate = () => {
       
            axios.post(URL + 'templates', this.state.form_template ).then(response => {
                let rta = response.data[0]
                if ( rta.Result === 1)
                {
                    this.getTemplates(this.state.template.wells_id)
                    this.setState({modalNuevo: false, modalStart: true})    
                }
                else
                {
                    message.warning(rta.Error)
                }
            }).catch(error => {
                message.error('Ocurrió un error al obtener el template, intente nuevamente o contacte al administrador')
                console.log(error.message);
            })
       
        
    }
    EliminarTemplate = (id) => {
        axios.get(URL + 'templates/' + id ).then(response => {          
            let [eliminar] = response.data
            this.setState({ 
                formDeleteTemplate: {
                    id: eliminar.id,
                    nombre: eliminar.nombre,
                    descripcion: eliminar.descripcion
                },
                modalStart: false,
                openModalDeleteTemplate: true
            });
        }).catch(error => {
            console.log(error.message);
        })
    }
    ConfirmDeleteTemplate = () => {
      
        var datos = {
            'id': this.state.formDeleteTemplate.id,
            'pkuser': this.state.userStorage && this.state.userStorage.id_usuario_sesion
            ? this.state.userStorage.id_usuario_sesion
            : ''
        };
            
        axios.delete(URL + 'templates', { data: datos }).then( response => {
            this.setState({ openModalDeleteTemplate: false, modalStart: true });
            this.getTemplates(this.state.template.wells_id);
            message.success('Template eliminado con éxito')

        }).catch(error => {
            console.log(error.message);
        })
     
    }
    ActualizaTemplate = () => {
        if (this.state.dataCurvas.length > 0)
        {
            if (this.state.form_template.id > 0)
            {   
                const curvas = this.state.dataCurvas.map(curva => (
                    { id: curva.id, mostrar: curva.mostrar, grupo: curva.grupo }
                ))
                const data = {
                    curvas: curvas,
                    pkuser: this.state.userStorage && this.state.userStorage.id_usuario_sesion
                    ? this.state.userStorage.id_usuario_sesion
                    : ''
                }
                axios.put(URL + 'templates_wells_wits_detalle_secciones', data ).then(response => {          
                    message.success('Template actualizado')
                }).catch(error => {
                    console.log(error.message);
                    message.success('Ocurrió un error actualizado el Template')
                })
            }
            else
                message.info('No hay un template abierto')
        }
        else
        {
            message.info('No existen curvas seleccionadas para guardar')
        }
    }

    

    UpdateEvent = () => {
       
        let eventoUpd = {...this.state.evento}

        let fechaInicio = eventoUpd.fecha_inicial + ' ' + eventoUpd.hora_inicial;
        let fechaFinal  = eventoUpd.fecha_final + ' ' + eventoUpd.hora_final;
        let numberFecI = new Date(fechaInicio).getTime();
        let numberFecF = new Date(fechaFinal).getTime();
        let profundidadInicio = eventoUpd.profundidad_inicial.replace(',', '.');
        let profundidadFinal  = eventoUpd.profundidad_final.replace(',', '.');

        if (this.state.showing)
        {
            eventoUpd.tipo_tiempo = 2
            //this.state.evento.tipo_tiempo = 2;
        }
        else
        {
            eventoUpd.tipo_tiempo = 1;
            eventoUpd.fecha_final = eventoUpd.fecha_inicial;
            eventoUpd.hora_final  = eventoUpd.hora_inicial;
            eventoUpd.profundidad_final = eventoUpd.profundidad_inicial;           
        }

        this.setState({ ...this.state.evento, eventoUpd })
        //const evento   = {...this.state.evento}
        const anterior = {...this.state.eventoAnterior}
        
        //Actualizar
        axios.put(URL + 'eventos', eventoUpd)
            .then( response => {
                
                
                let updateGrafica = false;
                let newData = [...this.state.dataGP]
                let index = this.state.dataGP.findIndex((item) => item.name === anterior.TipoEvento);

                const newLayout = Object.assign({}, this.state.layoutGP)
                
                //console.log(anterior);
                //console.log(evento);
                // Es el mismo tipo de evento (traza) ?
                if (anterior.tipo_evento_id === eventoUpd.tipo_evento_id)
                {
                    
                    //Evento Puntual (Anterior)
                    if (anterior.tipo_tiempo === 1)
                    {
                        if (
                            (anterior.fecha_inicial !== eventoUpd.fecha_inicial) || 
                            (anterior.hora_inicial  !== eventoUpd.hora_inicial) || 
                            (anterior.profundidad_inicial !== eventoUpd.profundidad_inicial)
                        )
                        {
                            //Actualizar el punto
                            newData[index].x.splice(0, 1, fechaInicio);
                            newData[index].y.splice(0, 1, profundidadInicio);            
                            updateGrafica = true;
                            
                        }

                        // De Puntual a En el tiempo
                        if (eventoUpd.tipo_tiempo === 2)
                        {
                            //Agegar shape
                            let color = hexRgb(eventoUpd.color, {format: 'css'});
                            let shape = { name: eventoUpd.id, type: 'rect', xref: 'x', yref: 'y', 
                                x0: numberFecI, y0: profundidadInicio, x1: numberFecF, y1: profundidadFinal ,
                                line: {color: color , width: 1}
                            };
                            newLayout.shapes.push(shape);
                            updateGrafica = true;
                            
                        }
                    }
                    else
                    {
                    // Evento en tiempo (Anterior)
                        if (
                            (anterior.fecha_inicial !== eventoUpd.fecha_inicial) || 
                            (anterior.hora_inicial  !== eventoUpd.hora_inicial) || 
                            (anterior.profundidad_inicial !== eventoUpd.profundidad_inicial) ||
                            (anterior.fecha_final !== eventoUpd.fecha_final) || 
                            (anterior.hora_final  !== eventoUpd.hora_final) || 
                            (anterior.profundidad_final !== eventoUpd.profundidad_final)
                        )
                        {
                            //Actualizar el punto
                            newData[index].x.splice(0, 1, fechaInicio);
                            newData[index].y.splice(0, 1, profundidadInicio);      
                            
                        }
                        if (eventoUpd.tipo_tiempo === 2)
                        {
                            //Actualizar el shape
                            let indexLayout = newLayout.shapes.findIndex((shape) => shape.name === eventoUpd.id);                          
                        
                            newLayout.shapes[indexLayout].x0 = numberFecI;
                            newLayout.shapes[indexLayout].y0 = profundidadInicio;
                            newLayout.shapes[indexLayout].x1 = numberFecF;
                            newLayout.shapes[indexLayout].y1 = profundidadFinal;
                        }
                        else
                        {
                            //Remover el shape  anterior
                            let indexLayout = newLayout.shapes.findIndex((shape) => shape.name === eventoUpd.id);
                            newLayout.shapes.splice(indexLayout, 1)                               
                        }
                        updateGrafica = true;

                    }

                    
                }
                else
                {
                    //Remover punto anterior de ese tipo de evento
                    let nextIndex = newData[index].text.findIndex((subitem) => subitem === eventoUpd.id)
                                        
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
                    let indexNew = newData.findIndex((item) => item.name === eventoUpd.TipoEvento);
                    

                    if (indexNew >= 0)
                    {
                        //Agrega la data en traza existente
                        newData[indexNew].x.push(fechaInicio);
                        newData[indexNew].y.push(profundidadInicio);            
                        newData[indexNew].text.push(eventoUpd.id);
                    }
                    else
                    {
                        //Agregar data en traza nueva
                        let color = hexRgb(eventoUpd.color, {format: 'css'});
                        let x = [], y = [], t = [];
                        x.push(fechaInicio);
                        y.push(profundidadInicio);
                        t.push(eventoUpd.id);
                        let traceEvento = {
                            x: x, y: y, name: eventoUpd.TipoEvento, mode: 'markers', type: 'scatter', 
                            marker: { symbol: '303', size: 10, color: color }, hovertemplate:'%{x}, %{y}', text: t
                        }
                        newData.push(traceEvento)
                    }

                    
                    if (anterior.tipo_tiempo === 2)
                    {
                        //Remover shape anterior
                        let indexLayout = newLayout.shapes.findIndex((shape) => shape.name === eventoUpd.id);
                        newLayout.shapes.splice(indexLayout, 1)

                    } 
                    if (eventoUpd.tipo_tiempo === 2)
                    {
                        //Agegar nuevo shape
                      
                        let color = hexRgb(eventoUpd.color, {format: 'css'});
                        let shape = { name: eventoUpd.id, type: 'rect', xref: 'x', yref: 'y', 
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
                message.success('Evento actualizado con éxito')
                
            })
            .catch( error => {
                console.log('Error Actualizar Evento: ' + error.message)
                message.error('Ocurrió un error actualizando el evento, intente nuevamente')
            })
       
    }

    DeleteEvent = () => {
        const evento   = {...this.state.evento}
        var datos = {
            'id': evento.id,
            'pkuser': this.state.userStorage && this.state.userStorage.id_usuario_sesion
            ? this.state.userStorage.id_usuario_sesion
            : ''
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
            message.success('Evento eliminado con éxito')
        })
        .catch( error => {
            console.log('Error Eliminar Evento: ' + error.message)
            message.error('Ocurrió un error eliminando el evento, intente nuevamente')
        })

    }

    InsertEvent = () => {
        delete this.state.evento.id
        
        let eventoIns = {...this.state.evento}

        eventoIns.wells_id =  this.state.template.wells_id;
        eventoIns.pkuser   = this.state.userStorage && this.state.userStorage.id_usuario_sesion
        ? this.state.userStorage.id_usuario_sesion
        : '';

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
            eventoIns.tipo_tiempo = 2;
        }
        else
        {
            fechaFinal = this.state.evento.fecha_inicial + ' ' + this.state.evento.hora_inicial;
            numberFecF = new Date(fechaInicio).getTime();
            profundidadFinal = this.state.evento.profundidad_inicial.replace(',', '.');
            eventoIns.fecha_final = this.state.evento.fecha_inicial;
            eventoIns.hora_final = this.state.evento.hora_inicial;
            eventoIns.profundidad_final = this.state.evento.profundidad_inicial;
            eventoIns.tipo_tiempo = 1; 
        }
          

        //const evento   = {...this.state.evento}
        
        axios.post(URL + 'eventos', eventoIns).then( response => {
            eventoIns.id = response.data[0].id;
           
            let newData = [...this.state.dataGP]
            let index = newData.findIndex((item) => item.name === eventoIns.TipoEvento);

            const newLayout = Object.assign({}, this.state.layoutGP)

            //Si existe traza, incluir punto
            if (index >= 0)
            {
                newData[index].x.push(fechaInicio);
                newData[index].y.push(profundidadInicio);            
                newData[index].text.push(eventoIns.id);      
            }
            else
            {
            //no existe traza, crear
                let color = hexRgb(eventoIns.color, {format: 'css'});
                let x = [], y = [], t = [];
                x.push(fechaInicio);
                y.push(profundidadInicio);
                t.push(eventoIns.id);
                let traceEvento = {
                    x: x, y: y, name: eventoIns.TipoEvento, mode: 'markers', type: 'scatter', 
                    marker: { symbol: '303', size: 10, color: color }, hovertemplate:'%{x}, %{y}', text: t
                }
                newData.push(traceEvento)
            }
            
            //Si es en el tiempo
            if (eventoIns.tipo_tiempo == 2)
            {
                let color = hexRgb(eventoIns.color, {format: 'css'});
                let shape = { name: eventoIns.id, type: 'rect', xref: 'x', yref: 'y', 
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
            message.success('Evento creado con éxito.')
            console.log('OK Evento '+ eventoIns.id)
            
        }).catch(error => {
            console.log('Error Insertar Evento: ' + error.message);
            message.error('Ocurrió un error creando el evento, intente nuevamente.')
        })
    }

    Start = () => {
        this.setState({modalNuevo: false, modalStart: true})
    }

    IrHome = () => {
        window.location = 'home'
    }

    componentDidMount() {      
        this.Start();
        this.getFields(); 

        this.setState({userStorage: JSON.parse(sessionStorage.getItem('user'))})
        
        this.setState({dataTipoEvento: JSON.parse(sessionStorage.getItem('dataTipoEvento'))})
        this.setState({dataConvencion: JSON.parse(sessionStorage.getItem('dataConvencion'))})
        this.setState({dataWitsDetalle: JSON.parse(sessionStorage.getItem('dataWitsDetalle'))})
    }   
    
    
    render() { 
        const { template, fel }      = this.state; 
        
        return (
            <div className="App">
                <SideBar pageWrapId={"page-wrap"} outerContainerId={"App"} />
                <div className="container-fluid ">
                    
                    <div className="row border-bottom bg-verdeclaro">
                        <div className="col-md-5 col-lg-5 small text-left mt-2">
                            <label className="font-weight-bold">Template: </label> {template.template_nombre} | <label  className="font-weight-bold">Campo: </label> {template.field_nombre} | <label  className="font-weight-bold">Pozo: </label> {template.wells_nombre}   
                        </div>
                        <div className="col-md-4 col-lg-4 text-left  mt-1">
                            <button title="Templates registrados" onClick={() => this.Start()} className="btn btn-sm btn-success btn-circle"><CreateNewFolderOutlined fontSize="small" /></button>
                            &nbsp;&nbsp;
                            <button title="Guardar Template" onClick={() => this.ActualizaTemplate()} className="btn btn-sm btn-success btn-circle"><Save fontSize="small" /></button>
                            &nbsp;&nbsp;|&nbsp;&nbsp;
                            <button title="Configuración" onClick={() => this.toggleModalTemplate(true, false, null)} className="btn btn-sm btn-primary btn-circle"><Brush fontSize="small" /></button>
                            &nbsp;&nbsp;
                            <button title="Dark Mode" onClick={() => this.DarkSide() } className="btn btn-sm btn-dark btn-circle"><InvertColorsOff fontSize="small" /></button>
                            &nbsp;&nbsp;|&nbsp;&nbsp;
                            <button title="Algoritmo de Operaciones" onClick={() => this.toggleModalAlgoritmo(true)} className="btn btn-sm btn-warning btn-circle"><MultilineChart fontSize="small" /></button>
                            &nbsp;&nbsp;|&nbsp;&nbsp;
                            <button title="Ver/Ocultar Eventos" onClick={() => this.toggleEventos()} className="btn btn-sm btn-outline-primary btn-circle"><EventAvailable fontSize="small"/></button>
                            &nbsp;&nbsp;
                            <button title="Ver/Ocultar Operaciones" onClick={() => this.toggleOperaciones()} className="btn btn-sm btn-outline-secondary btn-circle"><EventNote fontSize="small" /> </button>
                            &nbsp;&nbsp;|&nbsp;&nbsp;
                            <button title="Ver/Ocultar Tracks Horizontales" onClick={() => this.CollapseTrackHorizontal()} className="btn btn-sm btn-info btn-circle"><HorizontalSplit fontSize="small" className="rotate"  /></button>
                            &nbsp;&nbsp;
                            <button title="Ver/Ocultar Tracks Verticales" onClick={() => this.CollapseTrackVertical()} className="btn btn-sm btn-danger btn-circle"><BarChart fontSize="small" /></button>
                        </div>
                        <div className="col-md-3 col-lg-3 text-right  mt-1">
                            <small> {this.state.userStorage.nombre_usuario_sesion} </small>
                        </div>
                    </div>
                  
                    <div className={ this.state.darkMode ? 'row bg-negro' : 'row'} >
                        <div id="divPrincipal" className={this.state.plotDeptCol}>
                            {
                                this.state.togglePrincipal ?
                                <div id="divGraficaPrincipal" className="row">
                                    <div className="col-md-12 col-lg-12">
                                        {
                                            this.state.isLoadedPrincipal ? 
                                            <Plot
                                                divId="plotDept"
                                                data={this.state.dataGP}
                                                layout={this.state.layoutGP}
                                                config={this.state.configGP}
                                                useResizeHandler={true}
                                                style={{width:"100%", height:this.state.plotDeptVH}}
                                                onClick={(e) => this.PlotClick(e)}
                                                onHover={(e) => this.PlotOnHover(e)}
                                                onUnhover={(e) => this.PlotOnUnHover(e)}
                                                onRelayout={(e) => this.PlotOnRelayout(e)}
                                                onInitialized={(figure) => this.setState(figure)}
                                                onUpdate={(figure) => this.setState(figure)}
                                            />
                                            :
                                            null
                                        }
                                    </div>
                                </div>
                                :
                                null
                            }

                            {
                                this.state.toggleTrackHorizontal ?
                                <div id="divTrackHorizontal" className="row">
                                    <div className="col-md-12 col-lg-12">
                                        <Plot
                                            divId="plotTracksHorizontal"
                                            data={this.state.dataTH}
                                            layout={this.state.layoutTH}
                                            config={this.state.configGP}
                                            useResizeHandler={true}
                                            style={{width:"100%", height:this.state.plotTrackVH}}
                                        />
                                    </div>
                                </div>
                                :
                                null
                            }
                        </div>
                        
                        {
                            this.state.toggleTrackVertical ?
                            <div id="divTrackVertical" className="col-md-4">
                                <div className="row">
                                    {this.state.isLoadedVertical ?
                                    <div className={this.state.colVertical}>
                                        <Plot
                                            divId="plotTracksVertical"
                                            style={{width:"100%", height:"95vh"}}
                                            data={this.state.dataTV}
                                            layout={this.state.layoutTV}
                                            config={this.state.configGP}
                                            useResizeHandler={true}
                                        />
                                    </div>
                                    : null }
                                    { this.state.isLoadedVerticalFEL ?
                                    <div className={this.state.colVerticalFEL}>
                                        <Plot
                                            divId="plotFel"
                                            style={{width:"100%", height:"95vh"}}
                                            data={this.state.dataFEL}
                                            layout={this.state.layoutFEL}
                                            config={null}
                                            useResizeHandler={true}
                                        />
                                    </div>
                                    : null}
                                </div>           
                            </div>
                            :
                            null
                        }
                    </div>

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
                    <MenuItem key={'MI1'} onClick={this.handlePlot}><EventAvailable fontSize="small" /> Agregar Evento</MenuItem>
                    <MenuItem key={'MI2'} onClick={this.handleClose}><Close fontSize="small"/> Cerrar </MenuItem>
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
                                    <label><b><EventAvailable fontSize="small"/> Fecha Inicial: </b></label>
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
                                    <CalendarToday style={{cursor: 'pointer'}}/>  Click para {(this.state.showing ? "inactivar" : "activar")} fecha final 
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
                        { this.state.insertar ? <button className="btn btn-success" onClick={() => this.InsertEvent()}><Save /> Insertar </button> : <button className="btn btn-primary" onClick={() => this.UpdateEvent()}><Save /> Actualizar </button>}
                        { this.state.insertar ?  '' : <button className="btn btn-danger" onClick={() => this.setState({ openModalDeleteEvento: true })}><Delete /> Eliminar </button> }
                        <button className="btn btn-secondary" onClick={() => this.setState({ openModalEvento: false })}><Close /> Cerrar</button>
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
                                    <textarea rows="5"
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
                        <button className="btn btn-secondary" onClick={() => this.setState({ openModalOperacion: false })}><Close /> Cerrar</button>
                    </ModalFooter>
                </Modal>
                
                <Modal isOpen={this.state.modalStart} >
                    <ModalHeader>
                        <b>Templates registrados</b>
                    </ModalHeader>
                    <ModalBody>
                        <div className="row">
                            <div className="col-md-5">
                                <div className="form-group">
                                    <label><b>Campo: </b></label>
                                    <select name="field_id" id="field_id" className="form-control" onChange={this.handleChange} defaultValue={template ? template.field_id : 0}>
                                        <option key="0" value="0">Seleccionar</option>
                                        {this.state.dataFields.length > 0 ? this.state.dataFields.map(elemento => (<option key={elemento.id} value={elemento.id}>{elemento.nombre}</option>)) :null } 
                                    </select>
                                </div>
                            </div>
                            <div className="col-md-7">
                                <div className="form-group">
                                    <label><b>Pozo: </b></label>
                                    <select name="wells_id" id="wells_id" className="form-control" onChange={this.handleChange} defaultValue={template ? template.wells_id : 0}>
                                        <option key="0" value="0">Seleccionar</option>
                                        {this.state.dataWells ? this.state.dataWells.map(elemento => (<option key={elemento.id} value={elemento.id}>{elemento.nombre}</option>)) : null}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                
                                    {
                                    template.wells_id > 0 ?
                                    <div className="form-group">
                                        <label><b>Templates </b></label>
                                        <button className="btn btn-primary btn-sm float-right" onClick={() => this.NuevoTemplate()}>Nuevo</button>
                                        <hr/>
                                        {this.state.loadingTemplates ? 
                                        <div className="text-center">
                                            <Spinner 
                                                color="success" 
                                                animation="border"
                                                size="md"
                                                role="status"
                                                aria-hidden="true" 
                                            />
                                        </div>
                                        :
                                        <table className="table table-sm table-striped">
                                            <tbody>
                                                {
                                                    this.state.dataTemplates ? 
                                                    this.state.dataTemplates.map( (row , index) => 
                                                        <tr key={'row_'+index}>
                                                            <td> {row.nombre} </td><td> {row.descripcion} </td>
                                                            <td >
                                                                <button id={'btnopen_'+index} className="btn btn-sm btn-success" title="Abrir" onClick={()=> this.AbrirTemplate(row.id)}><PlayCircleOutline fontSize="small" /> </button>
                                                            </td>
                                                            <td >
                                                                <button id={'btndel_'+index} className="btn btn-sm btn-danger" title="Eliminar" onClick={()=> this.EliminarTemplate(row.template_id)}><Delete fontSize="small" /> </button>
                                                            </td>
                                                        </tr>
                                                    )
                                                    :
                                                    null
                                                }
                                            </tbody>
                                        </table> 
                                        }
                                    </div>
                                    : null }
                                
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        {this.state.loadingStart ? 
                            <Spinner 
                                color="success" 
                                animation="border"
                                size="md"
                                role="status"
                                aria-hidden="true" 
                            />
                        : null}
                        
                        <button className="btn btn-primary"   onClick={() => this.IrHome()}><Home /> Salir</button>
                        <button className="btn btn-secondary" onClick={() => this.setState({modalStart : false, loadingStart: false}) }><Close /> Cerrar</button>                        
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.modalNuevo} >
                    <ModalHeader>
                        <b>Crear Template</b>
                    </ModalHeader>
                    <ModalBody>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Campo</label>
                                    <input type="text" className="form-control" disabled value={template.field_nombre}/>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Pozo</label>
                                    <input type="text" className="form-control" disabled value={template.wells_nombre}/>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="form-group">
                                    <label>Nombre</label>
                                    <input type="text" name="tmpNombre" id="tmpNombre" className="form-control" onChange={this.handleChangeNuevo} />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="form-group">
                                    <label>Descripción</label>
                                    <textarea id="tmpDescripcion" name="tmpDescripcion" className="form-control" onChange={this.handleChangeNuevo} ></textarea>
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-success"   onClick={() => this.GuardarTemplate()}><Save /> Guardar</button>
                        <button className="btn btn-secondary" onClick={() => this.Start()}><Close /> Cancelar</button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.openModalDeleteTemplate}>
                    <ModalBody>
                            <div className="form-group text-center">
                                Est&aacute;s seguro de eliminar el Template ?
                            </div>
                            <br/>
                            <div className="form-group">
                                
                                <b><label >Template:&nbsp;</label></b>
                                    <span>{ this.state.formDeleteTemplate.nombre } </span>
                                <br />
                                <b><label>Descripción:&nbsp;</label></b>
                                { this.state.formDeleteTemplate.descripcion} 
                            
                            </div>
                    </ModalBody>
                    <ModalFooter>
                        <br />
                        <button className="btn btn-danger" onClick={() => this.ConfirmDeleteTemplate()}>Si</button>
                        <button className="btn btn-secondary" onClick={() => this.setState({ openModalDeleteTemplate: false })}> No</button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.modalConfig} size="lg" >
                    <ModalHeader>
                        <div className="row">
                            <div className="col-md-1">
                                <Brush fontSize="large" className="btn-circle bg-primary text-white"/>
                            </div>
                            <div className="col-md-11">
                                <b>Configuración Template: {template.template_nombre}</b>
                                <h6>{template.template_descripcion}</h6>
                            </div>   
                        </div>
                    </ModalHeader>
                    <ModalBody>
                        <Accordion defaultActiveKey="0" >
                            <Card>
                                <Accordion.Toggle as={Card.Header} eventKey="0" className="bg-verdeoscuro small cursor-pointer">
                                    GRÁFICA PRINCIPAL
                                </Accordion.Toggle>
                                <Accordion.Collapse eventKey="0">
                                    <Card.Body>
                                        {
                                            this.state.principal != null ?
                                            this.state.principal.map((tipo) => (
                                                <div key={'dgp_'+tipo.id} className="form-check">
                                                    <input className="form-check-input" type="checkbox" checked={tipo.mostrar} onChange={(e) => this.handleConfigChangePrincipal(e)} id={`chkgp_${tipo.id}`} />
                                                    <label className="form-check-label" htmlFor={`chkgp_${tipo.id}`}>
                                                        {'['+ tipo.codigo + '] ' + tipo.short_mnemonico + ' - ' + tipo.descripcion}
                                                    </label>
                                                </div>
                                            ))
                                            : null
                                        }
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>

                            <Card>
                                <Accordion.Toggle as={Card.Header} eventKey="1" className="bg-verdeclaro  small cursor-pointer">
                                    TRACKS HORIZONTALES
                                </Accordion.Toggle>
                                <Accordion.Collapse eventKey="1">
                                    <Card.Body>
                                        <table className="table table-sm">
                                            <tbody>
                                            <tr><td></td><td style={{widt: '50px'}}># de Track</td></tr>
                                            {
                                                this.state.horizontal.map((tipo) => (
                                                    <tr key={'gth_'+tipo.id}>
                                                        <td>
                                                            <div className="form-check">
                                                                <input className="form-check-input" type="checkbox" checked={tipo.mostrar} onChange={(e) => this.handleConfigChangeHorizontal(e, true)} id={`chkth_${tipo.id}`} />
                                                                <label className="form-check-label" htmlFor={`chkth_${tipo.id}`}>
                                                                    {'['+ tipo.codigo + '] ' + tipo.short_mnemonico + ' - ' + tipo.descripcion}
                                                                </label>   
                                                            </div>
                                                        </td>
                                                        <td >
                                                            <input type="number" className="form-control form-control-sm" min="1" max="10" value={tipo.grupo} id={`grup_${tipo.id}`} onChange={(e) => this.handleConfigChangeHorizontal(e, false)}/>
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                            </tbody>
                                        </table>
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>

                            <Card>
                                <Accordion.Toggle as={Card.Header} eventKey="2" className="bg-verdeoscuro  small cursor-pointer">
                                    CAVINGS
                                </Accordion.Toggle>
                                <Accordion.Collapse eventKey="2">
                                    <Card.Body>
                                        Caving 1 , 2 , 3,
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>

                            <Card>
                                <Accordion.Toggle as={Card.Header} eventKey="3" className="bg-verdeclaro  small cursor-pointer">
                                    LAS ({this.state.archivos_las.length})
                                </Accordion.Toggle>
                                <Accordion.Collapse eventKey="3">
                                    <Card.Body>
                                        <table className="table table-sm">
                                            <tbody>
                                                { 
                                                    this.state.archivos_las.map((arc) => (
                                                        <tr key={'tr_'+arc.id}>
                                                            <td><b>ID:</b> {arc.id} <br/><br/><b>NOMBRE:</b><br/> {arc.nombre_archivo} <br/><br/><b>REFERENCIA:</b><br/>{arc.es_tiempo ? 'TIEMPO' :  'PROFUNDIDAD'}</td>
                                                            <td><b>HOMOLOGADOS:</b>
                                                                {
                                                                arc.homologacion.map( (key) =>  (
                                                                        <div key={'hg_'+key.id}  className="form-check">
                                                                            <input className="form-check-input" type="checkbox" id={`chklas_${arc.id}_${key.id}`} name={`chklas_${arc.id}_${key.id}`} checked={key.mostrar} onChange={(e) =>this.handleChangeLas(e)} />
                                                                            <label className="form-check-label" htmlFor={`chk_lt_${key.id}`}>
                                                                                {key.nombre} = {'['+ key.codigo + '] ' + key.short_mnemonico +'-'+key.descripcion}
                                                                            </label>
                                                                        </div> 
                                                                ))                                                                  
                                                                }
                                                            </td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>

                            <Card>
                                <Accordion.Toggle as={Card.Header} eventKey="4" className="bg-verdeoscuro  small cursor-pointer">
                                    FEL ({this.state.dataFEL.length})
                                </Accordion.Toggle>
                                <Accordion.Collapse eventKey="4">
                                    <Card.Body>
                                        <table className="table table-sm">
                                            <tbody>
                                                { 
                                                    fel.id !== '' ? 

                                                        <tr key={'rowfel_'+fel.id}>
                                                            <td>
                                                                <div key={'fel_'+fel.id}  className="form-check">
                                                                    <input className="form-check-input" type="checkbox" id={`checked_fel`} name={`checked_fel}`} checked={fel.checked_fel} onChange={(e) =>this.handleChangeFel(e)} />
                                                                    <label className="form-check-label" htmlFor={`checked_fel_${fel.id}`}> <b>ID:</b> {fel.id} </label>
                                                                </div> 
                                                            </td>
                                                            <td>
                                                                <b>INICIO:</b> {fel.inicio} 
                                                            </td>
                                                            <td>
                                                                <b>FIN:</b> {fel.fin}
                                                            </td>
                                                            <td>
                                                                <b>PASO:</b> {fel.paso}
                                                            </td>
                                                        </tr>
                                                    
                                                    :
                                                    null
                                                }
                                            </tbody>
                                        </table>
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        </Accordion>
                    </ModalBody>
                    <ModalFooter>
                        {this.state.loadingConfig ? 
                            <Spinner 
                                color="success" 
                                animation="border"
                                size="md"
                                role="status"
                                aria-hidden="true" 
                            />
                        : null}
                        <button className="btn btn-success"   onClick={() => this.toggleModalTemplate(false, true)}><PlaylistAddCheck /> Aplicar</button>
                        <button className="btn btn-secondary" onClick={() => this.toggleModalTemplate(false, false)}><Close /> Cerrar</button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.modalAlgoritmo} size="lg" >
                    <ModalHeader>
                        <MultilineChart fontSize="large" className="btn-circle bg-warning"/> <b>Algoritmo de Operaciones</b>
                    </ModalHeader>
                    <ModalBody>
                        <div className="row">
                            <div className="col-md-12">
                                {
                                    this.state.alert_algoritmo.show ?
                                        <div className={this.state.alert_algoritmo.tipo} role="alert">
                                            {this.state.alert_algoritmo.mensaje}
                                        </div>
                                    :
                                    null
                                }
                                <table className="table table-sm table-striped">
                                    <thead>
                                        <tr>
                                            <th>Parámetro requerido</th>
                                            <th>Origen del dato</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>[0108] DBTM - Depth Bit (meas)</td>
                                            <td><select className="form-control" id="wd_0108" name="wd_0108" onChange={this.handleChangeAlgoritmo} defaultValue={this.state.algoritmo.wd_0108}><option value="0">Seleccione</option>
                                            {
                                                this.state.optionsDetalle ? 
                                                this.state.optionsDetalle.map( opt => 
                                                    <option key={ opt.value } value={ opt.value}  >{ opt.text }</option>
                                                )
                                                : null
                                            }
                                            </select></td>
                                        </tr>
                                        <tr>
                                            <td>[0110] DMEA - Depth Hole (meas)</td>
                                            <td><select className="form-control" id="wd_0110" name="wd_0110" onChange={this.handleChangeAlgoritmo} defaultValue={this.state.algoritmo.wd_0110}><option value="0">Seleccione</option>
                                            {
                                                this.state.optionsDetalle ? 
                                                this.state.optionsDetalle.map( opt => 
                                                    <option key={ opt.value } value={ opt.value}  >{ opt.text }</option>
                                                )
                                                : null
                                            }
                                            </select></td>
                                        </tr>
                                        <tr>
                                            <td>[0113] ROPA - Rate of Penetration (avg)</td>
                                            <td><select className="form-control" id="wd_0113" name="wd_0113" onChange={this.handleChangeAlgoritmo} defaultValue={this.state.algoritmo.wd_0113}><option value="0">Seleccione</option>
                                            {
                                                this.state.optionsDetalle ? 
                                                this.state.optionsDetalle.map( opt => 
                                                    <option key={ opt.value } value={ opt.value}  >{ opt.text }</option>
                                                )
                                                : null
                                            }
                                            </select></td>
                                        </tr>
                                        <tr>
                                            <td>[0116] WOBA - Weight-on-Bit (surf,avg)</td>
                                            <td><select className="form-control" id="wd_0116" name="wd_0116" onChange={this.handleChangeAlgoritmo} defaultValue={this.state.algoritmo.wd_0116}><option value="0">Seleccione</option>
                                            {
                                                this.state.optionsDetalle ? 
                                                this.state.optionsDetalle.map( opt => 
                                                    <option key={ opt.value } value={ opt.value}  >{ opt.text }</option>
                                                )
                                                : null
                                            }
                                            </select></td>
                                        </tr>
                                        <tr>
                                            <td>[0118] TQA - Rotary Torque (surf,avg)</td>
                                            <td><select className="form-control" id="wd_0118" name="wd_0118" onChange={this.handleChangeAlgoritmo} defaultValue={this.state.algoritmo.wd_0118} ><option value="0">Seleccione</option>
                                            {
                                                this.state.optionsDetalle ? 
                                                this.state.optionsDetalle.map( opt => 
                                                    <option key={ opt.value } value={ opt.value} >{ opt.text }</option>
                                                )
                                                : null
                                            }
                                            </select></td>
                                        </tr>
                                        <tr>
                                            <td>[0120] RPMA - Rotary Speed (surf,avg)</td>
                                            <td><select className="form-control" id="wd_0120" name="wd_0120" onChange={this.handleChangeAlgoritmo} defaultValue={this.state.algoritmo.wd_0120}><option value="0">Seleccione</option>
                                            {
                                                this.state.optionsDetalle ? 
                                                this.state.optionsDetalle.map( opt => 
                                                    <option key={ opt.value } value={ opt.value}  >{ opt.text }</option>
                                                )
                                                : null
                                            }
                                            </select></td>
                                        </tr>                                    
                                        <tr>
                                            <td>[0130] MFIA - Mud Flow In (avg)</td>
                                            <td><select className="form-control" id="wd_0130" name="wd_0130" onChange={this.handleChangeAlgoritmo} defaultValue={this.state.algoritmo.wd_0130} ><option value="0">Seleccione</option>
                                            {
                                                this.state.optionsDetalle ? 
                                                this.state.optionsDetalle.map( opt => 
                                                    <option key={ opt.value } value={ opt.value} >{ opt.text }</option>
                                                )
                                                : null
                                            }
                                            </select></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        {this.state.loadingAlgoritmo ? 
                            <Spinner 
                                color="success" 
                                animation="border"
                                size="md"
                                role="status"
                                aria-hidden="true" 
                            />
                        : null}
                        <button className="btn btn-success" onClick={async () => this.EjecutarAlgoritmo() } ><SlowMotionVideo /> Ejecutar</button>
                        <button className="btn btn-warning" onClick={() => this.LimparAlgoritmo()}><LayersClear /> Limpiar Operaciones</button>
                        <button className="btn btn-secondary" onClick={() => this.toggleModalAlgoritmo(false)}><Close /> Cerrar</button>
                    </ModalFooter>
                </Modal>

            </div>
        )

    }
}
export default Graficador;