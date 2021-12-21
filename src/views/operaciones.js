import React, { Component } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

import { CSVReader } from 'react-papaparse';
import {
  Col,
  message,
  Row,
  Table,
  Tooltip,
  Input,
  Spin
} from 'antd';
import SideBar from '../componentes/sidebar';
import Cabecera from '../componentes/cabecera';
import Footer from '../componentes/footer';

import '../css/styles.css';
import iconList from '../util/iconList';

const URL = process.env.REACT_APP_API_HOST;
const { Search } = Input;


const buttonRef = React.createRef();


var ArrayD = [];

class viewOperaciones extends Component {
  state = {
    data: [], dataSearch: [], loading: false,
    dataWells: [],
    dataArray: [],
    modalInsertar: false,
    modalEliminar: false,
    form: { id: '', wells_id: '', estado_id: '', pkuser: '', datoFile: '' },
    tipoModal: '',
    pozo_id: '0',
    search: ''
  };

  peticionGet = (pozo_id) => {
    return new Promise((resolve, reject) =>  {
      axios
        .get(URL + 'operaciones/wells/'+ pozo_id)
        .then(response => {
          if (response.status === 200)
          {     
            this.setState({ data: response.data, dataSearch: response.data});      
            resolve(true)
          }
          else
          {
            console.log(response.data);
            message.error('Ocurrió un error consultando las operaciones, intente nuevamente')
            reject(false)
          }
        })
        .catch(error => {
            message.error('Ocurrió un error consultando las operaciones, intente nuevamente')
            console.log(error.message);
            reject(false)
        });
    })
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
    let datos = []
    for (let i = 1; i < ArrayD.value.length - 1; i++) {
      let col1 = ArrayD.value[i].data[0]
      let col2 = ArrayD.value[i].data[1]
      

      if (col1 !== '' && col2 !== '')
      {
          
        //Desde
        let desde = await this.ConvertirFecha(ArrayD.value[i].data[4])
        
        //Hasta   
        let hasta = await this.ConvertirFecha(ArrayD.value[i].data[5])

        if (desde.addHora)
        {
          let extractHora1 = hasta.fecha.split(' ')
          ArrayD.value[i].data[4] = desde.fecha + ' ' + extractHora1[1]
        }
        else
          ArrayD.value[i].data[4] = desde.fecha 
        if (hasta.addHora)
        {
          let extractHora2 = desde.fecha.split(' ')
          ArrayD.value[i].data[5] = hasta.fecha + ' ' + extractHora2[1]
        }
        else
          ArrayD.value[i].data[5] = hasta.fecha

        datos.push(ArrayD.value[i].data)    
      }
    }
    let form = {
      wells_id: Number(this.state.form.wells_id),
      pkuser: JSON.parse(sessionStorage.getItem('user')).pk_usuario_sesion,
      datos: datos
    }
    
    
    axios
      .post(URL + 'operaciones', {data: form})
      .then(response => {
        if (response.status === 200)
        {
          this.modalInsertar();
          message.success('Archivo de operaciones cargado con éxito.')
        }
        else
        {
          console.log(response.data);
          message.error('Ocurrió un error cargando el archivo de operaciones, intente nuevamente')
        }
      })
      .catch(error => {
        message.error('Ocurrió un error cargando el archivo de operaciones, intente nuevamente')
        console.log(error.message);
      });
    
  };

  ConvertirFecha = async (fecha) => {
    let colDate = fecha.split(' ')
    let agregarHora = false
    switch (colDate.length)
    {
      case 1:
        let date1 = colDate[0].split('/')
        colDate = date1[2] + '-' + ( date1[0].length === 1 ? ('0'+date1[0]) : date1[0] ) + '-' + ( date1[1].length === 1 ? ('0'+date1[1]) : date1[1] )
        agregarHora = true
        break;
      case 3:
        let date2 = colDate[0].split('/')
        let fullhora = colDate[1]
        let hora = fullhora.split(':')
        if (colDate[2] === 'AM')
        {
          if (hora[0] === '12')
            hora[0] = '0'
        }
        else
        {
          if (hora[0] !== '12')
            hora[0] = Number(hora[0]) + 12
        }

        colDate = date2[2] + '-' + ( date2[0].length === 1 ? ('0'+date2[0]) : date2[0] ) + '-' + ( date2[1].length === 1 ? ('0'+date2[1]) : date2[1] ) + ' ' + ( hora[0].length === 1 ? ('0'+hora[0]) : hora[0] ) + ':' + ( hora[1].length === 1 ? ('0'+hora[1]) : hora[1] ) + ':' + ( hora[2].length === 1 ? ('0'+hora[2]) : hora[2] )
        break;
    }
    return { addHora: agregarHora, fecha: colDate }
  }

  peticionDelete = () => {
    var datos = {
      id: this.state.form.id,
      pkuser: JSON.parse(sessionStorage.getItem('user')).pk_usuario_sesion,
    };

    axios.delete(URL + 'operaciones', { data: datos }).then(response => {
      if (response.status === 200)
      {
        this.setState({ modalEliminar: false });
        this.onSearchByPozo()
        message.success('Operación eliminada con éxito')
      }
      else
      {
        console.log(response.data);
        message.error('Ocurrió un error eliminando la operación, intente nuevamente')
      }
    }).catch(error => {
      console.log(error.message);
      message.error('Ocurrió un error eliminando la operación, intente nuevamente')
    });
  };

  modalInsertar = () => {
    let pkuser = JSON.parse(
      sessionStorage.getItem('user')
    ).pk_usuario_sesion;
    this.setState({ modalInsertar: !this.state.modalInsertar,
      form: {
        id: '', wells_id: '', estado_id: '', pkuser: pkuser, datoFile: ''
      } 
    });
  };

  modalEliminar = (info) => {
    this.seleccionarRegistro(info)
    this.setState({ modalEliminar: !this.state.modalEliminar });
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

  onFiltered = (search) => {
    this.setState({search: search.target.value})
    if (this.state.pozo_id === '0')
      message.info('Seleccione el pozo')
    else
    {
      let searched = search.target.value.toLowerCase();
      if (this.state.dataSearch.length > 0)
      {
        const responseSearch = this.state.data.filter( ({operacion, desde, hasta}) => {
          operacion = operacion.toLowerCase();
          return  operacion.includes(searched) || desde.includes(searched) || hasta.includes(searched);
        });
        this.setState({dataSearch:  responseSearch});
      }
    }
  }

  onSearchByPozo = () => {
    if (this.state.pozo_id === '0')
      message.info('Seleccione el pozo')
    else
    {
      this.setLoading(true)
      this.peticionGet(this.state.pozo_id).then( res => {
        if (res)
        {
          this.setState({ loading: false });
        }
        else
          this.setState({dataSearch:  [], loading: false });
      })
    }
  }

  handleChange =  e => {
    this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value,
      },
    });
  };

  handleChangeFilter =  e => {
    this.setState({
        [e.target.name]: e.target.value,
        dataSearch: [], search: ''
    });
  };

  setLoading = e => {
    this.setState({loading: e})
  }

  componentDidMount() {
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
        <SideBar />

        <nav aria-label="breadcrumb" className='small'>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">Cargue de datos</li>
            <li className="breadcrumb-item active" aria-current="page">Operaciones</li>
          </ol>
        </nav>

        <div className='container-xl'>
          <div className='row'>
            <div className='col-sm-12 col-md-12 col-lg-12'>
              <h3>Listado de Operaciones</h3>
            </div>
          </div>
          <div className='row'>
            <div className='col-sm-12 col-md-4 col-lg-4'>
              <div className="input-group mb-3">
                <select
                  name="pozo_id"
                  id="pozo_id"
                  className="form-control form-control-sm"
                  onChange={this.handleChangeFilter}
                  defaultValue={this.state.pozo_id}
                  aria-describedby="basic-addon2"
                >
                  <option key="0" value="0">
                    Seleccione el Pozo
                  </option>
                  {this.state.dataWells.map(elemento => (
                    <option key={elemento.id} value={elemento.id}>
                      {elemento.nombre}
                    </option>
                  ))}
                </select>
                <div className="input-group-append">
                  <button className='btn btn-sm btn-outline-secondary' style={{height:'31px'}} type='button' title='Buscar' onClick={() => this.onSearchByPozo()}><iconList.Search /></button>
                </div>
              </div>
            </div>
            <div className='col-sm-6 col-md-4 col-lg-4'>
              <Search
                placeholder="Buscar"
                onChange={(v) => this.onFiltered(v)}
                enterButton={false}
                value={this.state.search}
              />
            </div>
            <div className='col-sm-6 col-md-4 col-lg-4 text-right'>
              <button
                className="btn btn-success btn-sm"
                onClick={() => {
                  this.setState({ form: null, tipoModal: 'insertar' });
                  this.modalInsertar();
                }}
              >
                <iconList.Add /> Agregar archivo
              </button>
            </div>
          </div>
    
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
                    title: 'Desde',
                    dataIndex: 'desde',
                    key: 'desde',
                  },
                  {
                    title: 'Hasta',
                    dataIndex: 'hasta',
                    key: 'hasta',
                  },
                  {
                    title: 'Prof. Inicial',
                    dataIndex: 'md_from',
                    key: 'md_from',
                  },
                  {
                    title: 'Prof. Final',
                    dataIndex: 'md_to',
                    key: 'md_to',
                  },
                  {
                    title: 'Operación',
                    dataIndex: 'operacion',
                    key: 'operacion',
                    width: '40%'
                  },
                  {
                    title: 'Acción',
                    width: '10%',
                    render: info => {
                      return (
                      <Row  justify="center">
                        <Col  style={{ cursor: 'pointer' }}>
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

        <Modal isOpen={this.state.modalInsertar} centered>
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
              <label htmlFor="nombre"><b>Operación:</b> &nbsp; </label><br/>
              {form ? <span>{form.operacion}</span> : ''}
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
      </div>
    );
  }
}
export default viewOperaciones;
