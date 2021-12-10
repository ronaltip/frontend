import React, { useEffect, useState } from 'react';
import { DeleteOutlined, FileSearchOutlined } from '@ant-design/icons';
import { Col, message, Row } from 'antd';
import { Tooltip } from '@material-ui/core';
import onSearch from '../../util/onSearch';
import HttpServices from '../../services/HttpServices';
import { TYPE_OF_FILES } from '../../util/constants/enums';

const useUploadCavingLas = typeFile => {
  const [listTotalRegisters, setListTotalRegisters] = useState([]);
  const [listWells, setListWells] = useState([]);
  const [isActiveHomologation, setIsActiveHomologation] = useState(false);
  const [isActiveUpload, setIsActiveUpload] = useState(false);
  const [listCurves, setListCurves] = useState([]);
  const [userStorage, setUserStorage] = useState({});
  const [listRegistersFilter, setListRegistersFilter] = useState([]);
  const [homologationRow, setHomologationRow] = useState({
    resultArray: [],
    wellId: '',
    definitionTime: null,
    definitionDate: null,
    definitionHour: null,
  });

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      width: '5%',
    },
    {
      title: 'Pozo',
      dataIndex: 'nombre_wells',
      key: 'nombre_wells',
      width: '10%',
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
      title: 'Tipo de Cargue',
      dataIndex: 'TipoCargue',
      key: 'TipoCargue',
      width: '10%',
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
    getRecordList();
    getWellList();
    getListCurves();
    setUserStorage(JSON.parse(sessionStorage.getItem('user')));
  }, []);

  const getRecordList = () => {
    HttpServices()
      .get(`archivo_encabezado/tipocargue/${TYPE_OF_FILES[typeFile]}`)
      .then(response => {
        if (response) {
          setListTotalRegisters(response);
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
      .then(responseList =>
        responseList ? setListCurves(responseList) : setListCurves([])
      )
      .catch(error => console.log(error));
  };
  const clickOpenFileUpload = () => {
    setIsActiveUpload(true);
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
        message.success('El registro se ha eliminado correctamente.');
        getRecordList();
        onClickCancel();
      })
      .catch(error => {
        console.log(error);
        onClickCancel();
        message.error('Algo ha salido mal, por favor intente de nuevo.');
      });
  };

  const onClickCancel = () => {
    setHomologationRow({
      resultArray: [],
      wellId: '',
      definitionTime: null,
      definitionDate: null,
      definitionHour: null,
    });
    setIsActiveUpload(false);
    setIsActiveHomologation(false);
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
          if (typeFile === 'CAVING') {
            saveTheApprovealDate(datePayload, homoPayload);
          }
        } else {
          message.error('Algo ha salido mal, por favor intente de nuevo.');
        }
        getRecordList();
        onClickCancel();
      })
      .catch(error => {
        console.log(error);
        onClickCancel();
        getRecordList();
        message.error('Algo ha salido mal, por favor intente de nuevo.');
      });
  };

  const saveTheApprovealDate = (datePayload, homoPayload) => {
    HttpServices()
      .commandPut('archivo_encabezado', {
        ...datePayload,
        id: homoPayload[0].register_id,
      })
      .then(responseDate => {
        // if (responseDate && responseDate[0].id) {
        message.success(
          'La asignación en tiempos se ha actualizado correctamente.'
        );
        // } else {
        //   message.error(
        //     'Algo ha salido mal, por favor intente de nuevo     1.'
        //   );
        // }
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
        getRecordList();
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

    return (
      listColumns &&
      listColumns.map((colValue, key) =>
        HttpServices()
          .get(`archivos_homologacion/${rowData.id}/${colValue}`)
          .then(response => {
            return {
              homologation:
                response.length >= 1 ? response[0].wits_detalle_id : 0,
              idColumn: response.length >= 1 ? response[0].id : key,
              nameColumn: colValue,
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
        setIsActiveHomologation(true);
        return setHomologationRow({
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

  const onFilter = value => {
    const responseSearch = onSearch(value, listTotalRegisters);
    !responseSearch
      ? setListRegistersFilter(listTotalRegisters)
      : setListRegistersFilter(responseSearch);
  };

  return {
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
  };
};

export default useUploadCavingLas;
