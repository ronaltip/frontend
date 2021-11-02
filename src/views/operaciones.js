import React, { Component } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import Materialtable from 'material-table';
import { CSVReader } from 'react-papaparse';

import SideBar from '../componentes/sidebar';
import Cabecera from '../componentes/cabecera';
import '../css/styles.css';
import iconList from '../util/iconList';

const URL = process.env.REACT_APP_API_HOST;
//const url = "http://localhost:9000/operaciones";
//const urlAuxiliar = "http://localhost:9000/wells";

const buttonRef = React.createRef();

const columns = [
  { title: 'Pozo', field: 'nombre_wells' },
  { title: 'Desde', field: 'desde' },
  { title: 'Hasta', field: 'hasta' },
  { title: 'P/N', field: 'p_n' },
  { title: 'Detalle', field: 'operacion' },
];

var ArrayD = [];

class viewOperaciones extends Component {
  state = {
    data: [],
    dataWells: [],
    dataArray: [],
    modalInsertar: false,
    modalEliminar: false,
    form: { id: '', wells_id: '', estado_id: '', pkuser: '', datoFile: '' },
    tipoModal: '',
  };

  peticionGet = async () => {
    axios
      .get(URL + 'operaciones')
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

  peticionPost = async () => {
    var datos = '';
    delete this.state.form.id;

    for (let i = 1; i < ArrayD.value.length - 1; i++) {
      datos = ArrayD.value[i].data;
      this.state.form.datoFile = datos;
      await axios
        .post(URL + 'operaciones', this.state.form)
        .then(response => {})
        .catch(error => {
          console.log(error.message);
        });
    }

    this.modalInsertar();
    this.peticionGet();
  };

  peticionPut = () => {
    axios.put(URL + 'operaciones', this.state.form).then(response => {
      this.modalInsertar();
      this.peticionGet();
    });
  };

  peticionDelete = () => {
    var datos = {
      id: this.state.form.id,
      pkuser: JSON.parse(sessionStorage.getItem('user')).pk_usuario_sesion,
    };

    axios.delete(URL + 'operaciones', { data: datos }).then(response => {
      this.setState({ modalEliminar: false });
      this.peticionGet();
    });
  };

  modalInsertar = () => {
    this.setState({ modalInsertar: !this.state.modalInsertar });
  };

  seleccionarRegistro = operaciones => {
    this.setState({
      tipoModal: 'actualizar',
      form: {
        id: operaciones.id,
        operacion: operaciones.operacion,
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
    //console.log(this.state.form);
  };

  componentDidMount() {
    this.peticionGet();
    this.peticionWellsGet();
  }

  handleOpenDialog = e => {
    if (buttonRef.current) {
      buttonRef.current.open(e);
    }
  };

  handleOnFileLoad = data => {
    ArrayD.value = data;
  };

  handleOnError = (err, file, inputElem, reason) => {
    console.log(err);
  };

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
            <iconList.Add /> Agregar Operaciones
          </button>
        </div>

        <div
          className="form-group col-11"
          style={{ float: 'left', padding: '30px 0 0 30px' }}
        >
          <Materialtable
            title={'Listado de Operaciones'}
            columns={columns}
            data={this.state.data}
            icons={iconList}
            actions={[
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
              <label htmlFor="nombre">Nuevo Archivo de Operaciones</label>
            ) : (
              <label htmlFor="nombre">Editar Archivo de Operaciones</label>
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
              <label htmlFor="nombre">
                Adjunte el archivo de operaciones (.csv)
              </label>

              <br />

              <label htmlFor="wells_id">Wells</label>
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
                    {elemento.tag} - {elemento.nombre}
                  </option>
                ))}
              </select>
              <br />
              <CSVReader
                ref={buttonRef}
                onFileLoad={this.handleOnFileLoad}
                onError={this.handleOnError}
                noClick
                noDrag
              >
                {({ file }) => (
                  <aside
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      marginBottom: 10,
                    }}
                  >
                    <button
                      className="form-control"
                      type="button"
                      onClick={this.handleOpenDialog}
                      style={{
                        borderRadius: 0,
                        marginLeft: 0,
                        marginRight: 0,
                        width: '30%',
                        paddingLeft: 0,
                        paddingRight: 0,
                      }}
                    >
                      Adjuntar archivo
                    </button>
                    <div
                      style={{
                        borderWidth: 1,
                        borderStyle: 'solid',
                        borderColor: '#ccc',
                        height: 37,
                        lineHeight: 2.0,
                        marginTop: 2,
                        marginBottom: 5,
                        paddingLeft: 13,
                        paddingTop: 3,
                        width: '70%',
                      }}
                    >
                      {file && file.name}
                    </div>
                  </aside>
                )}
              </CSVReader>

              <br />
            </div>
          </ModalBody>

          <ModalFooter>
            {this.state.tipoModal === 'insertar' ? (
              <button
                className="btn btn-success"
                onClick={() => this.peticionPost()}
              >
                <iconList Save /> Insertar
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
              <label htmlFor="nombre">Detalle: &nbsp; </label>
              {form ? form.operacion : ''}
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
export default viewOperaciones;
