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
  Input
} from 'antd';
import Cabecera from '../componentes/cabecera';
import Sidebar from '../componentes/sidebar';
import Footer from '../componentes/footer';

const URL = process.env.REACT_APP_API_HOST;
const { Search } = Input;


class viewWells extends Component {
  state = {
    data: [], dataSearch: [],
    dataFields: [],
    modalInsertar: false,
    modalEditar: false,
    modalEliminar: false,
    tipoModal: '',
    form: {
      id: '',
      nombre: '',
      tag: '',
      ip: '',
      puerto: '',
      url: '',
      usuario: '',
      clave: '',
      estado_id: '',
      pkuser: '',
      field_id: '',
      pkuser: 0
    },
  };

  peticionGet = async () => {
    axios
      .get(URL + 'wells')
      .then(response => {
        if (response.status === 200)
          this.setState({ data: response.data, dataSearch: response.data });
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

  peticionCamposGet = () => {
    axios
      .get(URL + 'fields')
      .then(response => {
        if (response.status === 200)
          this.setState({ dataFields: response.data });
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
      .post(URL + 'wells', this.state.form)
      .then(response => {
        if (response.status === 200)
        {
          this.modalInsertar();
          this.peticionGet();
          message.success('Pozo creado con éxito')
        }
        else
        {
          console.log(response.data);
          message.error('Ocurrió un error creando el pozo, intente nuevamente')
        }
      })
      .catch(error => {
        message.error('Ocurrió un error creando el pozo, intente nuevamente')
        console.log(error.message);
      });
  };

  peticionPut = () => {
    axios.put(URL + 'wells', this.state.form).then(response => {
      if (response.status === 200)
      {
        this.modalInsertar();
        this.peticionGet();
        message.success('Pozo actualizado con éxito')
      }
      else
      {
        console.log(response.data);
        message.error('Ocurrió un error actualizando el pozo, intente nuevamente')
      }
    }).catch(error => {
      message.error('Ocurrió un error actualizando el pozo, intente nuevamente')
      console.log(error.message);
    });
  };

  peticionDelete = () => {
    var datos = {
      id: this.state.form.id,
      pkuser: JSON.parse(sessionStorage.getItem('user')).pk_usuario_sesion,
    };

    axios.delete(URL + 'wells', { data: datos }).then(response => {
      if (response.status === 200)
      {
        this.setState({ modalEliminar: false });
        this.peticionGet();
        message.success('Pozo eliminado con éxito')
      }
      else
      {
        console.log(response.data);
        message.error('Ocurrió un error eliminando el pozo, intente nuevamente')
      }
    }).catch(error => {
      console.log(error.message);
      message.error('Ocurrió un error aliminando el pozo, intente nuevamente')
    });
  };

  modalInsertar = () => {
    let pkuser = JSON.parse(
      sessionStorage.getItem('user')
    ).pk_usuario_sesion;
    this.setState({ 
        modalInsertar: !this.state.modalInsertar, 
        tipoModal: 'insertar', 
        form: { id: '',
          nombre: '',
          tag: '',
          ip: '',
          puerto: '',
          url: '',
          usuario: '',
          clave: '',
          estado_id: '',
          pkuser: '',
          field_id: '',
          pkuser: pkuser 
        } 
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

  seleccionarRegistro = wells => {
    let pkuser = JSON.parse(
      sessionStorage.getItem('user')
    ).pk_usuario_sesion;
    this.setState({
      tipoModal: 'actualizar',
      form: {
        id: wells.id,
        nombre: wells.nombre,
        tag: wells.tag,
        ip: wells.ip,
        puerto: wells.puerto,
        url: wells.url,
        usuario: wells.usuario,
        clave: wells.clave,
        estado_id: wells.estado_id,
        field_id: wells.field_id,
        pkuser: pkuser
      },
    });
  };

  handleChange = e => {
    this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value,
      },
    });
  };

  onFilter = search => {
    let searched = search.target.value.toLowerCase();
    const responseSearch = this.state.data.filter( ({nombre, campo}) => {
      nombre = nombre.toLowerCase();
      campo = campo.toLowerCase();
      return nombre.includes(searched) || campo.includes(searched);
    });
    this.setState({dataSearch:  responseSearch});
  };

  componentDidMount() {
    this.peticionGet();
    this.peticionCamposGet();
  }

  render() {
    const { form } = this.state;

    return (
      <>
        <Cabecera />
        <Sidebar />
        <nav aria-label="breadcrumb" className='small'>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">Curvas</li>
            <li className="breadcrumb-item active" aria-current="page">Pozos</li>
          </ol>
        </nav>

        <div className='container-xl'>
          <Row >
            <Col span={24}>
              <h3>Listado de Pozos</h3>
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
                <iconList.Add /> Agregar Pozo
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
                    title: 'Campo',
                    dataIndex: 'campo',
                    key: 'campo',
                    width: '30%',
                  },
                  {
                    title: 'Nombre',
                    dataIndex: 'nombre',
                    key: 'nombre',
                    width: '30%',
                  },
                  {
                    title: 'Tag',
                    dataIndex: 'tag',
                    key: 'tag',
                  },
                  {
                    title: 'IP',
                    dataIndex: 'ip',
                    key: 'ip',
                  },
                  {
                    title: 'Puerto',
                    dataIndex: 'puerto',
                    key: 'puerto',
                  },
                  {
                    title: 'Url',
                    dataIndex: 'url',
                    key: 'url',
                  },
                  {
                    title: 'Acción',
                    width: '10%',
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
              <label htmlFor="nombre">Nuevo Pozo</label>
            ) : (
              <label htmlFor="nombre">Editar Pozo</label>
            )}
          </ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label htmlFor="field_id">Campo</label>
              <select
                name="field_id"
                id="wells_id"
                className="form-control"
                onChange={this.handleChange}
                defaultValue={form ? form.field_id : ''}
              >
                <option key="0" value="0">
                  Seleccionar
                </option>
                {this.state.dataFields.map(elemento => (
                  <option key={elemento.id} value={elemento.id}>
                    {elemento.nombre}
                  </option>
                ))}
              </select>
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
              <label htmlFor="nombre">Nombre</label>
              <input
                className="form-control"
                type="text"
                name="nombre"
                id="nombre"
                onChange={this.handleChange}
                value={form ? form.nombre : ''}
                autoComplete="off"
              />
              <br />
              <label htmlFor="tag">Tag</label>
              <input
                className="form-control"
                type="text"
                name="tag"
                id="tag"
                onChange={this.handleChange}
                value={form ? form.tag : ''}
                autoComplete="off"
              />
              <br />
              <label htmlFor="ip">Direcci&oacute;n IP</label>
              <input
                className="form-control"
                type="text"
                name="ip"
                id="ip"
                onChange={this.handleChange}
                value={form ? form.ip : ''}
                autoComplete="off"
              />
              <br />
              <label htmlFor="puerto">Puerto</label>
              <input
                className="form-control"
                type="text"
                name="puerto"
                id="puerto"
                onChange={this.handleChange}
                value={form ? form.puerto : ''}
                autoComplete="off"
              />
              <br />
              <label htmlFor="url">URL</label>
              <input
                className="form-control"
                type="text"
                name="url"
                id="url"
                onChange={this.handleChange}
                value={form ? form.url : ''}
                autoComplete="off"
              />
              <br />
              {/* <label htmlFor="usuario">Usuario</label>
                            <input className="form-control" type="text" name="usuario" id="usuario" onChange={this.handleChange} value={form ? form.usuario : ''} />
                            <br />
                            <label htmlFor="clave">Clave</label>
                            <input className="form-control" type="text" name="clave" id="clave" onChange={this.handleChange} value={form ? form.clave : ''} />
                            <br /> */}
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
              <label htmlFor="nombre"><b>Nombre:</b></label> &nbsp;{' '}
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
export default viewWells;
