import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  DeleteOutlined,
  FileSearchOutlined,
  ScissorOutlined,
} from '@ant-design/icons';
import { Tooltip } from '@material-ui/core';
import { Button, Col, message, notification, Row, Space } from 'antd';
import { generateImgCanvanTobase64 } from '../../util/converterToBase64';
import HttpServices from '../../services/HttpServices';
import onSearch from '../../util/onSearch';

const useFels = modules => {
  const imgRef = useRef(null);
  const [userStorage, setUserStorage] = useState({});
  const [listRegistersFels, setListRegistersFels] = useState([]);
  const [listWells, setListWells] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openModalCrop, setOpenModalCrop] = useState(false);
  const [registerRowId, setRegisterRowId] = useState('');
  const [upImg, setUpImg] = useState();
  const [listRegistersFilter, setListRegistersFilter] = useState([]);
  const [isVisible, setIsVisible] = useState({ status: false, data: null });

  const [crop, setCrop] = useState({
    unit: '%',
  });
  const [stepFields, setStepFields] = useState({
    startCut: 0,
    endCut: 0,
    stepCut: 0,
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
      width: '45%',
    },
    {
      title: 'Fecha cargue',
      dataIndex: 'date_upload',
      key: 'date_upload',
      width: '15%',
    },
    {
      title: 'Acción',
      width: '20%',
      render: info_upload => (
        <Row justify="space-around">
          <Col style={{ cursor: 'pointer' }}>
            <Tooltip
              title={modules ? 'Visualizar recorte' : 'No tienes permisos.'}
            >
              <Button
                shape="circle"
                disabled={!modules}
                onClick={() => OpenCrop(info_upload)}
              >
                <ScissorOutlined />
              </Button>
            </Tooltip>
          </Col>
          <Col style={{ cursor: 'pointer' }}>
            <Tooltip
              title={modules ? 'Visualizar archivo' : 'No tienes permisos.'}
            >
              <Button
                shape="circle"
                disabled={!modules}
                onClick={() => OpenAndViewPdf(info_upload)}
              >
                <FileSearchOutlined />
              </Button>
            </Tooltip>
          </Col>
          <Tooltip title={modules ? 'Eliminar cargue' : 'No tienes permisos.'}>
            <Button
              shape="circle"
              disabled={!modules}
              onClick={() =>
                setIsVisible({
                  status: true,
                  data: info_upload,
                })
              }
            >
              <DeleteOutlined />
            </Button>
          </Tooltip>
        </Row>
      ),
    },
  ];

  const getListByFels = () => {
    HttpServices()
      .get('archivo_encabezado_fel')
      .then(response => {
        if (response && Array.isArray(response)) {
          setListRegistersFels(response);
          setListRegistersFilter(response);
        } else {
          setListRegistersFels([]);
        }
      })
      .catch(error => console.log(error));
  };

  const getWellList = () => {
    HttpServices()
      .get('wells')
      .then(response => {
        if (response && Array.isArray(response)) {
          setListWells(response);
        } else {
          setListWells([]);
        }
      });
  };
  const onFilter = value => {
    const responseSearch = onSearch(value, listRegistersFels);
    !responseSearch
      ? setListRegistersFilter(listRegistersFels)
      : setListRegistersFilter(responseSearch);
  };

  const clickOpenFileUpload = () => {
    setIsActive(true);
  };

  const onCancelDelete = () => {
    setIsVisible({ status: false, data: null });
  };

  const commandDeteteRegister = value => {
    onCancelDelete();
    var payload = {
      id: value.id,
    };

    HttpServices()
      .commandDelete('archivo_encabezado_fel', { params: payload })
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
    setStepFields({
      startCut: 0,
      endCut: 0,
      stepCut: 0,
    });
    setOpenModal(false);
    setOpenModalCrop(false);
    setUpImg(null);
    setIsActive(false);
    notification.destroy();
  };

  const onClickInsert = payload => {
    setIsLoading(true);
    HttpServices()
      .command('archivo_encabezado_fel', payload)
      .then(response => {
        setIsLoading(false);
        if (!response.data) {
          message.success('El archivo se ha cargado correctamente.');
        } else {
          message.error('Algo ha salido mal, por favor intente de nuevo.');
        }
        getListByFels();
        onClickCancel();
      })
      .catch(error => {
        setIsLoading(false);
        console.log(error);
        onClickCancel();
        message.error('Algo ha salido mal, por favor intente de nuevo.');
      });
  };

  const OpenCrop = rowData => {
    HttpServices()
      .get(`archivo_imagenes_fel/${rowData.id}`)
      .then(responseCrop => {
        if (responseCrop && responseCrop[0].archivo_imagen_recorte) {
          setUpImg(responseCrop[0].archivo_imagen_recorte);
          setOpenModalCrop(true);
        } else {
          onClickCancel();
          message.warning('No existe un recorte realizado.');
        }
      })
      .catch(() => {
        onClickCancel();
        message.error('Algo ha salido mal,spor favor intente de nuevo.');
      });
  };
  const OpenAndViewPdf = rowData => {
    setCrop({
      unit: '%',
    });
    setRegisterRowId('');
    setIsLoading(true);
    HttpServices()
      .get(`archivo_encabezado_fel/${rowData.id}`)
      .then(detailRegister => {
        setIsLoading(false);
        if (detailRegister && detailRegister[0].archivo_imagen.length >= 1) {
          setUpImg(detailRegister[0].archivo_imagen);
          setOpenModal(true);
          setRegisterRowId(rowData.id);
        } else {
          message.error('No se encuentran referencias de cargue.');
          setOpenModal(false);
          setRegisterRowId('');
        }
      });
  };

  const onLoad = useCallback(img => {
    imgRef.current = img;
  }, []);

  const makeClientCrop = (crop, stepFields) => {
    if (imgRef && crop.width && crop.height) {
      notification.destroy();
      const croppedImageUrl = generateImgCanvanTobase64(imgRef.current, crop);
      croppedImageUrl.length >= 1 &&
        openNotification(croppedImageUrl, stepFields);
    } else {
      notification.destroy();
    }
  };

  const changeCropImg = (base64Img, stepFields) => {
    notification.destroy();

    HttpServices()
      .command('archivo_imagenes_fel', {
        archivoEncabezadoFelId: registerRowId,
        imagenBase64: base64Img,
        inicioRecorte: stepFields.startCut,
        finRecorte: stepFields.endCut,
        pasoRecorte: stepFields.stepCut,
      })
      .then(response => {
        if (!response.data) {
          message.success(
            'La sección seleccionada se ha guardado correctamente.'
          );
        } else {
          message.error('Algo ha salido mal, por favor intente de nuevo.');
        }
        getListByFels();
        onClickCancel();
      })
      .catch(error => {
        onClickCancel();
        message.error('Algo ha salido mal, por favor intente de nuevo.');
      });
    onClickCancel();
  };

  const openNotification = (base64Img, stepFields) => {
    const args = {
      message: 'Ya tienes una sección seleccionada',
      description: 'Deseas guardar el recorte?',
      btn: (
        <Button
          shape="round"
          style={{ backgroundColor: '#55c21b', color: '#fff' }}
          onClick={() => {
            changeCropImg(base64Img, stepFields);
          }}
        >
          Guardar
        </Button>
      ),
      duration: 0,
    };
    notification.open(args);
  };

  return {
    userStorage,
    columns,
    states: {
      isLoading,
      isActive,
      openModal,
      openModalCrop,
      upImg,
      crop,
      stepFields,
      isVisible,
    },
    listResponse: { listRegistersFilter, listWells },
    functions: {
      onFilter,
      clickOpenFileUpload,
      onClickCancel,
      onClickInsert,
      onLoad,
      setCrop,
      makeClientCrop,
      setStepFields,
      onCancelDelete,
      commandDeteteRegister,
    },
  };
};

export default useFels;
