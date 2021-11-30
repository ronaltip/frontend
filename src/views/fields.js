import React, { Component, forwardRef } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import Materialtable from 'material-table';
import iconList from '../util/iconList';

import SideBar from '../componentes/sidebar';
import Cabecera from '../componentes/cabecera';
import '../css/styles.css';

const URL = process.env.REACT_APP_API_HOST;

const columns = [
  { title: 'Nombre', field: 'nombre' },
  { title: 'Descripción', field: 'descripcion' },
];

class viewTiposCurvas extends Component {
  state = {
    data: [],
    modalInsertar: false,
    modalEliminar: false,
    tipoModal: '',
    form: { id: '', nombre: '', descripcion: '', estado_id: '', pkuser: '' },
  };

  useEffect = () => {
    this.peticionGet();
  };

  peticionGet = async () => {
    axios
      .get(URL + 'fields')
      .then(response => {
        this.setState({ data: response.data });
      })
      .catch(error => {
        console.log(error.message);
      });
  };

  peticionPost = async () => {
    delete this.state.form.id;
    await axios
      .post(URL + 'fields', this.state.form)
      .then(response => {
        this.modalInsertar();
        this.peticionGet();
      })
      .catch(error => {
        console.log(error.message);
      });
  };

  peticionPut = () => {
    axios.put(URL + 'fields', this.state.form).then(response => {
      this.modalInsertar();
      this.peticionGet();
    });
  };

  peticionDelete = () => {
    var datos = {
      id: this.state.form.id,
      pkuser: JSON.parse(sessionStorage.getItem('user')).pk_usuario_sesion,
    };

    axios.delete(URL + 'fields', { data: datos }).then(response => {
      this.setState({ modalEliminar: false });
      this.peticionGet();
    });
  };

  modalInsertar = () => {
    this.setState({ modalInsertar: !this.state.modalInsertar });
  };

  seleccionarRegistro = field => {
    this.setState({
      tipoModal: 'actualizar',
      form: {
        id: field.id,
        nombre: field.nombre,
        descripcion: field.descripcion,
        estado_id: field.estado_id,
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
            <iconList.Add /> Agregar Campo
          </button>
        </div>
        <div
          className="form-group col-11"
          style={{ float: 'left', padding: '30px 0 0 30px' }}
        >
          <Materialtable
            title={'Listado de Campos'}
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
              <label htmlFor="nombre">Nuevo Campo</label>
            ) : (
              <label htmlFor="nombre">Editar Campo</label>
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
              <label htmlFor="nombre">Nombre</label>
              <input
                className="form-control"
                type="text"
                name="nombre"
                id="nombre"
                onChange={this.handleChange}
                value={form ? form.nombre : ''}
              />
              <br />
              <label htmlFor="descripcion">Descripción</label>
              <input
                className="form-control"
                type="text"
                name="descripcion"
                id="dscripcion"
                onChange={this.handleChange}
                value={form ? form.descripcion : ''}
              />
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
                value={form ? form.id : this.state.data.length + 1}
              />
              <label htmlFor="nombre">Nombre</label> &nbsp;
              {form ? form.nombre : ''}
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
export default viewTiposCurvas;
