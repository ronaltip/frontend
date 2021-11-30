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
    definitionTime: null,
    definitionDate: null,
    definitionHour: null,
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
      width: '15%',
    },
    {
      title: 'Acción',
      width: '5%',
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
        // if (response && response[0].id) {
        message.success('El registro se ha eliminado correctamente.');
        // } else {
        //   message.error('Algo ha salido mal, por favor intente de nuevo.');
        // }
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
      definitionTime: null,
      definitionDate: null,
      definitionHour: null,
    });
    setIsActive(false);
    setIsActiveHom(false);
  };

  const onClickSave = (homoPayload, wells_id, datePayload) => {
    HttpServices()
      .commandPut('archivos_homologacion', {
        id: homoPayload[0].register_id,
        wellid: wells_id,
        lista: homoPayload,
      })
      .then(response => {
        if (response && response[0].id) {
          message.success(
            'El archivo de homologacion se ha actualizado correctamente.'
          );

          HttpServices()
            .commandPut('archivo_encabezado', {
              ...datePayload,
              id: homoPayload[0].register_id,
            })
            .then(response => {
              if (response && response[0].id) {
                message.success(
                  'La asignación en tiempos se ha actualizado correctamente.'
                );
              } else {
                message.error(
                  'Algo ha salido mal, por favor intente de nuevo.'
                );
              }
            });
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
        if (response && response[0].id) {
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
    const listColumns = valueColumns.filter(
      value =>
        value !== 'DATE' &&
        value !== 'TIME' &&
        value !== 'FECHA' &&
        value !== 'HORA'
    );
    setIsRowData(rowData);
    return (
      listColumns &&
      listColumns.map((colValue, key) =>
        HttpServices()
          .get(`archivos_homologacion/${rowData.id}/${colValue}`)
          .then(response => {
            return {
              homologation:
                response.length >= 1 ? response[0].wits_detalle_id : key,
              idColumn: response.length >= 1 ? response[0].id : key,
              nameColumn:
                response.length >= 1 ? response[0].nombre_columna : colValue,
              curveTypeName:
                response.length >= 1 ? response[0].tipo_curva_nombre : '',
              curveTypeId:
                response.length >= 1 ? response[0].wits_detalle_id : 0,
              user_id:
                userStorage && userStorage.id_usuario_sesion
                  ? userStorage.id_usuario_sesion
                  : '',
              register_id: rowData.id,
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
          definitionTime:
            rowData && rowData.tiempo_inicial ? rowData.tiempo_inicial : null,
          definitionDate:
            rowData && rowData.fecha_inicial ? rowData.fecha_inicial : null,
          definitionHour:
            rowData && rowData.hora_inicial ? rowData.hora_inicial : null,
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
        definitionTime={infoByColumn.definitionTime}
        definitionDate={infoByColumn.definitionDate}
        definitionHour={infoByColumn.definitionHour}
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
