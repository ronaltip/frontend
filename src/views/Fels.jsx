import React, { Fragment, useEffect, useState } from 'react';
import HeaderSection from '../libs/headerSection/headerSection';
import HttpServices from '../services/HttpServices';
import ModalUpload from '../libs/modalUpload/modalUpload';
import { Col, message, Row, Table, Tooltip } from 'antd';
import { DeleteOutlined, FileSearchOutlined } from '@ant-design/icons';

const Fels = () => {
  const [listRegistersFels, setListRegistersFels] = useState([]);
  const [listWells, setListWells] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [userStorage, setUserStorage] = useState({});
  const [infoByColumn, setInfoByColumn] = useState({
    resultArray: [],
    wellId: '',
  });

  useEffect(() => {
    getListByFels();
    getWellList();
    setUserStorage(JSON.parse(sessionStorage.getItem('user')));
  }, []);

  const columns = [
    {
      title: 'Pozo',
      dataIndex: 'name_wells',
      key: 'name_wells',
      width: '20%',
    },
    {
      title: 'Nombre Carga Fels',
      dataIndex: 'name_upload',
      key: 'name_upload',
      width: '55%',
    },
    {
      title: 'Fecha cargue',
      dataIndex: 'date_upload',
      key: 'date_upload',
      width: '15%',
    },
    {
      title: '',
      width: '10%',
      render: info_upload => (
        <Row justify="space-around">
          <Col style={{ cursor: 'pointer' }}>
            <Tooltip title="Visualizar archivo PDF">
              <span onClick={() => OpenAndViewPdf(info_upload)}>
                <FileSearchOutlined />
              </span>
            </Tooltip>
          </Col>
          <Col style={{ cursor: 'pointer' }}>
            <Tooltip title="Eliminar cargue">
              <span onClick={() => commandDeteteRegister(info_upload)}>
                <DeleteOutlined />
              </span>
            </Tooltip>
          </Col>
        </Row>
      ),
    },
  ];

  const getListByFels = () => {
    HttpServices()
      .get('archivo_encabezado_fel')
      .then(response => {
        if (response) {
          setListRegistersFels(response);
        }
      });
  };

  const getWellList = () => {
    HttpServices()
      .get('wells')
      .then(response => {
        if (response) {
          setListWells(response);
        }
      });
  };

  const clickOpenFileUpload = () => {
    setIsActive(true);
  };

  const commandDeteteRegister = value => {
    var payload = {
      id: value.id,
      pkuser:
        userStorage && userStorage.id_usuario_sesion
          ? userStorage.id_usuario_sesion
          : '',
    };

    HttpServices()
      .command('archivo_encabezado_fel', { params: payload })
      .then(response => {
        if (!response.data) {
          message.success('El registro se ha eliminado correctamente.');
        } else {
          message.error('Algo ha salido mal, por favor intente de nuevo.');
        }
        getListByFels();
        onClickCancel();
      })
      .catch(error => {
        console.log(error);
        onClickCancel();
        message.error('Algo ha salido mal, por favor intente de nuevo.');
      });
  };
  const onClickCancel = () => {
    setInfoByColumn({
      resultArray: [],
      wellId: '',
    });
    setIsActive(false);
  };

  const onClickInsert = payload => {
    console.log('payload', payload);
    HttpServices()
      .command('archivo_encabezado_fel', payload)
      .then(response => {
        if (!response.data) {
          message.success('El archivo se ha cargado correctamente.');
        } else {
          message.error('Algo ha salido mal, por favor intente de nuevo.');
        }
        getListByFels();
        onClickCancel();
      })
      .catch(error => {
        console.log(error);
        onClickCancel();
        message.error('Algo ha salido mal, por favor intente de nuevo.');
      });
  };

  const OpenAndViewPdf = rowData => {
    console.log('-info?View', rowData);
  };

  return (
    <Fragment>
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
      <ModalUpload
        isActive={isActive}
        fileType="FEL"
        isRadiusButton={false}
        listWells={listWells}
        onClickCancel={onClickCancel}
        onClickInsert={onClickInsert}
        userStorage={userStorage}
      />
    </Fragment>
  );
};
export default Fels;
