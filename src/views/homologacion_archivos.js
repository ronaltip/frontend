import React, { Component, forwardRef } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import Materialtable from 'material-table';

import SideBar from '../componentes/sidebar';
import ComboLabelHomologacionArchivos from '../componentes/combolabel1';
import Cabecera from '../componentes/cabecera';
import '../css/styles.css';
import iconList from '../util/iconList';

const URL = process.env.REACT_APP_API_HOST;

//const url = "http://localhost:9000/homologacion_archivos";
//const urlAuxiliar = "http://localhost:9000/tipo_archivos";
//const urlAuxilir1 = "http://localhost:9000/tipo_curvas";

const columns = [{ title: 'Tipo de Archivo', field: 'nombre' }];

class viewArchivoHomologacion extends Component {
  state = {
    data: [],
    dataTipoArchivo: [],
    dataTipoCurva: [],
    modalInsertar: false,
    modalEliminar: false,
    form: { id: '', tipo_archivo_id: '', campo: [], pkuser: '' },
    campos: [],
    pk_tipo_archivo_id: '',
    tipoModal: '',
  };

  peticionTipoArchivosGet = () => {
    axios
      .get(URL + 'tipo_archivos')
      .then(response => {
        this.setState({ dataTipoArchivo: response.data });
      })
      .catch(error => {
        console.log(error.message);
      });
  };

  peticionTipoCurvasGet = () => {
    axios
      .get(URL + 'tipo_curvas')
      .then(response => {
        this.setState({ dataTipoCurva: response.data });
      })
      .catch(error => {
        console.log(error.message);
      });
  };

  peticionPost = async () => {
    delete this.state.form.id;
    await axios
      .post(URL + 'homologacion_archivos', this.state.form)
      .then(response => {
        this.modalInsertar();
        this.peticionTipoArchivosGet();
      })
      .catch(error => {
        console.log(error.message);
      });
  };

  peticionPut = () => {
    axios.put(URL + 'homologacion_archivos', this.state.form).then(response => {
      this.modalInsertar();
      this.peticionTipoArchivosGet();
    });
  };

  peticionDelete = () => {
    var datos = {
      id: this.state.form.id,
      pkuser: JSON.parse(sessionStorage.getItem('user')).pk_usuario_sesion,
    };

    axios
      .delete(URL + 'homologacion_archivos', { data: datos })
      .then(response => {
        this.setState({ modalEliminar: false });
        this.peticionGet();
      });
  };

  modalInsertar = () => {
    this.setState({ modalInsertar: !this.state.modalInsertar });
  };

  getResponse(reg) {
    this.state.campos.push(reg);
    this.state.form.tipo_archivo_id = this.state.pk_tipo_archivo_id;
    this.state.form.campo = this.state.campos;
    this.state.form.pkuser = JSON.parse(
      sessionStorage.getItem('user')
    ).pk_usuario_sesion;
  }

  seleccionarRegistro = tipo_archivos => {
    axios
      .get(URL + 'homologacion_archivos', {
        params: { tipo_archivo_id: tipo_archivos.id },
      })
      .then(response => {
        this.setState({ data: response.data });
        this.setState({ pk_tipo_archivo_id: tipo_archivos.id });
      })
      .catch(error => {
        console.log(error.message);
      });
    this.setState({
      tipoModal: 'actualizar',
      form: {
        id: this.state.data.id,
        tipo_archivo_id: this.state.data.tipo_archivo_id,
        campo: this.state.data.campo,
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
    //console.log(this.state.form);
    this.state.form.pkuser = JSON.parse(
      sessionStorage.getItem('user')
    ).pk_usuario_sesion;
  };

  componentDidMount() {
    this.peticionTipoArchivosGet();
  }

  render() {
    const { form } = this.state;

    return (
      <div className="App">
        <Cabecera />
        <SideBar pageWrapId={'page-wrap'} outerContainerId={'App'} />
        <div
          className="form-group col-11"
          style={{ float: 'left', padding: '30px 0 0 30px' }}
        >
          <Materialtable
            title={'Configuracion de Archivos y el estandar WITS 0'}
            columns={columns}
            data={this.state.dataTipoArchivo}
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
              <label htmlFor="nombre">
                Nuevo configuraci&oacute;n de Archivos
              </label>
            ) : (
              <label htmlFor="nombre">
                Editar configuraci&oacute;n de Archivos
              </label>
            )}
          </ModalHeader>
          <ModalBody>
            <input
              className="form-control"
              type="hidden"
              name="id"
              id="id"
              readOnly
              onChange={this.handleChange}
              value={form ? form.id : this.state.data.length + 1}
            />

            <div className="form-group">
              <input
                className="form-control"
                type="hidden"
                name="tipo_archivo_id"
                id="tipo_archivo_id"
                onChange={this.handleChange}
                value={form ? form.tipo_archivo_id : this.state.data.length + 1}
              />
              {this.state.data.map(elemento => (
                <ComboLabelHomologacionArchivos
                  id={elemento.id}
                  campo={elemento.campo}
                  tipo_archivo={this.state.pk_tipo_archivo_id}
                  callback={this.getResponse.bind(this)}
                />
              ))}
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
            <iconList.DeleteOutline /> Est&aacute;s seguro que deseas eliminar
            el registro?
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
export default viewArchivoHomologacion;
