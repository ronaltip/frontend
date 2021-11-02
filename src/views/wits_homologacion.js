import React, { Component } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import Materialtable from 'material-table';

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import SideBar from '../componentes/sidebar';
import Cabecera from '../componentes/cabecera';
import iconList from '../util/iconList';
import '../css/styles.css';

const URL = process.env.REACT_APP_API_HOST;
//const url = "http://localhost:9000/wits_homologacion";
//const urlAuxiliar = "http://localhost:9000/tipo_curvas";
//const urlAuxilir2 = "http://localhost:9000/wits_detalle";

const columns = [
  { title: 'Codigo Wits', field: 'nombre' },
  { title: 'Tag Tipo de Curva', field: 'tag' },
  { title: 'Tipo de Curva', field: 'tipo_curva_nombre' },
  // { title: 'Referencia', field: 'referencia_nombre' }
];
class viewWitsHomologacion extends Component {
  state = {
    data: [],
    dataTipoCurva: [],
    dataWitsDetalle: [],
    modalInsertar: false,
    modalEliminar: false,
    form: {
      id: '',
      wits_detalle_id: '',
      tipo_curva_id: '',
      tag: '',
      tipo_curva_nombre: '',
      referencia_nombre: '',
      nombre: '',
      wits_padre_nombre: '',
      wits_detalle_nombre: '',
      pkuser: '',
    },

    cod1: '',
    cod2: '',
  };

  peticionGet = async () => {
    axios
      .get(URL + 'wits_homologacion')
      .then(response => {
        this.setState({ data: response.data });
      })
      .catch(error => {
        console.log(error.message);
      });
  };

  peticionWitsDetalleGet = async e => {
    axios
      .get(URL + 'wits_detalle')
      .then(response => {
        this.setState({ dataWitsDetalle: response.data });
      })
      .catch(error => {
        console.log(error.message);
      });
  };

  useEffect = () => {
    this.peticionGet();
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
    var datos = {
      wits_detalle_id: this.state.cod2,
      tipo_curva_id: this.state.cod1,
      pkuser: JSON.parse(sessionStorage.getItem('user')).pk_usuario_sesion,
    };

    await axios
      .post(URL + 'wits_homologacion', datos)
      .then(response => {
        this.modalInsertar();
        this.peticionGet();
      })
      .catch(error => {
        console.log(error.message);
      });
  };

  peticionPut = () => {
    var datos = {
      id: this.state.form.id,
      wits_detalle_id: this.state.cod2,
      tipo_curva_id: this.state.cod1,
      pkuser: JSON.parse(sessionStorage.getItem('user')).pk_usuario_sesion,
    };

    axios.put(URL + 'wits_homologacion', datos).then(response => {
      this.modalInsertar();
      this.peticionGet();
    });
  };

  peticionDelete = () => {
    var datos = {
      id: this.state.form.id,
      pkuser: JSON.parse(sessionStorage.getItem('user')).pk_usuario_sesion,
    };
    axios.delete(URL + 'wits_homologacion', { data: datos }).then(response => {
      this.setState({ modalEliminar: false });
      this.peticionGet();
    });
  };

  modalInsertar = () => {
    this.setState({ modalInsertar: !this.state.modalInsertar });
  };

  seleccionarRegistro = wits_homologacion => {
    this.setState({
      tipoModal: 'actualizar',
      form: {
        id: wits_homologacion.id,
        tipo_curva_id: wits_homologacion.tipo_curva_id,
        wits_detalle_id: wits_homologacion.wits_detalle_id,
        nombre: wits_homologacion.nombre,
        tag: wits_homologacion.tag,
        tipo_curva_nombre: wits_homologacion.tipo_curva_nombre,
        referencia_nombre: wits_homologacion.referencia_nombre,
        wits_padre_nombre: wits_homologacion.wits_padre_nombre,
        wits_detalle_nombre: wits_homologacion.wits_detalle_nombre,
      },
      cod1: wits_homologacion.tipo_curva_id,
      cod2: wits_homologacion.wits_detalle_id,
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
    this.peticionTipoCurvasGet();
    this.peticionWitsDetalleGet();
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
              this.state.cod1 = null;
              this.state.cod2 = null;
            }}
          >
            <iconList.Add /> Agregar Variable Wits
          </button>
        </div>
        <div
          className="form-group col-11"
          style={{ float: 'left', padding: '30px 0 0 30px' }}
        >
          <Materialtable
            title={
              'Tabla WITS 0 - Proceso de enlace entre Tipos de Curva y el estandar WITS 0'
            }
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
            {this.state.tipoModal == 'insertar' ? (
              <label htmlFor="nombre">Nueva Homologaci&oacute;n Wits 0</label>
            ) : (
              <label htmlFor="nombre">Editar variables Wits 0</label>
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
              <br />
              <label>Referencia General Wits</label>

              <Autocomplete
                id="wits_detalle_id"
                options={this.state.dataWitsDetalle}
                onChange={(e, v) => (this.state.cod2 = v.id)}
                defaultValue={
                  this.state.dataWitsDetalle.length > 0 &&
                  this.state.dataWitsDetalle.find(v => v.id == this.state.cod2)
                }
                getOptionLabel={option => option.codigo + '  ' + option.nombre}
                style={{ width: 470 }}
                renderInput={params => (
                  <TextField
                    name="wits_detalle_id"
                    {...params}
                    variant="outlined"
                  />
                )}
              />

              <br />
              <label>Tipo de Curva</label>

              <Autocomplete
                id="tipo_curva_id"
                options={this.state.dataTipoCurva}
                onChange={(e, v) => (this.state.cod1 = v.id)}
                defaultValue={this.state.dataTipoCurva.find(
                  v => v.id == this.state.cod1
                )}
                getOptionLabel={option =>
                  '[' + option.tag + ']  ' + option.nombre
                }
                style={{ width: 470 }}
                renderInput={params => (
                  <TextField
                    name="tipo_curva_id"
                    {...params}
                    variant="outlined"
                  />
                )}
              />
            </div>
          </ModalBody>

          <ModalFooter>
            {this.state.tipoModal == 'insertar' ? (
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
              <label htmlFor="nombre">
                <b>C&oacute;digo Wits: </b>
              </label>
              &nbsp; {form ? form.nombre : ''}
              <br />
              <label htmlFor="nombre">
                <b>Tag Tipo de Curva: </b>
              </label>
              &nbsp; {form ? form.tag : ''}
              <br />
              <label htmlFor="nombre">
                <b>Tipo de Curva: </b>
              </label>
              &nbsp; {form ? form.tipo_curva_nombre : ''}
              <br />
              {/* <label htmlFor="nombre"><b>Referencia: </b></label> &nbsp; {form ? form.referencia_nombre : ''}<br /> */}
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
export default viewWitsHomologacion;
