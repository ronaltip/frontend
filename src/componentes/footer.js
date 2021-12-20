import React, { Component } from 'react';
import { Divider } from 'antd';
import 'bootstrap/dist/css/bootstrap.min.css';

import '../css/styles.css';
import '../css/button.css';

class Footer extends Component {
  render() {
    return (
      <>
        <Divider plain></Divider>
        <nav className="navbar navbar-light fixed-bottom bg-verdeoscuro">
          <small className="text-center" >2021 - ICP Instituto Colombiano del Petróleo </small>
        </nav>
      </>
    );
  }
}
export default Footer;