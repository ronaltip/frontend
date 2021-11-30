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
  { title: 'Level', field: 'level' },
  { title: 'Codigo Wits', field: 'codigo' },
  { title: 'tag', field: 'short_mnemonico' },
  { title: 'descripcion', field: 'descripcion' },
];

class viewWits extends Component {
  state = {
    data: [],
    dataTipoCurva: [],
    dataWitsDetalle: [],
    modalInsertar: false,
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
  };

  peticionGet = async () => {
    axios
      .get(URL + 'wits_detalle')
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
  }

  NoAction = () => {};

  render() {
    const { form } = this.state;

    return (
      <div className="App">
        <Cabecera />
        <SideBar pageWrapId={'page-wrap'} outerContainerId={'App'} />

        <div className="container-fluid">
          <div className="col-md-12">
            <Materialtable
              title={'Tabla WITS 0'}
              columns={columns}
              data={this.state.data}
              icons={iconList}
              actions={[
                {
                  icon: iconList.Search,
                  tooltip: 'Detalle',
                  onClick: (event, rowData) => {
                    this.seleccionarRegistro(rowData);
                    this.modalInsertar();
                  },
                },
              ]}
              options={{
                actionsColumnIndex: -1,
                pageSize: 10,
              }}
              localization={{
                header: { actions: 'Acciones' },
              }}
              onChangePage={() => this.NoAction}
              onChangeRowsPerPage={() => this.NoAction}
            />
          </div>
        </div>
        <Modal isOpen={this.state.modalInsertar}>
          <ModalHeader style={{ display: 'block' }}>
            <span
              style={{ float: 'right' }}
              onClick={() => this.modalInsertar()}
            >
              <iconList.CancelIcon icon={iconList.CancelIcon} />
            </span>
            <label>Wits 0</label>
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
                defaultValue={this.state.dataWitsDetalle.find(
                  v => v.id == this.state.cod2
                )}
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
            <button
              className="btn btn-secondary"
              onClick={() => this.modalInsertar()}
            >
              <iconList.CancelIcon /> Cancelar
            </button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
export default viewWits;
