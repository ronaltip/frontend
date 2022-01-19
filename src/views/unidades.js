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
  Spin,
  Button
} from 'antd';
import Footer from '../componentes/footer';
import HeaderSection from '../libs/headerSection/headerSection';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

const URL = process.env.REACT_APP_API_HOST;
const { Search } = Input;
let modules = null;
class viewUnidades extends Component {
  state = {
    data: [], dataSearch: [], loading: false,
    modalInsertar: false,
    modalEditar: false,
    modalEliminar: false,
    tipoModal: '',
    form: { id: '', nombre: '', tag: '', estado_id: '', pkuser: '' },
  };

  peticionGet = () => {
    this.setLoading(true)
    axios
      .get(URL + 'unidades')
      .then(response => {
        if (response.status === 200)
          this.setState({ data: response.data, dataSearch: response.data, loading: false });
        else {
          message.error('Ocurrió un error consultando las unidades de medida, intente nuevamente')
          this.setLoading(false)
        }
      })
      .catch(error => {
        message.error('Ocurrió un error consultando las unidades de medida, intente nuevamente')
        console.log(error.message)
        this.setLoading(false)
      });
  };

  peticionPost = async () => {
    delete this.state.form.id;
    await axios
      .post(URL + 'unidades', this.state.form)
      .then(response => {
        if (response.status === 200) {
          this.modalInsertar();
          this.peticionGet();
          message.success('Unidad de medida creada con éxito')
        }
        else {
          console.log(response.data);
          message.error('Ocurrió un error creando la unidad de medida, intente nuevamente')
        }
      })
      .catch(error => {
        message.error('Ocurrió un error creando la unidad de medida, intente nuevamente')
        console.log(error.message);
      });
  };

  peticionPut = () => {
    axios.put(URL + 'unidades', this.state.form).then(response => {
      if (response.status === 200) {
        this.modalInsertar();
        this.peticionGet();
        message.success('Unidad de medida actualizado con éxito')
      }
      else {
        console.log(response.data);
        message.error('Ocurrió un error actualizando la unidad de medida, intente nuevamente')
      }
    }).catch(error => {
      message.error('Ocurrió un error actualizando la unidad de medida, intente nuevamente')
      console.log(error.message);
    });
  };

  peticionDelete = () => {
    var datos = {
      id: this.state.form.id,
      pkuser: JSON.parse(sessionStorage.getItem('user')).pk_usuario_sesion,
    };

    axios.delete(URL + 'unidades', { data: datos }).then(response => {
      if (response.status === 200) {
        this.setState({ modalEliminar: false });
        this.peticionGet();
        message.success('Unidad de medida eliminada con éxito')
      }
      else {
        console.log(response.data);
        message.error('Ocurrió un error eliminando la unidad de medida, intente nuevamente')
      }
    }).catch(error => {
      console.log(error.message);
      message.error('Ocurrió un error aliminando la unidad de medida, intente nuevamente')
    });
  };

  modalInsertar = () => {
    let pkuser = JSON.parse(
      sessionStorage.getItem('user')
    ).pk_usuario_sesion;
    this.setState({
      modalInsertar: !this.state.modalInsertar,
      tipoModal: 'insertar',
      form: { id: 0, nombre: '', tag: '', estado_id: '', pkuser: pkuser }
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

  seleccionarRegistro = unidades => {
    let pkuser = JSON.parse(
      sessionStorage.getItem('user')
    ).pk_usuario_sesion;
    this.setState({
      tipoModal: 'actualizar',
      form: {
        id: unidades.id,
        nombre: unidades.nombre,
        tag: unidades.tag,
        estado_id: unidades.estado_id,
        pkuser: pkuser
      }
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
    const responseSearch = this.state.data.filter(({ nombre }) => {
      nombre = nombre.toLowerCase();
      return nombre.includes(search.target.value.toLowerCase());
    });
    this.setState({ dataSearch: responseSearch });
  };

  setLoading = e => {
    this.setState({ loading: e })
  }

  componentDidMount() {
    this.peticionGet();
    modules = JSON.parse(sessionStorage.getItem('modules'));
  }

  render() {
    const { form } = this.state;

    return (
      <>
        <HeaderSection
          onClick={() => {
            this.setState({ form: null, tipoModal: 'insertar' });
            this.modalInsertar();
          }}
          titleButton="Agregar Unidad"
          content='Configuración'
          title={'Unidades de Medida'}
          disabled={modules && modules.configuration.unitMeasurement.edit}
        />
        <div className='container-xl'>
          <Row >
            <Col span={24}>
              <h3>Listado de Unidades de Medida</h3>
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
                    title: 'Tag',
                    dataIndex: 'tag',
                    key: 'tag',
                    width: '30%',
                  },
                  {
                    title: 'Acción',
                    width: '20%',
                    render: info => {
                      return (
                        <Row gutter={8} justify="center">
                          <Col span={4} style={{ cursor: 'pointer' }}>
                            <Tooltip
                              title={modules && modules.configuration.unitMeasurement.edit
                                ? "Editar" : "No tienes permisos."}>
                              <Button
                                shape='circle'
                                disabled={!(modules && modules.configuration.unitMeasurement.edit)}
                                onClick={() => this.modalEditar(info)}
                              >
                                <EditOutlined
                                /></Button>
                            </Tooltip>
                          </Col>
                          <Col span={4} style={{ cursor: 'pointer' }}>
                            <Tooltip
                              title={modules && modules.configuration.unitMeasurement.edit
                                ? "Eliminar" : "No tienes permisos."}>
                              <Button
                                shape='circle'
                                disabled={!(modules && modules.configuration.unitMeasurement.edit)}
                                onClick={() => this.modalEliminar(info)}
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

        <Footer />

        <Modal isOpen={this.state.modalInsertar}>
          <ModalHeader style={{ display: 'block' }}>
            <span
              style={{ float: 'right' }}
              onClick={() => this.modalInsertar()}
            >
              <iconList.CancelIcon />
            </span>
            {this.state.tipoModal === 'insertar' ? (
              <label htmlFor="nombre">Nueva Unidad de Medida</label>
            ) : (
              <label htmlFor="nombre">Editar Unidad de Medida</label>
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
                value={form ? form.id : this.state.data.length + 1}
              />
              <label htmlFor="nombre"><b>Nombre:</b> &nbsp; </label>
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
export default viewUnidades;
