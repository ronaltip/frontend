import React, { Component } from 'react';  
import "bootstrap/dist/css/bootstrap.min.css";  

import Cookies from 'universal-cookie';  
import SideBar from "../componentes/sidebar";
import Cabecera from "../componentes/cabecera";
import '../css/styles.css';
const cookies = new Cookies();

class Home extends Component {

    cerrarSesion=()=>{
        cookies.remove('id_usuario_sesion', {path:"/"});
        cookies.remove('nombre_usuario_sesion', { path: "/" });
        cookies.remove('perfil_id_usuario_sesion', { path: "/" });
        window.location.href = './';
    }

    componentDidMount() {
        if (cookies.remove('id_usuario_sesion')) {
            window.location.href = "./";
        }
    } 
  

    render() {
        
        return (
            <div id="Home" >
                <Cabecera />                                 
                <SideBar pageWrapId={"page-wrap"} outerContainerId={"App"} />
            </div>
        );
    }

    
}
export default Home;
 