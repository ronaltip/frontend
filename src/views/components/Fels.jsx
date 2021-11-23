import React, { Fragment } from 'react';
import HeaderSection from '../../libs/headerSection/headerSection';
import ModalUpload from '../../libs/modalUpload/modalUpload';
import { Col, Row, Table, Modal, Spin } from 'antd';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import useFels from '../hooks/useFels';
const Fels = () => {
  const {
    userStorage,
    columns,
    isLoading,
    isActive,
    openModal,
    upImg,
    crop,
    listRegistersFels,
    listWells,
    clickOpenFileUpload,
    onClickCancel,
    onClickInsert,
    cancelCrop,
    onLoad,
    setCrop,
    makeClientCrop,
  } = useFels();
  console.log('ñllll', isLoading, isActive);
  return (
    <Fragment>
      <Spin tip="Cargardo..." spinning={isLoading}>
        <HeaderSection
          onClick={clickOpenFileUpload}
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
              dataSource={listRegistersFels}
              rowKey="id"
              key="id"
              columns={columns}
            />
          </Col>
        </Row>
      </Spin>
      <ModalUpload
        isActive={isActive}
        fileType="FEL"
        isRadiusButton={false}
        listWells={listWells}
        onClickCancel={onClickCancel}
        onClickInsert={onClickInsert}
        userStorage={userStorage}
      />
      <Modal
        visible={openModal}
        width="900px"
        onCancel={cancelCrop}
        footer=""
        centered
      >
        <Row
          justify="center"
          style={{
            maxHeight: '500px',
            overflowY: 'scroll',
            overflowX: 'hidden',
            marginTop: '20px',
          }}
          className="scrollTheme"
        >
          <Col style={{ maxHeigth: '500px' }}>
            {upImg && upImg.length >= 1 && (
              <ReactCrop
                src={upImg}
                onImageLoaded={onLoad}
                crop={crop}
                onChange={c => setCrop(c)}
                onComplete={c => makeClientCrop(c)}
              />
            )}
          </Col>
        </Row>
      </Modal>
    </Fragment>
  );
};
export default Fels;
