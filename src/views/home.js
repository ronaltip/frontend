import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import SideBar from '../componentes/sidebar';
import Cabecera from '../componentes/cabecera';
import '../css/styles.css';
class Home extends Component {
  cerrarSesion = () => {
    sessionStorage.removeItem('user');
    window.location.href = './';
  };

  render() {
    return (
      <div id="Home">
        <Cabecera />
        <SideBar pageWrapId={'page-wrap'} outerContainerId={'App'} />
      </div>
    );
  }
}
export default Home;
