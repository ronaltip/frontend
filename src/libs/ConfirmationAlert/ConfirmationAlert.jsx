import { WarningOutlined } from '@ant-design/icons';
import { Button, Col, Modal, Row } from 'antd';
import React from 'react';

const ConfirmationAlert = ({ onClickGo, isVisible, onCancel }) => (
  <Modal
    title="Eliminar registro"
    visible={isVisible}
    width={300}
    centered
    onCancel={onCancel}
    footer={
      <Row justify="end">
        <Col span={6}>
          <Button
            className="btn-success"
            style={{ backgroundColor: '#28a745', color: '#FFF' }}
            onClick={onClickGo}
          >
            Si
          </Button>
        </Col>
        <Col span={6}>
          <Button className="btn btn-secundary" onClick={onCancel}>
            No
          </Button>
        </Col>
      </Row>
    }
  >
    <Row justify="space-between">
      <Col span={5}>
        <WarningOutlined style={{ color: '#f19a00', fontSize: '40px' }} />
      </Col>
      <Col span={18}>
        <span>Está seguro que desea eliminar el registro ? </span>
      </Col>
    </Row>
  </Modal>
);

export default ConfirmationAlert;
