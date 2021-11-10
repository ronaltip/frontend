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
  definitionTime,
  definitionDate,
  definitionHour,
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
                  onClick={() =>
                    onClickSave(infoByColumn, {
                      // wells_id: wellId,
                      tiempo_inicial: definitionTime,
                      fecha_inicial: definitionDate,
                      hora_inicial: definitionHour,
                    })
                  }
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
                  <Row>
                    <Col span={24}>
                      <span>Time</span>
                    </Col>
                    <Col>
                      <InputNumber
                        defaultValue={
                          definitionTime
                            ? parseInt(definitionTime).toFixed()
                            : null
                        }
                        onChange={e => (definitionTime = e)}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                      <span>Fecha</span>
                    </Col>
                    <Col>
                      <DatePicker
                        defaultValue={definitionDate}
                        onChange={e =>
                          (definitionDate = e.format('DD/MM/YYYY'))
                        }
                        placeholder="Selecciona una fecha"
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                      <span>Hora</span>
                    </Col>
                    <Col>
                      <TimePicker
                        defaultValue={definitionHour}
                        onChange={(time, timeString) =>
                          (definitionHour = time.hour())
                        }
                        placeholder="Selecciona una hora"
                        showNow={false}
                        showSecond={false}
                        showMinute={false}
                        format={'HH'}
                        minuteStep={60}
                        secondStep={60}
                      />
                    </Col>
                  </Row>
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
