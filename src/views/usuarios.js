import React, { Component, forwardRef } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import Materialtable from 'material-table';
import iconList from '../util/iconList';
import '../css/styles.css';
import ButtonUpload from '../libs/ButtonUpload/ButtonUpload';

const URL = process.env.REACT_APP_API_HOST;
//const url = "http://localhost:9000/usuarios";
//const urlPerfil = "http://localhost:9000/perfiles";

const columns = [
  { title: 'Nombre', field: 'nombre' },
  { title: 'Email', field: 'email' },
  { title: 'Codigo', field: 'codigo' },
  { title: 'Perfil', field: 'Perfil' },
];
class Usuarios extends Component {
  state = {
    data: [],
    dataPerfil: [],
    modalInsertar: false,
    modalEliminar: false,
    tipoModal: '',
    form: {
      id: '',
      nombre: '',
      email: '',
      codigo: '',
      clave: '',
      perfil_id: '',
      estado_id: '',
      nombre_perfil: '',
      pkuser: '',
    },
  };

  peticionGet = async () => {
    axios
      .get(URL + 'usuarios')
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

  peticionPerfilesGet = () => {
    axios
      .get(URL + 'perfiles')
      .then(response => {
        this.setState({ dataPerfil: response.data });
      })
      .catch(error => {
        console.log(error.message);
      });
  };

  peticionPost = async () => {
    delete this.state.form.id;
    this.state.form.pkuser = JSON.parse(
      sessionStorage.getItem('user')
    ).id_usuario_sesion;
    await axios
      .post(URL + 'usuarios', this.state.form)
      .then(response => {
        this.modalInsertar();
        this.peticionGet();
      })
      .catch(error => {
        console.log(error.message);
      });
  };

  peticionPut = () => {
    axios.put(URL + 'usuarios', this.state.form).then(response => {
      this.modalInsertar();
      this.peticionGet();
    });
  };

  peticionDelete = () => {
    var datos = {
      id: this.state.form.id,
      pkuser: JSON.parse(sessionStorage.getItem('user')).pk_usuario_sesion,
    };
    axios.delete(URL + 'usuarios', { data: datos }).then(response => {
      this.setState({ modalEliminar: false });
      this.peticionGet();
    });
  };

  modalInsertar = () => {
    this.setState({ modalInsertar: !this.state.modalInsertar });
  };

  seleccionarUsuario = usuario => {
    this.setState({
      tipoModal: 'actualizar',
      form: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        codigo: usuario.codigo,
        clave: usuario.clave,
        perfil_id: usuario.perfil_id,
        estado_id: usuario.estado_id,
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
    console.log(this.state.form);
    this.state.form.pkuser = JSON.parse(
      sessionStorage.getItem('user')
    ).pk_usuario_sesion;
  };

  componentDidMount() {
    this.peticionGet();
    this.peticionPerfilesGet();
  }

  render() {
    const { form } = this.state;
    return (
      <div className="App">
        <ButtonUpload
          titleButton='Agregar usuario'
          onClick={() => {
            this.setState({ form: null, tipoModal: 'insertar' });
            this.modalInsertar()
          }} />
        <div
          className="form-group col-11"
          style={{ float: 'left', padding: '30px 0 0 30px' }}
        >
          <Materialtable
            title={'Lista de Usuarios'}
            columns={columns}
            data={this.state.data}
            icons={iconList}
            actions={[
              {
                icon: iconList.Edit,
                tooltip: 'Editar',
                onClick: (event, rowData) => {
                  this.seleccionarUsuario(rowData);
                  this.modalInsertar();
                },
              },
              {
                icon: iconList.Delete,
                tooltip: 'Eliminar',
                onClick: (event, rowData) => {
                  this.seleccionarUsuario(rowData);
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
              <label htmlFor="nombre">Nuevo Usuario</label>
            ) : (
              <label htmlFor="nombre">Editar Usuario</label>
            )}
          </ModalHeader>
          <ModalBody>
            <div className="form-group">
              <input
                className="form-control"
                type="hidden"
                name="id"
                id="id"
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
              <label htmlFor="email">Email</label>
              <input
                className="form-control"
                type="text"
                name="email"
                id="email"
                onChange={this.handleChange}
                value={form ? form.email : ''}
              />
              <br />
              <label htmlFor="codigo">C&oacute;digo</label>
              <input
                className="form-control"
                type="text"
                name="codigo"
                id="codigo"
                onChange={this.handleChange}
                value={form ? form.codigo : ''}
              />
              <br />
              <label htmlFor="clave">Clave</label>
              <input
                className="form-control"
                type="password"
                name="clave"
                id="clave"
                onChange={this.handleChange}
                value={form ? form.clave : ''}
              />
              <br />
              <label htmlFor="perfil_id">Perfil</label>
              <br />
              <select
                name="perfil_id"
                id="perfil_id"
                className="form-control"
                onChange={this.handleChange}
                defaultValue={form ? form.perfil_id : ''}
              >
                <option key="0" value="0">
                  Seleccionar
                </option>
                {this.state.dataPerfil.map(elemento => (
                  <option key={elemento.id} value={elemento.id}>
                    {elemento.nombre}
                  </option>
                ))}
              </select>
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
              <label htmlFor="nombre">Nombre: </label> &nbsp;
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
export default Usuarios;
