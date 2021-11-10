import React, { Component } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Link } from 'react-router-dom';
import Materialtable from 'material-table';
import SideBar from '../componentes/sidebar';
import Cabecera from '../componentes/cabecera';
import iconList from '../util/iconList';
import '../css/styles.css';

const URL = process.env.REACT_APP_API_HOST;
// const url = 'http://localhost:9000/template_config';
// const urlAuxiliar1 = 'http://localhost:9000/template_track_config';
// const urlAuxiliar3 = 'http://localhost:9000/tipo_curvas';

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
class viewVisualConfigLista extends Component {
  state = {
    data: [],
    data1: [],
    dataTipoTrack: [],
    dataTipoCurva: [],
    modalInsertar: false,
    modalEliminar: false,
    nombreck: '',
    form: {
      id: '',
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
    form2: {
      id: '',
      template_config_id: '',
      tipo_track_id: '',
      tipo_curva_id: '',
      origen: '',
      pkuser: '',
    },
  };

  peticionGet = async () => {
    axios
      .get(URL + 'template_config')
      .then(response => {
        this.setState({ data: response.data });
      })
      .catch(error => {
        console.log(error.message);
      });
  };

  peticionGetTipoCurva = async registro => {
    axios
      .get(URL + 'tipo_curvas?id=' + registro.id)
      .then(response => {
        this.setState({ dataTipoCurva: response.data });
      })
      .catch(error => {
        console.log(error.message);
      });
  };

  peticionGetTrack = async registro => {
    axios
      .get(URL + 'template_track_config?id=' + registro.id)
      .then(response => {
        this.setState({ data1: response.data });
      })
      .catch(error => {
        console.log(error.message);
      });
  };

  useEffect = () => {
    //this.peticionGet();
  };

  peticionDeleteTemplateTrack = template_track_config => {
    var datos = {
      id: template_track_config.template_track_config_id,
      pkuser: JSON.parse(sessionStorage.getItem('user')).pk_usuario_sesion,
    };

    axios
      .delete(URL + 'template_track_config', { params: datos })
      .then(response => {
        this.peticionGetTrack(this.state.form);
      });
  };

  peticionAInsetarTemplateTrack = async ttc => {
    delete this.state.form2.id;
    this.state.form2.template_config_id = ttc.template_config_id;
    this.state.form2.tipo_track_id = ttc.tipo_track_id;
    this.state.form2.tipo_curva_id = ttc.tipo_curva_id;
    this.state.form2.origen = ttc.origen;
    this.state.form2.pkuser = JSON.parse(
      sessionStorage.getItem('user')
    ).pk_usuario_sesion;

    await axios
      .post(URL + 'template_track_config', this.state.form2)
      .then(response => {
        this.peticionGetTrack(this.state.form);
      })
      .catch(error => {
        console.log(error.message);
      });
  };

  peticionDelete = () => {
    var datos = {
      id: this.state.form.id,
      pkuser: JSON.parse(sessionStorage.getItem('user')).pk_usuario_sesion,
    };

    axios.delete(URL + 'template_config', { params: datos }).then(response => {
      this.setState({ modalEliminar: false });
      this.peticionGet();
    });
  };

  IrAEditar = templateconfig => {
    this.props.history.push('/visual_config_edi' + templateconfig.id);
  };

  IrAGraficar = templateconfig => {
    this.props.history.push('/visual_historicos_dp' + templateconfig.id);
  };
  IrAGraficarComp = templateconfig => {
    this.props.history.push('/visual_historicos_dc/' + 1);
  };

  modalInsertar = () => {
    this.setState({ modalInsertar: !this.state.modalInsertar });
  };

  seleccionarRegistro = templateconfig => {
    this.setState({
      tipoModal: 'actualizar',
      form: {
        id: templateconfig.id,
        wells_id: templateconfig.wells_id,
        archivo_encabezado_id: templateconfig.archivo_encabezado_id,
        datetime: templateconfig.datetime,
        dmea: templateconfig.dmea,
        dbtm: templateconfig.dbtm,
        rpm: templateconfig.rpm,
        ropa: templateconfig.ropa,
        mfia: templateconfig.mfia,
        tqa: templateconfig.tqa,
        wob: templateconfig.wob,
      },
    });
  };

  handleChange = async e => {
    e.persist();
    await this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value,
      },
    });
    this.state.form.pkuser = JSON.parse(
      sessionStorage.getItem('user')
    ).pk_usuario_sesion;
  };

  componentDidMount() {
    this.peticionGet();
  }

  modalEliminar = () => {
    this.setState({ modalEliminar: !this.state.modalEliminar });
  };

  render() {
    const { form, form2 } = this.state;

    return (
      <div className="App">
        <Cabecera />
        <SideBar pageWrapId={'page-wrap'} outerContainerId={'App'} />

        <div className="containerCuatro">
          <Link className="btn btn-success" to="/visual_config">
            <iconList.Add /> Agregar Configuraci&oacute;n
          </Link>
        </div>
        <div className="form-group col-12" style={{ float: 'left' }}>
          <Materialtable
            title={'Listado de visualizaciones configuradas [Datos Historicos]'}
            columns={columns}
            data={this.state.data}
            icons={iconList}
            actions={[
              {
                icon: iconList.PlaylistAddSharpIcon,
                tooltip: 'Configurar Tracks Time/Depth',
                onClick: (event, rowData) => {
                  this.seleccionarRegistro(rowData);
                  this.peticionGetTrack(rowData);
                  this.modalInsertar();
                },
              },
              {
                icon: iconList.Multiline,
                tooltip: 'Ver Grafica',
                onClick: (event, rowData) => {
                  this.IrAGraficar(rowData);
                },
              },
              {
                icon: iconList.Multiline,
                tooltip: 'Ver Grafica Componente',
                onClick: (event, rowData) => {
                  this.IrAGraficarComp(rowData);
                },
              },
              {
                icon: iconList.Edit,
                tooltip: 'Editar',
                onClick: (event, rowData) => {
                  this.IrAEditar(rowData);
                },
              },
              {
                icon: iconList.Delete,
                tooltip: 'Eliminar',
                onClick: (event, rowData) => {
                  this.seleccionarRegistro(rowData);
                  this.setState({ modalEliminar: true });
                },
              },
            ]}
            options={{
              actionsColumnIndex: -1,
            }}
            localization={{
              header: { actions: 'Acciones' },
            }}
          />
          <br />* - T: Dato leido de telemetr&iacute;a - A: Dato leido de
          archivo .las
        </div>

        <Modal
          isOpen={this.state.modalInsertar}
          contentClassName="custom-modal-style"
        >
          <ModalHeader style={{ display: 'block' }}>
            <span
              style={{ float: 'right' }}
              onClick={() => this.modalInsertar()}
            >
              <iconList.CancelIcon />
            </span>
            <label htmlFor="nombre">Configuracion de Track</label>
          </ModalHeader>
          <ModalBody>
            <div className="form-group">
              <input
                className="form-control"
                type="hidden"
                name="pkuser"
                id="pkuser"
                readOnly
                onChange={this.handleChange}
                value={
                  form2
                    ? form2.id
                    : JSON.parse(sessionStorage.getItem('user'))
                        .id_usuario_sesion
                }
              />
              <input
                className="form-control"
                type="hidden"
                name="id"
                id="id"
                readOnly
                onChange={this.handleChange}
                value={form2 ? form2.id : this.state.data.length + 1}
              />

              <div className="form-group">
                Seleccione las curvas adicionar en los track (Horizontal y
                Vertical)
                <br />
                <br />
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
                        <td>
                          {elemento.resultado === 'ASIGNADA' ? (
                            <button
                              className="btn btn-outline-secondary"
                              onClick={() =>
                                this.peticionDeleteTemplateTrack(elemento)
                              }
                            >
                              <iconList.Delete /> Eliminar
                            </button>
                          ) : (
                            <button
                              className="btn btn-outline-secondary"
                              onClick={() =>
                                this.peticionAInsetarTemplateTrack(elemento)
                              }
                            >
                              <iconList.Add /> Asignar
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <button
              className="btn  btn-outline-secondary"
              onClick={() => this.modalInsertar()}
            >
              <iconList.CancelIcon /> Salir
            </button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modalEliminar}>
          <ModalBody>
            <iconList.Delete /> Est&aacute; seguro que deseas eliminar el
            registro seleccionado?
            <div className="form-group">
              <br />
              <input
                className="form-control"
                type="hidden"
                name="id"
                id="id"
                readOnly
                onChange={this.handleChange}
                value={form ? form.id : this.state.data.length + 1}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <button
              className="btn btn-danger"
              onClick={() => this.peticionDelete()}
            >
              Si
            </button>
            <button
              className="btn btn-secundary"
              onClick={() => this.modalEliminar()}
            >
              No
            </button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
export default viewVisualConfigLista;
