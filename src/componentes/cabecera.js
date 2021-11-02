import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';

import '../css/style.css';

class Cabecera extends Component {
  render() {
    return (
      <div className="Cabecera">
        <div className="containerUno">
          <label className="title"> EcoDRILL - EcoAge Web </label>
          <div className="containerTres">
            {
              <AssignmentIndIcon
                icon={AssignmentIndIcon}
                style={{ fontSize: 50 }}
              />
            }
          </div>
          <div className="containerDos">
            Usuario <br />
            {JSON.parse(sessionStorage.getItem('user')).nombre_usuario_sesion}
          </div>
        </div>
      </div>
    );
  }
}
export default Cabecera;
