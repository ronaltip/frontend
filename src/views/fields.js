import React, { Component, Fragment } from 'react';
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
  Spin,
  Button
} from 'antd';
import Footer from '../componentes/footer';
import HeaderSection from '../libs/headerSection/headerSection';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';


const URL = process.env.REACT_APP_API_HOST;
const { Search } = Input;
let modules = null;
class viewFields extends Component {
  state = {
    data: [], dataSearch: [], loading: false,
    modalInsertar: false,
    modalEliminar: false,
    modalEditar: false,
    tipoModal: '',
    form: { id: '', nombre: '', descripcion: '', estado_id: '', pkuser: '' },
  };


  peticionGet = () => {
    this.setLoading(true)
    axios
      .get(URL + 'fields')
      .then(response => {
        if (response.status === 200)
          this.setState({ data: response.data, dataSearch: response.data, loading: false });
        else {
          console.log(response.data);
          message.error('Ocurrió un error consultando los campos, intente nuevamente')
          this.setLoading(false)
        }
      })
      .catch(error => {
        message.error('Ocurrió un error consultando los campos, intente nuevamente')
        console.log(error.message);
        this.setLoading(false)
      });
  };

  peticionPost = () => {
    delete this.state.form.id;
    axios
      .post(URL + 'fields', this.state.form)
      .then(response => {
        if (response.status === 200) {
          this.modalInsertar();
          this.peticionGet();
          message.success('Campo creado con éxito')
        }
        else {
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
      if (response.status === 200) {
        this.modalInsertar();
        this.peticionGet();
        message.success('Campo actualizado con éxito')
      }
      else {
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
      if (response.status === 200) {
        this.setState({ modalEliminar: false });
        this.peticionGet();
        message.success('Campo eliminado con éxito')
      }
      else {
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

  setLoading = e => {
    this.setState({ loading: e })
  }

  onFilter = search => {
    this.setLoading(true)
    const responseSearch = this.state.data.filter(({ nombre }) => {
      nombre = nombre.toLowerCase();
      return nombre.includes(search.target.value.toLowerCase());
    });
    this.setState({ dataSearch: responseSearch, loading: false });
  };

  componentDidMount() {
    this.peticionGet();
    modules = JSON.parse(sessionStorage.getItem('modules'));
  }

  render() {
    const { form } = this.state;
    return (
      <Fragment>
        <HeaderSection
          onClick={() => {
            this.setState({ form: null, tipoModal: 'insertar' });
            this.modalInsertar();
          }}
          titleButton="Agregar Campo"
          content='Curvas'
          title={'Campos'}
          disabled={modules && modules.curves.fields.edit}
        />
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
          </Row>
          <Row style={{ marginTop: '10px' }}>
            <Col span={24}>
              <Table
                tableLayout="fixed"
                pagination={{ pageSize: 10 }}
                dataSource={this.state.dataSearch}
                rowKey="id"
                key="id"
                loading={{ indicator: <div><Spin /></div>, spinning: this.state.loading }}
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
                    width: '50%',
                  },
                  {
                    title: 'Acción',
                    width: '20%',
                    render: info => {
                      return (
                        <Row gutter={16} justify="center">
                          <Col span={8} style={{ cursor: 'pointer' }}>
                            <Tooltip
                              title={modules && modules.curves.fields.edit
                                ? "Editar" : "No tienes permisos."}>
                              <Button
                                shape='circle'
                                disabled={!(modules && modules.curves.fields.edit)}
                                onClick={() => this.modalEditar(info)}>
                                <EditOutlined />
                              </Button>
                            </Tooltip>
                          </Col>
                          <Col span={4} style={{ cursor: 'pointer' }}>
                            <Tooltip
                              title={modules && modules.curves.fields.edit
                                ? "Eliminar" : "No tienes permisos."}>
                              <Button
                                shape='circle'
                                disabled={!(modules && modules.curves.fields.edit)}
                                onClick={() => this.modalEliminar(info)}>
                                <DeleteOutlined />
                              </Button>
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
      </Fragment>
    );
  }
}
export default viewFields;
