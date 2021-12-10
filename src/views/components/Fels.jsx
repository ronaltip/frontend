import React, { Fragment, useState } from 'react';
import HeaderSection from '../../libs/headerSection/headerSection';
import ModalUpload from '../../libs/modalUpload/modalUpload';
import { Col, Row, Table, Modal, Spin, InputNumber, Space } from 'antd';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import useFels from '../hooks/useFels';
const Fels = () => {
  const { userStorage, columns, states, listResponse, functions } = useFels();

  return (
    <Fragment>
      <Spin tip="Cargardo..." spinning={states.isLoading}>
        <HeaderSection
          onClick={functions.clickOpenFileUpload}
          titleButton="Archivo .Fels"
        />
        <Row justify="space-around">
          <Col span={22}>
            <h3>Listado de Archivo .Fels</h3>
          </Col>
        </Row>
        <Row justify="center" align="center">
          <Col span={22}>
            <Table
              bordered
              tableLayout="fixed"
              dataSource={listResponse.listRegistersFels}
              rowKey="id"
              key="id"
              columns={columns}
            />
          </Col>
        </Row>
      </Spin>
      <ModalUpload
        isActive={states.isActive}
        fileType="FEL"
        isRadiusButton={false}
        listWells={listResponse.listWells}
        onClickCancel={functions.onClickCancel}
        onClickInsert={functions.onClickInsert}
        userStorage={userStorage}
      />
      <Modal
        visible={states.openModal || states.openModalCrop}
        width={states.openModalCrop ? '600px' : '900px'}
        onCancel={functions.onClickCancel}
        footer=""
        centered
        maskClosable={false}
        title={
          !states.openModalCrop && (
            <Row justify="space-around" align="middle">
              <Col span={7}>
                <Space>
                  <span>Inicio recorte</span>
                  <InputNumber
                    value={states.stepFields.startCut}
                    min={0}
                    onChange={e =>
                      functions.setStepFields({
                        ...states.stepFields,
                        startCut: e,
                      })
                    }
                  />
                </Space>
              </Col>
              <Col span={7}>
                <Space>
                  <span>Fin recorte</span>
                  <InputNumber
                    value={states.stepFields.endCut}
                    min={0}
                    onChange={e =>
                      functions.setStepFields({
                        ...states.stepFields,
                        endCut: e,
                      })
                    }
                  />
                </Space>
              </Col>
              <Col span={7}>
                <Space>
                  <span>Paso recorte</span>
                  <InputNumber
                    value={states.stepFields.stepCut}
                    min={0}
                    onChange={e =>
                      functions.setStepFields({
                        ...states.stepFields,
                        stepCut: e,
                      })
                    }
                  />
                </Space>
              </Col>
            </Row>
          )
        }
      >
        <Row
          justify="center"
          style={{
            maxHeight: '400px',
            overflowY: 'scroll',
            overflowX: 'hidden',
            marginTop: '20px',
          }}
          className="scrollTheme"
        >
          {!states.openModalCrop ? (
            <Col style={{ maxHeigth: '400px' }}>
              {states.upImg && states.upImg.length >= 1 && (
                <ReactCrop
                  src={states.upImg}
                  onImageLoaded={functions.onLoad}
                  crop={states.crop}
                  onChange={c => functions.setCrop(c)}
                  onComplete={c =>
                    functions.makeClientCrop(c, states.stepFields)
                  }
                />
              )}
            </Col>
          ) : (
            <Col style={{ maxHeigth: '400px' }}>
              {states.upImg && states.upImg.length >= 1 && (
                <img
                  src={`data:image/png;base64,${states.upImg}`}
                  alt="croppedImage"
                />
              )}
            </Col>
          )}
        </Row>
      </Modal>
    </Fragment>
  );
};
export default Fels;
