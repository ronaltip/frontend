import React, { Fragment, useEffect } from 'react';
import HeaderSection from '../../libs/headerSection/headerSection';
import ModalUpload from '../../libs/modalUpload/modalUpload';
import ModalHomologation from '../../libs/modalHomologation/modalHomologation';
import { Col, Input, Row, Table } from 'antd';
import useUploadCavingLas from '../hooks/useUploadCavingLas';
import ConfirmationAlert from '../../libs/ConfirmationAlert/ConfirmationAlert';

const { Search } = Input;
let modules = null;

const ArchivoLas = () => {
  useEffect(() => {
    modules = JSON.parse(sessionStorage.getItem('modules'));
  }, []);

  const {
    userStorage,
    columns,
    isActiveUpload,
    homologationRow,
    isActiveHomologation,
    listCurves,
    listWells,
    listRegistersFilter,
    clickOpenFileUpload,
    onFilter,
    onClickCancel,
    onClickInsert,
    onClickSave,
    commandDeteteRegister,
    isVisible,
    onCancelDelete,
  } = useUploadCavingLas('LAS', modules && modules.loadData.las.edit);

  return (
    <Fragment>
      <ConfirmationAlert
        onClickGo={() => commandDeteteRegister(isVisible.data)}
        isVisible={isVisible.status}
        onCancel={onCancelDelete}
      />
      <HeaderSection
        onClick={clickOpenFileUpload}
        titleButton="Archivo Las"
        title={'Las'}
        content={'Cargue de datos'}
        disabled={modules && modules.loadData.las.edit}
      />
      <Row justify="space-around">
        <Col span={22}>
          <h3>Listado de Archivo .Las</h3>
        </Col>
      </Row>
      <Row gutter={16} justify="space-around">
        <Col span={22}>
          <Search
            placeholder="Buscar"
            onChange={onFilter}
            enterButton={false}
            style={{
              width: '30%',
              marginBottom: '24px',
            }}
          />
        </Col>
      </Row>
      <Row justify="center" align="center">
        <Col span={22}>
          <Table
            tableLayout="fixed"
            pagination={{ pageSize: 10 }}
            dataSource={listRegistersFilter}
            rowKey="id"
            key="id"
            columns={columns}
            bordered
          />
        </Col>
      </Row>
      <ModalUpload
        isActive={isActiveUpload}
        fileType="LAS"
        isRadiusButton={false}
        listWells={listWells}
        onClickCancel={onClickCancel}
        onClickInsert={onClickInsert}
        userStorage={userStorage}
      />
      <ModalHomologation
        infoByColumn={homologationRow.resultArray}
        wellId={homologationRow.wellId}
        isActive={
          isActiveHomologation && homologationRow.resultArray.length >= 1
        }
        onClickCancel={onClickCancel}
        onClickSave={onClickSave}
        fileType="LAS"
        listWells={listWells}
        listCurves={listCurves}
      />
    </Fragment>
  );
};
export default ArchivoLas;
