import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import SideBar from '../componentes/sidebar';
import Cabecera from '../componentes/cabecera';
import iconList from '../util/iconList';
import '../css/styles.css';

const URL = process.env.REACT_APP_API_HOST;
// const urlAuxiliar = 'http://localhost:9000/wells';
// const urlAuxiliar1 = 'http://localhost:9000/archivolas';
// const urlAuxiliar2 = 'http://localhost:9000/datos_entrada';
// const urlAuxiliar3 = 'http://localhost:9000/template_config';
class viewVisualConfig extends Component {
  state = {
    isLoaded: false,
    items: [],
    dataWells: [],
    dataVariables: [],
    dataArchivo: [],
    campost: [],
    dataTelemetria: [],
    dataTrack: [],
    visual_ajax1: false,
    visual_ajax2: false,
    visual_variable: false,
    select_archivo: false,
    select_telemetria: false,
    form: {
      wells_id: '',
      archivo_encabezado_id: '',
      archivo: '',
      datetime: '',
      dmea: '',
      dbtm: '',
      rpm: '',
      ropa: '',
      mfia: '',
      tqa: '',
      wob: '',
      nmenonicosarcs: '',
      datetime_est: false,
      dmea_est: false,
      dbtm_est: false,
      rpm_est: false,
      ropa_est: false,
      mfia_est: false,
      tqa_est: false,
      wob_est: false,
      datetime_estt: false,
      dmea_estt: false,
      dbtm_estt: false,
      rpm_estt: false,
      ropa_estt: false,
      mfia_estt: false,
      tqa_estt: false,
      wob_estt: false,
      pkuser: '',
      contador: 0,
    },

    form1: {
      wells_id: '',
      archivo_encabezado_id: '',
      datetime: '',
      dmea: '',
      dbtm: '',
      rpm: '',
      ropa: '',
      mfia: '',
      tqa: '',
      wob: '',
      pkuser: '',
    },

    auxWellsid: '',
    auxArchsid: '',
    auxContador: 0,
  };

  peticionPost = async () => {
    await this.setState({
      form1: {
        wells_id: this.state.form.wells_id,
        archivo_encabezado_id: this.state.form.archivo_encabezado_id,
        datetime: this.state.form.datetime,
        dmea: this.state.form.dmea,
        dbtm: this.state.form.dbtm,
        rpm: this.state.form.rpm,
        ropa: this.state.form.ropa,
        mfia: this.state.form.mfia,
        tqa: this.state.form.tqa,
        wob: this.state.form.wob,
        pkuser: JSON.parse(sessionStorage.getItem('user')).pk_usuario_sesion,
      },
    });

    await axios
      .post(URL + 'template_config', this.state.form1)
      .then(response => {
        return this.props.history.push('/visual_config_lista');
      })
      .catch(error => {
        console.log(error.message);
      });
  };

  peticionWellsGet = () => {
    axios
      .get(URL + 'wells')
      .then(response => {
        this.setState({ dataWells: response.data });
      })
      .catch(error => {
        console.log(error.message);
      });
  };

  peticionArchivoLasGet = idw => {
    axios
      .get(URL + 'archivolas?idw=' + idw)
      .then(response => {
        this.setState({ dataArchivo: response.data });
        if (this.state.dataArchivo.length > 0) {
          this.setState({ visual_ajax2: true });
        } else {
          this.setState({ visual_ajax2: false });
        }
        ReactDOM.render();
      })
      .catch(error => {
        console.log(error.message);
      });
  };

  peticionArchivoLasGet2 = (ida, idr) => {
    axios
      .get(URL + 'archivolas?idar=' + ida + '&idr=' + idr)
      .then(response => {
        this.setState({ dataVariables: response.data });
        if (this.state.dataVariables.length > 0) {
          this.setState({ visual_variable: true });
        } else {
          this.setState({ visual_variable: false });
        }
        ReactDOM.render();
      })
      .catch(error => {
        console.log(error.message);
      });
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

    let contadorvariables = this.state.auxContador;

    axios
      .get(URL + 'archivolas?idar=' + ida + '&idr=' + idr)
      .then(response => {
        this.setState({ dataVariables: response.data });

        for (let k = 0; k < this.state.dataVariables.length; k++) {
          if (this.state.dataVariables[k].campos === 'DATETIME') {
            datetimeest = true;
            contadorvariables = contadorvariables + 1;
          }
          if (this.state.dataVariables[k].campos === 'DMEA') {
            dmeaest = true;
            contadorvariables = contadorvariables + 1;
          }
          if (this.state.dataVariables[k].campos === 'DBTM') {
            dbtmest = true;
            contadorvariables = contadorvariables + 1;
          }
          if (this.state.dataVariables[k].campos === 'RPM') {
            rpmest = true;
            contadorvariables = contadorvariables + 1;
          }
          if (this.state.dataVariables[k].campos === 'ROPA') {
            ropaest = true;
            contadorvariables = contadorvariables + 1;
          }
          if (this.state.dataVariables[k].campos === 'MFIA') {
            mfiaest = true;
            contadorvariables = contadorvariables + 1;
          }
          if (this.state.dataVariables[k].campos === 'TQA') {
            tqaest = true;
            contadorvariables = contadorvariables + 1;
          }
          if (this.state.dataVariables[k].campos === 'WOB') {
            wobest = true;
            contadorvariables = contadorvariables + 1;
          }
          nmenonicosarc =
            nmenonicosarc + this.state.dataVariables[k].campos + ',';
        }

        this.setState({
          form: {
            nmenonicosarcs: nmenonicosarc.substring(
              nmenonicosarc.length - 1,
              1
            ),
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

            contador: contadorvariables,
          },
          auxContador: contadorvariables,
        });
      })
      .catch(error => {
        console.log(error.message);
      });
  };

  //-> revisado
  peticionDatosEntradaGet = idw => {
    var datetimeestt = false;
    var dmeaestt = false;
    var dbtmestt = false;
    var rpmestt = false;
    var ropaestt = false;
    var mfiaestt = false;
    var tqaestt = false;
    var wobestt = false;

    axios
      .get(URL + 'datos_entrada?id=' + idw)
      .then(response => {
        this.setState({ dataTelemetria: response.data });

        let contadorvariables = 0;
        if (this.state.dataTelemetria.length > 0) {
          this.setState({ campost: this.state.dataTelemetria[0].nameMnemonic });
          var cadena = this.state.campost.split(',');

          for (let k = 0; k < cadena.length; k++) {
            if (cadena[k] === 'DATETIME') {
              datetimeestt = true;
              contadorvariables = contadorvariables + 1;
            }
            if (cadena[k] === 'DMEA') {
              dmeaestt = true;
              contadorvariables = contadorvariables + 1;
            }
            if (cadena[k] === 'DBTM') {
              dbtmestt = true;
              contadorvariables = contadorvariables + 1;
            }
            if (cadena[k] === 'RPM') {
              rpmestt = true;
              contadorvariables = contadorvariables + 1;
            }
            if (cadena[k] === 'ROPA') {
              ropaestt = true;
              contadorvariables = contadorvariables + 1;
            }
            if (cadena[k] === 'MFIA') {
              mfiaestt = true;
              contadorvariables = contadorvariables + 1;
            }
            if (cadena[k] === 'TQA') {
              tqaestt = true;
              contadorvariables = contadorvariables + 1;
            }
            if (cadena[k] === 'WOB') {
              wobestt = true;
              contadorvariables = contadorvariables + 1;
            }
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
        } else {
          this.setState({
            visual_ajax1: false,
          });
        }
      })
      .catch(error => {
        console.log(error.message);
      });
  };

  peticionDatosEntradaGet2 = idm => {
    axios
      .get(URL + 'datos_entrada?idm=' + idm)
      .then(response => {
        this.setState({ dataVariables: response.data });
        if (this.state.dataVariables.length > 0) {
          this.setState({ visual_variable: true });
        } else {
          this.setState({ visual_variable: false });
        }
        ReactDOM.render();
      })
      .catch(error => {
        console.log(error.message);
      });
  };

  componentDidMount() {
    this.peticionWellsGet();
  }

  handleChange = async e => {
    e.persist();
    await this.setState({ selectValue: e.target.value });
    this.setState({
      visual_ajax1: false,
      visual_ajax2: false,
      select_archivo: false,
      select_telemetria: false,
    });
    this.peticionDatosEntradaGet(this.state.selectValue);
    this.peticionArchivoLasGet(this.state.selectValue);

    this.setState({
      auxWellsid: this.state.selectValue,
      auxContador: this.state.form.contador,
    });

    await this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value,
        wells_id: this.state.selectValue,
        contador: this.state.auxContador,
      },
    });
  };

  handleChange21 = async e => {
    e.persist();
    await this.setState({ selectValue: e.target.value });

    this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value,
        wells_id: this.state.auxWellsid,
        archivo_encabezado_id: this.state.auxArchsid,
        contador: this.state.auxContador,
      },
    });
  };

  handleChange2 = async e => {
    e.persist();
    await this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value,
      },
    });

    console.log(this.state.form);

    this.setState({
      auxArchsid: this.state.form.archivo_encabezado_id,
      auxContador: this.state.form.contador,
    });

    this.peticionArchivoLasGet3(this.state.form.archivo_encabezado_id, 2);

    console.log(this.state.form);

    if (this.state.form.archivo_encabezado_id > 0) {
      this.setState({ select_archivo: true });
    }

    if (this.state.dataTelemetria.length > 0) {
      this.setState({ select_telemetria: true });
    }
  };

  render() {
    const { form } = this.state;

    return (
      <div className="App">
        <Cabecera />
        <SideBar pageWrapId={'page-wrap'} outerContainerId={'App'} />
        <div className="containerCuatro">
          <Link className="btn btn-outline-secondary" to="/visual_config_lista">
            <iconList.CancelIcon /> Regresar
          </Link>
        </div>

        <div
          className="form-group col-8"
          style={{ float: 'left', padding: '0 0 0 70px' }}
        >
          <br />
          <h5>
            Nueva parametrizaci&oacute;n de la visualizaci&oacute;n de la
            gr&aacute;fica principal
          </h5>
          <hr></hr>
          <h6>
            <iconList.Add /> 1: Selecci&oacute;n del Pozo y fuente de origen de
            datos
          </h6>
          <hr></hr>
          <div
            style={{ float: 'left', padding: '15px 0 0 60px' }}
            className="form-group"
          >
            <input
              className="form-control"
              type="hidden"
              name="contador"
              id="contador"
              value={form ? form.contador : ''}
            />
            Seleccion el Wells
            <select
              name="wells_id"
              id="wells_id"
              className="form-control"
              value={form.wells_id}
              onChange={this.handleChange}
            >
              <option key="0" value="0">
                Seleccionar el pozo a visualizar
              </option>
              {this.state.dataWells.map(elemento => (
                <option key={elemento.id} value={elemento.id}>
                  {elemento.tag} - {elemento.nombre}
                </option>
              ))}
            </select>
            {this.state.visual_ajax1 ? (
              <div id="ajax_visual1">
                <span className="badge badge-success">
                  Datos de telemetria: Encontrados con los Mnemonicos:
                  {this.state.dataTelemetria.map(
                    elemento => elemento.nameMnemonic
                  )}
                </span>
                <br />
              </div>
            ) : (
              <div>
                <span className="badge badge-light">
                  Datos de telemetria: NO Encontrados
                </span>
                <br />
              </div>
            )}
            <br />
            {this.state.visual_ajax2 ? (
              <div id="ajax_visual2">
                <label htmlFor="archivo_encabezado_idt">
                  Archivos .Las encontrados
                </label>
                <select
                  name="archivo_encabezado_id"
                  id="archivo_encabezado_id"
                  className="form-control"
                  value={form ? form.archivo_encabezado_id : ''}
                  onChange={this.handleChange2}
                >
                  <option key="0" value="0">
                    Seleccionar el archivo
                  </option>
                  {this.state.dataArchivo.map(elemento => (
                    <option key={elemento.id} value={elemento.id}>
                      {elemento.nombre_archivo}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <span className="badge badge-light">
                  Archivos .LAS: NO Encontrados
                </span>
                <br />
              </div>
            )}
            <div id="nemonicarc">
              {this.state.select_archivo ? (
                <div>
                  <span className="badge badge-success">
                    Datos de archivo .las: Encontrados con los Mnemonicos:
                    {this.state.form.nmenonicosarcs}
                  </span>
                </div>
              ) : (
                <div></div>
              )}
            </div>
          </div>
          <br />
          {this.state.visual_ajax1 || this.state.visual_ajax2 ? (
            <div style={{ clear: 'both' }} className="form-group col-12">
              <hr></hr>
              <h6>
                <iconList.Add /> 2: Parametrizaci&oacute;n de la Gr&aacute;fica
                Principal
              </h6>
              <hr></hr>
            </div>
          ) : (
            <div></div>
          )}

          {this.state.visual_ajax1 || this.state.visual_ajax2 ? (
            <div
              style={{ float: 'left', padding: '15px 0 0 60px' }}
              className="form-group col-12"
            >
              <div className="container">
                <div className="row">
                  <div className="col-2">VARIABLE</div>
                  <div className="col-4">FUENTES DE ORIGEN</div>
                </div>

                <div className="row">
                  <div className="col-2">DATETIME</div>
                  {this.state.visual_ajax1 && this.state.form.datetime_estt ? (
                    <div className="col-4">
                      <input
                        type="radio"
                        value="1"
                        name="datetime"
                        onChange={this.handleChange21}
                      />
                      Telemetria
                    </div>
                  ) : (
                    <div className="col-2"></div>
                  )}
                  {this.state.visual_ajax2 &&
                  this.state.select_archivo &&
                  this.state.form.datetime_est ? (
                    <div className="col-4">
                      <input
                        type="radio"
                        value="2"
                        name="datetime"
                        onChange={this.handleChange21}
                      />
                      Archivo .Las
                    </div>
                  ) : (
                    <div className="col-2"></div>
                  )}
                </div>

                <div className="row">
                  <div className="col-2">DMEA</div>
                  {this.state.visual_ajax1 && this.state.form.dmea_estt ? (
                    <div className="col-4">
                      <input
                        type="radio"
                        value="1"
                        name="dmea"
                        onChange={this.handleChange21}
                      />
                      Telemetria
                    </div>
                  ) : (
                    <div className="col-2"></div>
                  )}
                  {this.state.visual_ajax2 &&
                  this.state.select_archivo &&
                  this.state.form.dmea_est ? (
                    <div className="col-4">
                      <input
                        type="radio"
                        value="2"
                        name="dmea"
                        onChange={this.handleChange21}
                      />
                      Archivo .Las
                    </div>
                  ) : (
                    <div className="col-2"></div>
                  )}
                </div>

                <div className="row">
                  <div className="col-2">DBTM</div>
                  {this.state.visual_ajax1 && this.state.form.dbtm_estt ? (
                    <div className="col-4">
                      <input
                        type="radio"
                        value="1"
                        name="dbtm"
                        onChange={this.handleChange21}
                      />
                      Telemetria
                    </div>
                  ) : (
                    <div className="col-2"></div>
                  )}
                  {this.state.visual_ajax2 &&
                  this.state.select_archivo &&
                  this.state.form.dbtm_est ? (
                    <div className="col-4">
                      <input
                        type="radio"
                        value="2"
                        name="dbtm"
                        onChange={this.handleChange21}
                      />
                      Archivo .Las
                    </div>
                  ) : (
                    <div className="col-2"></div>
                  )}
                </div>

                <div className="row">
                  <div className="col-2">RPM</div>
                  {this.state.visual_ajax1 && this.state.form.rpm_estt ? (
                    <div className="col-4">
                      <input
                        type="radio"
                        value="1"
                        name="rpm"
                        onChange={this.handleChange21}
                      />
                      Telemetria
                    </div>
                  ) : (
                    <div className="col-2"></div>
                  )}
                  {this.state.visual_ajax2 &&
                  this.state.select_archivo &&
                  this.state.form.rpm_est ? (
                    <div className="col-4">
                      <input
                        type="radio"
                        value="2"
                        name="rpm"
                        onChange={this.handleChange21}
                      />
                      Archivo .Las
                    </div>
                  ) : (
                    <div className="col-2"></div>
                  )}
                </div>

                <div className="row">
                  <div className="col-2">ROPA</div>
                  {this.state.visual_ajax1 && this.state.form.ropa_estt ? (
                    <div className="col-4">
                      <input
                        type="radio"
                        value="1"
                        name="ropa"
                        onChange={this.handleChange21}
                      />
                      Telemetria
                    </div>
                  ) : (
                    <div className="col-2"></div>
                  )}
                  {this.state.visual_ajax2 &&
                  this.state.select_archivo &&
                  this.state.form.ropa_est ? (
                    <div className="col-4">
                      <input
                        type="radio"
                        value="2"
                        name="ropa"
                        onChange={this.handleChange21}
                      />
                      Archivo .Las
                    </div>
                  ) : (
                    <div className="col-2"></div>
                  )}
                </div>

                <div className="row">
                  <div className="col-2">MFIA</div>
                  {this.state.visual_ajax1 && this.state.form.mfia_estt ? (
                    <div className="col-4">
                      <input
                        type="radio"
                        value="1"
                        name="mfia"
                        onChange={this.handleChange21}
                      />
                      Telemetria
                    </div>
                  ) : (
                    <div className="col-2"></div>
                  )}
                  {this.state.visual_ajax2 &&
                  this.state.select_archivo &&
                  this.state.form.mfia_estt ? (
                    <div className="col-4">
                      <input
                        type="radio"
                        value="2"
                        name="mfia"
                        onChange={this.handleChange21}
                      />
                      Archivo .Las
                    </div>
                  ) : (
                    <div className="col-2"></div>
                  )}
                </div>

                <div className="row">
                  <div className="col-2">TQA</div>
                  {this.state.visual_ajax1 && this.state.form.tqa_estt ? (
                    <div className="col-4">
                      <input
                        type="radio"
                        value="1"
                        name="tqa"
                        onChange={this.handleChange21}
                      />
                      Telemetria
                    </div>
                  ) : (
                    <div className="col-2"></div>
                  )}
                  {this.state.visual_ajax2 &&
                  this.state.select_archivo &&
                  this.state.form.tqa_est ? (
                    <div className="col-4">
                      <input
                        type="radio"
                        value="2"
                        name="tqa"
                        onChange={this.handleChange21}
                      />
                      Archivo .Las
                    </div>
                  ) : (
                    <div className="col-2"></div>
                  )}
                </div>

                <div className="row">
                  <div className="col-2">WOB</div>
                  {this.state.visual_ajax1 && this.state.form.wob_estt ? (
                    <div className="col-4">
                      <input
                        type="radio"
                        value="1"
                        name="wob"
                        onChange={this.handleChange21}
                      />
                      Telemetria
                    </div>
                  ) : (
                    <div className="col-2"></div>
                  )}
                  {this.state.visual_ajax2 &&
                  this.state.select_archivo &&
                  this.state.form.wob_est ? (
                    <div className="col-4">
                      <input
                        type="radio"
                        value="2"
                        name="wob"
                        onChange={this.handleChange21}
                      />
                      Archivo .Las
                    </div>
                  ) : (
                    <div className="col-2"></div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div></div>
          )}

          {this.state.visual_ajax1 || this.state.visual_ajax2 ? (
            <div
              style={{ float: 'left', padding: '15px 0 0 60px' }}
              className="form-group col-12"
            >
              <hr></hr>
              <div className="container">
                <div className="row">
                  {this.state.form.contador > 7 ? (
                    <div className="col-4">
                      <button
                        className="btn btn-success"
                        onClick={() => this.peticionPost()}
                        style={{ float: 'center' }}
                      >
                        <iconList.Save /> Guardar Configuraci&oacute;n
                      </button>
                    </div>
                  ) : (
                    <div className="alert alert-danger col-6" role="alert">
                      No estan las variables necesarias para configurar la
                      gr&aacute;fica principal <br />
                    </div>
                  )}
                  <div className="col-2">
                    <Link className="btn btn-danger" to="/visual_config_lista">
                      <iconList.CancelIcon /> Cancelar
                    </Link>
                  </div>
                </div>
              </div>
              <hr></hr>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    );
  }
}
export default viewVisualConfig;
