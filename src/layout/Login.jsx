import React, { useState, useEffect, useContext } from 'react';
import '../css/login.css';
import md5 from 'md5';
import { Col, Form, message, Row, Input, Button } from 'antd';
import HttpServices from '../services/HttpServices';
import { UserContext } from '../context/UserContext';

const Login = () => {
  const [form] = Form.useForm();
  const [, forceUpdate] = useState({});
  const [, userDispatch] = useContext(UserContext);

  const signIn = async values => {
    userDispatch({ type: '' });
    sessionStorage.removeItem('user');
    HttpServices()
      .get('usuarios/' + values.code + '/' + md5(values.password))
      .then(response => {
        if (response && response.length > 0 && response[0].id) {
          var respuesta = response[0];
          const user = {
            id_usuario_sesion: respuesta.id,
            nombre_usuario_sesion: respuesta.nombre,
            perfil_id_usuario_sesion: respuesta.perfil_id,
            pk_usuario_sesion: respuesta.id,
          };

          sessionStorage.setItem('user', JSON.stringify(user));
          window.location.href = './eco';
        } else {
          message.error('El usuario o contraseña no son correctos.');
          sessionStorage.removeItem('user');
        }
      })
      .catch(error => {
        console.log(error);
        sessionStorage.removeItem('user');
        message.error('Algo ha salido mal, intenta de nuevo.');
      });
  };

  return (
    <div className="auth-container">
      <Row id="wrapper-singIn">
        <Col span={24}>
          <Row align="center" justify="middle" id="content-singIn">
            <Col span={15} id="col-singIn">
              <h2>
                EcoAge <strong>2.0</strong>
              </h2>
            </Col>
            <Col span={15} id="col-singIn">
              <Form
                name="basic"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                initialValues={{ code: '', password: '' }}
                onFinish={signIn}
                autoComplete="off"
              >
                <Form.Item
                  label="Usuario"
                  name="code"
                  rules={[
                    {
                      required: true,
                      message: 'Por favor ingresa tu usuario !',
                    },
                  ]}
                >
                  <Input className="component-signIn" />
                </Form.Item>
                <Form.Item
                  label="Contraseña"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: 'Por favor ingresa tu contraseña',
                    },
                  ]}
                >
                  <Input.Password className="component-signIn" />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                  <Button
                    className="btn-success"
                    type="primary"
                    htmlType="submit"
                    disabled={
                      !form.isFieldsTouched(true) ||
                      !!form
                        .getFieldsError()
                        .filter(({ errors }) => errors.length).length
                    }
                  >
                    Ingresar
                  </Button>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
