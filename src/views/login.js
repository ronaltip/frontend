import React, { Component } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/login.css';
import md5 from 'md5';
import { message } from 'antd';

const url = process.env.REACT_APP_API_HOST;

class Login extends Component {
  state = {
    form: {
      codigo: '',
      clave: '',
    },
  };

  handleChange = async e => {
    e.persist();
    await this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value,
      },
    });
    //console.log(this.state.form);
    //console.log(md5(this.state.form.clave))
  };

  iniciarSesion = async () => {
    //await axios.get(url + 'usuarios', { params: { codigo: this.state.form.codigo, clave: md5(this.state.form.clave) } })
    await axios
      .get(
        url +
          'usuarios/' +
          this.state.form.codigo +
          '/' +
          md5(this.state.form.clave)
      )
      .then(response => {
        return response.data;
      })
      .then(response => {
        if (response.length > 0) {
          var respuesta = response[0];
          const user = {
            id_usuario_sesion: respuesta.id,
            nombre_usuario_sesion: respuesta.nombre,
            perfil_id_usuario_sesion: respuesta.perfil_id,
            pk_usuario_sesion: respuesta.id,
          };
          sessionStorage.setItem('user', JSON.stringify(user));
          window.location.href = './home';
        } else {
          message.error('El usuario o contraseña no son correctos.');
          window.location.pathname = '/';
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    return (
      <div>
        <div className="containerPrincipal">
          <div className="containerSecundario">
            <div className="form-groop">
              <label className="title"> EcoAge </label> 1.0 <br />
              <label>Usuario:</label>
              <br />
              <input
                type="text"
                id="codigo"
                name="codigo"
                className="form-control"
                autoComplete="off"
                onChange={this.handleChange}
              />
              <br />
              <label>Contrase&ntilde;a:</label>
              <br />
              <input
                type="password"
                id="clave"
                name="clave"
                className="form-control"
                autoComplete="off"
                onChange={this.handleChange}
              />
              <br />
              <button
                className="btn btn-primary"
                onClick={() => this.iniciarSesion()}
              >
                Ingresar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Login;
