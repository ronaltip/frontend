import React, { Component } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { TextField } from '@material-ui/core';
import iconList from '../util/iconList';
import {CalendarToday} from '@material-ui/icons';
import SideBar from '../componentes/sidebar';
import Cabecera from '../componentes/cabecera';
import Footer  from '../componentes/footer';
import {
  Col,
  message,
  Row,
  Table,
  Tooltip,
  Input
} from 'antd';
import '../css/styles.css';

const URL = process.env.REACT_APP_API_HOST; 
const { Search } = Input;

class viewEventos extends Component {
  state = {
    data: [], dataSearch: [],
    dataWells: [],
    dataTipoEvento: [],
    modalInsertar: false,
    modalEditar: false,
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
        if (response.status === 200)
          this.setState({ data: response.data, dataSearch: response.data });
        else
        {
          console.log(response.data);
          message.error('Ocurrió un error consultando los eventos, intente nuevamente')
        }
      })
      .catch(error => {
          message.error('Ocurrió un error consultando los eventos, intente nuevamente')
          console.log(error.message);
      });
  };

  peticionTipoEventosGet = () => {
    axios
      .get(URL + 'tipo_eventos')
      .then(response => {
        if (response.status === 200)
          this.setState({ dataTipoEvento: response.data });
        else
        {
          console.log(response.data);
          message.error('Ocurrió un error consultando los campos, intente nuevamente')
        }
      })
      .catch(error => {
          message.error('Ocurrió un error consultando los tipos de evento, intente nuevamente')
          console.log(error.message);
      });
  };

  peticionWellsGet = () => {
    axios
      .get(URL + 'wells')
      .then(response => {
        if (response.status === 200)
          this.setState({ dataWells: response.data });
        else
        {
          console.log(response.data);
          message.error('Ocurrió un error consultando los pozos, intente nuevamente')
        }
      })
      .catch(error => {
          message.error('Ocurrió un error consultando los pozos, intente nuevamente')
          console.log(error.message);
      });
  };

  peticionPost = async () => {
    delete this.state.form.id;
    await axios
      .post(URL + 'eventos', this.state.form)
      .then(response => {
        if (response.status === 200)
        {
          this.modalInsertar();
          this.peticionGet();
          message.success('Evento creado con éxito')
        }
        else
        {
          console.log(response.data);
          message.error('Ocurrió un error creando el evento, intente nuevamente')
        }
      })
      .catch(error => {
          message.error('Ocurrió un error creando el evento, intente nuevamente')
          console.log(error.message);
      });
  };

  peticionPut = () => {
    axios.put(URL + 'eventos', this.state.form).then(response => {
      if (response.status === 200)
      {
        this.modalInsertar();
        this.peticionGet();
        message.success('Evento actualizado con éxito')
      }
      else
      {
        console.log(response.data);
        message.error('Ocurrió un error actualizando el evento, intente nuevamente')
      }
    }).catch(error => {
      console.log(error.message);
      message.error('Ocurrió un error actualizando el evento, intente nuevamente')
    });
  };

  peticionDelete = () => {
    var datos = {
      id: this.state.form.id,
      pkuser: JSON.parse(sessionStorage.getItem('user')).pk_usuario_sesion,
    };

    axios.delete(URL + 'eventos', { data: datos }).then(response => {
      if (response.status === 200)
      {
        this.setState({ modalEliminar: false });
        this.peticionGet();
        message.success('Evento eliminado con éxito')
      }
      else
      {
        console.log(response.data);
        message.error('Ocurrió un error eliminando el evento, intente nuevamente')
      }
    }).catch(error => {
      console.log(error.message);
      message.error('Ocurrió un error eliminando el evento, intente nuevamente')
    });
  };

  modalInsertar = () => {
    let pkuser = JSON.parse(
      sessionStorage.getItem('user')
    ).pk_usuario_sesion;

    this.setState({
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
        nombre_tipo_eventos: '',
        nombre_pozo: '',
        pkuser: pkuser
      },
      tipoModal: 'insertar',
      modalInsertar: !this.state.modalInsertar, 
      showing: false
    });
  
  };

  modalEditar = (info) => {
    this.seleccionarRegistro(info)
    this.setState({ modalInsertar: !this.state.modalInsertar });
  };

  modalEliminar = (info) => {
    this.seleccionarRegistro(info)
    this.setState({ modalEliminar: !this.state.modalEliminar });
  };

  seleccionarRegistro = eventos => {
    let pkuser = JSON.parse(
      sessionStorage.getItem('user')
    ).pk_usuario_sesion;
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
        pkuser: pkuser
      },
      showing: eventos.tipo_tiempo === 1 ? false : true
    });
  };

  handleChange = e => {
    this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value,
      },
    });
    if (this.state.showing === false) 
    {
      this.state.form.tipo_tiempo = '1';
      this.state.form.fecha_final = this.state.form.fecha_inicial;
      this.state.form.hora_final = this.state.form.hora_inicial;
      this.state.form.profundidad_final = this.state.form.profundidad_inicial;
    } 
    else {
      this.state.form.tipo_tiempo = '2';
    }
  };

  setFechaFinal() {
    this.setState({ showing: !this.state.showing });
  }

  onFilter = search => {
    let serched = search.target.value.toLowerCase();
    const responseSearch = this.state.data.filter( ({nombre_pozo, nombre_tipo_eventos, profundidad_inicial, profundidad_final}) => {
      nombre_pozo = nombre_pozo.toLowerCase();
      nombre_tipo_eventos = nombre_tipo_eventos.toLowerCase();
    
      return nombre_pozo.includes(serched) || nombre_tipo_eventos.includes(serched) || profundidad_inicial.includes(serched) || profundidad_final.includes(serched);
    });
    this.setState({dataSearch:  responseSearch});
  };

  componentDidMount() {
    this.peticionGet();
    this.peticionTipoEventosGet();
    this.peticionWellsGet();
  }

  render() {
    const { form } = this.state;
    const { showing } = this.state;

    return (
      <>
        <Cabecera />
        <SideBar />

        <nav aria-label="breadcrumb" className='small'>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">Cargue de Datos</li>
            <li className="breadcrumb-item active" aria-current="page">Eventos</li>
          </ol>
        </nav>

        <div className='container-xl'>
          <Row >
            <Col span={24}>
              <h3>Listado de Eventos</h3>
            </Col>
          </Row>
          <Row >
            <Col span={12}>
              <Search
                placeholder="Buscar"
                onChange={(value) => this.onFilter(value)}
                enterButton={false}
              />
            </Col>
            <Col span={12} className='text-right'>
              <button
                className="btn btn-success btn-sm"
                onClick={() => {
                  this.setState({ form: null, tipoModal: 'insertar' });
                  this.modalInsertar();
                }}
              >
                <iconList.Add /> Agregar Evento
              </button>
            </Col>
          </Row>
          <Row >
            <Col span={24}>
              <Table
                tableLayout="fixed"
                pagination={{ pageSize: 10 }}
                dataSource={this.state.dataSearch}
                rowKey="id"
                key="id"
                columns={[
                  {
                    title: 'Pozo',
                    dataIndex: 'nombre_pozo',
                    key: 'nombre_pozo'
                  },
                  {
                    title: 'Tipo de Evento',
                    dataIndex: 'nombre_tipo_eventos',
                    key: 'nombre_tipo_eventos'
                  },
                  {
                    title: 'Fecha Inicial',
                    dataIndex: 'fecha_inicial',
                    key: 'fecha_inicial'
                  },
                  {
                    title: 'Hora Inicial',
                    dataIndex: 'hora_inicial',
                    key: 'hora_inicial'
                  },
                  {
                    title: 'Profundidad Inicial',
                    dataIndex: 'profundidad_inicial',
                    key: 'profundidad_inicial'
                  },
                  {
                    title: 'Acción',
                    render: info => {
                      return (
                      <Row gutter={8} justify="center">
                        <Col span={4} style={{ cursor: 'pointer' }}>
                          <Tooltip title="Editar">
                            <span onClick={() => this.modalEditar(info)}>
                              <iconList.Edit />
                            </span>
                          </Tooltip>
                        </Col>
                        <Col span={4} style={{ cursor: 'pointer' }}>
                          <Tooltip title="Eliminar">
                            <span onClick={() => this.modalEliminar(info)}>
                              <iconList.Delete />
                            </span>
                          </Tooltip>
                        </Col>
                      </Row>
                      )
                    }
                  }
                ]}
                bordered
              />
            </Col>
          </Row>
        </div> 

        <Footer />

        <Modal isOpen={this.state.modalInsertar}>
          <ModalHeader style={{ display: 'block' }}>
            <span
              style={{ float: 'right', cursor: 'pointer' }}
              onClick={() => this.modalInsertar()}
            >
              <iconList.CancelIcon />{' '}
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
                type="time"
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
                <CalendarToday style={{cursor:'pointer'}} /> Click
                para { showing ? 'desactivar' : 'activar' } fecha final{' '}
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
                  type="time"
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
                <iconList.Save /> Insertar{' '}
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => this.peticionPut()}
              >
                {' '}
                <iconList.Save /> Actualizar{' '}
              </button>
            )}
            <button
              className="btn btn-danger"
              onClick={() => this.modalInsertar()}
            >
              {' '}
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
              <b>
                <label htmlFor="nombre"><b>Pozo:</b> &nbsp; </label>
              </b>
              {form ? form.wells_nombre : ''}
              <br />
              <b>
                <label htmlFor="nombre"><b>Descripci&oacute;n:</b> &nbsp; </label>
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
              className="btn btn-secondary"
              onClick={() => this.setState({ modalEliminar: false })}
            >
              No
            </button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}
export default viewEventos;
