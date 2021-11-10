import React, { Fragment } from 'react';
import {
  Button,
  Col,
  DatePicker,
  InputNumber,
  Modal,
  Row,
  Space,
  TimePicker,
  Select,
} from 'antd';
import { CloseCircleOutlined, SaveOutlined } from '@ant-design/icons';
import './_modalHomologation.css';

const { Option } = Select;

const ModalHomologation = ({
  infoByColumn,
  wellId,
  isActive,
  onClickCancel,
  onClickSave,
  fileType,
  listWells,
  listCurves,
  selectDate,
}) => {
  const onChangeSelectHomologation = (value, infoCol) => {
    infoCol.homologation = value;
  };

  return (
    <Fragment>
      <Modal
        destroyOnClose={true}
        centered
        visible={isActive}
        title={
          <label htmlFor="nombre">{`Editar Archivo de ${fileType}`}</label>
        }
        onCancel={onClickCancel}
        footer={
          <Row justify="end">
            <Col>
              <Space>
                <Button
                  className="button-insert"
                  onClick={() => onClickSave(infoByColumn)}
                  icon={<SaveOutlined />}
                  disabled={wellId === ''}
                >
                  Actualizar
                </Button>
                <Button
                  className="button-cancel"
                  onClick={onClickCancel}
                  icon={<CloseCircleOutlined />}
                >
                  Cancelar
                </Button>
              </Space>
            </Col>
          </Row>
        }
      >
        <div className="modalHomologation">
          {selectDate && (
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Space>
                  <div>
                    <span>Time</span>
                    <InputNumber />
                  </div>
                  <div>
                    <span>Fecha</span>
                    <DatePicker placeholder="Selecciona una fecha" />
                  </div>
                  <div>
                    <span>Hora</span>
                    <TimePicker placeholder="Selecciona una hora" />
                  </div>
                </Space>
              </Col>
            </Row>
          )}
          <Row gutter={[16, 16]} style={{ marginTop: '10px' }}>
            <Col span={24}>
              <label htmlFor="title-wells">Wells</label>
              <Select style={{ width: '100%' }} defaultValue={wellId}>
                <Option onChange={e => (wellId = e)} value="">
                  Seleccionar
                </Option>
                {listWells &&
                  listWells.map((well, idKey) => (
                    <Option
                      key={idKey}
                      value={well.id}
                    >{`${well.tag} - ${well.nombre}`}</Option>
                  ))}
              </Select>
            </Col>
          </Row>
          <Row gutter={[16, 16]} style={{ marginTop: '10px' }}>
            {infoByColumn &&
              infoByColumn.length >= 1 &&
              infoByColumn.map(
                (valueCol, idKey) =>
                  valueCol.nameColumn && (
                    <Col span={24} key={idKey}>
                      <span>
                        <strong>{valueCol.nameColumn}</strong> asignada al tipo
                        de curva: <strong>{valueCol.curveTypeName}</strong>
                      </span>
                      <Select
                        style={{ width: '100%' }}
                        onChange={e => onChangeSelectHomologation(e, valueCol)}
                        defaultValue={valueCol.curveTypeId}
                      >
                        <Option value="">Seleccionar</Option>
                        {listCurves &&
                          listCurves.map((curve, idKey) => (
                            <Option
                              key={idKey}
                              value={curve.id}
                            >{`${curve.tag} - ${curve.nombre}`}</Option>
                          ))}
                      </Select>
                    </Col>
                  )
              )}
          </Row>
        </div>
      </Modal>
    </Fragment>
  );
};

export default ModalHomologation;
