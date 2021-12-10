import React, { Component } from 'react';
import { Spinner } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import SideBar from '../componentes/sidebar';
import Cabecera from '../componentes/cabecera';
import '../css/styles.css';
import { message } from 'antd';
import axios from "axios";
import { CheckCircleOutline, Warning, Refresh } from '@material-ui/icons';
const URL = process.env.REACT_APP_API_HOST; 
const RESULT = {
  WAIT:   0,
  OK:     1,
  ERROR:  2 
}
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      convencion: 0,
      tiposEvento:0,
      tiposCurva: 0,
      
    }
  }

  cerrarSesion = () => {
    sessionStorage.removeItem('user');
    window.location.href = './';
  };

  getTipoEventos = async () => {
    let tiposEvento = []
    this.setState({tiposEvento: RESULT.WAIT})
    axios.get(URL + 'tipo_eventos').then(response => {
      if (response.status === 200)
      {
        response.data.forEach((item) => {
          tiposEvento.push({value: item.id, label: item.nombre, color: item.color})
        })
        sessionStorage.setItem('dataTipoEvento', JSON.stringify(tiposEvento));
        this.setState({tiposEvento: RESULT.OK})
      }
      else
      {
        message.error('No se cargaron los tipos de evento en la aplicación')
        console.log( response.data );
        this.setState({tiposEvento: RESULT.ERROR})
      }
    }).catch(error => {
       message.error('No se cargaron los tipos de evento en la aplicación')
       console.log(error.message);
       this.setState({tiposEvento: RESULT.ERROR})
    })
  }
  getConvencion = async () => {
      this.setState({convencion: RESULT.WAIT})
      axios.get(URL + 'convencion_datos_operacion').then(response => {
        if (response.status === 200)
        {
          this.setState({convencion: RESULT.OK})
          sessionStorage.setItem('dataConvencion', JSON.stringify(response.data));
        }
        else
        {
          this.setState({convencion: RESULT.ERROR})
          console.log( response.data );
          message.error('No se cargaron las convenciones de las operaciones en la aplicación')
        }
      }).catch(error => {
          message.error('No se cargaron las convenciones de las operaciones en la aplicación')
          console.log( error.message );
          this.setState({convencion: RESULT.ERROR})

      })
  }
  getWitsDetalle = async () => {
    this.setState({tiposCurva: RESULT.WAIT})
    axios.get(URL + 'wits_detalle').then(response => {
      if (response.status === 200)
      {
        sessionStorage.setItem('dataWitsDetalle', JSON.stringify(response.data));
        this.setState({tiposCurva: RESULT.OK})
      }
      else
      {
        this.setState({tiposCurva: RESULT.ERROR})
        console.log( response.data );
        message.error('No se cargaron los tipos de curva en la aplicación')
      }
    }).catch(error => {
        message.error('No se cargaron los tipos de curva en la aplicación')
        console.log( error.message );
        this.setState({tiposCurva: RESULT.ERROR})
    })
  }

  componentDidMount() {
    this.getTipoEventos();
    this.getConvencion();
    this.getWitsDetalle();
  }

  render() {
    return (
      <div id="Home">
        <Cabecera />
        <SideBar pageWrapId={'page-wrap'} outerContainerId={'App'} />
        <div className="container">

          <div className="row mt-5">
            <div className="col-md-5 col-lg-4"></div>
              <table className="table table-sm table-striped">
                <tbody>
                  <tr>

                    <td style={{width: '90%'}}>
                      Convención datos de Operación &nbsp;&nbsp;
                      
                    </td>
                    <td>
                      {
                        this.state.convencion === RESULT.WAIT
                        ?
                        <Spinner 
                            color="warning" 
                            animation="border"
                            size="md"
                            role="status"
                            aria-hidden="true" 
                        />
                        :
                        this.state.convencion === RESULT.OK
                        ?
                        <CheckCircleOutline fontSize="large" style={{color: 'green'}} />
                        :
                        null
                      }
                      {
                        this.state.convencion === RESULT.ERROR ? 
                        <Warning fontSize="large" style={{color: 'orange'}} titleAccess="Error consultando los datos" />
                        : null
                      }
                    </td>
                    <td>
                      {
                        this.state.convencion === RESULT.ERROR ?
                        <button className="btn btn-primary btn-sm" onClick={() => this.getConvencion() } title="Consultar de nuevo" > <Refresh /></button>
                        : null
                      }
                    </td>
                  </tr>
                  <tr>

                    <td >
                      Tipos de Evento &nbsp;&nbsp;
                    </td>
                    <td>
                      {
                        this.state.tiposEvento === RESULT.WAIT
                        ?
                        <Spinner 
                            color="warning" 
                            animation="border"
                            size="md"
                            role="status"
                            aria-hidden="true" 
                        />
                        :
                        this.state.tiposEvento === RESULT.OK
                        ?
                        <CheckCircleOutline fontSize="large" style={{color: 'green'}} />
                        :
                        null
                      }
                      {
                        this.state.tiposEvento === RESULT.ERROR ? 
                        <Warning fontSize="large" style={{color: 'orange'}} titleAccess="Error consultando los datos" />
                        : null
                      }
                    </td>
                    <td>
                      {
                        this.state.tiposEvento === RESULT.ERROR ?
                        <button className="btn btn-primary btn-sm" onClick={() => this.getTipoEventos() } title="Consultar de nuevo" > <Refresh /></button>
                        : null
                      }
                    </td>
                  </tr>
                  <tr>

                    <td >
                      Tipos de Curva &nbsp;&nbsp;
                    </td>
                    <td>
                      {
                        this.state.tiposCurva === RESULT.WAIT
                        ?
                        <Spinner 
                            color="warning" 
                            animation="border"
                            size="md"
                            role="status"
                            aria-hidden="true" 
                        />
                        :
                        this.state.tiposCurva === RESULT.OK
                        ?
                        <CheckCircleOutline fontSize="large" style={{color: 'green'}} />
                        :
                        null
                      }
                      {
                        this.state.tiposCurva === RESULT.ERROR ? 
                        <Warning fontSize="large" style={{color: 'orange'}} titleAccess="Error consultando los datos" />
                        : null
                      }
                    </td>
                    <td>
                      {
                        this.state.tiposCurva === RESULT.ERROR ?
                        <button className="btn btn-primary btn-sm" onClick={() => this.getWitsDetalle() } title="Consultar de nuevo" > <Refresh /></button>
                        : null
                      }
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
        </div>
      </div>
    );
  }
}
export default Home;
