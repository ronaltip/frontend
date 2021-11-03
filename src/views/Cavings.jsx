import React, { Fragment, useEffect, useState } from 'react';
import HeaderSection from '../libs/headerSection/headerSection';
import HttpServices from '../services/HttpServices';
import ModalUpload from '../libs/modalUpload/modalUpload';
import ModalHomologation from '../libs/modalHomologation/modalHomologation';
import { Col, message, Row, Tooltip, Table, Input } from 'antd';
import { DeleteOutlined, FileSearchOutlined } from '@ant-design/icons';
const { Search } = Input;

const Cavings = () => {
  const [listRegistersCAVING, setListRegistersCAVING] = useState([]);
  const [listRegistersFilter, setListRegistersFilter] = useState([]);
  const [listWells, setListWells] = useState([]);
  const [isActiveHom, setIsActiveHom] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [listCurves, setListCurves] = useState([]);
  const [userStorage, setUserStorage] = useState({});
  const [isRowData, setIsRowData] = useState({});
  const [infoByColumn, setInfoByColumn] = useState({
    resultArray: [],
    wellId: '',
  });
  const columns = [
    {
      title: 'Pozo',
      dataIndex: 'nombre_wells',
      key: 'nombre_wells',
      width: '20%',
    },
    {
      title: 'Encabezados',
      dataIndex: 'columnas',
      key: 'columnas',
      width: '60%',
    },
    {
      title: 'Fecha de Cargue',
      dataIndex: 'fecha_creacion',
      key: 'fecha_creacion',
      width: '10%',
    },
    {
      title: '',
      width: '10%',
      render: info_upload => (
        <Row justify="space-around">
          <Col style={{ cursor: 'pointer' }}>
            <Tooltip title="Editar homologación">
              <span onClick={() => goToHomogolationUpdate(info_upload)}>
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

  useEffect(() => {
    getListByCAVING();
    getWellList();
    getListCurves();
    setUserStorage(JSON.parse(sessionStorage.getItem('user')));
  }, []);

  const getListByCAVING = () => {
    HttpServices()
    .get('archivo_encabezado/tipocargue/2')
      .then(response => {
        if (response) {
          setListRegistersCAVING(response);
          setListRegistersFilter(response);
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
  const getListCurves = () => {
    HttpServices()
      .get('tipo_curvas')
      .then(responseList => setListCurves(responseList))
      .catch(error => console.log(error));
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
      .commandDelete('archivo_encabezado', { params: payload })
      .then(response => {
        if (!response.data) {
          message.success('El registro se ha eliminado correctamente.');
        } else {
          message.error('Algo ha salido mal, por favor intente de nuevo.');
        }
        getListByCAVING();
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
    setIsActiveHom(false);
  };

  const onClickSave = value => {
    HttpServices()
      .commandPut('archivos_homologacion', value)
      .then(response => {
        if (!response.data) {
          message.success('El archivo se ha actualizado correctamente.');
        } else {
          message.error('Algo ha salido mal, por favor intente de nuevo.');
        }
        getListByCAVING();
        onClickCancel();
      })
      .catch(error => {
        console.log(error);
        onClickCancel();
        message.error('Algo ha salido mal, por favor intente de nuevo.');
      });
  };

  const onClickInsert = payload => {
    HttpServices()
      .command('archivo_encabezado', payload)
      .then(response => {
        if (!response.data) {
          message.success('El archivo se ha cargado correctamente.');
        } else {
          message.error('Algo ha salido mal, por favor intente de nuevo.');
        }
        getListByCAVING();
        onClickCancel();
      })
      .catch(error => {
        console.log(error);
        onClickCancel();
        message.error('Algo ha salido mal, por favor intente de nuevo.');
      });
  };

  const getInfomationByColumn = (valueColumns, rowData) => {
    setIsRowData(rowData);
    return (
      valueColumns &&
      valueColumns.map((colValue, key) =>
        HttpServices()
          .get(`archivos_homologacion/${rowData.id}/${colValue}`)
          .then(response => {
            return {
              idColumn: response.length >= 1 ? response[0].id : key,
              nameColumn: colValue,
              curveTypeName:
                response.length >= 1 ? response[0].tipo_curva_nombre : '',
              curveTypeId: response.length >= 1 ? response[0].wits_detalle_id : 0,
              user_id: userStorage.id_usuario_sesion,
              register_id: isRowData.id,
            };
          })
          .catch(error => {
            console.log(error);
          })
      )
    );
  };

  const goToHomogolationUpdate = rowData => {
    const dataColumns = rowData.columnas;
    const arrayColumns = dataColumns.split(',');
    const objectHomogolationResponse = getInfomationByColumn(
      arrayColumns,
      rowData
    );
    Promise.all(objectHomogolationResponse)
      .then(resultArray => {
        setIsActiveHom(true);
        return setInfoByColumn({
          resultArray: resultArray,
          wellId: rowData.wells_id,
        });
      })
      .catch(e => console.log(`Error capturado:  ${e}`));
  };

  const onSearch = valueFilter => {
    const value = valueFilter.target.value;
    if (value !== '') {
      const valueSearch = value
        .normalize('NFD')
        .replace(/([aeio])\u0301|(u)[\u0301\u0308]/gi, '$1$2')
        .normalize()
        .toUpperCase();
      const valuesFiltered = listRegistersCAVING.filter(
        search =>
          search.nombre_wells
            .normalize('NFD')
            .replace(/([aeio])\u0301|(u)[\u0301\u0308]/gi, '$1$2')
            .normalize()
            .toUpperCase()
            .includes(valueSearch) ||
          search.columnas
            .normalize('NFD')
            .replace(/([aeio])\u0301|(u)[\u0301\u0308]/gi, '$1$2')
            .normalize()
            .toUpperCase()
            .includes(valueSearch)
      );
      setListRegistersFilter(valuesFiltered);
    } else {
      setListRegistersFilter(listRegistersCAVING);
    }
  };

  return (
    <Fragment>
      <HeaderSection
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
            onChange={onSearch}
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
        isActive={isActive}
        fileType="CAVING"
        isRadiusButton={false}
        listWells={listWells}
        onClickCancel={onClickCancel}
        onClickInsert={onClickInsert}
        userStorage={userStorage}
      />
      <ModalHomologation
        infoByColumn={infoByColumn.resultArray}
        wellId={infoByColumn.wellId}
        isActive={isActiveHom && infoByColumn.resultArray.length >= 1}
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
