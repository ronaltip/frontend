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
import Footer  from '../componentes/footer';


const URL = process.env.REACT_APP_API_HOST;
const { Search } = Input;

class viewFields extends Component {
  state = {
    data: [], dataSearch: [],
    modalInsertar: false,
    modalEliminar: false,
    modalEditar: false,
    tipoModal: '',
    form: { id: '', nombre: '', descripcion: '', estado_id: '', pkuser: '' },
  };

 
  peticionGet = async () => {
    axios
      .get(URL + 'fields')
      .then(response => {
        if (response.status === 200)
          this.setState({ data: response.data, dataSearch: response.data });
        else
        {
          console.log(response.data);
          message.error('Ocurrió un error consultando los campos, intente nuevamente')
        }
      })
      .catch(error => {
        message.error('Ocurrió un error consultando los campos, intente nuevamente')
        console.log(error.message);
      });
  };

  peticionPost = async () => {
    delete this.state.form.id;
    await axios
      .post(URL + 'fields', this.state.form)
      .then(response => {
        if (response.status === 200)
        {
          this.modalInsertar();
          this.peticionGet();
          message.success('Campo creado con éxito')
        }
        else
        {
          console.log(response.data);
          message.error('Ocurrió un error creando el campo, intente nuevamente')
        }
      })
      .catch(error => {
        console.log(error.message);
        message.error('Ocurrió un error creando el campo, intente nuevamente')
      });
  };

  peticionPut = () => {
    axios.put(URL + 'fields', this.state.form).then(response => {
      if (response.status === 200)
      {
        this.modalInsertar();
        this.peticionGet();
        message.success('Campo actualizado con éxito')
      }
      else
      {
        console.log(response.data);
        message.error('Ocurrió un error actualizando el campo, intente nuevamente')
      }
    }).catch(error => {
      console.log(error.message);
      message.error('Ocurrió un error actualizando el campo, intente nuevamente')
    });
  };

  peticionDelete = () => {
    var datos = {
      id: this.state.form.id,
      pkuser: JSON.parse(sessionStorage.getItem('user')).pk_usuario_sesion,
    };

    axios.delete(URL + 'fields', { data: datos }).then(response => {
      if (response.status === 200)
      {
        this.setState({ modalEliminar: false });
        this.peticionGet();
        message.success('Campo eliminado con éxito')
      }
      else
      {
        console.log(response.data);
        message.error('Ocurrió un error eliminando el campo, intente nuevamente')
      }
    }).catch(error => {
      console.log(error.message);
      message.error('Ocurrió un error eliminando el campo, intente nuevamente')
    });
  };

  modalInsertar = () => {
    let pkuser = JSON.parse(
      sessionStorage.getItem('user')
    ).pk_usuario_sesion;
    this.setState({ 
        modalInsertar: !this.state.modalInsertar, 
        tipoModal: 'insertar', 
        form: { id: 0, nombre: '', descripcion: '', estado_id: '', pkuser: pkuser } 
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

  seleccionarRegistro = field => {
    let pkuser = JSON.parse(
      sessionStorage.getItem('user')
    ).pk_usuario_sesion;
    this.setState({
      tipoModal: 'actualizar',
      form: {
        id: field.id,
        nombre: field.nombre,
        descripcion: field.descripcion,
        estado_id: field.estado_id,
        pkuser: pkuser
      }
    });
  };

  handleChange = e => {
    e.persist();
    this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value,
      },
    });
  };

  onFilter = search => {
    const responseSearch = this.state.data.filter( ({nombre}) => {
      nombre = nombre.toLowerCase();
      return nombre.includes(search.target.value.toLowerCase());
    });
    this.setState({dataSearch:  responseSearch});
  };

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
            <li className="breadcrumb-item">Curvas</li>
            <li className="breadcrumb-item active" aria-current="page">Campos</li>
          </ol>
        </nav>
       
        <div className='container-xl'>
          <Row >
            <Col span={24}>
              <h3>Listado de Campos</h3>
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
                <iconList.Add /> Agregar Campo
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
                    title: 'Nombre',
                    dataIndex: 'nombre',
                    key: 'nombre',
                    width: '30%',
                  },
                  {
                    title: 'Descripción',
                    dataIndex: 'descripcion',
                    key: 'descripcion',
                    width: '55%',
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
              style={{ float: 'right' }}
              onClick={() => this.modalEditar()}
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
                autoComplete="off"
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
              <label htmlFor="nombre"><b>Nombre:</b></label> &nbsp;
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
export default viewFields;
