import React, { Component } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

import Plot from 'react-plotly.js';
import Plotly from 'plotly.js';
import axios from 'axios';
import hexRgb from 'hex-rgb';
import { Simplify } from 'curvereduce';
import { AlgoritmoOperaciones } from '../util/utilities';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/button.css';

import SideBar from '../componentes/sidebar';

import SaveIcon from '@material-ui/icons/Save';
import HorizontalSplitIcon from '@material-ui/icons/HorizontalSplit';
import BarChartIcon from '@material-ui/icons/BarChart';
import BrushIcon from '@material-ui/icons/Brush';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';

import ModalTemplate from '../componentes/graficador/modalConfig';

const URL = process.env.REACT_APP_API_HOST;

var maxDMEA = 0;
var datosGraficaPrincipal = [];
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
  ], // , 'hoverClosestCartesian','hoverCompareCartesian', 'pan2d',
  toImageButtonOptions: {
    format: 'png',
    filename: 'archivo_',
    height: 800,
    width: 800,
    scale: 1,
  },
};

class Graficador extends Component {
  constructor(props) {
    super(props);
    this.state = {
      template: {
        template_id: 0,
        template_nombre: '',
        field_id: 0,
        field_nombre: '',
        wells_id: 0,
        wells_nombre: '',
      },
      template_well: {
        id: 0,
      },
      dataFields: [],
      dataWells: [],
      dataTemplates: [],
      dataCurvas: [],
      tmpDataCurvas: [],

      modalStart: false,
      modalNuevo: false,

      dataEventos: [],
      dataOperaciones: [],

      dataWits: [],

      dataGP: [],
      configGP: {},
      layoutGP: {},

      toggleTrackHorizontal: false,
      toggleTrackVertical: false,
      plotDeptVH: '95vh',
      plotDeptCol: 'col-md-12',

      modalConfig: false,
      profundidadFinal: 0,
    };
  }

  handleChange = async e => {
    e.persist();

    if (e.target.name === 'field_id') {
      this.getWells(e.target.value);
    }
    if (e.target.name === 'wells_id') {
      this.getTemplates(e.target.value);
    }

    this.setState({
      template: {
        ...this.state.template,
        [e.target.name]: e.target.value,
      },
    });
  };

  setDataCurvas = e => {
    this.setState({ dataCurvas: [...e] });

    //Si no existe, remover data por name

    e.forEach(i => {
      if (i.mostrar && i.grupo === null) console.log(i.descripcion);
    });
  };

  setDataTrackHorizontal = e => {};

  toggleModalTemplate = (open, upd, e) => {
    if (open) {
      this.setState({
        tmpDataCurvas: [...this.state.dataCurvas],
        modalConfig: open,
      });
    } else {
      if (upd) {
        this.setState({
          dataCurvas: [...e],
          modalConfig: open,
        });
      } else {
        this.setState({
          tmpDataCurvas: [...this.state.dataCurvas],
          modalConfig: open,
        });
      }
    }
  };

  getFields = () => {
    axios
      .get(URL + 'fields')
      .then(response => {
        this.setState({ dataFields: response.data });
      })
      .catch(error => {
        console.log(error.message);
      });
  };
  getWells = id => {
    axios
      .get(URL + 'wells/field/' + id)
      .then(response => {
        this.setState({ dataWells: response.data });
      })
      .catch(error => {
        console.log(error.message);
      });
  };
  getTemplates = id => {
    axios
      .get(URL + 'templates_wells/' + id + '/' + 2)
      .then(response => {
        this.setState({ dataTemplates: response.data });
      })
      .catch(error => {
        console.log(error.message);
      });
  };

  AbrirTemplate = id => {
    const requestTemplatesWells = axios.get(URL + 'templates_wells/' + id);
    const requestTemplatesWellTipoCurva = axios.get(
      URL + 'templates_wells_wits_detalle_secciones/template_well/' + id
    );

    //const requestLas = axios.get(URL + "archivo_encabezado/las/" + id);
    //const requestCavings = axios.get(URL + "archivo_encabezado/caving/" + id);
    //const requestFel = axios.get(URL + "archivo_encabezado/fel/" + id);

    //Obtener template y sus curvas
    axios
      .all([requestTemplatesWells, requestTemplatesWellTipoCurva])
      .then(
        axios.spread((...response) => {
          const [template] = response[0].data;
          const curvas = response[1].data;

          this.setState({
            template: { ...template },
            dataCurvas: [...curvas],
          });

          let datosGraficaPrincipal = [];
          let profundidadFinal_temporal = 1000;

          //Obtener Datos y Graficar
          axios
            .get(URL + 'datos_wits/wells/' + template.wells_id)
            .then(response => {
              const dataWits = response.data.filter(
                d =>
                  Number(d['0108']) < 15000 &&
                  Number(d['0110']) < 15000 &&
                  Number(d['0108']) > 0 &&
                  Number(d['0110']) > 0
              );
              this.setState({ dataWits: dataWits });
              if (curvas.length > 0) {
                //Gráfica principal
                curvas
                  .filter(c => c.mostrar === true && c.grupo === null)
                  .map(c => {
                    const datos = dataWits.map(f => ({
                      x: f['DATETIME'],
                      y: f[c.codigo],
                    }));
                    const x = datos.map(d => d.x);
                    const y = datos.map(d => d.y);
                    const serie = {
                      x: x,
                      y: y,
                      name: c.descripcion,
                      type: 'scatter',
                    };
                    datosGraficaPrincipal.push(serie);

                    let prof = Math.max(...y) + 500;
                    profundidadFinal_temporal =
                      prof > profundidadFinal_temporal
                        ? prof
                        : profundidadFinal_temporal;
                  });

                //Track Horizontal
              }
              let datosGraficasHorizontales = {};

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
                  range: [profundidadFinal_temporal, -20],
                  title: 'Profundidad [ft]',
                  nticks: 10,
                },
                font: { family: 'verdana', size: 11 },
                showlegend: false,
                shapes: [],
                datarevision: 1,
              };

              this.setState({
                isLoadedPrincipal: true,
                dataTH: datosGraficasHorizontales,
                dataGP: datosGraficaPrincipal,
                configGP: config_general,
                layoutGP: layout_Principal,
                profundidadFinal: profundidadFinal_temporal,
              });
            })
            .catch(errors => {
              console.log(errors.message);
            });

          /*
            //Datos Del Pozo
            const requestDatos  = axios.get(URL + "datos_wits/wells/" + template.wells_id);
            //Conveción de colores de las operaciones
            const requestConvencion = axios.get(URL + "convencion_datos_operacion");

            axios.all([ requestDatos, requestConvencion]).then(axios.spread((...response) => {
                
                const dataWits   = response[0].data.filter(d=>Number(d.DBTM) < 15000 && Number(d.DMEA) < 15000  && Number(d.DBTM) > 0 && Number(d.DMEA) > 0) ;
                const convencion = response[1].data;   

                // Para Ejecutar el cálculo algoritmo de operaciones
                //'DATETIME','DMEA','RPM','DBTM','ROPA','MFIA','TQA','WOB'

                const datosToSimplyfy = dataWits.map( obj => ({x: Number(obj.id), y: Number(obj.DBTM)}) ).sort(x => x.id);
                let dataRta = Simplify(datosToSimplyfy, 0.9075); 
                
                this.creaGraficaPrincipal_Full_v2(convencion, dataRta, dataWits);
                //this.crearCF_LayoutHorizontal();
                //this.crearCF_LayoutVertical();

                console.log('FIN')
                this.setState({ isLoaded: true });
            })).catch(error => {
                console.log(error.message);
            })
            */
          //console.log(this.state.checkedStateTC)
          //console.log(curvas)
          //console.log(archivos)
        })
      )
      .catch(error => {
        console.log(error.message);
      });
    this.setState({ modalStart: false });
  };

  SetSerieGraficaPrincipal = () => {
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
      ], // , 'hoverClosestCartesian','hoverCompareCartesian', 'pan2d',
      toImageButtonOptions: {
        format: 'png',
        filename: 'archivo_',
        height: 800,
        width: 800,
        scale: 1,
      },
    };
  };

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
      modeBarButtonsToRemove: [
        'hoverClosestGl2d',
        'hoverClosestPie',
        'toggleHover',
        'resetViews',
        'zoom2d',
        'select2d',
        'lasso2d',
        'toggleSpikelines',
      ], // , 'hoverClosestCartesian','hoverCompareCartesian', 'pan2d',
      toImageButtonOptions: {
        format: 'png',
        filename: 'archivo_',
        height: 800,
        width: 800,
        scale: 1,
      },
    };

    var DATETIME = [];
    var DBTM = [],
      DMEA = [],
      MFIA = [],
      ROPA = [],
      RPM = [],
      TQA = [],
      WOB = [];

    var operacion_0 = [],
      operacion_2 = [],
      operacion_3 = [],
      operacion_4 = [],
      operacion_7 = [],
      operacion_8 = [],
      operacion_9 = [];
    var operacion_35 = [],
      operacion_36 = [],
      operacion_37 = [],
      operacion_38 = [],
      operacion_39 = [];
    var operacion_40 = [],
      operacion_41 = [];

    var fec1 = '';
    var fec2 = '';
    var pro1 = '';
    var pro2 = '';
    let DBTM_0 = 0;
    rsDouglas.forEach(function (row) {
      let indice = rsTabla.filter(item => Number(item.id) === row.x);
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

        indice.operacion = AlgoritmoOperaciones(
          DBTM_0,
          indice.DMEA,
          indice.DBTM,
          indice.RPM,
          indice.ROPA,
          indice.MFIA,
          indice.TQA,
          indice.WOB
        ).Operacion;

        if (indice.operacion === 0) {
          operacion_0.push(indice.DBTM);
        } else {
          operacion_0.push(null);
        }
        if (indice.operacion === 2) {
          operacion_2.push(indice.DBTM);
        } else {
          operacion_2.push(null);
        }
        if (indice.operacion === 3) {
          operacion_3.push(indice.DBTM);
        } else {
          operacion_3.push(null);
        }
        if (indice.operacion === 4) {
          operacion_4.push(indice.DBTM);
        } else {
          operacion_4.push(null);
        }
        if (indice.operacion === 7) {
          operacion_7.push(indice.DBTM);
        } else {
          operacion_7.push(null);
        }
        if (indice.operacion === 8) {
          operacion_8.push(indice.DBTM);
        } else {
          operacion_8.push(null);
        }
        if (indice.operacion === 9) {
          operacion_9.push(indice.DBTM);
        } else {
          operacion_9.push(null);
        }
        if (indice.operacion === 35) {
          operacion_35.push(indice.DBTM);
        } else {
          operacion_35.push(null);
        }
        if (indice.operacion === 36) {
          operacion_36.push(indice.DBTM);
        } else {
          operacion_36.push(null);
        }
        if (indice.operacion === 37) {
          operacion_37.push(indice.DBTM);
        } else {
          operacion_37.push(null);
        }
        if (indice.operacion === 38) {
          operacion_38.push(indice.DBTM);
        } else {
          operacion_38.push(null);
        }
        if (indice.operacion === 39) {
          operacion_39.push(indice.DBTM);
        } else {
          operacion_39.push(null);
        }
        if (indice.operacion === 40) {
          operacion_40.push(indice.DBTM);
        } else {
          operacion_40.push(null);
        }
        if (indice.operacion === 41) {
          operacion_41.push(indice.DBTM);
        } else {
          operacion_41.push(null);
        }

        DBTM_0 = indice.DBTM;
      }
    });

    let [Op_0] = convencion
      .filter(c => c.id === 0)
      .map(p => ({ nombre: p.nombre, color: p.color }));
    let [Op_2] = convencion
      .filter(c => c.id === 2)
      .map(p => ({ nombre: p.nombre, color: p.color }));
    let [Op_3] = convencion
      .filter(c => c.id === 3)
      .map(p => ({ nombre: p.nombre, color: p.color }));
    let [Op_4] = convencion
      .filter(c => c.id === 4)
      .map(p => ({ nombre: p.nombre, color: p.color }));
    let [Op_7] = convencion
      .filter(c => c.id === 7)
      .map(p => ({ nombre: p.nombre, color: p.color }));
    let [Op_8] = convencion
      .filter(c => c.id === 8)
      .map(p => ({ nombre: p.nombre, color: p.color }));
    let [Op_9] = convencion
      .filter(c => c.id === 9)
      .map(p => ({ nombre: p.nombre, color: p.color }));
    let [Op_35] = convencion
      .filter(c => c.id === 35)
      .map(p => ({ nombre: p.nombre, color: p.color }));
    let [Op_36] = convencion
      .filter(c => c.id === 36)
      .map(p => ({ nombre: p.nombre, color: p.color }));
    let [Op_37] = convencion
      .filter(c => c.id === 37)
      .map(p => ({ nombre: p.nombre, color: p.color }));
    let [Op_38] = convencion
      .filter(c => c.id === 38)
      .map(p => ({ nombre: p.nombre, color: p.color }));
    let [Op_39] = convencion
      .filter(c => c.id === 39)
      .map(p => ({ nombre: p.nombre, color: p.color }));
    let [Op_40] = convencion
      .filter(c => c.id === 40)
      .map(p => ({ nombre: p.nombre, color: p.color }));
    let [Op_41] = convencion
      .filter(c => c.id === 41)
      .map(p => ({ nombre: p.nombre, color: p.color }));

    datosGraficaPrincipal.push({
      x: DATETIME,
      y: DBTM,
      mode: 'lines+markers',
      type: 'scatter',
      name: 'DBTM',
    });

    datosGraficaPrincipal.push({
      x: DATETIME,
      y: operacion_0,
      mode: 'markers',
      type: 'scatter',
      name: Op_0.nombre,
      marker: { color: hexRgb(Op_0.color, { format: 'css' }) },
    });
    datosGraficaPrincipal.push({
      x: DATETIME,
      y: operacion_2,
      mode: 'markers',
      type: 'scatter',
      name: Op_2.nombre,
      marker: { color: hexRgb(Op_2.color, { format: 'css' }) },
    });
    datosGraficaPrincipal.push({
      x: DATETIME,
      y: operacion_3,
      mode: 'markers',
      type: 'scatter',
      name: Op_3.nombre,
      marker: { color: hexRgb(Op_3.color, { format: 'css' }) },
    });
    datosGraficaPrincipal.push({
      x: DATETIME,
      y: operacion_4,
      mode: 'markers',
      type: 'scatter',
      name: Op_4.nombre,
      marker: { color: hexRgb(Op_4.color, { format: 'css' }) },
    });
    datosGraficaPrincipal.push({
      x: DATETIME,
      y: operacion_7,
      mode: 'markers',
      type: 'scatter',
      name: Op_7.nombre,
      marker: { color: hexRgb(Op_7.color, { format: 'css' }) },
    });
    datosGraficaPrincipal.push({
      x: DATETIME,
      y: operacion_8,
      mode: 'markers',
      type: 'scatter',
      name: Op_8.nombre,
      marker: { color: hexRgb(Op_8.color, { format: 'css' }) },
    });
    datosGraficaPrincipal.push({
      x: DATETIME,
      y: operacion_9,
      mode: 'markers',
      type: 'scatter',
      name: Op_9.nombre,
      marker: { color: hexRgb(Op_9.color, { format: 'css' }) },
    });
    datosGraficaPrincipal.push({
      x: DATETIME,
      y: operacion_35,
      mode: 'markers',
      type: 'scatter',
      name: Op_35.nombre,
      marker: { color: hexRgb(Op_35.color, { format: 'css' }) },
    });
    datosGraficaPrincipal.push({
      x: DATETIME,
      y: operacion_36,
      mode: 'markers',
      type: 'scatter',
      name: Op_36.nombre,
      marker: { color: hexRgb(Op_36.color, { format: 'css' }) },
    });
    datosGraficaPrincipal.push({
      x: DATETIME,
      y: operacion_37,
      mode: 'markers',
      type: 'scatter',
      name: Op_37.nombre,
      marker: { color: hexRgb(Op_37.color, { format: 'css' }) },
    });
    datosGraficaPrincipal.push({
      x: DATETIME,
      y: operacion_38,
      mode: 'markers',
      type: 'scatter',
      name: Op_38.nombre,
      marker: { color: hexRgb(Op_38.color, { format: 'css' }) },
    });
    datosGraficaPrincipal.push({
      x: DATETIME,
      y: operacion_39,
      mode: 'markers',
      type: 'scatter',
      name: Op_39.nombre,
      marker: { color: hexRgb(Op_39.color, { format: 'css' }) },
    });
    datosGraficaPrincipal.push({
      x: DATETIME,
      y: operacion_40,
      mode: 'markers',
      type: 'scatter',
      name: Op_40.nombre,
      marker: { color: hexRgb(Op_40.color, { format: 'css' }) },
    });
    datosGraficaPrincipal.push({
      x: DATETIME,
      y: operacion_41,
      mode: 'markers',
      type: 'scatter',
      name: Op_41.nombre,
      marker: { color: hexRgb(Op_41.color, { format: 'css' }) },
    });

    let datosGraficasHorizontales = {
      DATETIME: DATETIME,
      DBTM: DBTM,
      DMEA: DMEA,
      MFIA: MFIA,
      ROPA: ROPA,
      RPM: RPM,
      TQA: TQA,
      WOB: WOB,
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
      font: { family: 'verdana', size: 11 },
      showlegend: false,
      shapes: [],
      datarevision: 1,
    };

    //EVENTOS
    var rsEventos = this.state.dataEventos;
    var eventShapes = [];
    var tracesEvents = [];
    if (rsEventos.length > 0) {
      for (let k = 0; k < rsEventos.length; k++) {
        fec1 = rsEventos[k].fecha_inicial;
        fec2 = rsEventos[k].fecha_final;
        let idEvento = rsEventos[k].id;
        if (rsEventos[k].tipo_tiempo === 1) {
          //Eventos Puntuales
          pro1 = rsEventos[k].profundidad_inicial.replace(',', '.');
          let color = hexRgb(rsEventos[k].color, { format: 'css' });

          let trace = {
            t: idEvento,
            name: rsEventos[k].TipoEvento,
            x: fec1,
            y: pro1,
            c: color,
          };
          tracesEvents.push(trace);
        } else {
          //Eventos en el tiempo
          let numberFecI = new Date(fec1).getTime();
          let numberFecF = new Date(fec2).getTime();
          pro1 = rsEventos[k].profundidad_inicial.replace(',', '.');
          pro2 = rsEventos[k].profundidad_final.replace(',', '.');

          let color = hexRgb(rsEventos[k].color, { format: 'css' });
          let shape = {
            name: idEvento,
            type: 'rect',
            xref: 'x',
            yref: 'y',
            x0: numberFecI,
            y0: pro1,
            x1: numberFecF,
            y1: pro2,
            line: { color: color, width: 1 },
          };
          eventShapes.push(shape);

          let trace = {
            t: idEvento,
            name: rsEventos[k].TipoEvento,
            x: fec1,
            y: pro1,
            c: color,
          };
          tracesEvents.push(trace);
        }
      }
      if (tracesEvents.length > 0) {
        let grupos = tracesEvents.reduce((r, a) => {
          r[a.name] = [...(r[a.name] || []), a];
          return r;
        }, {});

        for (let grupo in grupos) {
          let x = [],
            y = [],
            c = '',
            t = [];
          for (let item in grupos[grupo]) {
            x.push(grupos[grupo][item].x);
            y.push(grupos[grupo][item].y);
            c = grupos[grupo][item].c;
            t.push(grupos[grupo][item].t);
          }
          let traceEvento = {
            x: x,
            y: y,
            name: grupo,
            mode: 'markers',
            type: 'scatter',
            marker: { symbol: '303', size: 10, color: c },
            hovertemplate: '%{x}, %{y}',
            text: t,
          };
          datosGraficaPrincipal.push(traceEvento);
        }
        if (eventShapes.length > 0) {
          eventShapes.forEach(sh => {
            layout_Principal.shapes.push(sh);
          });
        }
      }
    }

    //OPERACIONES
    var operacionesShapes = [];
    let rsOperaciones = this.state.dataOperaciones;
    if (rsOperaciones.length > 0) {
      let x = [],
        y = [],
        t = [];
      rsOperaciones.forEach(item => {
        if (item.desde === item.hasta) {
          x.push(item.desde);
          y.push(item.md_from.replace(',', '.'));
          t.push(item.id);
        } else {
          x.push(item.desde);
          y.push(item.md_from.replace(',', '.'));
          t.push(item.id);

          let numberFecI = new Date(item.desde).getTime();
          let numberFecF = new Date(item.hasta).getTime();
          pro1 = item.md_from.replace(',', '.');
          pro2 = item.md_to.replace(',', '.');
          let shape = {
            type: 'rect',
            xref: 'x',
            yref: 'y',
            name: 0,
            x0: numberFecI,
            y0: pro1,
            x1: numberFecF,
            y1: pro2,
            line: { color: 'Gray', width: 1 },
          };
          operacionesShapes.push(shape);
        }
      });

      if (x.length > 0) {
        let traceOperaciones = {
          x: x,
          y: y,
          name: 'Operaciones',
          mode: 'markers',
          type: 'scatter',
          marker: { symbol: '303', size: 10, color: 'Gray' },
          hovertemplate: '%{x}, %{y}',
          text: t,
        };
        datosGraficaPrincipal.push(traceOperaciones);
      }
      if (operacionesShapes.length > 0) {
        operacionesShapes.forEach(sh => {
          layout_Principal.shapes.push(sh);
        });
      }
    }

    this.setState({
      isLoadedPrincipal: true,
      dataTH: datosGraficasHorizontales,
      dataGP: datosGraficaPrincipal,
      configGP: config_general,
      layoutGP: layout_Principal,
    });
    console.log(this.now() + ' Fin Grafica Principal');
  };
  //Fin Grafica Principal

  // Handle Gráfica
  PlotClick = e => {
    let infoData = e.points.map(function (data) {
      let trace = {
        x: data.x,
        y: data.y,
        text: data.text,
        name: data.data.name,
      };
      return trace;
    });
    let id = infoData[0].text;

    //Eventos
    if (this.EsEvento(infoData[0].name)) {
      axios
        .get(URL + 'eventos/' + id)
        .then(response => {
          let row = response.data[0];

          this.setState({
            showing: row.tipo_tiempo === 1 ? false : true,
            evento: {
              id: row.id,
              tipo_evento_id: row.tipo_evento_id,
              color: row.color,
              fecha_inicial: row.fecha_inicial,
              hora_inicial: row.hora_inicial,
              fecha_final: row.fecha_final,
              hora_final: row.hora_final,
              profundidad_inicial: String(row.profundidad_inicial),
              profundidad_final: String(row.profundidad_final),
              descripcion: row.descripcion,
              causa: row.causa,
              solucion: row.solucion,
              tipo_tiempo: row.tipo_tiempo,
              TipoEvento: row.TipoEvento,
            },
            eventoAnterior: {
              fecha_inicial: row.fecha_inicial,
              hora_inicial: row.hora_inicial,
              fecha_final: row.fecha_final,
              hora_final: row.hora_final,
              profundidad_inicial: String(row.profundidad_inicial),
              profundidad_final: String(row.profundidad_final),
              tipo_evento_id: row.tipo_evento_id,
              TipoEvento: row.TipoEvento,
              tipo_tiempo: row.tipo_tiempo,
            },
            insertar: false,
            openModalEvento: true,
          });
        })
        .catch(error => {
          console.log(error.message);
        });
    } else {
      //Operaciones
      if (infoData[0].name === 'Operaciones') {
        axios
          .get(URL + 'operaciones/' + id)
          .then(response => {
            let row = response.data[0];
            let fechaInicio = row.desde.split(' ');
            let hora = fechaInicio[1];
            fechaInicio = fechaInicio[0].split('-');
            fechaInicio =
              fechaInicio[2] +
              '/' +
              fechaInicio[1] +
              '/' +
              fechaInicio[0] +
              ' ' +
              hora;

            let fechaFinal = row.hasta.split(' ');
            hora = fechaFinal[1];
            fechaFinal = fechaFinal[0].split('-');
            fechaFinal =
              fechaFinal[2] +
              '/' +
              fechaFinal[1] +
              '/' +
              fechaFinal[0] +
              ' ' +
              hora;
            this.setState({
              operacion: {
                id: row.id,
                desde: fechaInicio,
                hasta: fechaFinal,
                md_from: row.md_from.replace(',', '.'),
                md_to: row.md_to.replace(',', '.'),
                operacion: row.operacion,
              },
              openModalOperacion: true,
            });
          })
          .catch(error => {
            console.log(error.message);
          });
      } else {
        this.setState({
          menuEmergente: {
            x: e.event.clientX,
            y: e.event.clientY,
            showMenu: true,
            fecha: infoData[0].x,
            prof: infoData[0].y,
          },
        });
      }
    }
  };
  PlotOnHover = e => {
    var points = e.points[0],
      pointNum = points.pointNumber;
    if (this.state.isLoadedHorizontal) {
      let nt_h = this.state.dataGH.length;
      let curves_h = [];
      let coords_h = [];
      for (let i = 0; i < nt_h; i++) {
        curves_h.push({ curveNumber: i, pointNumber: pointNum });
        coords_h.push('xy' + (i > 0 ? String(i + 1) : ''));
      }

      Plotly.Fx.hover('plotTracksHorizontal', curves_h, coords_h);
    }

    if (this.state.isLoadedVertical) {
      let nt_v = this.state.dataGV.length;
      let coords_v = [];
      let curves_v = [];
      for (let i = 0; i < nt_v; i++) {
        curves_v.push({ curveNumber: i, yval: e.yvals[0] });
        coords_v.push('x' + (i > 0 ? String(i + 1) : '') + 'y');
      }
      Plotly.Fx.hover('plotTracksVertical', curves_v, coords_v);
    }
  };
  PlotOnUnHover = () => {
    if (this.state.isLoadedHorizontal)
      Plotly.Fx.unhover('plotTracksHorizontal');
    if (this.state.isLoadedVertical) Plotly.Fx.unhover('plotTracksVertical');
  };

  PlotOnRelayout = eventdata => {
    let layout_hor = { ...this.state.layoutTH };
    let layout_ver = { ...this.state.layoutTV };

    if (eventdata['xaxis.range[0]'] !== undefined) {
      layout_hor.xaxis = {
        range: [eventdata['xaxis.range[0]'], eventdata['xaxis.range[1]']],
        nticks: 5,
      };
    } else {
      layout_hor.xaxis = {
        autorange: true,
      };
    }

    if (eventdata['yaxis.range[0]'] !== undefined) {
      let newMax = this.maxTrackVertical(
        eventdata['yaxis.range[1]'],
        eventdata['yaxis.range[0]']
      );

      layout_ver.yaxis = {
        range: [newMax, eventdata['yaxis.range[1]']],
        nticks: 15,
      };
    }

    layout_hor.datarevision++;
    layout_ver.datarevision++;

    this.setState({
      layoutTH: layout_hor,
      layoutTV: layout_ver,
    });
  };

  // Fin Handle Gráfica

  //Botones
  CollapseTrackHorizontal = () => {
    let layout = { ...this.state.layoutGP };
    layout.datarevision++;
    this.setState({
      toggleTrackHorizontal: !this.state.toggleTrackHorizontal,
      plotDeptVH: this.state.toggleTrackHorizontal ? '95vh' : '60vh',
      layoutGP: layout,
    });
  };
  CollapseTrackVertical = () => {
    let layout = { ...this.state.layoutGP };
    layout.datarevision++;
    this.setState({
      toggleTrackVertical: !this.state.toggleTrackVertical,
      plotDeptCol: this.state.toggleTrackVertical ? 'col-md-12' : 'col-md-9',
      layoutGP: layout,
    });
  };
  //

  NuevoTemplate = () => {
    this.setState({ modalStart: false, modalNuevo: true });
  };
  GuardarTemplate = () => {
    this.setState({ modalNuevo: false });
  };

  Start = () => {
    this.getFields();
    //const id = this.props.match.params.id;
    //if (id === undefined)
    //{
    //
    this.setState({ modalNuevo: false, modalStart: true });
    //}
    //else
    //{

    //}
  };

  IrHome = () => {
    window.location = 'home';
  };

  componentDidMount() {
    this.Start();
  }

  render() {
    const { template } = this.state;

    return (
      <div className="App">
        <SideBar pageWrapId={'page-wrap'} outerContainerId={'App'} />
        <div className="container-fluid">
          <div className="row border-bottom">
            <div className="col-md-6 col-lg-6 small text-center  mt-2">
              <label className="font-weight-bold">Template: </label>{' '}
              {template.template_nombre} |{' '}
              <label className="font-weight-bold">Campo: </label>{' '}
              {template.field_nombre} |{' '}
              <label className="font-weight-bold">Pozo: </label>{' '}
              {template.wells_nombre}
            </div>
            <div className="col-md-4 col-lg-4 text-left  mt-1">
              <button
                title="Abrir Template"
                onClick={() => this.Start()}
                className="btn btn-sm btn-outline-success btn-circle"
              >
                <FolderOpenIcon fontSize="small" />
              </button>
              &nbsp;&nbsp;
              <button
                title="Guardar Template"
                onClick={() => this.GuardarTemplate()}
                className="btn btn-sm btn-success btn-circle"
              >
                <SaveIcon fontSize="small" />
              </button>
              &nbsp;&nbsp;|&nbsp;&nbsp;
              <button
                title="Configuración"
                onClick={() => this.toggleModalTemplate(true, false, null)}
                className="btn btn-sm btn-primary btn-circle"
              >
                <BrushIcon fontSize="small" />
              </button>
              &nbsp;&nbsp;|&nbsp;&nbsp;
              <button
                title="Ver/Ocultar Tracks Horizontales"
                onClick={() => this.CollapseTrackHorizontal()}
                className="btn btn-sm btn-outline-info btn-circle"
              >
                <HorizontalSplitIcon fontSize="small" />
              </button>
              &nbsp;&nbsp;
              <button
                title="Ver/Ocultar Tracks Verticales"
                onClick={() => this.CollapseTrackVertical()}
                className="btn btn-sm btn-outline-danger btn-circle"
              >
                <BarChartIcon fontSize="small" />
              </button>
            </div>
            <div className="col-md-2 col-lg-2 text-left  mt-1">
              <small>
                {
                  JSON.parse(sessionStorage.getItem('user'))
                    .nombre_usuario_sesion
                }
              </small>
            </div>
          </div>

          <div className="row" style={{ backgroundColor: 'rgb(233,233,233)' }}>
            <div id="divPrincipal" className={this.state.plotDeptCol}>
              <div className="row">
                <div className="col-md-12">
                  <Plot
                    divId="plotDept"
                    data={this.state.dataGP}
                    layout={this.state.layoutGP}
                    config={this.state.configGP}
                    useResizeHandler={true}
                    style={{ width: '100%', height: this.state.plotDeptVH }}
                    onClick={e => this.PlotClick(e)}
                    onHover={e => this.PlotOnHover(e)}
                    onUnhover={e => this.PlotOnUnHover(e)}
                    onRelayout={e => this.PlotOnRelayout(e)}
                    onInitialized={figure => this.setState(figure)}
                    onUpdate={figure => this.setState(figure)}
                  />
                </div>
              </div>
              {this.state.toggleTrackHorizontal ? (
                <div id="divTrackHorizontal" className="row">
                  <div className="col-md-12">
                    <div className="row">
                      <div className="col-md-12">
                        <Plot
                          divId="plotTracksHorizontal"
                          style={{ width: '100%', height: '35vh' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {this.state.toggleTrackVertical ? (
              <div id="divTrackVertical" className="col-md-3">
                <div className="row">
                  <div className="col-md-12">
                    <Plot
                      divId="plotTracksVertical"
                      style={{ width: '100%', height: '95vh' }}
                    />
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
        <Modal isOpen={this.state.modalStart}>
          <ModalHeader>
            <b>Templates de Usuario</b>
          </ModalHeader>
          <ModalBody>
            <div className="row">
              <div className="col-md-5">
                <div className="form-group">
                  <label>
                    <b>Campo: </b>
                  </label>
                  <select
                    name="field_id"
                    id="wells_id"
                    className="form-control"
                    onChange={this.handleChange}
                    defaultValue={template ? template.field_id : 0}
                  >
                    <option key="0" value="0">
                      Seleccionar
                    </option>
                    {this.state.dataFields.map(elemento => (
                      <option key={elemento.id} value={elemento.id}>
                        {elemento.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-md-7">
                <div className="form-group">
                  <label>
                    <b>Pozo: </b>
                  </label>
                  <select
                    name="wells_id"
                    id="wells_id"
                    className="form-control"
                    onChange={this.handleChange}
                    defaultValue={template ? template.wells_id : 0}
                  >
                    <option key="0" value="0">
                      Seleccionar
                    </option>
                    {this.state.dataWells.map(elemento => (
                      <option key={elemento.id} value={elemento.id}>
                        {elemento.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                {template.wells_id > 0 ? (
                  <div className="form-group">
                    <label>
                      <b>Templates: </b>
                    </label>
                    <button
                      className="btn btn-primary btn-sm float-right"
                      onClick={() => this.NuevoTemplate()}
                    >
                      Nuevo
                    </button>
                    <table className="table table-sm table-striped">
                      <thead>
                        <tr>
                          <td></td>
                          <td></td>
                          <td style={{ width: '80px' }}></td>
                          <td style={{ width: '80px' }}></td>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.dataTemplates
                          ? this.state.dataTemplates.map((row, index) => (
                              <tr key={'row_' + index}>
                                <td> {row.nombre} </td>
                                <td> {row.descripcion} </td>
                                <td>
                                  <button
                                    id={'btnopen_' + index}
                                    className="btn btn-sm btn-block btn-success"
                                    onClick={() => this.AbrirTemplate(row.id)}
                                  >
                                    Abrir
                                  </button>
                                </td>
                                <td>
                                  <button
                                    id={'btndel_' + index}
                                    className="btn btn-sm btn-block btn-danger"
                                    onClick={() =>
                                      this.EliminarTemplate(row.id)
                                    }
                                  >
                                    Eliminar
                                  </button>
                                </td>
                              </tr>
                            ))
                          : null}
                      </tbody>
                    </table>
                  </div>
                ) : null}
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <button
              className="btn btn-light"
              onClick={() => this.setState({ modalStart: false })}
            >
              Cancelar
            </button>
            <button className="btn btn-secondary" onClick={() => this.IrHome()}>
              Cerrar
            </button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modalNuevo}>
          <ModalHeader>
            <b>Crear Template</b>
          </ModalHeader>
          <ModalBody>
            <div className="row">
              <div className="col-md-12">
                <div className="form-group">
                  <label>Nombre</label>
                  <input type="text" className="form-control" />
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <button
              className="btn btn-success"
              onClick={() => this.GuardarTemplate()}
            >
              Guardar
            </button>
            <button className="btn btn-secondary" onClick={() => this.Start()}>
              Cancelar
            </button>
          </ModalFooter>
        </Modal>

        <ModalTemplate
          template={template}
          modalConfig={this.state.modalConfig}
          dataCurvas={this.state.tmpDataCurvas}
          toggle={(a, b, c) => this.toggleModalTemplate(a, b, c)}
          setDataGP={e => this.setDataCurvas(e)}
          setDataTH={e => this.setDataTrackHorizontal(e)}
        />
      </div>
    );
  }
}
export default Graficador;
