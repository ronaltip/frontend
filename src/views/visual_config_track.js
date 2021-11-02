import React, { Component, forwardRef } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import SideBar from '../componentes/sidebar';
import Cabecera from '../componentes/cabecera';
import '../css/styles.css';
import iconList from '../util/iconList';

const URL = process.env.REACT_APP_API_HOST;

// const urlAuxiliar = "http://localhost:9000/wells";
// const urlAuxiliar1 = 'http://localhost:9000/archivolas';
// const urlAuxiliar2 = 'http://localhost:9000/datos_entrada';
class viewVisualConfigTrack extends Component {
  state = {
    isLoaded: false,
    items: [],
    dataWells: [],
    dataVariables: [],
    dataArchivo: [],
    dataTelemetria: [],
    dataTrack: [],
    visual_ajax1: false,
    visual_ajax2: false,
    visual_variable: false,
    select_archivo: false,
    select_telemetria: false,
    nTrackH: false,
    nTrackV: false,
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
      pkuser: '',
    },
    formt: {
      archivo_encabezado_id: '',
      origen: '',
      variable: '',
      orden: '',
      tipo: '',
      habilitar: '',
    },
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

    axios
      .get(URL + 'archivolas?idar=' + ida + '&idr=' + idr)
      .then(response => {
        this.setState({ dataVariables: response.data });

        for (let k = 0; k < this.state.dataVariables.length; k++) {
          if (this.state.dataVariables[k].campos === 'DATETIME') {
            datetimeest = true;
          }
          if (this.state.dataVariables[k].campos === 'DMEA') {
            dmeaest = true;
          }
          if (this.state.dataVariables[k].campos === 'DBTM') {
            dbtmest = true;
          }
          if (this.state.dataVariables[k].campos === 'RPM') {
            rpmest = true;
          }
          if (this.state.dataVariables[k].campos === 'ROPA') {
            ropaest = true;
          }
          if (this.state.dataVariables[k].campos === 'MFIA') {
            mfiaest = true;
          }
          if (this.state.dataVariables[k].campos === 'TQA') {
            tqaest = true;
          }
          if (this.state.dataVariables[k].campos === 'WOB') {
            wobest = true;
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
          },
        });
        console.log(this.state.form);

        ReactDOM.render();
      })
      .catch(error => {
        console.log(error.message);
      });
  };

  peticionDatosEntradaGet = idw => {
    axios
      .get(URL + 'datos_entrada?id=' + idw)
      .then(response => {
        this.setState({ dataTelemetria: response.data });
        if (this.state.dataTelemetria.length > 0) {
          this.setState({
            visual_ajax1: true,
          });
        } else {
          this.setState({
            visual_ajax1: false,
          });
        }
        ReactDOM.render();
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
    await this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value,
      },
    });
    console.log(this.state.form);
  };

  handleChange21 = async e => {
    e.persist();
    await this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value,
      },
    });

    console.log(this.state.form);
  };

  handleChange2 = async e => {
    e.persist();
    await this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value,
      },
    });

    this.peticionArchivoLasGet3(this.state.form.archivo_encabezado_id, 2);

    this.state.formt.archivo_encabezado_id =
      this.state.form.archivo_encabezado_id;

    if (this.state.form.archivo_encabezado_id > 0) {
      this.setState({ select_archivo: true });
    }

    if (this.state.dataTelemetria.length > 0) {
      this.setState({ select_telemetria: true });
    }

    console.log(this.state.form);
  };

  handleChange3 = async e => {
    e.persist();
    await this.setState({
      formt: {
        ...this.state.formt,
        [e.target.name]: e.target.value,
      },
    });
    console.log(this.state.formt);
  };

  handleChange4 = async e => {
    e.persist();
    this.state.formt.tipo = '0';
    this.state.visual_variable = false;
    if (e.target.value === 1) {
      this.peticionDatosEntradaGet2(this.state.form.wells_id);
      this.state.formt.tipo = '1';
      this.state.formt.habilitar = false;
    } else if (e.target.value === 2) {
      this.state.formt.habilitar = true;
    }

    await this.setState({
      formt: {
        ...this.state.formt,
        [e.target.name]: e.target.value,
      },
    });

    console.log(this.state.formt);
  };

  handleChange5 = async e => {
    e.persist();
    await this.setState({
      formt: {
        ...this.state.formt,
        [e.target.name]: e.target.value,
      },
    });

    this.state.visual_variable = false;
    if (this.state.formt.origen === 1) {
      this.state.formt.habilitar = false;
    } else {
      this.peticionArchivoLasGet2(
        this.state.formt.archivo_encabezado_id,
        this.state.formt.tipo
      );
      this.state.formt.habilitar = true;
      this.state.visual_variable = true;
    }
  };

  render() {
    const { form, formt } = this.state;

    return (
      <div className="App">
        <Cabecera />
        <SideBar pageWrapId={'page-wrap'} outerContainerId={'App'} />

        <div className="form-group col-8">
          <br />
          <h5>
            Parametrizaci&oacute;n de la visualizaci&oacute;n gr&aacute;fica
          </h5>
          <hr></hr>
          <h6>
            <iconList.Add /> 1: Selecci&oacute;n del Pozo y fuente de origen de
            datos
          </h6>
          <hr></hr>
          <div style={{ float: 'right' }} className="form-group col-8">
            Seleccion el Wells
            <select
              name="wells_id"
              id="wells_id"
              className="form-control"
              value={this.state.selectValue}
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
            <br />
            {this.state.visual_ajax1 ? (
              <div id="ajax_visual1">
                <label htmlFor="telemetria_idt">
                  Datos de telemetria: Encontrados con los Mnemonicos:
                  {this.state.dataTelemetria.map(
                    elemento => elemento.nameMnemonic
                  )}
                </label>
                <br />
              </div>
            ) : (
              <div>
                <label htmlFor="telemetria_idt">
                  Datos de telemetria: NO Encontrados
                </label>
                <br />
              </div>
            )}
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
                <label htmlFor="archivo_encabezado_id">
                  Archivos .LAS: NO Encontrados
                </label>
                <br />
              </div>
            )}
            <div id="nemonicarc">
              {this.state.select_archivo ? (
                <div> {this.state.form.nmenonicosarcs}</div>
              ) : (
                <div></div>
              )}
            </div>
          </div>
          <br />
          {this.state.visual_ajax1 || this.state.visual_ajax2 ? (
            <div style={{ clear: 'both' }} className="form-group col-8">
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
            <div style={{ float: 'right' }} className="form-group col-8">
              <br />
              <table width="100%">
                <thead>
                  <tr>
                    <th width="33%">VARIABLE</th>
                    <th colSpan="2">FUENTES DE ORIGEN </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td width="33%">DATETIME</td>
                    <td width="33%">
                      {this.state.visual_ajax1 ? (
                        <div>
                          <input
                            type="radio"
                            value="1"
                            name="datetime"
                            onChange={this.handleChange21}
                          />
                          Telemetria
                        </div>
                      ) : (
                        <div></div>
                      )}
                    </td>
                    <td width="33%">
                      {this.state.visual_ajax2 &&
                      this.state.select_archivo &&
                      this.state.form.datetime_est ? (
                        <div>
                          <input
                            type="radio"
                            value="2"
                            name="datetime"
                            onChange={this.handleChange21}
                          />
                          Archivo .Las
                        </div>
                      ) : (
                        <div></div>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td width="33%">DMEA</td>
                    <td width="33%">
                      {this.state.visual_ajax1 ? (
                        <div>
                          <input
                            type="radio"
                            value="1"
                            name="dmea"
                            onChange={this.handleChange21}
                          />
                          Telemetria
                        </div>
                      ) : (
                        <div></div>
                      )}
                    </td>
                    <td width="33%">
                      {this.state.visual_ajax2 &&
                      this.state.select_archivo &&
                      this.state.form.dmea_est ? (
                        <div>
                          <input
                            type="radio"
                            value="2"
                            name="dmea"
                            onChange={this.handleChange21}
                          />
                          Archivo .Las
                        </div>
                      ) : (
                        <div></div>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td width="33%">DBTM</td>
                    <td width="33%">
                      {this.state.visual_ajax1 ? (
                        <div>
                          <input
                            type="radio"
                            value="1"
                            name="dbtm"
                            onChange={this.handleChange21}
                          />
                          Telemetria
                        </div>
                      ) : (
                        <div></div>
                      )}
                    </td>
                    <td width="33%">
                      {this.state.visual_ajax2 &&
                      this.state.select_archivo &&
                      this.state.form.dbtm_est ? (
                        <div>
                          <input
                            type="radio"
                            value="2"
                            name="dbtm"
                            onChange={this.handleChange21}
                          />
                          Archivo .Las
                        </div>
                      ) : (
                        <div></div>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td width="33%">RPM</td>
                    <td width="33%">
                      {this.state.visual_ajax1 ? (
                        <div>
                          <input
                            type="radio"
                            value="1"
                            name="rpm"
                            onChange={this.handleChange21}
                          />
                          Telemetria
                        </div>
                      ) : (
                        <div></div>
                      )}
                    </td>
                    <td width="33%">
                      {this.state.visual_ajax2 &&
                      this.state.select_archivo &&
                      this.state.form.rpm_est ? (
                        <div>
                          <input
                            type="radio"
                            value="2"
                            name="rpm"
                            onChange={this.handleChange21}
                          />
                          Archivo .Las
                        </div>
                      ) : (
                        <div></div>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td width="33%">ROPA</td>
                    <td width="33%">
                      {this.state.visual_ajax1 ? (
                        <div>
                          <input
                            type="radio"
                            value="1"
                            name="ropa"
                            onChange={this.handleChange21}
                          />
                          Telemetria
                        </div>
                      ) : (
                        <div></div>
                      )}
                    </td>
                    <td width="33%">
                      {this.state.visual_ajax2 &&
                      this.state.select_archivo &&
                      this.state.form.ropa_est ? (
                        <div>
                          <input
                            type="radio"
                            value="2"
                            name="ropa"
                            onChange={this.handleChange21}
                          />
                          Archivo .Las
                        </div>
                      ) : (
                        <div></div>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td width="33%">MFIA</td>
                    <td width="33%">
                      {this.state.visual_ajax1 ? (
                        <div>
                          <input
                            type="radio"
                            value="1"
                            name="mfia"
                            onChange={this.handleChange21}
                          />
                          Telemetria
                        </div>
                      ) : (
                        <div></div>
                      )}
                    </td>
                    <td width="33%">
                      {this.state.visual_ajax2 &&
                      this.state.select_archivo &&
                      this.state.form.mfia_est ? (
                        <div>
                          <input
                            type="radio"
                            value="2"
                            name="mfia"
                            onChange={this.handleChange21}
                          />
                          Archivo .Las
                        </div>
                      ) : (
                        <div></div>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td width="33%">TQA</td>
                    <td width="33%">
                      {this.state.visual_ajax1 ? (
                        <div>
                          <input
                            type="radio"
                            value="1"
                            name="tqa"
                            onChange={this.handleChange21}
                          />
                          Telemetria
                        </div>
                      ) : (
                        <div></div>
                      )}
                    </td>
                    <td width="33%">
                      {this.state.visual_ajax2 &&
                      this.state.select_archivo &&
                      this.state.form.tqa_est ? (
                        <div>
                          <input
                            type="radio"
                            value="2"
                            name="tqa"
                            onChange={this.handleChange21}
                          />
                          Archivo .Las
                        </div>
                      ) : (
                        <div></div>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td width="33%">WOB</td>
                    <td width="33%">
                      {this.state.visual_ajax1 ? (
                        <div>
                          <input
                            type="radio"
                            value="1"
                            name="wob"
                            onChange={this.handleChange21}
                          />
                          Telemetria
                        </div>
                      ) : (
                        <div></div>
                      )}
                    </td>
                    <td width="33%">
                      {this.state.visual_ajax2 &&
                      this.state.select_archivo &&
                      this.state.form.wob_est ? (
                        <div>
                          <input
                            type="radio"
                            value="2"
                            name="wob"
                            onChange={this.handleChange21}
                          />
                          Archivo .Las
                        </div>
                      ) : (
                        <div></div>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div></div>
          )}

          {this.state.visual_ajax1 || this.state.visual_ajax2 ? (
            <div style={{ clear: 'both' }} className="form-group col-8">
              <hr></hr>
              <h6>
                <iconList.Add /> 3: Parametrizaci&oacute;n de Track Horizontales
                y Verticales
              </h6>
              <hr></hr>
            </div>
          ) : (
            <div></div>
          )}
          {this.state.visual_ajax1 || this.state.visual_ajax2 ? (
            <div style={{ float: 'right' }} className="form-group col-8">
              <label>Fuente de origen</label>
              <select
                name="origen"
                id="origen"
                className="form-control"
                value={formt ? formt.origen : ''}
                onChange={this.handleChange4}
              >
                <option key="org0" value="0">
                  Seleccionar el archivo
                </option>
                <option key="org1" value="1">
                  Dato de telemetria
                </option>
                {this.state.select_archivo ? (
                  <option key="org2" value="2">
                    Archivo .Las
                  </option>
                ) : (
                  <option key="org2" value="2" disabled>
                    Archivo .Las
                  </option>
                )}
              </select>
              <br />

              <label>Tipo de Track</label>
              <select
                name="tipo"
                id="tipo"
                className="form-control"
                value={formt ? formt.tipo : ''}
                onChange={this.handleChange5}
              >
                <option key="tipo0" value="0">
                  Seleccionar el archivo
                </option>
                <option key="tipo1" value="1">
                  Tiempo (Horizontal)
                </option>
                {this.state.formt.habilitar ? (
                  <option key="tipo2" value="2">
                    Profundidad (Vertical)
                  </option>
                ) : (
                  <option key="tipo2" value="2" disabled="disabled">
                    Profundidad (Vertical)
                  </option>
                )}
              </select>

              {this.state.visual_variable ? (
                <div>
                  <br />
                  <label>Variable</label>
                  <select
                    name="variable"
                    id="variable"
                    className="form-control"
                    value={formt ? formt.variable : ''}
                    onChange={this.handleChange3}
                  >
                    <option key="variable0" value="0">
                      Seleccionar el archivo
                    </option>
                    {this.state.dataVariables.map(elemento => (
                      <option value={elemento.campos}>{elemento.campos}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  No se encontraron variables en la seleccion realizada.
                </div>
              )}
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    );
  }
}
export default viewVisualConfigTrack;
