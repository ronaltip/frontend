import { DeleteOutlined, FileSearchOutlined } from '@ant-design/icons';
import { Tooltip } from '@material-ui/core';
import { Button, Col, message, notification, Row } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import HttpServices from '../../services/HttpServices';
import { generateImgCanvanTobase64 } from '../../util/converterToBase64';

const useFels = () => {
  const imgRef = useRef(null);
  const [userStorage, setUserStorage] = useState({});
  const [listRegistersFels, setListRegistersFels] = useState([]);
  const [listWells, setListWells] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [registerRowId, setRegisterRowId] = useState('');
  const [upImg, setUpImg] = useState();
  const [crop, setCrop] = useState({
    unit: '%',
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
            <Tooltip title="Visualizar archivo">
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
    setOpenModal(false);
    setIsActive(false);
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

  const makeClientCrop = crop => {
    if (imgRef && crop.width && crop.height) {
      notification.destroy();
      const croppedImageUrl = generateImgCanvanTobase64(imgRef.current, crop);
      croppedImageUrl.length >= 1 && openNotification(croppedImageUrl);
    } else {
      notification.destroy();
    }
  };

  const changeCropImg = base64Img => {
    setOpenModal(false);
    notification.destroy();

    HttpServices()
      .command('archivo_imagenes_fel', {
        archivoEncabezadoFelId: registerRowId,
        imagenBase64: base64Img,
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
  };

  const openNotification = base64Img => {
    const args = {
      message: 'Ya tienes una sección seleccionada',
      description: 'Deseas guardar el recorte?',
      btn: (
        <Button
          shape="round"
          style={{ backgroundColor: '#55c21b', color: '#fff' }}
          onClick={() => {
            changeCropImg(base64Img);
          }}
        >
          Guardar
        </Button>
      ),
      duration: 0,
    };
    notification.open(args);
  };
  const cancelCrop = () => {
    setOpenModal(false);
    notification.destroy();
  };
  return {
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
  };
};

export default useFels;
