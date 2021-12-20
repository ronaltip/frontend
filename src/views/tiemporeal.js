import React, { useState, useEffect } from 'react';
import { ProgressBar } from "react-bootstrap";
import Plot from 'react-plotly.js';
import Plotly from 'plotly.js';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/button.css";
import hexRgb from 'hex-rgb';

import SideBar from '../componentes/sidebar';
import { message } from 'antd';
import {AlgoritmoOperaciones} from '../util/utilities';
import { Modal, ModalBody,  ModalHeader, Spinner } from 'reactstrap';
import OndemandVideoIcon from '@material-ui/icons/OndemandVideo';
import TimerOffIcon from '@material-ui/icons/TimerOff';

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

const TiempoReal = () => {
    const [userStorage, setUserStorage] = useState({});
    const [count, setCount] = useState(0);
    const [ultimaConsulta, setUltimaConsulta] = useState('N/A');

    const [showgrafica, setShowGrafica] = useState(false)
    const [intervalId, setIntervalId] = useState(0);
    const [intervalo,  setIntervalo] = useState(10000);
    const [dataFields, setField] = useState([]);
    const [dataWells,  setWell] = useState([]);
    const [dataTemplates,  setTemplate] = useState([]);
    
    const [dataRegistro,  setRegistro] = useState({
        Inicio: '', Fin: '', Total: '', id: ''
    });
    const [form, setState] = useState ({
        field_id: 0, wells_id: 0, id: 0
    });
    const [formPrev, setPrevState] = useState ({
        field_id: 0, wells_id: 0, id: 0
    });
    const [registroFEL,  setRegistroFEL] = useState({
        id: '', inicio: '', fin: '', paso: '', checked_fel: false
    });

    const [curvasTemplate, setCurvas] = useState([]);

    const [profundidadFinal, setProfundidad] = useState(1000)
    const [layoutGP, setLayoutGP] = useState({
        autosize: true,
        uirevision: 'true',
        margin: { l: 50, r: 40, t: 80, b: 5 }, 
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
            range: [1000, -20],
            title: 'Profundidad [ft]',
            nticks: 10,
            gridcolor: '#eee',
            gridwidth: 1
        },
        font: { family: 'verdana', size: 11, color: 'black'},
        showlegend: false,
        shapes: [],
        datarevision: 1
    })
    const [layoutTH, setLayoutTH] = useState({
        autosize: true,
        uirevision: 'true',
        margin: { l: 40, r: 40, t: 30, b: 40 }, 
        dragmode: 'zoom',
        hovermode: 'x',
        plot_bgcolor: 'white',
        paper_bgcolor: 'white',
        font: { family: 'verdana', size: 11, color: 'black'},
        showlegend: false,
        grid:  { rows: 0, columns: 1, pattern: 'independent', subplots:[]},
        xaxis: { fixedrange: false, showspikes: true, spikemode: 'across', type: 'time', tickformat: '%d %b %Y \n %H:%M:%S ', title: 'Tiempo', nticks: 5  },
        datarevision: 1
    })
    const [layoutTV, setLayoutTV] = useState({
        autosize: true,
        uirevision: 'true',
        margin: { l: 5, r: 0, t: 80, b: 5 },
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
    })
    const [layoutFEL, setLayoutFEL] = useState({
        autosize: true,
        uirevision: 'true',
        margin: { l: 0, r: 40, t: 80, b: 5 },
        dragmode: 'zoom',
        hovermode: 'closest',
        plot_bgcolor: 'white',
        paper_bgcolor: 'white',
        font: { family: 'verdana', size: 11 },
        showlegend: false,
        xaxis: { fixedrange: false, autorange: false, nticks: 1 , titlefont: { size: 10, color: 'brown' }, side: 'top', textposition: 'top center' },
        yaxis: { fixedrange: false, autorange: false, nticks: 15, side: 'right', gridcolor: '#eee', gridwidth: 1 },
        datarevision: 1,
    })

    const [dataGP, setDataGP] = useState([])
    const [dataTH, setDataTH] = useState([])
    const [dataTV, setDataTV] = useState([])
    const [dataFEL, setDataFEL] = useState([])
    const [dataLAS, setDataLAS] = useState([])
    const [dataArchivosCurvas, setDataArchivosCurvas] = useState([])


    const [isLoadedPrincipal,  setIsLoadedGP] = useState(false)
    const [isLoadedHorizontal, setIsLoadedTH] = useState(false)
    const [isLoadedVertical,   setIsLoadedTV] = useState(false)
    const [isLoadedArchivoFEL, setIsLoadedFEL] = useState(null)
    function handleIsFEL(){
        setIsLoadedFEL(true)
    }
    function handleNotFEL(){
        setIsLoadedFEL(false)   
    }

    const [colVertical,   setColVertical] = useState('col-md-9')
    const [colVerticalFEL,   setColVerticalFEL] = useState('col-md-3')

   
    const [isToggled, toggle] = useState(0)
    const [isRunning,  setIsRunning] = useState(false)
    const [toggleAlgoritmo, setToggleAlgoritmo] = useState(false)
    const [ejecutando, setEjecutando] = useState(false)
    const [procesarAlgoritmo, setProcesarAlgoritmo] = useState(false)
    const [_DBTM, setDBTM] = useState(0)

    const [dataConvencion, setDataConvencion] = useState([])
    const [dataWitsDetalle, setDataWitsDetalle] = useState([])

    const [disabled, setDisabled] = useState(false)

    const [show, setShow] = useState(true);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    function getWells(id) {
    
        return new Promise((resolve, reject) =>  {
            axios.get(URL + 'wells/field/' + id).then(response => {
                resolve( response.data )
            }).catch(error => {
                reject (error)
            })
        })            
                   
    } 

    function getRegistro(id) {
        if (id != 0)
        {
            return new Promise((resolve, reject) =>  {
                axios.get(URL + 'datos_wits/registro/wells/' + id).then(response => {
                    resolve( response.data )
                }).catch(error => {
                    reject (error)
                })
            })            
        }
        else
            return {}
    }
    
    function getTemplates(id) {
        if (id != 0)
        {
            return new Promise((resolve, reject) =>  {
                axios.get(URL + 'templates_wells/well/' + id).then(response => {
                    resolve( response.data )
                }).catch(error => {
                    reject (error)
                })
            })            
        }
        else
            return []
    }

    const getFEL = (id, layout_Vertical, numGraVert) => {
        if (id != 0)
        {
            //return new Promise((resolve, reject) =>  {
                axios.get(URL + 'archivo_encabezado_fel/well/' + id).then(response => {
                    
                    const [fel]   = response.data;
            
                    if (fel !== undefined)
                    {
                        if (fel.archivo_imagen_recorte !== null)
                        {
                            let newMax = MaxTrackVertical(-20, profundidadFinal)
                            const imagen = 'data:image/png;base64,' + fel.archivo_imagen_recorte;

                            let layout_fel = {...layoutFEL}
                            layout_fel.xaxis.range = [0, fel.inicio_recorte]
                            layout_fel.xaxis.title = fel.id + '_FEL'
                            layout_fel.yaxis.range = [newMax, -20]
                            layout_fel.images = [
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
                        
                            let _y = []
                            let _x = []

                            for (let i=fel.inicio_recorte; i<= fel.fin_recorte; i = i + fel.paso_recorte)
                            {
                                _y.push(i)
                                _x.push(0)
                            }
                            
                            const serie = {
                                x: _x,
                                y: _y,
                                name: fel.id + '_FEL',
                                type: 'scatter',
                                hovertemplate: '%{y}'
                            }
                            const data = [serie]
                            layout_fel.datarevision++


                            setColVertical( numGraVert === 0 ? '' : 'col-md-9 col-lg-9' )
                            setIsLoadedTV(numGraVert === 0 ? false : true)
                            layout_Vertical.datarevision++
                            setLayoutTV(layout_Vertical)
    
                            handleIsFEL()
                            setColVerticalFEL('col-md-3 col-lg-3')
                            setDataFEL(data)
                            setRegistroFEL({
                                id: fel.id, inicio: fel.inicio_recorte, fin: fel.fin_recorte, paso: fel.paso_recorte, checked_fel: true
                            })
                            sessionStorage.setItem('isLoadedFEL', JSON.stringify(true));

                            setLayoutFEL(layout_fel)

                            setRegistroFEL({
                                id: fel.id,
                                inicio: fel.inicio_recorte,
                                fin: fel.fin_recorte,
                                paso: fel.paso_recorte,
                                checked_fel: true
                            })
                            console.log('Archivo FEL cargado')
                            
                        }
                        else
                        {
                            
                            setColVertical( numGraVert === 0 ? ''  : 'col-md-12 col-lg-12' )
                            setIsLoadedTV( numGraVert === 0 ? false: true )
                            
                            setColVerticalFEL('')
                            setDataFEL([])
                            handleNotFEL()
                            setLayoutFEL({})
                            setRegistroFEL({
                                id: 0, inicio: '', fin: '', paso: '', checked_fel: false
                            })
                            sessionStorage.setItem('isLoadedFEL', JSON.stringify(false));

                            message.info('Aún no se ha recortado el área del archivo FEL')
                        }
                    }
                    else
                    {
                        setColVerticalFEL('')
                        setDataFEL([])
                        handleNotFEL()
                        setLayoutFEL({})
                        sessionStorage.setItem('isLoadedFEL', JSON.stringify(false));

                    }
                    //resolve( response.data )
                }).catch(error => {
                    //reject (error)
                    message.error('Ocurrió un error consultando el archivo FEL, intente nuevamente ')
                    console.log(error)
                })
            //})
        }
    }

    const handleChangeForm = e => {
        const { name, value } = e.target;
        
        if (e.target.name === 'field_id')
        {
            if (e.target.value !== '0')
            {
                getWells(e.target.value).then ( res =>{
                    setWell(res) 
                    setRegistro( {
                        Inicio: null,
                        Fin: null,
                        Total: null,
                        id: null
                    }) 
                    setState(prevState => ({
                        ...prevState,
                        wells_id: 0, 
                        id: 0
                    }));
                    setTemplate([])
                })
                .catch(err => console.log(err.response))
            }
            else
                Reset()
            
        }
        if (e.target.name === 'wells_id')
        {
            if (e.target.value !== '0')
            {
                getTemplates(e.target.value).then ( res => {
                    setTemplate(res)
                })
                .catch(err => console.log(err.response))
                
                getRegistro(e.target.value).then ( res =>{
                    
                    if (res.length > 0)
                    {
                        const [regs] = res
                        setRegistro( {
                            Inicio: regs.Inicio,
                            Fin: regs.Fin,
                            Total: regs.Total,
                            id: regs.id
                        }) 
                    }
                    else
                        setRegistro( {
                            Inicio: '',
                            Fin:    '',
                            Total:  0,
                            id: 0
                        })

                    setState(prevState => ({
                        ...prevState,
                        id: 0
                    }));
                })
                .catch(err => console.log(err))
            }
            else
                Reset()
            
        }

        setPrevState({
            field_id: form.field_id,
            wells_id: form.wells_id,
            id: form.id
        });
        setState(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleChange = (e) => {
        let valor = 1000 * Number(e.target.value)
        setIntervalo(valor)
        
        if (showgrafica && count > 0)
        {
            if (intervalId) {
                clearInterval(intervalId);
                setIntervalId(0);
            }
            
            const newIntervalId = setInterval(() => {
                toggle(prev => prev + 1)
            }, valor );
            setIntervalId(newIntervalId);
        }
    }

    const handleClick = () => {
        
        if (form.id > 0)
        {
            if (intervalId) {
                clearInterval(intervalId)
                setIntervalId(0)
                setCount(0)
                toggle(-1)
                setDisabled(false)
                console.log('DETENIDO')
                return;
            }
            
            if (isToggled === 0)
            {
                getInit()
                console.log('PRIMER CARGUE')
            }
            else
            {
                console.log('RE INICIA')
                setDisabled(true)
                setCount( prev => prev + 1)
                const newIntervalId = setInterval(() => {
                    toggle(prev => prev + 2)
                }, intervalo );
                setIntervalId(newIntervalId);
            }
        }
        else
        {
            message.info("Debe seleccionar un template")
        }
    }

    const Reset = () => {
        setIsLoadedGP(false)
        setIsLoadedTH(false)
        setShowGrafica(false)
        setIsLoadedFEL(false)
        setCount(0)
        toggle(0)
        setRegistro( {
            Inicio: null,
            Fin: null,
            Total: 0,
            id: 0
        })
    }

    const getData = () => {
       
        if (isRunning)
        {
            setCount(prevCount => prevCount + 1)
            setIsRunning(false)
           
            axios.get(URL + `datos_wits/wells/${form.wells_id}/${dataRegistro.id}`).then(response => {
                if (response.status === 200)
                {
                    if (response.data.length > 0 )
                    {
                        let profundidadFinal_temporal = profundidadFinal

                        //Agregar datos en gráfica principal
                        let newData = [...dataGP]
                        let curvasPrincipal  = curvasTemplate.filter(c=>c.mostrar === true && c.grupo === null)
                        curvasPrincipal.forEach( (c) =>  {  
                                        
                            if (c.mostrar)
                            {
                                let index = newData.findIndex((item) => item.name === c.descripcion);      
                                const datos = response.data.map( f => ({ x: f['DATETIME'], y: f['_'+c.codigo]}) );  
                                const x = datos.map(d=>d.x)
                                const y = datos.map(d=>d.y)
                                
                                newData[index].x.push(...x)
                                newData[index].y.push(...y)        
                                
                                let prof = Math.max(...newData[index].y) + 500
                                profundidadFinal_temporal =  (prof > profundidadFinal_temporal) ? prof : profundidadFinal_temporal
                                
                            }
                        })

                        if (procesarAlgoritmo)
                        {
                            // Ejecutar algoritmo
                            let operacion_0  = {x:[], y:[]}, operacion_2  = {x:[], y:[]}, operacion_3  = {x:[], y:[]}, operacion_4  = {x:[], y:[]}, operacion_7  = {x:[], y:[]}, operacion_8 = {x:[], y:[]}, operacion_9 = {x:[], y:[]};
                            let operacion_35 = {x:[], y:[]}, operacion_36 = {x:[], y:[]}, operacion_37 = {x:[], y:[]}, operacion_38 = {x:[], y:[]}, operacion_39 = {x:[], y:[]};
                            let operacion_40 = {x:[], y:[]}, operacion_41 = {x:[], y:[]};

                            let algoritmo = {
                                _0108: 0,
                                _0110: 0,
                                _0113: 0,
                                _0116: 0,
                                _0118: 0,
                                _0120: 0,
                                _0130: 0
                            }
                            
                            let DBTM_0  = 0
                            let DBTM    = _DBTM
                        
                            // Ejecutar y seleccionar la operación
                            response.data.forEach(wits => {
                                algoritmo[0] = ( wits.hasOwnProperty('_0108') ? wits['_0108'] : -999.25 )
                                algoritmo[1] = ( wits.hasOwnProperty('_0110') ? wits['_0110'] : -999.25 )
                                algoritmo[2] = ( wits.hasOwnProperty('_0113') ? wits['_0113'] : -999.25 )
                                algoritmo[3] = ( wits.hasOwnProperty('_0116') ? wits['_0116'] : -999.25 )
                                algoritmo[4] = ( wits.hasOwnProperty('_0118') ? wits['_0118'] : -999.25 )
                                algoritmo[5] = ( wits.hasOwnProperty('_0120') ? wits['_0120'] : -999.25 )
                                algoritmo[6] = ( wits.hasOwnProperty('_0130') ? wits['_0130'] : -999.25 )
                                //AlgoritmoOperaciones(DBTM_0, DMEA, DBTM, RPMA, ROPA, MFIA, TQA, WOBA)
                                let operacion = AlgoritmoOperaciones(DBTM_0, algoritmo[1], algoritmo[0], algoritmo[5], algoritmo[2], algoritmo[6], algoritmo[4], algoritmo[3]).Operacion;
                                DBTM = algoritmo[1]

                                switch (operacion)
                                {
                                    case 0:  operacion_0.x.push(wits.DATETIME); operacion_0.y.push(DBTM); break;
                                    case 2:  operacion_2.x.push(wits.DATETIME); operacion_2.y.push(DBTM); break;
                                    case 3:  operacion_3.x.push(wits.DATETIME); operacion_3.y.push(DBTM); break;
                                    case 4:  operacion_4.x.push(wits.DATETIME); operacion_4.y.push(DBTM); break;
                                    case 7:  operacion_7.x.push(wits.DATETIME); operacion_7.y.push(DBTM); break;
                                    case 8:  operacion_8.x.push(wits.DATETIME); operacion_8.y.push(DBTM); break;
                                    case 9:  operacion_9.x.push(wits.DATETIME); operacion_9.y.push(DBTM); break;
                                    case 35: operacion_35.x.push(wits.DATETIME); operacion_35.y.push(DBTM); break;
                                    case 36: operacion_36.x.push(wits.DATETIME); operacion_36.y.push(DBTM); break;
                                    case 37: operacion_37.x.push(wits.DATETIME); operacion_37.y.push(DBTM); break;
                                    case 38: operacion_38.x.push(wits.DATETIME); operacion_38.y.push(DBTM); break;
                                    case 39: operacion_39.x.push(wits.DATETIME); operacion_39.y.push(DBTM); break;
                                    case 40: operacion_40.x.push(wits.DATETIME); operacion_40.y.push(DBTM); break;
                                    case 41: operacion_41.x.push(wits.DATETIME); operacion_41.y.push(DBTM); break;
                                    default: break;
                                }
                                
                                DBTM_0 = DBTM;
                            });

                            setDBTM( DBTM )
                        
                            newData.push( { x: operacion_0.x,  y: operacion_0.y,   mode: "markers",  type: "scatter", name: dataConvencion.Op_0.nombre , marker : {color: hexRgb(dataConvencion.Op_0.color,  {format: 'css'}) , symbol: '100' }} );
                            newData.push( { x: operacion_2.x,  y: operacion_2.y,   mode: "markers",  type: "scatter", name: dataConvencion.Op_2.nombre , marker : {color: hexRgb(dataConvencion.Op_2.color,  {format: 'css'}) , symbol: '100' }} );
                            newData.push( { x: operacion_3.x,  y: operacion_3.y,   mode: "markers",  type: "scatter", name: dataConvencion.Op_3.nombre , marker : {color: hexRgb(dataConvencion.Op_3.color,  {format: 'css'}) , symbol: '100' }} );
                            newData.push( { x: operacion_4.x,  y: operacion_4.y,   mode: "markers",  type: "scatter", name: dataConvencion.Op_4.nombre , marker : {color: hexRgb(dataConvencion.Op_4.color,  {format: 'css'}) , symbol: '100' }} );
                            newData.push( { x: operacion_7.x,  y: operacion_7.y,   mode: "markers",  type: "scatter", name: dataConvencion.Op_7.nombre , marker : {color: hexRgb(dataConvencion.Op_7.color,  {format: 'css'}) , symbol: '100' }} );
                            newData.push( { x: operacion_8.x,  y: operacion_8.y,   mode: "markers",  type: "scatter", name: dataConvencion.Op_8.nombre , marker : {color: hexRgb(dataConvencion.Op_8.color,  {format: 'css'}) , symbol: '100' }} );
                            newData.push( { x: operacion_9.x,  y: operacion_9.y,   mode: "markers",  type: "scatter", name: dataConvencion.Op_9.nombre , marker : {color: hexRgb(dataConvencion.Op_9.color,  {format: 'css'}) , symbol: '100' }} );
                            newData.push( { x: operacion_35.x, y: operacion_35.y,  mode: "markers",  type: "scatter", name: dataConvencion.Op_35.nombre, marker : {color: hexRgb(dataConvencion.Op_35.color, {format: 'css'}) , symbol: '100' }} );
                            newData.push( { x: operacion_36.x, y: operacion_36.y,  mode: "markers",  type: "scatter", name: dataConvencion.Op_36.nombre, marker : {color: hexRgb(dataConvencion.Op_36.color, {format: 'css'}) , symbol: '100' }} );
                            newData.push( { x: operacion_37.x, y: operacion_37.y,  mode: "markers",  type: "scatter", name: dataConvencion.Op_37.nombre, marker : {color: hexRgb(dataConvencion.Op_37.color, {format: 'css'}) , symbol: '100' }} );
                            newData.push( { x: operacion_38.x, y: operacion_38.y,  mode: "markers",  type: "scatter", name: dataConvencion.Op_38.nombre, marker : {color: hexRgb(dataConvencion.Op_38.color, {format: 'css'}) , symbol: '100' }} );
                            newData.push( { x: operacion_39.x, y: operacion_39.y,  mode: "markers",  type: "scatter", name: dataConvencion.Op_39.nombre, marker : {color: hexRgb(dataConvencion.Op_39.color, {format: 'css'}) , symbol: '100' }} );
                            newData.push( { x: operacion_40.x, y: operacion_40.y,  mode: "markers",  type: "scatter", name: dataConvencion.Op_40.nombre, marker : {color: hexRgb(dataConvencion.Op_40.color, {format: 'css'}) , symbol: '100' }} );
                            newData.push( { x: operacion_41.x, y: operacion_41.y,  mode: "markers",  type: "scatter", name: dataConvencion.Op_41.nombre, marker : {color: hexRgb(dataConvencion.Op_41.color, {format: 'css'}) , symbol: '100' }} );
                            
                        }

                        setDataGP( newData )
                        let layout_Principal = {...layoutGP}
                        layout_Principal.datarevision++
                        layout_Principal.yaxis.range = [profundidadFinal_temporal, -20]
                        setLayoutGP( layout_Principal )
                        setProfundidad ( profundidadFinal_temporal )

                        //Agregar datos en track horizontales
                        let newData_TH = [...dataTH]
                        let layout_Horizontal = {...layoutTH}
                                            
                        let nro_y = 1
                        let yaxis = ''
                        let curvasHorizontales = curvasTemplate.filter(c=>c.mostrar === true && c.grupo !== null).sort(c=>c.grupo)
                        curvasHorizontales.forEach(c => {
                            
                            if (c.mostrar)
                            {
                                let index = newData_TH.findIndex((item) => item.name === c.descripcion); 
                                const datos = response.data.map( f => ({ x: f['DATETIME'], y: f['_'+c.codigo]}) );  
                                const x = datos.map(d=>d.x)
                                const y = datos.map(d=>d.y)
                            
                                newData_TH[index].x.push(...x)
                                newData_TH[index].y.push(...y)
                                
                                yaxis = 'yaxis' + (nro_y === 1 ? '' : nro_y)
                                layout_Horizontal[yaxis].range = [y[0] , y[y.length - 1]]                         

                                nro_y++
                            }
                        
                        })
                        layout_Horizontal.xaxis.range = layout_Principal.xaxis.range
                        
                        layout_Horizontal.datarevision++
                        setDataTH( newData_TH )
                        setLayoutTH( layout_Horizontal )


                        //Actualizar fecha, profundidad, registro
                        const ultimo  = response.data[response.data.length - 1]
                        let fecha = ultimo['DATETIME'].split(' ');
                        let fechaTiempo = fecha[0].split('-');
                        fechaTiempo = fechaTiempo[2] +'/' + fechaTiempo[1] +'/' + fechaTiempo[0] +'/ ' + fecha[1]
                        
                        const registro = {...dataRegistro}
                        const total = Number(registro.Total) + response.data.length 
                        setRegistro({ 
                            Inicio: registro.Inicio,
                            Fin:    fechaTiempo,
                            Total:  total,
                            id:     ultimo['id']
                        })
                    }
                    else
                        message.info("No hay más datos provenientes de telemetría")
                }
                else
                {
                    message.error("Ocurrió un error consultando los datos wits del pozo. Detener e Iniciar nuevamente.")
                    console.log(response.data);
                }
                toggle(prev => prev + 1)

            }).catch(errors => {
                message.error("Ocurrió un error consultando los datos wits del pozo. Detener e Iniciar nuevamente.")
                console.log(errors.message);
            })
        }
        else
            message.info("Consulta y cargue en proceso")
    }

    const ContinuarData = () => {
        setToggleAlgoritmo(false)
        setProcesarAlgoritmo(false)
        const newIntervalId = setInterval(() => {
            toggle(prev => prev + 1)
        }, intervalo );
        setIntervalId(newIntervalId);
    }

    const InitEjecutarAlgoritmo = async () => {
        //Algoritmo de Operaciones
        setEjecutando(true)
        setProcesarAlgoritmo(true)
        await delay(1000);
        let data      = [...dataGP]  
        let datosWits = JSON.parse( sessionStorage.getItem('datosWits') )
        
        let operacion_0  = {x:[], y:[]}, operacion_2  = {x:[], y:[]}, operacion_3  = {x:[], y:[]}, operacion_4  = {x:[], y:[]}, operacion_7  = {x:[], y:[]}, operacion_8 = {x:[], y:[]}, operacion_9 = {x:[], y:[]};
        let operacion_35 = {x:[], y:[]}, operacion_36 = {x:[], y:[]}, operacion_37 = {x:[], y:[]}, operacion_38 = {x:[], y:[]}, operacion_39 = {x:[], y:[]};
        let operacion_40 = {x:[], y:[]}, operacion_41 = {x:[], y:[]};

        let algoritmo = {
            _0108: 0,
            _0110: 0,
            _0113: 0,
            _0116: 0,
            _0118: 0,
            _0120: 0,
            _0130: 0
        }
        
        let DBTM_0  = 0
        let DBTM    = 0
       
        // Ejecutar y seleccionar la operación
        datosWits.forEach(wits => {
            algoritmo[0] = ( wits.hasOwnProperty('_0108') ? wits['_0108'] : 0 )
            algoritmo[1] = ( wits.hasOwnProperty('_0110') ? wits['_0110'] : 0 )
            algoritmo[2] = ( wits.hasOwnProperty('_0113') ? wits['_0113'] : 0 )
            algoritmo[3] = ( wits.hasOwnProperty('_0116') ? wits['_0116'] : 0 )
            algoritmo[4] = ( wits.hasOwnProperty('_0118') ? wits['_0118'] : 0 )
            algoritmo[5] = ( wits.hasOwnProperty('_0120') ? wits['_0120'] : 0 )
            algoritmo[6] = ( wits.hasOwnProperty('_0130') ? wits['_0130'] : 0 )
            //AlgoritmoOperaciones(DBTM_0, DMEA, DBTM, RPMA, ROPA, MFIA, TQA, WOBA)
            let operacion = AlgoritmoOperaciones(DBTM_0, algoritmo[1], algoritmo[0], algoritmo[5], algoritmo[2], algoritmo[6], algoritmo[4], algoritmo[3]).Operacion;
            DBTM = algoritmo[1]

            switch (operacion)
            {
                case 0:  operacion_0.x.push(wits.DATETIME); operacion_0.y.push(DBTM); break;
                case 2:  operacion_2.x.push(wits.DATETIME); operacion_2.y.push(DBTM); break;
                case 3:  operacion_3.x.push(wits.DATETIME); operacion_3.y.push(DBTM); break;
                case 4:  operacion_4.x.push(wits.DATETIME); operacion_4.y.push(DBTM); break;
                case 7:  operacion_7.x.push(wits.DATETIME); operacion_7.y.push(DBTM); break;
                case 8:  operacion_8.x.push(wits.DATETIME); operacion_8.y.push(DBTM); break;
                case 9:  operacion_9.x.push(wits.DATETIME); operacion_9.y.push(DBTM); break;
                case 35: operacion_35.x.push(wits.DATETIME); operacion_35.y.push(DBTM); break;
                case 36: operacion_36.x.push(wits.DATETIME); operacion_36.y.push(DBTM); break;
                case 37: operacion_37.x.push(wits.DATETIME); operacion_37.y.push(DBTM); break;
                case 38: operacion_38.x.push(wits.DATETIME); operacion_38.y.push(DBTM); break;
                case 39: operacion_39.x.push(wits.DATETIME); operacion_39.y.push(DBTM); break;
                case 40: operacion_40.x.push(wits.DATETIME); operacion_40.y.push(DBTM); break;
                case 41: operacion_41.x.push(wits.DATETIME); operacion_41.y.push(DBTM); break;
                default: break;
            }
            
            DBTM_0 = DBTM;
        });

        setDBTM(DBTM)
        
        data.push( { x: operacion_0.x,  y: operacion_0.y,   mode: "markers",  type: "scatter", name: dataConvencion.Op_0.nombre , marker : {color: hexRgb(dataConvencion.Op_0.color,  {format: 'css'}) , symbol: '100' }} );
        data.push( { x: operacion_2.x,  y: operacion_2.y,   mode: "markers",  type: "scatter", name: dataConvencion.Op_2.nombre , marker : {color: hexRgb(dataConvencion.Op_2.color,  {format: 'css'}) , symbol: '100' }} );
        data.push( { x: operacion_3.x,  y: operacion_3.y,   mode: "markers",  type: "scatter", name: dataConvencion.Op_3.nombre , marker : {color: hexRgb(dataConvencion.Op_3.color,  {format: 'css'}) , symbol: '100' }} );
        data.push( { x: operacion_4.x,  y: operacion_4.y,   mode: "markers",  type: "scatter", name: dataConvencion.Op_4.nombre , marker : {color: hexRgb(dataConvencion.Op_4.color,  {format: 'css'}) , symbol: '100' }} );
        data.push( { x: operacion_7.x,  y: operacion_7.y,   mode: "markers",  type: "scatter", name: dataConvencion.Op_7.nombre , marker : {color: hexRgb(dataConvencion.Op_7.color,  {format: 'css'}) , symbol: '100' }} );
        data.push( { x: operacion_8.x,  y: operacion_8.y,   mode: "markers",  type: "scatter", name: dataConvencion.Op_8.nombre , marker : {color: hexRgb(dataConvencion.Op_8.color,  {format: 'css'}) , symbol: '100' }} );
        data.push( { x: operacion_9.x,  y: operacion_9.y,   mode: "markers",  type: "scatter", name: dataConvencion.Op_9.nombre , marker : {color: hexRgb(dataConvencion.Op_9.color,  {format: 'css'}) , symbol: '100' }} );
        data.push( { x: operacion_35.x, y: operacion_35.y,  mode: "markers",  type: "scatter", name: dataConvencion.Op_35.nombre, marker : {color: hexRgb(dataConvencion.Op_35.color, {format: 'css'}) , symbol: '100' }} );
        data.push( { x: operacion_36.x, y: operacion_36.y,  mode: "markers",  type: "scatter", name: dataConvencion.Op_36.nombre, marker : {color: hexRgb(dataConvencion.Op_36.color, {format: 'css'}) , symbol: '100' }} );
        data.push( { x: operacion_37.x, y: operacion_37.y,  mode: "markers",  type: "scatter", name: dataConvencion.Op_37.nombre, marker : {color: hexRgb(dataConvencion.Op_37.color, {format: 'css'}) , symbol: '100' }} );
        data.push( { x: operacion_38.x, y: operacion_38.y,  mode: "markers",  type: "scatter", name: dataConvencion.Op_38.nombre, marker : {color: hexRgb(dataConvencion.Op_38.color, {format: 'css'}) , symbol: '100' }} );
        data.push( { x: operacion_39.x, y: operacion_39.y,  mode: "markers",  type: "scatter", name: dataConvencion.Op_39.nombre, marker : {color: hexRgb(dataConvencion.Op_39.color, {format: 'css'}) , symbol: '100' }} );
        data.push( { x: operacion_40.x, y: operacion_40.y,  mode: "markers",  type: "scatter", name: dataConvencion.Op_40.nombre, marker : {color: hexRgb(dataConvencion.Op_40.color, {format: 'css'}) , symbol: '100' }} );
        data.push( { x: operacion_41.x, y: operacion_41.y,  mode: "markers",  type: "scatter", name: dataConvencion.Op_41.nombre, marker : {color: hexRgb(dataConvencion.Op_41.color, {format: 'css'}) , symbol: '100' }} );
        
        await delay(1000);
        setDataGP( data )
        
        let layout_Principal = {...layoutGP}
        layout_Principal.datarevision++
        setLayoutGP( layout_Principal )
        
        setEjecutando(false)
        setToggleAlgoritmo(false)

        const newIntervalId = setInterval(() => {
            toggle(prev => prev + 1)
        }, intervalo );
        setIntervalId(newIntervalId);
    }

    const GetDetalle = (codigo) => {
        const curva = dataWitsDetalle.filter( f => f.codigo === codigo)
        return curva
    }
    const getArchivos = (id) => {
        return new Promise((resolve, reject) =>  {

            setDataLAS([])

            axios.get(URL + 'archivo_encabezado/well/' + id).then(response => {
                const data   = response.data;
                const archivos_caving = data.filter(tipo => tipo.tipo_archivo_id === 2)
                const archivos_las    = data.filter(tipo => tipo.tipo_archivo_id === 3)

                //Para cada archivo
                // Para cada curva homologada
                // Crear el check 
                let dataArchivos = []
                archivos_las.forEach( row => {
                    //row.homologacion = JSON.parse(row.homologacion)
                    row.homologacion.forEach( h => {
                        const [curva] = GetDetalle(h.codigo)
                        h.descripcion = curva.descripcion
                        h.short_mnemonico = curva.short_mnemonico
                    })
   
                    dataArchivos.push( { id: row.id, datos: row.datos } );
                    
                })
                console.log('Archivos LAS cargados')
                setDataArchivosCurvas( dataArchivos )
                setDataLAS( archivos_las );
                
                resolve({ dataLas: archivos_las, dataArchivos: dataArchivos})
            }).catch(error => {
                console.log(error.message);
                reject(error)
            })
        }) 
    }
    
    const MaxTrackVertical = (P1Y1, P2Y1) => {
        let P1X1 = 0;
        let P2X1 = 51.7;
    
        let punto = 99.5;
    
        let pendiente = (P2Y1 - P1Y1) / (P2X1 - P1X1);
        let corte = P1Y1 - pendiente * P1X1;
    
        let newMax = pendiente * punto + corte;
        return newMax;
    };
   
    const getInit = () => {
     
        setCount(prevCount => prevCount + 1)
        setUltimaConsulta(now())
        setDisabled(true)
        const requestTemplatesWells         = axios.get(URL + "templates_wells/" + form.id);
        const requestTemplatesWellTipoCurva = axios.get(URL + "templates_wells_wits_detalle_secciones/template_well/" + form.id);


        //Obtener template y sus curvas
        axios.all([requestTemplatesWells, requestTemplatesWellTipoCurva]).then(axios.spread((...response) => {
            const [template] = response[0].data;
            const curvas     = response[1].data;
            setCurvas(curvas)


            getArchivos(template.wells_id).then( result => {
                    let datoslas = result.dataLas
                    let dataArchivosCurvas = result.dataArchivos

                    axios.get(URL + `datos_wits/wells/${template.wells_id}/0`).then(response => {
                        if (response.status === 200)
                        {
                        
                            sessionStorage.setItem('datosWits',    JSON.stringify(response.data) )
                            let layout_Principal = {...layoutGP}
                            let profundidadFinal_temporal = 1000
                            let data = []
                            let curvasPrincipal  = curvas.filter(c=>c.mostrar === true && c.grupo === null)
                            curvasPrincipal.forEach( (c) => {                      
                                if (c.mostrar)
                                {
                                    const datos = response.data.map( f => ({ x: f['DATETIME'], y: f['_'+c.codigo]}) );  
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
                                }
                            })
                                                
                        
                            let layout_Horizontal = {...layoutTH}
                            layout_Horizontal.grid.subplots = []
                            let data_TracksHorizontal = []
                            let i = 1
                            let j = 0
                            let grupo_anterior = 0  
                            let curvasHorizontales = curvas.filter(c=>c.mostrar === true && c.grupo !== null).sort(c=>c.grupo)
                            curvasHorizontales.map(c => {
                                
                                if (c.mostrar)
                                {
                                    const datos = response.data.map( f => ({ x: f['DATETIME'], y: f['_'+c.codigo]}) );  
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
                                    data_TracksHorizontal.push(traza);
                                }
                            
                            })
                            layout_Horizontal.grid.rows = j 
                            layout_Horizontal.datarevision++
                            

                            //Para DBTM o DMEA de un LAS en tiempo Homologado                       
                            profundidadFinal_temporal = layout_Principal.yaxis.range ? layout_Principal.yaxis.range[0] : 1000
                            
                            datoslas.forEach ( ar => {
                                
                                if (ar.es_tiempo === true)
                                {
                                    ar.homologacion.forEach( hm => {
                                        if (hm.mostrar)
                                        {
                                                
                                            const [curvas] = dataArchivosCurvas.filter( c => c.id === ar.id ).map( d => ({ datos: d.datos }))
                                            const datos    = curvas.datos.map( f => ({ x: f['DATETIME'], y: f['_'+hm.codigo]}) )
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
                                                    layout_Principal.yaxis.range = [profundidadFinal_temporal, -20]
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
                                                    data_TracksHorizontal.push(traza);
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
                                                }
                                            }
                                        }
                                    })
                                }
                            })

                            layout_Horizontal.grid.rows = j 
                            
                            setDataTH( data_TracksHorizontal )
                            setLayoutTH( layout_Horizontal )
                            setIsLoadedTH ( data_TracksHorizontal.length > 0 ? true : false )

                            setDataGP( data )
                            layout_Principal.datarevision++
                            layout_Principal.yaxis.range = [profundidadFinal_temporal, -20]

                            setLayoutGP( layout_Principal )
                            setProfundidad( profundidadFinal_temporal )
                            console.log('SetSerieTrackHorizontal')
                            //

                            // Track Vertical
                            let newMax = MaxTrackVertical(-20, profundidadFinal)
                            let layout_Vertical = {...layoutTV}
                    
                            let subplots = [];
                            layout_Vertical.grid.subplots = []
                            layout_Vertical.yaxis.range = [newMax, -20]
                            let datosGraficasVerticales = []
                            
                            i = 1
                        
                            datoslas.forEach ( ar => {
                                if (ar.es_tiempo === false)
                                {
                                    ar.homologacion.forEach( hm => {
                                        if (hm.mostrar)
                                        {
                                            const [curvas] = dataArchivosCurvas.filter( c => c.id === ar.id ).map( d => ({ datos: d.datos }))
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
                        
                                            datosGraficasVerticales.push(traza);
                                        }
                                    })
                                    layout_Vertical.grid.columns = subplots.length
                                    layout_Vertical.grid.subplots.push(subplots);
                                }
                            })
                    
                            layout_Vertical.datarevision++
                            setDataTV(datosGraficasVerticales)
                            //setLayoutTV(layout_Vertical)
                        
                            getFEL(template.wells_id, layout_Vertical, datosGraficasVerticales.length)

                            console.log('SetSerieTrackVertical')
                            //

                            const ultimo  = response.data[response.data.length - 1]
                            const registro  = {...dataRegistro}
                                            
                            setRegistro({
                                Inicio: registro.Inicio,
                                Fin:    registro.Fin,
                                Total:  registro.Total,
                                id:     ultimo !== undefined ? ultimo['id'] : 0
                            })

                            setIsLoadedGP(true)
                            setIsLoadedTH(true)
                            setShowGrafica(true)
                            handleClose(false)

                            if (data.length > 0)
                                setToggleAlgoritmo(true)
                            else
                            {
                                ContinuarData()
                            }
                            
                            message.success('Cargue inicial de datos finalizado')
                        }
                        else
                        {
                            message.error("Ocurrió un error consultando los datos wits del pozo. Detener e Iniciar nuevamente.")
                            console.log( response.data );
                        }
                    }).catch(errors => {
                        message.error("Ocurrió un error consultando los datos wits del pozo. Detener e Iniciar nuevamente.")
                        console.log(errors.message);
                        setDisabled(false)
                    })
                
            }).catch(err => {
                message.error('Ocurrió un error consultando los archivos LAS, recargue la página por favor')
                console.log(err)
            })

            


        })).catch(error => {
            message.error("Ocurrió un error consultando el template del pozo. Detener e Iniciar nuevamente.")
            console.log(error.message);
            setDisabled(false)
        })     
    } 

    const PlotOnHover = (e) => {
                 
        var points = e.points[0], pointNum = points.pointNumber;
        if (isLoadedHorizontal)
        {   
           
            let nt_h = dataTH.length;           
            let curves_h = []
            let coords_h = []

            for(let i=0; i<nt_h; i++) {
                curves_h.push({curveNumber: i, pointNumber: pointNum}) 
                coords_h.push('xy' + ((i>0)? String(i+1) : ''))            
            }
            Plotly.Fx.hover('plotTracksHorizontal', curves_h, coords_h);
        }

        if (isLoadedVertical)
        {
            let nt_v = dataTV.length;
            let coords_v = []
            let curves_v = []
            for(let i=0; i<nt_v; i++) {
                curves_v.push({curveNumber: i, yval: e.yvals[0]})
                coords_v.push('x' + ((i>0)? String(i+1) : '') + 'y')
            }
            Plotly.Fx.hover('plotTracksVertical', curves_v, coords_v);
        }
        
        let isFEL = JSON.parse(sessionStorage.getItem('isLoadedFEL'))

        if (isFEL)
        {   
            let nt_f = 1;
            let coords_f = []
            let curves_f = []
            for(let i=0; i<nt_f; i++) {
                curves_f.push({curveNumber: i, yval: e.yvals[0]})
                coords_f.push('x' + ((i>0)? String(i+1) : '') + 'y')
            }
            Plotly.Fx.hover('plotFel', curves_f, coords_f);
        }
        
    }
    const PlotOnUnHover = () => {
        if (isLoadedHorizontal)
            Plotly.Fx.unhover('plotTracksHorizontal')
        if (isLoadedVertical)
            Plotly.Fx.unhover('plotTracksVertical')
        let isFEL = JSON.parse(sessionStorage.getItem('isLoadedFEL'))
        if (isFEL)
            Plotly.Fx.unhover('plotFel')
    }
  
    useEffect(() => {

        if (isToggled > 0)
        {
            setUltimaConsulta(now())
            setIsRunning(true)
            getData()
        }
        else
            message.info("Proceso de consulta automático detenido")

    },[isToggled]);

    useEffect(() => {
        setUserStorage(JSON.parse(sessionStorage.getItem('user')))
        setDataConvencion(JSON.parse(sessionStorage.getItem('dataConvencion')))
        setDataWitsDetalle(JSON.parse(sessionStorage.getItem('dataWitsDetalle')))

        handleNotFEL()

        axios.get(URL + 'fields').then(response => {
            if (response.status === 200)
                setField(  response.data );
            else
            {
                console.log(response.error)
                message.error('Ocurrió un error cargando los campos, intente nuevamente')   
            }            
        }).catch(error => {
            message.error('Ocurrió un error cargando los campos, intente nuevamente')   
            console.log(error.message);
        })
        
    },[]);

    const now = () => {
        let ahora = new Date().toLocaleTimeString('es-CO');
        return ahora;
    }

    const delay = ms => new Promise(res => setTimeout(res, ms));

    return (
      
        <div className="App">
            <SideBar pageWrapId={"page-wrap"} outerContainerId={"App"} />
            <div className="container-fluid ">
                
                <div className="row border-bottom bg-verdeoscuro">
                    <div className="col-md-2 col-lg-2 small text-left mt-2">
                        <ProgressBar animated now={intervalId ? 100: 0} />
                    </div>
                    <div className="col-md-2 col-lg-2 text-left  mt-1">
                        <small><div>Última consulta:</div><div> {ultimaConsulta} </div></small>
                    </div>
                    <div className="col-md-2 col-lg-2 text-left  mt-1">
                        <small><div>Inicio:</div><div>{dataRegistro.Inicio}</div></small>
                    </div>
                    <div className="col-md-2 col-lg-2 text-left  mt-1">
                        <small><div>Fin:</div><div>{dataRegistro.Fin}</div></small>
                    </div>
                    <div className="col-md-2 col-lg-2 text-left  mt-1">
                        <small><div>Total registros:</div><div>{dataRegistro.Total}</div></small> 
                    </div>
                    <div className="col-md-1 col-lg-1 text-left  mt-1 mb-1 ">
                        {
                            show ?
                            <button onClick={handleClose} className="btn btn-sm btn-circle btn-danger"> <TimerOffIcon fontSize="small" /> </button>
                            :
                            <button onClick={handleShow} className="btn btn-sm btn-circle btn-success"> <OndemandVideoIcon fontSize="small" /> </button>
                        }
                    </div>
                    <div className="col-md-1 col-lg-1 text-right  mt-1">
                        <small> {userStorage.nombre_usuario_sesion} </small>
                    </div>
                </div>

                <div className="row">
                    
                    <div className="col-md-12 col-lg-12 col-xl-12">
                        { showgrafica ? 
                                                 
                                
                                <div className="row" >
                                    <div id="divPrincipal" className="col-md-8">
                                        {
                                            
                                            <div id="divGraficaPrincipal" className="row">
                                                <div className="col-md-12 col-lg-12">
                                                    {
                                                        isLoadedPrincipal ? 
                                                        <Plot
                                                            divId="plotDept"
                                                            data={dataGP}
                                                            layout={layoutGP}
                                                            config={config_general}
                                                            useResizeHandler={true}
                                                            style={{width:"100%", height:"55vh"}}
                                                            onHover={(e) => PlotOnHover(e)}
                                                            onUnhover={(e) => PlotOnUnHover(e)}
                                                        />
                                                        :
                                                        null
                                                    }
                                                </div>
                                            </div>
                                            
                                        }

                                        {
                                            
                                            <div id="divTrackHorizontal" className="row">
                                                <div className="col-md-12 col-lg-12">
                                                    <Plot
                                                        divId="plotTracksHorizontal"
                                                        data={dataTH}
                                                        layout={layoutTH}
                                                        config={config_general}
                                                        useResizeHandler={true}
                                                        style={{width:"100%", height:"40vh"}}
                                                    />
                                                </div>
                                            </div>
                                            
                                        }
                                    </div>
                                    
                                    
                                    <div id="divTrackVertical" className="col-md-4">
                                        <div className="row">
                                            { isLoadedVertical ?
                                            <div className={colVertical}>
                                                <Plot
                                                    divId="plotTracksVertical"
                                                    style={{width:"100%", height:"95vh"}}
                                                    data={dataTV}
                                                    layout={layoutTV}
                                                    config={config_general}
                                                    useResizeHandler={true}
                                                />
                                            </div>
                                            : null }
                                            { isLoadedArchivoFEL ?
                                            <div className={colVerticalFEL}>
                                                <Plot
                                                    divId="plotFel"
                                                    style={{width:"100%", height:"95vh"}}
                                                    data={dataFEL}
                                                    layout={layoutFEL}
                                                    config={null}
                                                    useResizeHandler={true}
                                                />
                                            </div>
                                            : null}
                                        </div>           
                                    </div>
                                   
                                </div>
                            
                        
                        :
                        null
                        }
                    </div>
                </div>
            </div>

            <Modal isOpen={toggleAlgoritmo} aria-labelledby="contained-modal-title-vcenter" centered>
                <ModalHeader>
                    <div id="contained-modal-title-vcenter" className="col-12 text-center">
                        Desea ejecutar el Algoritmo de Operaciones ?
                    </div>
                </ModalHeader>
                <ModalBody>
                    { !ejecutando ?
                        <div className="row ">
                            <div className="col-md-6">
                                <button className="btn btn-success btn-block" onClick={() => InitEjecutarAlgoritmo()}>Si</button>
                            </div>
                            <div className="col-md-6">
                                <button className="btn btn-secondary btn-block" onClick={() => ContinuarData()}> No</button>
                            </div>
                        </div>
                    :
                        <div className="row ">
                            <div className="col-md-12 text-center">
                                <Spinner 
                                    color="success" 
                                    animation="border"
                                    size="md"
                                    role="status"
                                    aria-hidden="true" 
                                />
                            </div>
                        </div>
                    }
                </ModalBody>
            </Modal>

            <Modal isOpen={show} aria-labelledby="contained-modal-title-vcenter" centered>
                <ModalBody>
                    <div className="card mt-2" >
                        <div className="card-body">

                            <div className="form-group">
                                <div className="row">
                                    <div className="col-md-6">
                                        <label><b>Campo: </b></label>
                                        <select name="field_id" id="field_id" className="form-control form-control-sm" disabled={disabled ? 'disabled': null} onChange={handleChangeForm} defaultValue={form ? form.field_id : 0}>
                                            <option key="0" value="0">Seleccionar</option>
                                            {
                                            dataFields.length > 0 ?
                                            dataFields.map(elemento => (<option key={elemento.id} value={elemento.id}>{elemento.nombre}</option>))
                                            :null
                                            }
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                         <label><b>Pozo: </b></label>
                                        <select name="wells_id" id="wells_id" className="form-control form-control-sm" disabled={disabled ? 'disabled': null} onChange={handleChangeForm} defaultValue={form ? form.wells_id : 0}>
                                            <option key="0" value="0">Seleccionar</option>
                                            {
                                                dataWells.length > 0 ?
                                                dataWells.map(elemento => (<option key={elemento.id} value={elemento.id}>{elemento.nombre}</option>))
                                                :null
                                            }
                                        </select>   
                                    </div>
                                </div>
                            </div>

                            <hr/>
                            
                            <div className="form-group">
                                <label>Primera Fecha</label>
                                <input type="text" className="form-control form-control-sm" readOnly={true} defaultValue={dataRegistro.Inicio} />
                            </div>
                            <div className="form-group">
                                <label>Última Fecha</label>
                                <input type="text" className="form-control form-control-sm" readOnly={true} defaultValue={dataRegistro.Fin} />
                            </div> 
                            <div className="form-group">
                                <label>Total registros</label>
                                <input type="text" className="form-control form-control-sm" readOnly={true} defaultValue={dataRegistro.Total} />
                            </div>
                            
                            <hr/>
                            
                            <div className="form-group">
                                <label><b>Template: </b></label>
                                <select name="id" id="id" className="form-control form-control-sm" disabled={disabled ? 'disabled': null} onChange={handleChangeForm} defaultValue={form ? form.id : 0}>
                                    <option key="0" value="0">Seleccionar</option>
                                    {
                                        dataTemplates.length > 0 ?
                                        dataTemplates.map(elemento => (<option key={elemento.id} value={elemento.id}>{elemento.nombre}</option>))
                                        :null
                                    }
                                </select>
                            </div>
                            
                        </div>
                        <div className="card-footer">
                            <div className="row">
                                <div className="col-sm-7">
                                    <label className="small">Intervalo de consulta [Sg]</label>
                                    <select className="form-control form-control-sm" onChange={handleChange}>
                                        <option value="10">10</option>
                                        <option value="20">20</option>
                                        <option value="30">30</option>
                                        <option value="60">60</option>
                                    </select>
                                </div>
                                <div className="col-sm-5 mt-3">
                                    <button className={count === 0 ? "btn btn-sm btn-success btn-block" : (count === 1) ? "btn btn-sm btn-info btn-block": "btn btn-sm btn-danger btn-block"} onClick={handleClick}> {count === 0 ? "Iniciar" : (count === 1) ? "Cargando": "Detener"}</button>
                                    <button className="btn btn-sm btn-secondary btn-block" onClick={handleClose} >Ocultar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        </div>
    );
};

export default TiempoReal;