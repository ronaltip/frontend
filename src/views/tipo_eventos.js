import React, { Component } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import iconList from '../util/iconList';
import '../css/styles.css';
import {
  Col,
  message,
  Row,
  Table,
  Tooltip,
  Input,
  Spin
} from 'antd';
import Cabecera from '../componentes/cabecera';
import Sidebar from '../componentes/sidebar';
import Footer from '../componentes/footer';
import { SketchPicker } from 'react-color';

const URL = process.env.REACT_APP_API_HOST;
const { Search } = Input;


class viewTipoEventos extends Component {
  constructor() {
    super();
    this.state = {
      data: [], dataSearch: [], loading: false,
      modalInsertar: false,
      modalEditar: false,
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
  }

  peticionGet = () => {
    this.setLoading(true)
    axios
      .get(URL + 'tipo_eventos')
      .then(response => {
        if (response.status === 200)
          this.setState({ data: response.data, dataSearch: response.data, loading: false});
        else
        {
          console.log(response.data);
          message.error('Ocurrió un error consultando los tipos de evento, intente nuevamente')
          this.setLoading(false)
        }
      })
      .catch(error => {
          message.error('Ocurrió un error consultando los tipos de evento, intente nuevamente')
          console.log(error.message)
          this.setLoading(false)
      });
  };

  peticionPost = async () => {
    delete this.state.form.id;
    await axios
      .post(URL + 'tipo_eventos', this.state.form)
      .then(response => {
        if (response.status === 200)
        {
          this.modalInsertar();
          this.peticionGet();
          message.success('Tipo de Evento creado con éxito')
        }
        else
        {
          console.log(response.data);
          message.error('Ocurrió un error creando el Tipo de Evento, intente nuevamente')
        }
      })
      .catch(error => {
          message.error('Ocurrió un error creando el Tipo de Evento, intente nuevamente')
          console.log(error.message);
      });
  };

  peticionPut = () => {
    axios.put(URL + 'tipo_eventos', this.state.form).then(response => {
      if (response.status === 200)
      {
        this.modalInsertar();
        this.peticionGet();
        message.success('Tipo de Evento actualizado con éxito')
      }
      else
      {
        console.log(response.data);
        message.error('Ocurrió un error actualizando el Tipo de Evento, intente nuevamente')
      }
    }).catch(error => {
      message.error('Ocurrió un error creando el Tipo de Evento, intente nuevamente')
      console.log(error.message);
    });
  };

  peticionDelete = () => {
    var datos = {
      id: this.state.form.id,
      pkuser: JSON.parse(sessionStorage.getItem('user')).pk_usuario_sesion,
    };

    axios.delete(URL + 'tipo_eventos', { params: datos }).then(response => {
      if (response.status === 200)
      {
        this.setState({ modalEliminar: false });
        this.peticionGet();
        message.success('Tipo de Evento eliminado con éxito')
      }
      else
      {
        console.log(response.data);
        message.error('Ocurrió un error eliminando el Tipo de Evento, intente nuevamente')
      }
    }).catch(error => {
      message.error('Ocurrió un error eliminando el Tipo de Evento, intente nuevamente')
      console.log(error.message);
  });
  };

  modalInsertar = () => {
    let pkuser = JSON.parse(
      sessionStorage.getItem('user')
    ).pk_usuario_sesion;
    this.setState({ modalInsertar: !this.state.modalInsertar,
      tipoModal: 'insertar', 
      form: { id: 0, nombre: '', tag: '', color: '', estado_id: '', pkuser: pkuser } 
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

  seleccionarRegistro = tipoevento => {
    this.setState({
      tipoModal: 'actualizar',
      form: {
        id: tipoevento.id,
        nombre: tipoevento.nombre,
        tag: tipoevento.tag,
        color: tipoevento.color,
        estado_id: tipoevento.estado_id
      },
    });
  };

  handleChange =  e => {
    this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value,
      },
    });
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
  };

  onFilter = search => {
    const responseSearch = this.state.data.filter( ({nombre, tag}) => {
      nombre = nombre.toLowerCase();
      tag = tag.toLowerCase();

      return nombre.includes(search.target.value.toLowerCase()) || tag.includes(search.target.value.toLowerCase());
    });
    this.setState({dataSearch:  responseSearch});
  };

  setLoading = e => {
    this.setState({loading: e})
  }

  componentDidMount() {
    this.peticionGet();
  }

  render() {
    const { form } = this.state;

    return (
      <>
        <Cabecera />
        <Sidebar />
        <nav aria-label="breadcrumb" className='small'>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">Configuración</li>
            <li className="breadcrumb-item active" aria-current="page">Tipos de Evento</li>
          </ol>
        </nav>

        <div className='container-xl'>
          <Row >
            <Col span={24}>
              <h3>Listado de Tipos de Evento</h3>
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
                <iconList.Add /> Agregar Tipo
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
                loading={{  indicator: <div><Spin /></div>, spinning: this.state.loading }}
                columns={[
                  {
                    title: 'Nombre',
                    dataIndex: 'nombre',
                    key: 'nombre'
                  },
                  {
                    title: 'Tag',
                    dataIndex: 'tag',
                    key: 'tag',
                    width: '10%',
                  },
                  {
                    title: 'Color',
                    dataIndex: 'color',
                    key: 'color',
                    width: '10%',
                  },
                  {
                    title: 'Acción',
                    width: '10%',
                    render: info => {
                      return (
                      <Row gutter={16} justify="center">
                        <Col span={8}  style={{ cursor: 'pointer' }}>
                          <Tooltip title="Editar">
                            <span onClick={() => this.modalEditar(info)}>
                              <iconList.Edit />
                            </span>
                          </Tooltip>
                        </Col>
                        <Col span={8} style={{ cursor: 'pointer' }}>
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
        
        <Footer/>

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
              <label><b>Nombre:</b> &nbsp; </label>
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
      </>
    );
  }
}
export default viewTipoEventos;
