import React, { Component } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import iconList from '../util/iconList';
import '../css/styles.css';
import HeaderSection from '../libs/headerSection/headerSection';
import { Button, Col, message, Row, Spin, Table, Tooltip } from 'antd';
import Search from 'antd/lib/transfer/search';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

const URL = process.env.REACT_APP_API_HOST;
let modules = null;
class viewUsuario extends Component {
  state = {
    data: [], dataSearch: [], loading: false,
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
    this.setLoading(true)
    axios
      .get(URL + 'usuarios')
      .then(response => {
        if (response.status === 200) {
          this.setState({
            data: response.data,
            dataSearch: response.data,
            loading: false
          });
        } else {
          message.error('Ocurrió un error consultando las unidades de medida, intente nuevamente')
          this.setLoading(false)
        }
      })
      .catch(error => {
        this.setLoading(false)

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
    this.state.form.pkuser = JSON.parse(
      sessionStorage.getItem('user')
    ).pk_usuario_sesion;
  };

  componentDidMount() {
    this.peticionGet();
    this.peticionPerfilesGet();
    modules = JSON.parse(sessionStorage.getItem('modules'));
  };
  onFilter = search => {
    const responseSearch = this.state.data.filter(({ nombre }) => {
      nombre = nombre.toLowerCase();
      return nombre.includes(search.target.value.toLowerCase());
    });
    this.setState({ dataSearch: responseSearch });
  };
  setLoading = e => {
    this.setState({ loading: e })
  }

  render() {
    const { form } = this.state;
    return (
      <div className="App">
        <HeaderSection
          onClick={() => {
            this.setState({ form: null, tipoModal: 'insertar' });
            this.modalInsertar();
          }}
          titleButton="Agregar Usuario"
          content='Configuración'
          title={'Listado Usuario'}
          disabled={modules && modules.configuration.users.edit}
        />
        <div className='container-xl'>
          <Row >
            <Col span={24}>
              <h3>Lista de Usuarios</h3>
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
                    width: '25%',
                  },
                  {
                    title: 'Email',
                    dataIndex: 'email',
                    key: 'email',
                    width: '15%',
                  },
                  {
                    title: 'Código',
                    dataIndex: 'codigo',
                    key: 'codigo',
                    width: '15%',
                  },
                  {
                    title: 'Perfil',
                    dataIndex: 'Perfil',
                    key: 'Perfil',
                    width: '15%',
                  },
                  {
                    title: 'Acción',
                    width: '20%',
                    render: info => {
                      return (
                        <Row gutter={8} justify="center">
                          <Col span={4} style={{ cursor: 'pointer' }}>
                            <Tooltip
                              title={modules && modules.configuration.users.edit
                                ? "Editar" : "No tienes permisos."}>
                              <Button
                                shape='circle'
                                disabled={!(modules && modules.configuration.users.edit)}
                                onClick={(event, rowData) => {
                                  this.seleccionarUsuario(rowData);
                                  this.modalInsertar();
                                }}
                              >
                                <EditOutlined />
                              </Button>
                            </Tooltip>
                          </Col>
                          <Col span={4} style={{ cursor: 'pointer' }}>
                            <Tooltip
                              title={modules && modules.configuration.users.edit
                                ? "Eliminar" : "No tienes permisos."}>
                              <Button
                                shape='circle'
                                disabled={!(modules && modules.configuration.users.edit)}
                                onClick={(event, rowData) => {
                                  this.seleccionarUsuario(rowData);
                                  this.setState({ modalEliminar: true });
                                }}
                              >
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
export default viewUsuario;
