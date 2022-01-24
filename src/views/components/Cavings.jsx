import React, { Fragment, useEffect } from 'react';
import HeaderSection from '../../libs/headerSection/headerSection';
import ModalHomologation from '../../libs/modalHomologation/modalHomologation';
import { Col, Row, Table, Input } from 'antd';
import useUploadCavingLas from '../hooks/useUploadCavingLas';
import ModalUpload from '../../libs/modalUpload/modalUpload';
import ConfirmationAlert from '../../libs/ConfirmationAlert/ConfirmationAlert';

const { Search } = Input;
let modules = null;

const Cavings = () => {
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
  } = useUploadCavingLas('CAVING', modules && modules.loadData.cavings.edit);

  return (
    <Fragment>
      <ConfirmationAlert
        onClickGo={() => commandDeteteRegister(isVisible.data)}
        isVisible={isVisible.status}
        onCancel={onCancelDelete}
      />
      <HeaderSection
        onClick={clickOpenFileUpload}
        titleButton="Archivo CAVING"
        title={'Caving'}
        content={'Cargue de datos'}
        disabled={modules && modules.loadData.cavings.edit}
      />
      <Row justify="space-around">
        <Col span={22}>
          <h3>Listado de Archivo CAVING</h3>
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
        fileType="CAVING"
        isRadiusButton={false}
        listWells={listWells}
        onClickCancel={onClickCancel}
        onClickInsert={onClickInsert}
        userStorage={userStorage}
      />
      <ModalHomologation
        infoByColumn={homologationRow.resultArray}
        wellId={homologationRow.wellId}
        definitionTime={homologationRow.definitionTime}
        definitionDate={homologationRow.definitionDate}
        definitionHour={homologationRow.definitionHour}
        isActive={
          isActiveHomologation && homologationRow.resultArray.length >= 1
        }
        onClickCancel={onClickCancel}
        onClickSave={onClickSave}
        fileType="CAVING"
        listWells={listWells}
        listCurves={listCurves}
        selectDate={true}
      />
    </Fragment>
  );
};
export default Cavings;
