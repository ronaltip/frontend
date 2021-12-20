import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import '../css/styles.css';
import '../css/button.css';

class Cabecera extends Component {
  render() {
    return (
      <>
      <nav className="navbar navbar-light bg-verdeclaro">
        <i className="navbar-brand" href="#">
          <img src="favicon.ico" width="30" height="30" className="d-inline-block align-top ml-5" alt="ECOPETROL" />
          EcoAge
        </i>
        <span className="navbar-text">
          <div className='row'>
            <div className='col-3 text-center'>
              <AccountCircleIcon
              className='text-success mt-2'
              fontSize='large'
              />
            </div>
            <div className='col-3' style={{display:'block'}}>
              <div><b>Usuario:</b></div>
              <div>{JSON.parse(sessionStorage.getItem('user')).nombre_usuario_sesion}</div>
            </div>
          </div>
        </span>
      </nav>
      
      </>
    );
  }
}
export default Cabecera;
