import React, { Fragment } from 'react';
import './headerBar.css';
import { Avatar, Button, Col, Image, Row, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const HeaderBar = () => {
  const user = JSON.parse(sessionStorage.getItem('user'));
  return (
    <Fragment>
      <Row justify="space-between" align="middle">
        <Col span={15}>
          <h3 className="title-headers"> EcoDRILL - EcoAge Web </h3>
        </Col>
        <Col span={5}>
          <Space align="center">
            <Avatar icon={<UserOutlined />}></Avatar>
            <span className="title-headers">
              Usuario: {user ? user.nombre_usuario_sesion : ''}
            </span>
          </Space>
        </Col>
      </Row>
      {/* <Row align="middle" justify="end">
        <Col span={5}>
          <Button>"Archivo .Fels"</Button>
        </Col>
      </Row> */}
    </Fragment>
  );
};

export default HeaderBar;
