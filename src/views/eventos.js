import React, { Component, forwardRef } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import Materialtable from 'material-table';
import { TextField } from '@material-ui/core';

import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import CancelIcon from '@material-ui/icons/Cancel';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import Save from '@material-ui/icons/Save';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import SideBar from '../componentes/sidebar';
import Cabecera from '../componentes/cabecera';
import '../css/styles.css';

const URL = process.env.REACT_APP_API_HOST; // "http://localhost:9000/eventos";
//const urlAuxiliar = "http://localhost:9000/wells";
//const urlAuxilir2 = "http://localhost:9000/tipo_eventos";

const columns = [
  { title: 'Pozo', field: 'nombre_pozo' },
  { title: 'Tipo Evento', field: 'nombre_tipo_eventos' },
  { title: 'Fecha Inicial', field: 'fecha_inicial' },
  { title: 'Hora Inicial', field: 'hora_inicial' },
  { title: 'Profundidad Inicial', field: 'profundidad_inicial' },
  { title: 'Profundidad Final', field: 'profundidad_final' },
];

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
  CalendarTodayIcon: forwardRef((props, ref) => (
    <CalendarTodayIcon {...props} ref={ref} />
  )),
};

class viewEventos extends Component {
  state = {
    data: [],
    dataWells: [],
    dataTipoEvento: [],
    openModalInsertar: false,
    modalEliminar: false,
    form: {
      id: '',
      wells_id: '',
      tipo_evento_id: '',
      tipo_tiempo: 1,
      fecha_inicial: '',
      hora_inicial: '',
      fecha_final: '',
      hora_final: '',
      profundidad_inicial: '',
      profundidad_final: '',
      descripcion: '',
      causa: '',
      solucion: '',
      estado_id: '',
      pkuser: '',
      nombre_tipo_eventos: '',
      nombre_pozo: '',
    },
    FechaActual: new Date(),
    showing: false,
    tipoModal: 'insertar',
  };

  peticionGet = async () => {
    axios
      .get(URL + 'eventos')
      .then(response => {
        this.setState({ data: response.data });
      })
      .catch(error => {
        console.log(error.message);
      });
  };

  peticionTipoEventosGet = () => {
    axios
      .get(URL + 'tipo_eventos')
      .then(response => {
        this.setState({ dataTipoEvento: response.data });
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

  useEffect = () => {
    this.peticionGet();
  };

  peticionPost = async () => {
    delete this.state.form.id;
    await axios
      .post(URL + 'eventos', this.state.form)
      .then(response => {
        this.modalInsertar();
        this.peticionGet();
      })
      .catch(error => {
        console.log(error.message);
      });
  };

  peticionPut = () => {
    axios.put(URL + 'eventos', this.state.form).then(response => {
      this.modalInsertar();
      this.peticionGet();
    });
  };

  peticionDelete = () => {
    var datos = {
      id: this.state.form.id,
      pkuser: JSON.parse(sessionStorage.getItem('user')).pk_usuario_sesion,
    };

    axios.delete(URL + 'eventos', { data: datos }).then(response => {
      this.setState({ modalEliminar: false });
      this.peticionGet();
    });
  };

  modalInsertar = op => {
    switch (op) {
      case 1:
        this.setState({
          form: null,
          tipoModal: 'insertar',
          openModalInsertar: true,
          showing: false,
        });
        break;
      case 2:
        this.setState({ tipoModal: 'actualizar', openModalInsertar: true });
        break;
      default:
        this.setState({ openModalInsertar: false });
        break;
    }
  };

  seleccionarRegistro = eventos => {
    this.setState({
      tipoModal: 'actualizar',
      form: {
        id: eventos.id,
        wells_id: eventos.wells_id,
        tipo_evento_id: eventos.tipo_evento_id,
        tipo_tiempo: eventos.tipo_tiempo,
        fecha_inicial: eventos.fecha_inicial,
        hora_inicial: eventos.hora_inicial,
        fecha_final: eventos.fecha_final,
        hora_final: eventos.hora_final,
        profundidad_inicial: eventos.profundidad_inicial,
        profundidad_final: eventos.profundidad_final,
        descripcion: eventos.descripcion,
        causa: eventos.causa,
        solucion: eventos.solucion,
        wells_nombre: eventos.wells_nombre,
      },
    });

    this.setState({ showing: eventos.tipo_tiempo === 1 ? false : true });
  };

  handleChange = async e => {
    e.persist();
    await this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value,
      },
    });
    if (this.state.showing === false) {
      this.state.form.tipo_tiempo = '1';
      this.state.form.fecha_final = this.state.form.fecha_inicial;
      this.state.form.hora_final = this.state.form.hora_inicial;
      this.state.form.profundidad_final = this.state.form.profundidad_inicial;
    } else {
      this.state.form.tipo_tiempo = '2';
    }
    this.state.form.pkuser = JSON.parse(
      sessionStorage.getItem('user')
    ).pk_usuario_sesion;
  };

  setFechaFinal() {
    this.setState({ showing: !this.state.showing });
  }

  componentDidMount() {
    this.peticionGet();
    this.peticionTipoEventosGet();
    this.peticionWellsGet();
  }

  render() {
    const { form } = this.state;
    const { showing } = this.state;

    return (
      <div className="App">
        <Cabecera />
        <SideBar pageWrapId={'page-wrap'} outerContainerId={'App'} />

        <div className="containerCuatro">
          <button
            className="btn btn-success"
            onClick={() => {
              this.modalInsertar(1);
            }}
          >
            {' '}
            <AddBox icon={tableIcons.Add} /> Agregar Eventos
          </button>
        </div>
        <div
          className="form-group col-11"
          style={{ float: 'left', padding: '30px 0 0 30px' }}
        >
          <Materialtable
            title={'Listado de Eventos'}
            columns={columns}
            data={this.state.data}
            icons={tableIcons}
            actions={[
              {
                icon: tableIcons.Edit,
                tooltip: 'Editar',
                onClick: (event, rowData) => {
                  this.seleccionarRegistro(rowData);
                  this.modalInsertar(2);
                },
              },
              {
                icon: tableIcons.Delete,
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
        </div>

        <Modal isOpen={this.state.openModalInsertar}>
          <ModalHeader style={{ display: 'block' }}>
            <span
              style={{ float: 'right' }}
              onClick={() => this.modalInsertar()}
            >
              <CancelIcon icon={tableIcons.CancelIcon} />{' '}
            </span>
            {this.state.tipoModal === 'insertar' ? (
              <label htmlFor="nombre">Nuevo Evento</label>
            ) : (
              <label htmlFor="nombre">Editar Evento</label>
            )}
          </ModalHeader>
          <ModalBody>
            <div className="form-group">
              <input
                className="form-control"
                type="hidden"
                name="id"
                id="id"
                readOnly
                onChange={this.handleChange}
                value={form ? form.id : this.state.data.length + 1}
              />
              <label htmlFor="wells_id">Pozo</label>
              <select
                name="wells_id"
                id="wells_id"
                className="form-control"
                onChange={this.handleChange}
                defaultValue={form ? form.wells_id : ''}
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
              <br />
              <label htmlFor="tipo_evento_id">Tipo de evento</label>
              <select
                name="tipo_evento_id"
                id="tipo_evento_id"
                className="form-control"
                onChange={this.handleChange}
                defaultValue={form ? form.tipo_evento_id : ''}
              >
                <option key="0" value="0">
                  Seleccionar
                </option>
                {this.state.dataTipoEvento.map(elemento => (
                  <option key={elemento.id} value={elemento.id}>
                    {elemento.nombre}
                  </option>
                ))}
              </select>
              <br />

              <label>Fecha Inicial</label>
              <TextField
                id="fecha_inicial"
                name="fecha_inicial"
                type="date"
                defaultValue={form ? form.fecha_inicial : ''}
                className="form-control"
                onChange={this.handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <br />
              <label>Hora Inicial</label>
              <input
                className="form-control"
                type="text"
                name="hora_inicial"
                id="hora_inicial"
                onChange={this.handleChange}
                value={form ? form.hora_inicial : '00:00:00'}
              />
              <br />
              <label>Profundidad Inicial</label>
              <input
                className="form-control"
                type="text"
                name="profundidad_inicial"
                id="profundidad_inicial"
                onChange={this.handleChange}
                value={form ? form.profundidad_inicial : ''}
              />
              <br />
              <span
                style={{ float: 'right' }}
                onClick={() => this.setFechaFinal()}
              >
                <CalendarTodayIcon icon={tableIcons.CalendarTodayIcon} /> Click
                para activar fecha final{' '}
              </span>

              <div style={{ display: showing ? 'block' : 'none' }}>
                <label>Fecha Final</label>
                <TextField
                  id="fecha_final"
                  name="fecha_final"
                  type="date"
                  onChange={this.handleChange}
                  defaultValue={form ? form.fecha_final : ''}
                  className="form-control"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <br />
                <label>Hora Final</label>
                <input
                  className="form-control"
                  type="text"
                  name="hora_final"
                  id="hora_final"
                  onChange={this.handleChange}
                  value={form ? form.hora_final : '00:00:00'}
                />

                <br />
                <label>Profundidad Final</label>
                <input
                  className="form-control"
                  type="text"
                  name="profundidad_final"
                  id="profundidad_final"
                  onChange={this.handleChange}
                  value={form ? form.profundidad_final : ''}
                />
              </div>

              <br />
              <label htmlFor="tag">Descripci&oacute;n</label>
              <textarea
                className="form-control"
                name="descripcion"
                id="descripcion"
                onChange={this.handleChange}
                value={form ? form.descripcion : ''}
              />

              <br />
              <label htmlFor="tag">Causa</label>
              <textarea
                className="form-control"
                name="causa"
                id="causa"
                onChange={this.handleChange}
                value={form ? form.causa : ''}
              />

              <br />
              <label htmlFor="tag">Soluci&oacute;n</label>
              <textarea
                className="form-control"
                name="solucion"
                id="solucion"
                onChange={this.handleChange}
                value={form ? form.solucion : ''}
              />

              <br />
            </div>
          </ModalBody>

          <ModalFooter>
            {this.state.tipoModal === 'insertar' ? (
              <button
                className="btn btn-success"
                onClick={() => this.peticionPost()}
              >
                <Save icon={tableIcons.Save} /> Insertar{' '}
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => this.peticionPut()}
              >
                {' '}
                <Save icon={tableIcons.Save} /> Actualizar{' '}
              </button>
            )}
            <button
              className="btn btn-danger"
              onClick={() => this.modalInsertar()}
            >
              {' '}
              <CancelIcon icon={tableIcons.CancelIcon} /> Cancelar
            </button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modalEliminar}>
          <ModalBody>
            <DeleteOutline /> Est&aacute;s seguro que deseas eliminar el
            registro?
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
              <b>
                <label htmlFor="nombre">Pozo: &nbsp; </label>
              </b>
              {form ? form.wells_nombre : ''}
              <br />
              <b>
                <label htmlFor="nombre">Descripci&oacute;n: &nbsp; </label>
              </b>
              {form ? form.descripcion : ''}
            </div>
          </ModalBody>
          <ModalFooter>
            <br />
            <button
              className="btn btn-danger"
              onClick={() => this.peticionDelete()}
            >
              Si
            </button>
            <button
              className="btn btn-secundary"
              onClick={() => this.setState({ modalEliminar: false })}
            >
              No
            </button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
export default viewEventos;
