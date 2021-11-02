import React, { Component, forwardRef } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import Materialtable from 'material-table';
import SideBar from '../componentes/sidebar';
import Cabecera from '../componentes/cabecera';
import iconList from '../util/iconList';
import '../css/styles.css';
import { SketchPicker } from 'react-color';

//const url = "http://localhost:9000/tipo_eventos";
const URL = process.env.REACT_APP_API_HOST;

const columns = [
  { title: 'Nombre', field: 'nombre' },
  { title: 'Tag', field: 'tag' },
  { title: 'Color', field: 'color' },
];
class viewTipoEventos extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      modalInsertar: false,
      modalEliminar: false,
      tipoModal: '',
      form: {
        id: 0,
        nombre: '',
        tag: '',
        color: '',
        estado_id: '',
        pkuser: '',
      },
    };
    this.handleChange = this.handleChange.bind(this);
  }

  peticionGet = async () => {
    axios
      .get(URL + 'tipo_eventos')
      .then(response => {
        this.setState({ data: response.data });
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
      .post(URL + 'tipo_eventos', this.state.form)
      .then(response => {
        this.modalInsertar();
        this.peticionGet();
      })
      .catch(error => {
        console.log(error.message);
      });
  };

  peticionPut = () => {
    axios.put(URL + 'tipo_eventos', this.state.form).then(response => {
      this.modalInsertar();
      this.peticionGet();
    });
  };

  peticionDelete = () => {
    var datos = {
      id: this.state.form.id,
      pkuser: JSON.parse(sessionStorage.getItem('user')).pk_usuario_sesion,
    };

    axios.delete(URL + 'tipo_eventos', { params: datos }).then(response => {
      this.setState({ modalEliminar: false });
      this.peticionGet();
    });
  };

  modalInsertar = () => {
    this.setState({ modalInsertar: !this.state.modalInsertar });
  };

  seleccionarRegistro = tipoevento => {
    this.setState({
      tipoModal: 'actualizar',
      form: {
        id: tipoevento.id,
        nombre: tipoevento.nombre,
        tag: tipoevento.tag,
        color: tipoevento.color,
      },
    });
  };

  handleChange = async e => {
    await this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value,
      },
    });
    this.state.form.pkuser = JSON.parse(
      sessionStorage.getItem('user')
    ).pk_usuario_sesion;
    //console.log(this.state.form);
  };

  handleChangeComplete = color => {
    this.setState({
      form: {
        id: this.state.form.id,
        nombre: this.state.form.nombre,
        tag: this.state.form.tag,
        color: color.hex,
        pkuser: JSON.parse(sessionStorage.getItem('user')).pk_usuario_sesion,
      },
    });
    //console.log(this.state.form);
  };

  componentDidMount() {
    this.peticionGet();
  }

  render() {
    const { form } = this.state;

    return (
      <div className="App">
        <Cabecera />
        <SideBar pageWrapId={'page-wrap'} outerContainerId={'App'} />

        <div className="containerCuatro">
          <button
            className="btn btn-success"
            onClick={() => {
              this.setState({ form: null, tipoModal: 'insertar' });
              this.modalInsertar();
            }}
          >
            <iconList.Add /> Agregar Tipo
          </button>
        </div>
        <div
          className="form-group col-11"
          style={{ float: 'left', padding: '30px 0 0 30px' }}
        >
          <Materialtable
            title={'Listado de Tipos de Eventos'}
            columns={columns}
            data={this.state.data}
            icons={iconList}
            actions={[
              {
                icon: iconList.Edit,
                tooltip: 'Editar',
                onClick: (event, rowData) => {
                  this.seleccionarRegistro(rowData);
                  this.modalInsertar();
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
        </div>

        <Modal isOpen={this.state.modalInsertar}>
          <ModalHeader style={{ display: 'block' }}>
            <span
              style={{ float: 'right' }}
              onClick={() => this.modalInsertar()}
            >
              <iconList.CancelIcon />
            </span>
            {this.state.tipoModal === 'insertar' ? (
              <label>Nuevo Tipo de Evento</label>
            ) : (
              <label>Editar Tipo de Evento</label>
            )}
          </ModalHeader>
          <ModalBody>
            <div className="form-group">
              {/* <input className="form-control" type="text" name="pkuser" id="pkuser" onChange={this.handleChange} value={JSON.parse(sessionStorage.getItem('user')).id_usuario_sesion} /> 
                            <input className="form-control" type="text" name="id" id="id"  onChange={this.handleChange} value={form ? form.id : this.state.data.length + 1} /> */}
              <label htmlFor="nombre">Nombre</label>
              <input
                className="form-control"
                type="text"
                name="nombre"
                id="nombre"
                onChange={this.handleChange}
                value={form ? form.nombre : '1'}
              />
              <br />
              <label htmlFor="tag">Tag</label>
              <input
                className="form-control"
                type="text"
                name="tag"
                id="tag"
                onChange={this.handleChange}
                value={form ? form.tag : '1'}
              />
              <br />
              <label>Color</label>
              <br />
              <SketchPicker
                key="color"
                color={form ? form.color : '#FFF'}
                onChangeComplete={this.handleChangeComplete}
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
                <iconList.Save /> Insertar
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => this.peticionPut()}
              >
                <iconList.Save /> Actualizar
              </button>
            )}
            <button
              className="btn btn-danger"
              onClick={() => this.modalInsertar()}
            >
              <iconList.CancelIcon /> Cancelar
            </button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modalEliminar}>
          <ModalBody>
            <iconList.Delete /> Est&aacute;s seguro que deseas eliminar el
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
                value={form ? form.id : 0}
              />
              <label>Nombre: &nbsp; </label>
              {form ? form.nombre : ''}
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
              className="btn btn-secondary"
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
export default viewTipoEventos;
