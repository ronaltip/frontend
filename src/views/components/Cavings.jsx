import React, { Fragment, useContext } from 'react';
import ModalUpload from '../../libs/modalUpload/modalUpload';
import ModalHomologation from '../../libs/modalHomologation/modalHomologation';
import { Col, Row, Table, Input } from 'antd';
import useUploadCavingLas from '../hooks/useUploadCavingLas';
import { UserContext } from '../../context/UserContext';
import ButtonUpload from '../../libs/ButtonUpload/ButtonUpload';
const { Search } = Input;

const Cavings = () => {
  const [userState, userDispatch] = useContext(UserContext);
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
  } = useUploadCavingLas('CAVING', userState);

  return (
    <Fragment>
      <ButtonUpload
        onClick={clickOpenFileUpload}
        titleButton="Archivo CAVING"
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
