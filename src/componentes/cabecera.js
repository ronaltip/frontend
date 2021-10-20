import React, { Component } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Cookies from 'universal-cookie';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';

import '../css/style.css';
const cookies = new Cookies();
 
class Cabecera extends Component {
    render() {
        return (            
            <div className="Cabecera"> 
                <div className="containerUno">
                    <label className="title">   EcoDRILL - EcoAge Web </label>
                    <div className="containerTres"> {<AssignmentIndIcon icon={AssignmentIndIcon} style={{ fontSize: 50 }} />} </div>
                    <div className="containerDos">
                        Usuario  <br/>
                        {cookies.get('nombre_usuario_sesion')}  
                    </div>
                </div> 
            </div>
        );
    }
}
export default Cabecera;