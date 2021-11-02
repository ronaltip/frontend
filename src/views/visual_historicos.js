import React, { Component, forwardRef } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import SideBar from '../componentes/sidebar';
import Cabecera from '../componentes/cabecera';
import '../css/styles.css';

import Plotly from 'plotly.js';

const URL = process.env.REACT_APP_API_HOST;

// const url = "http://localhost:9000/datos_salida";
// const urlAuxiliar = "http://localhost:9000/wells";
// const urlAuxilir1 = 'http://localhost:9000/eventos';

let id = 6801;

var matriz = [{ clave: '', valor: '' }];
var matriz_variable = [];
var matriz_valor = [];

var datosregistro2 = [];
var datosregistro = [];
var campo = [];
var fila = [];
//variables temporales para almacenar los datos que vienen de la base de datos
var datosGraficaPrincipal_Aux = '';
var datosgrafVertical_DMEA_Aux = '';
var datosgrafVertical_MFIA_Aux = '';
var datosgrafVertical_RPM_Aux = '';
var datosgrafVertical_TQA_Aux = '';
var datosgrafVertical_DBTM_Aux = '';

var datosgrafHorizont_DMEA_Aux = '';
var datosgrafHorizont_MFIA_Aux = '';
var datosgrafHorizont_RPM_Aux = '';
var datosgrafHorizont_TQA_Aux = '';
var datosgrafHorizont_DBTM_Aux = '';

var datosGraficaPrincipal_Aux2 = '';

var datosfecIni_Eve_Aux = '';
var datosfecFin_Eve_Aux = '';
var datosproIni_Eve_Aux = '';
var datosproFin_Eve_Aux = '';
var datosdescrp_Eve_Aux = '';
var ejex = '';

var color = new Array(30);
var simbolo = new Array(30);

color = [
  'blue',
  'green',
  'orange',
  'yellow',
  'black',
  'red',
  'cyan',
  'gray',
  'pink',
  'violet',
  'yellowgreen',
  'greenyellow',
  'olive',
  'skyblue',
  'brown',
  'chocolate',
  'navy',
  'aquamarine',
  'lime',
  'indigo',
  'lightgray',
];
simbolo = [
  'circle',
  'square',
  'diamond',
  'cross',
  'x',
  'triangle-up',
  'triangle-down',
  'start',
  'octagon',
  'hexagon',
];

class viewVisualHistorico extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      items: [],
      dataWells: [],
      dataEventos: [],
      datosParaGraficaPrincipal: '',
      datosgrafVertical_DMEA: '',
      datosgrafVertical_MFIA: '',
      datosgrafVertical_RPM: '',
      datosgrafVertical_TQA: '',
      datosgrafVertical_DBTM: '',
      datosGraficaEventos_Auxiliar: '',
      datosgrafHorizont_DMEA: '',
      datosgrafHorizont_MFIA: '',
      datosgrafHorizont_RPM: '',
      datosgrafHorizont_TQA: '',
      datosgrafHorizont_DBTM: '',
      wells_id: '',
    };
  }

  cambioNombre = campo => {
    var respuesta = campo;
    switch (campo) {
      case 'operacion_0':
        respuesta = 'Undef status';
        break;
      case 'operacion_2':
        respuesta = 'Drilling';
        break;
      case 'operacion_3':
        respuesta = 'Connection';
        break;
      case 'operacion_4':
        respuesta = 'Reaming';
        break;
      case 'operacion_7':
        respuesta = 'Circulating';
        break;
      case 'operacion_8':
        respuesta = 'RIH';
        break;
      case 'operacion_9':
        respuesta = 'POOH';
        break;
      case 'operacion_35':
        respuesta = 'OnSurface';
        break;
      case 'operacion_36':
        respuesta = 'Sliding';
        break;
      case 'operacion_37':
        respuesta = 'POOHW/Pump';
        break;
      case 'operacion_38':
        respuesta = 'RIHW/Pump';
        break;
      case 'operacion_39':
        respuesta = 'BackReaming';
        break;
      case 'operacion_40':
        respuesta = 'Working Pipe';
        break;
      case 'operacion_41':
        respuesta = 'Unregister';
        break;
    }
    return respuesta;
  };

  peticionWellsGet = () => {
    axios
      .get(URL + 'wells?g')
      .then(response => {
        this.setState({ dataWells: response.data });
      })
      .catch(error => {
        console.log(error.message);
      });
  };

  peticionGet(idinicial) {
    fetch(URL + 'datos_salida?id=' + idinicial)
      .then(res => res.json())
      .then(
        result => {
          this.setState({
            isLoaded: true,
            items: result,
          });
          datosregistro = result;

          //  Se crea una matriz general que agrega todos los valores encontrados de cada una de las curvas
          for (let k = 0; k < datosregistro.length; k++) {
            fila = datosregistro[k].salida.split('",');

            datosGraficaPrincipal_Aux = '';
            datosgrafVertical_DMEA_Aux = '';
            datosgrafVertical_MFIA_Aux = '';
            datosgrafVertical_RPM_Aux = '';
            datosgrafVertical_TQA_Aux = '';
            datosgrafVertical_DBTM_Aux = '';
            datosgrafHorizont_DMEA_Aux = '';
            datosgrafHorizont_MFIA_Aux = '';
            datosgrafHorizont_RPM_Aux = '';
            datosgrafHorizont_TQA_Aux = '';
            datosgrafHorizont_DBTM_Aux = '';
            ejex = '';
            matriz_variable[0] = 'primero';

            for (let j = 0; j < fila.length; j++) {
              campo = fila[j].split('="');

              const found = matriz_variable.indexOf(campo[0]);

              if (found === -1) {
                matriz_variable.push(campo[0]);
                matriz.push({ clave: campo[0], valor: campo[1] });
              } else {
                var formateo = campo[1];
                var formateo = formateo.replace('"', '');
                var formateo = formateo.replace('"', '');
                matriz[found].valor = matriz[found].valor + ',' + formateo;
              }
            }
          }

          var IndexDateTime = matriz_variable.indexOf('DATETIME');
          var datosDateTime = matriz[IndexDateTime].valor;

          var IndexProfundidad = matriz_variable.indexOf('puntero_vertical');
          // var datosProfundidad = matriz[IndexProfundidad].valor;
          // datosProfundidad = datosProfundidad.valueOf();

          for (let j = 1; j < matriz.length; j++) {
            if (
              matriz[j].clave === 'idWell' ||
              matriz[j].clave === 'idWellbore' ||
              matriz[j].clave === 'idLogCurve' ||
              matriz[j].clave === 'DATETIME'
            ) {
            } else if (
              matriz[j].clave === 'DMEA' ||
              matriz[j].clave === 'MFIA' ||
              matriz[j].clave === 'RPM' ||
              matriz[j].clave === 'TQA' ||
              matriz[j].clave === 'DBTM' ||
              matriz[j].clave === 'puntero_vertical'
            ) {
              console.log(matriz[j].clave);
              switch (matriz[j].clave) {
                case 'DBTM':
                  // Aqui se arma la trama de la grafica Horizontal (tiempo)-------------------
                  datosgrafHorizont_DBTM_Aux =
                    '{ x: [' +
                    datosDateTime +
                    '],  y: [' +
                    matriz[j].valor.replace('"', '') +
                    '], mode:"lines+markers", type:"scatter", name:"' +
                    matriz[j].clave.replace('_', ' ') +
                    '", text:"' +
                    matriz[j].clave.replace('_', ' ') +
                    '", xaxis: "x", yaxis: "y" },';

                  // Aqui se arma la trama de la grafica Vertical (Profundidad)------------
                  //   datosgrafVertical_DBTM_Aux = '{ x: [' + matriz[j].valor.replace('"', '') + '], y: [' + datosProfundidad + '], mode: "lines+markers",  type: "scatter",  name: "' + matriz[j].clave.replace('_', ' ') + '",  text: "' + matriz[j].clave.replace('_', ' ') + '",  xaxis: "x", yaxis: "y"}';

                  // Aqui se arma la trama de la grafica principal--------------------
                  datosGraficaPrincipal_Aux =
                    datosGraficaPrincipal_Aux +
                    '{ x: [' +
                    datosDateTime +
                    '],  y: [' +
                    matriz[j].valor.replace('"', '') +
                    '], mode: "lines+markers",  type: "scatter",  name: "' +
                    matriz[j].clave.replace('_', ' ') +
                    '" },';
                  break;

                case 'DMEA':
                  // Aqui se arma la trama de la grafica Horizontal (tiempo)-------------------
                  datosgrafHorizont_DMEA_Aux =
                    '{ x: [' +
                    datosDateTime +
                    '], y: [' +
                    matriz[j].valor.replace('"', '') +
                    '], mode: "lines+markers",  type: "scatter",  name: "' +
                    matriz[j].clave.replace('_', ' ') +
                    '",  text: "' +
                    matriz[j].clave.replace('_', ' ') +
                    '", xaxis: "x", yaxis: "y2" },';

                  // Aqui se arma la trama de la grafica Vertical (Profundidad)------------
                  //       datosgrafVertical_DMEA_Aux = '{ x: [' + matriz[j].valor.replace('"', '') + '], y: [' + datosProfundidad + '], mode: "lines+markers",  type: "scatter", name: "' + matriz[j].clave.replace('_', ' ') + '",  text: "' + matriz[j].clave.replace('_', ' ') + '", xaxis: "x2", yaxis: "y"}';

                  break;

                case 'MFIA':
                  // Aqui se arma la trama de la grafica Horizontal (tiempo)-------------------
                  datosgrafHorizont_MFIA_Aux =
                    '{ x: [' +
                    datosDateTime +
                    '], y: [' +
                    matriz[j].valor.replace('"', '') +
                    '], mode: "lines+markers",  type: "scatter", name: "' +
                    matriz[j].clave.replace('_', ' ') +
                    '",  text: "' +
                    matriz[j].clave.replace('_', ' ') +
                    '", xaxis: "x", yaxis: "y3" },';

                  // Aqui se arma la trama de la grafica Vertical (Profundidad)------------
                  //         datosgrafVertical_MFIA_Aux = '{ x: [' + matriz[j].valor.replace('"', '') + '], y: [' + datosProfundidad + '], mode: "lines+markers",  type: "scatter", name: "' + matriz[j].clave.replace('_', ' ') + '",  text: "' + matriz[j].clave.replace('_', ' ') + '", xaxis: "x3", yaxis: "y"}';
                  break;

                case 'RPM':
                  // Aqui se arma la trama de la grafica Horizontal (tiempo)-------------------
                  datosgrafHorizont_RPM_Aux =
                    '{ x: [' +
                    datosDateTime +
                    '], y: [' +
                    matriz[j].valor.replace('"', '') +
                    '], mode: "lines+markers",  type: "scatter", name: "' +
                    matriz[j].clave.replace('_', ' ') +
                    '",  text: "' +
                    matriz[j].clave.replace('_', ' ') +
                    '", xaxis: "x", yaxis: "y4" },';

                  // Aqui se arma la trama de la grafica Vertical (Profundidad)------------
                  //         datosgrafVertical_RPM_Aux = '{ x: [' + matriz[j].valor.replace('"', '') + '], y: [' + datosProfundidad + '], mode: "lines+markers",  type: "scatter", name: "' + matriz[j].clave.replace('_', ' ') + '",  text: "' + matriz[j].clave.replace('_', ' ') + '", xaxis: "x4", yaxis: "y"}';
                  break;

                case 'TQA':
                  // Aqui se arma la trama de la grafica Horizontal (tiempo)-------------------
                  datosgrafHorizont_TQA_Aux =
                    '{ x: [' +
                    datosDateTime +
                    '], y: [' +
                    matriz[j].valor.replace('"', '') +
                    '], mode: "lines+markers",  type: "scatter", name: "' +
                    matriz[j].clave.replace('_', ' ') +
                    '",  text: "' +
                    matriz[j].clave.replace('_', ' ') +
                    '", xaxis: "x", yaxis: "y5" },';

                  // Aqui se arma la trama de la grafica Vertical (Profundidad)------------
                  //          datosgrafVertical_TQA_Aux = '{ x: [' + matriz[j].valor.replace('"', '') + '], y: [' + datosProfundidad + '], mode: "lines+markers",  type: "scatter", name: "' + matriz[j].clave.replace('_', ' ') + '",  text: "' + matriz[j].clave.replace('_', ' ') + '", xaxis: "x5", yaxis: "y"}';
                  break;
              }
            } else {
              // Aqui se arma la trama de la grafica principal

              var nombre_variable = this.cambioNombre(matriz[j].clave);

              datosGraficaPrincipal_Aux =
                datosGraficaPrincipal_Aux +
                '{ x: [' +
                datosDateTime +
                '],' +
                'y: [' +
                matriz[j].valor.replace('"', '') +
                '],' +
                'mode: "lines+markers",' +
                'type: "scatter",' +
                'name: "' +
                nombre_variable +
                '" },';
              // ---------------------------------------------------------------------
            }
          }

          var fec1 = '';
          var fec2 = '';
          var pro1 = '';
          var pro2 = '';

          var vector_H_DBTM =
            '{' +
            datosgrafHorizont_DBTM_Aux.substring(
              datosgrafHorizont_DBTM_Aux.length - 1,
              1
            );

          var vector_H_DMEA =
            '{' +
            datosgrafHorizont_DMEA_Aux.substring(
              datosgrafHorizont_DMEA_Aux.length - 1,
              1
            );

          var vector_H_MFIA =
            '{' +
            datosgrafHorizont_MFIA_Aux.substring(
              datosgrafHorizont_MFIA_Aux.length - 1,
              1
            );

          var vector_H_RPM =
            '{' +
            datosgrafHorizont_RPM_Aux.substring(
              datosgrafHorizont_RPM_Aux.length - 1,
              1
            );

          var vector_H_TQA =
            '{' +
            datosgrafHorizont_TQA_Aux.substring(
              datosgrafHorizont_TQA_Aux.length - 1,
              1
            );

          fetch(URL + 'eventos?id=' + idinicial)
            .then(res => res.json())
            .then(result2 => {
              this.setState({
                isLoaded: true,
                dataEventos: result2,
              });

              datosregistro2 = result2;
              datosfecIni_Eve_Aux = '';
              datosfecFin_Eve_Aux = '';
              datosproIni_Eve_Aux = '';
              datosproFin_Eve_Aux = '';
              datosdescrp_Eve_Aux = '';

              datosGraficaPrincipal_Aux2 = '';

              for (let k = 0; k < datosregistro2.length; k++) {
                fec1 = datosregistro2[k].fecha_inicial;
                fec2 = datosregistro2[k].fecha_final;

                fec1 = fec1.replace('.000Z', '');
                fec1 = fec1.replace('T', ' ');
                fec2 = fec2.replace('.000Z', '');
                fec2 = fec2.replace('T', ' ');
                datosfecIni_Eve_Aux =
                  datosfecIni_Eve_Aux + ',' + "'" + fec1 + "'";
                datosfecFin_Eve_Aux =
                  datosfecFin_Eve_Aux + ',' + "'" + fec2 + "'";

                pro1 = datosregistro2[k].profundidad_inicial;
                pro2 = datosregistro2[k].profundidad_final;

                pro1 = pro1.replace(',', '.');
                pro2 = pro2.replace(',', '.');

                datosproIni_Eve_Aux =
                  datosproIni_Eve_Aux + "'" + pro1 + "'" + ',';
                datosproFin_Eve_Aux =
                  datosproFin_Eve_Aux + "'" + pro2 + "'" + ',';

                datosdescrp_Eve_Aux =
                  datosdescrp_Eve_Aux +
                  "'" +
                  datosregistro2[k].descripcion +
                  "'" +
                  ',';
              }

              datosfecIni_Eve_Aux = datosfecIni_Eve_Aux.substring(
                1,
                datosfecIni_Eve_Aux.length
              );
              datosfecFin_Eve_Aux = datosfecFin_Eve_Aux.substring(
                1,
                datosfecFin_Eve_Aux.length
              );
              datosproIni_Eve_Aux = datosproIni_Eve_Aux.substring(
                datosproIni_Eve_Aux.length - 1,
                1
              );
              datosproFin_Eve_Aux = datosproFin_Eve_Aux.substring(
                datosproFin_Eve_Aux.length - 1,
                1
              );
              datosdescrp_Eve_Aux = datosdescrp_Eve_Aux.substring(
                datosdescrp_Eve_Aux.length - 1,
                1
              );

              datosGraficaPrincipal_Aux2 =
                ' { x: [' +
                datosfecIni_Eve_Aux +
                '],' +
                'y: [' +
                "'" +
                datosproIni_Eve_Aux +
                '], ' +
                'text: [' +
                "'" +
                datosdescrp_Eve_Aux +
                '],  marker: { symbol:"' +
                simbolo[3] +
                '", size: 10 }, ' +
                'name: "eventos", mode: "markers", type: "scatter",legend: {orientation: "h", y: -0.3},  hovertemplate:"<b>%{text}</b>" }';

              this.setState({
                datosGraficaEventos_Auxiliar: datosGraficaPrincipal_Aux2,
              });
            });

          var vectorPrincipal =
            '{' +
            datosGraficaPrincipal_Aux.substring(
              datosGraficaPrincipal_Aux.length - 1,
              1
            );

          this.setState({
            datosParaGraficaPrincipal: vectorPrincipal,

            datosgrafVertical_DBTM: datosgrafVertical_DBTM_Aux,
            datosgrafVertical_DMEA: datosgrafVertical_DMEA_Aux,
            datosgrafVertical_MFIA: datosgrafVertical_MFIA_Aux,
            datosgrafVertical_RPM: datosgrafVertical_RPM_Aux,
            datosgrafVertical_TQA: datosgrafVertical_TQA_Aux,

            datosgrafHorizont_DBTM: vector_H_DBTM,
            datosgrafHorizont_DMEA: vector_H_DMEA,
            datosgrafHorizont_MFIA: vector_H_MFIA,
            datosgrafHorizont_RPM: vector_H_RPM,
            datosgrafHorizont_TQA: vector_H_TQA,
          });
        },
        error => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );
  }

  componentDidMount() {
    this.peticionWellsGet();
  }

  handleChange = async e => {
    e.persist();
    await this.setState({ selectValue: e.target.value });
    this.peticionGet(this.state.selectValue);
  };

  render() {
    const {
      datosGraficaEventos_Auxiliar,
      wells_id,
      dataWells,
      datosParaGraficaPrincipal,
      datosgrafVertical_DMEA,
      datosgrafVertical_MFIA,
      datosgrafVertical_RPM,
      datosgrafVertical_TQA,
      datosgrafVertical_DBTM,
      datosgrafHorizont_DMEA,
      datosgrafHorizont_MFIA,
      datosgrafHorizont_RPM,
      datosgrafHorizont_TQA,
      datosgrafHorizont_DBTM,
    } = this.state;

    document.getElementById('graficas0').style.display = '';
    document.getElementById('graficas1').style.display = 'inline';

    //#region Layout-------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    var config_general = {
      showSendToCloud: false,
      editable: false,
      displayModeBar: true,
      locale: 'es',
      displaylogo: false,
      responsive: true,
      modeBarButtonsToRemove: [
        'hoverClosestGl2d',
        'hoverClosestPie',
        'toggleHover',
        'resetViews',
        'zoom2d',
        'select2d',
        'lasso2d',
        'toggleSpikelines',
        'hoverClosestCartesian',
      ], //,'hoverCompareCartesian', 'pan2d',
      toImageButtonOptions: {
        format: 'png',
        filename: 'archivo_',
        height: 600,
        width: 1800,
        scale: 1,
      },
    };

    var layout_Principal = {
      autosize: true,
      uirevision: 'true',
      margin: { l: 60, r: 10, t: 50, b: 10 },
      //width: 1600,
      // height: 700,
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
    };

    var layout_Horizontal = {
      autosize: true,
      uirevision: 'true',
      margin: { l: 60, r: 10, t: 10, b: 30 },
      //width: 1600,
      //height: 450,
      dragmode: 'zoom',
      showlegend: false,
      plot_bgcolor: 'white',
      paper_bgcolor: 'lightgray',
      grid: {
        rows: 5,
        columns: 1,
        subplots: [['xy'], ['xy2'], ['xy3'], ['xy4'], ['xy5']],
        roworder: 'top to bottom',
      },
      xaxis: {
        fixedrange: false,
        showspikes: true,
        spikemode: 'across',
        type: 'time',
        tickformat: '%d %b %Y \n %H:%M:%S ',
        title: 'Tiempo',
        nticks: 5,
      },
      yaxis1: {
        title: 'DBTM',
        autorange: 'reversed',
        titlefont: { size: 10, color: 'blue' },
        tickfont: { size: 8.0 },
      },
      yaxis2: {
        title: 'DMEA',
        titlefont: { size: 10, color: 'blue' },
        tickfont: { size: 8.0 },
      },
      yaxis3: {
        title: 'MFIA',
        titlefont: { size: 10, color: 'blue' },
        tickfont: { size: 8.0 },
      },
      yaxis4: {
        title: 'RPM',
        titlefont: { size: 10, color: 'blue' },
        tickfont: { size: 8.0 },
      },
      yaxis5: {
        title: 'TQA',
        titlefont: { size: 10, color: 'blue' },
        tickfont: { size: 8.0 },
      },
    };

    var layout_Vertical = {
      autosize: true,
      uirevision: 'true',
      margin: { l: 60, r: 10, t: 50, b: 10 },
      //width: 300,
      // height: 700,
      dragmode: 'zoom',
      hovermode: 'y',
      showlegend: false,
      plot_bgcolor: 'white',
      paper_bgcolor: 'lightgray',
      grid: {
        rows: 1,
        columns: 5,
        subplots: ['x1y', 'x2y', 'x3y', 'x4y', 'x5y'],
        roworder: 'left to right',
      },
      yaxis: {
        fixedrange: false,
        autorange: 'reversed',
        title: 'Profundidad',
        nticks: 5,
      },
      images: [
        {
          source: 'fondo.jpg',
          xref: 'x',
          yref: 'y',
          x: 0,
          y: 0,
          sizex: 1,
          sizey: 12114,
          sizing: 'stretch',
          opacity: 1.0,
          layer: 'below',
        },
      ],
      xaxis1: {
        fixedrange: false,
        textposition: 'top center',
        side: 'top',
        title: 'DBTM',
        titlefont: { size: 10, color: 'blue' },
        tickfont: { size: 8.0 },
      },
      xaxis2: {
        fixedrange: false,
        textposition: 'top center',
        side: 'top',
        title: 'DMEA',
        titlefont: { size: 10, color: 'blue' },
        tickfont: { size: 8.0 },
      },
      xaxis3: {
        fixedrange: false,
        textposition: 'top center',
        side: 'top',
        title: 'MFIA',
        titlefont: { size: 10, color: 'blue' },
        tickfont: { size: 8.0 },
      },
      xaxis4: {
        fixedrange: false,
        textposition: 'top center',
        side: 'top',
        title: 'RPM',
        titlefont: { size: 10, color: 'blue' },
        tickfont: { size: 8.0 },
      },
      xaxis5: {
        fixedrange: false,
        textposition: 'top center',
        side: 'top',
        title: 'TQA',
        titlefont: { size: 10, color: 'blue' },
        tickfont: { size: 8.0 },
      },
    };

    //#region Datos-------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    var dataPrincipal_01 = [];

    var dataPrincipal_1 = eval(
      '[' + this.state.datosParaGraficaPrincipal + ']'
    );
    var dataPrincipal_2 = eval(
      '[' + this.state.datosGraficaEventos_Auxiliar + ']'
    );

    dataPrincipal_01 = dataPrincipal_01.concat(dataPrincipal_1);
    dataPrincipal_01 = dataPrincipal_01.concat(dataPrincipal_2);

    var data_Hor_DBTM = eval('[' + this.state.datosgrafHorizont_DBTM + ']');
    var data_Hor_DMEA = eval('[' + this.state.datosgrafHorizont_DMEA + ']');
    var data_Hor_MFIA = eval('[' + this.state.datosgrafHorizont_MFIA + ']');
    //     var data_Hor_RPM = eval("[" + this.state.datosgrafHorizont_RPM + "]");
    var data_Hor_TQA = eval('[' + this.state.datosgrafHorizont_TQA + ']');

    console.log(this.state.datosgrafHorizont_RPM);

    var data_Horizontal = [];
    data_Horizontal = data_Horizontal.concat(data_Hor_DBTM);
    data_Horizontal = data_Horizontal.concat(data_Hor_DMEA);
    data_Horizontal = data_Horizontal.concat(data_Hor_MFIA);
    // data_Horizontal = data_Horizontal.concat(data_Hor_RPM);
    data_Horizontal = data_Horizontal.concat(data_Hor_TQA);
    ////-------------------------------------------------------------------------
    /*
       var data_Ver_DBTM = eval("[" + this.state.datosgrafVertical_DBTM + "]");
       var data_Ver_DMEA = eval("[" + this.state.datosgrafVertical_DMEA + "]");
       var data_Ver_MFIA = eval("[" + this.state.datosgrafVertical_MFIA + "]");
       var data_Ver_RPM = eval("[" + this.state.datosgrafVertical_RPM + "]");
       var data_Ver_TQA = eval("[" + this.state.datosgrafVertical_TQA + "]");

      


        var data_Vertical= [];
        data_Vertical = data_Vertical.concat(data_Ver_DBTM);
        data_Vertical = data_Vertical.concat(data_Ver_DMEA);
        data_Vertical = data_Vertical.concat(data_Ver_MFIA);
        data_Vertical = data_Vertical.concat(data_Ver_RPM);
        data_Vertical = data_Vertical.concat(data_Ver_TQA);
        */

    // console.log(data_Ver_DBTM);
    //#region Ejecucion de Grafica-------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    Plotly.react(
      'graphDiv',
      dataPrincipal_01,
      layout_Principal,
      config_general
    );

    //Frame Horizontales (Tiempos)
    Plotly.react('myDiv_H', data_Horizontal, layout_Horizontal, config_general);

    // Plotly.react('myDiv_V', data_Vertical, layout_Vertical, config_general);

    var hoverlayer_P = document
      .getElementById('graphDiv')
      .querySelector('.hoverlayer');
    // var hoverlayer_V = document.getElementById("myDiv_V").querySelector(".hoverlayer");
    var hoverlayer_H = document
      .getElementById('myDiv_H')
      .querySelector('.hoverlayer');

    //labb  graphDiv.on("plotly_hover", function (d) {
    document.getElementById('graphDiv').on('plotly_hover', function (d) {
      var points = d.points[0],
        pointNum = points.pointNumber;

      Plotly.Fx.hover(
        'myDiv_H',
        [
          { curveNumber: 0, pointNumber: pointNum },
          { curveNumber: 1, pointNumber: pointNum },
          { curveNumber: 2, pointNumber: pointNum },
          { curveNumber: 3, pointNumber: pointNum },
          { curveNumber: 4, pointNumber: pointNum },
        ],
        ['xy', 'xy2', 'xy3', 'xy4', 'xy5']
      );
    });

    document.getElementById('graphDiv').on('plotly_unhover', function (d) {
      hoverlayer_H.innerHTML = '';
    });

    document.getElementById('myDiv_H').on('plotly_hover', function (d) {
      var points = d.points[0],
        pointNum = points.pointNumber;

      Plotly.Fx.hover(
        'myDiv_H',
        [
          { curveNumber: 0, pointNumber: pointNum },
          { curveNumber: 1, pointNumber: pointNum },
          { curveNumber: 2, pointNumber: pointNum },
          { curveNumber: 3, pointNumber: pointNum },
          { curveNumber: 4, pointNumber: pointNum },
        ],
        ['xy', 'xy2', 'xy3', 'xy4', 'xy5', 'xy6']
      );

      Plotly.Fx.hover(
        'graphDiv',
        [{ curveNumber: 0, pointNumber: pointNum }],
        ['xy']
      );
    });

    document.getElementById('myDiv_H').on('plotly_unhover', function (d) {
      hoverlayer_P.innerHTML = '';
    });

    document
      .getElementById('graphDiv')
      .on('plotly_relayout', function (eventdata) {
        Plotly.relayout('myDiv_H', {
          xaxis: {
            range: [eventdata['xaxis.range[0]'], eventdata['xaxis.range[1]']],
            nticks: 5,
          },
        });

        Plotly.relayout('myDiv_V', {
          yaxis: {
            range: [eventdata['yaxis.range[0]'], eventdata['yaxis.range[1]']],
            title: 'Profundidad',
            nticks: 5,
          },
        });

        if (eventdata['yaxis.range[0]'] == undefined) {
          Plotly.relayout('myDiv_V', {
            yaxis: {
              autorange: 'reversed',
              nticks: 5,
            },
          });

          Plotly.relayout('myDiv_H', {
            xaxis: {
              range: [
                layout_Principal.xaxis.range[0],
                layout_Principal.xaxis.range[1],
              ],
              nticks: 5,
            },
          });
        }
      });

    window.onresize = resize;

    function resize() {
      var valor1 = document.getElementById('graphDiv').style.width;
      var valor2 = document.getElementById('myDiv_V').style.width;

      var valorW1 = valor1;
      var valorW2 = valor2;

      var valorH1 = ((window.outerHeight - 200) * 0.7).toFixed(0);
      var valorH2 = ((window.outerHeight - 200) * 0.3).toFixed(0);

      layout_Principal.width = valorW1;
      layout_Vertical.width = valorW2;
      layout_Horizontal.width = valorW1;

      layout_Principal.height = valorH1;
      layout_Vertical.height = valorH1;
      layout_Horizontal.height = valorH2;

      layout_Principal.autosize = true;
      layout_Vertical.autosize = true;
      layout_Horizontal.autosize = true;

      Plotly.relayout('graphDiv', layout_Principal);
      Plotly.relayout('myDiv_H', layout_Horizontal);
      Plotly.relayout('myDiv_V', layout_Vertical);
    }

    return (
      <div className="App">
        <Cabecera />
        <SideBar pageWrapId={'page-wrap'} outerContainerId={'App'} />

        <div>
          <label htmlFor="wells_id">Wells</label>
          <select
            name="wells_id"
            id="wells_id"
            className="form-control"
            value={this.state.selectValue}
            onChange={this.handleChange}
          >
            <option key="0" value="0">
              Seleccionar el pozo a visualizar{' '}
            </option>
            {this.state.dataWells.map(elemento => (
              <option key={elemento.id} value={elemento.id}>
                {elemento.tag} - {elemento.nombre}{' '}
              </option>
            ))}
          </select>
        </div>

        <div className="row" id="graficas0">
          <div className="col-md-8" id="divprincipal">
            <div id="graphDiv"></div>
          </div>
          <div className="col-md-4" id="divvertical">
            <div className="tabla-interna-v">
              <div id="myDiv_V"></div>
            </div>
          </div>
        </div>
        <div className="row" id="graficas1">
          <div className="col-md-8" id="divhorizontal">
            <div className="tabla-interna">
              <div id="myDiv_H"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default viewVisualHistorico;
