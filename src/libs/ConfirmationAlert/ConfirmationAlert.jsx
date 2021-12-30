import { WarningOutlined } from '@ant-design/icons';
import { Button, Col, Modal, Row } from 'antd';
import React from 'react';

const ConfirmationAlert = ({ onClickGo, isVisible, setIsVisible }) => (
  <Modal
    title="Eliminar registro"
    visible={isVisible}
    footer={
      <Row>
        <Col>
          <Button className="btn btn-danger" onClick={onClickGo()}>
            Si
          </Button>
        </Col>
        <Col>
          <Button
            className="btn btn-secundary"
            onClick={() => setIsVisible(false)}
          >
            No
          </Button>
        </Col>
      </Row>
    }
  >
    <Row>
      <Col>
        <WarningOutlined style={{ color: '#f19a00' }} />
      </Col>
      <Col>
        <span>Está seguro que desea eliminar el registro ? </span>
      </Col>
    </Row>
  </Modal>
);

export default ConfirmationAlert;
