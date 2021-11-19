import React, { useRef, useState } from 'react';
import {
  UploadOutlined,
  CloseCircleOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { Button, Col, Row, Select, Modal, Space, Upload } from 'antd';
import { EXTENSIONS_LIST, TYPE_OF_FILES } from '../../util/constants/enums';
import { CSVReader } from 'react-papaparse';
import { pdfToBase64 } from './../../util/converterToBase64';
import './modalUpload.css';

const { Option } = Select;
// const PDFJS = require('pdfjs-dist/build/pdf');

// const images = [];
const ModalUpload = ({
  isActive,
  fileType,
  listWells,
  onClickInsert,
  onClickCancel,
  userStorage,
}) => {
  const buttonRefUpload = useRef();
  const [payload, setPayload] = useState(null);
  const [wellId, setWellId] = useState('');

  const handleOnFileLoad = (value, file) => {
    let totalColumns = null;
    const totalDetails = [];
    const totalHeaders = [];
    const detail = [];
    let headers = '';
    let columns = '';
    let columnsData;
    let isDateColumn = false;

    const valueUpload = value;
    if (fileType === 'LAS') {
      const valuesUp = value;
      const detailCurves = value.map(({ data }) =>
        data.indexOf('#Curves Array')
      );
      const valueIndexOfArray = detailCurves.indexOf(0);
      const detailAscii = value.map(({ data }) =>
        data.indexOf('~Ascii Data Section')
      );
      const detailDateValue = value.map(({ data }) =>
        data.indexOf('DATE.                                       : Index')
      );
      const valueIndexOfAscii = detailAscii.indexOf(0);
      columnsData = valueUpload[valueIndexOfArray + 1].data[0];
      totalHeaders.push(valuesUp.splice(0, valueIndexOfArray));
      columnsData = columnsData.replaceAll('#DATE.', 'DATE.');
      columnsData = columnsData.replace('TIME', 'TIME.');
      if (detailDateValue.indexOf(0) !== -1) {
        isDateColumn = true;
      } else {
        isDateColumn = false;
      }
      totalColumns = columnsData.split('.');
      totalColumns.pop();
      totalDetails.push(valueUpload.slice(valueIndexOfAscii + 2));
      for (let index = 0; index < totalHeaders[0].length; index++) {
        headers = headers + totalHeaders[0][index].data + ',';
      }
      detail.push(totalDetails[0].map(({ data }) => data));
    } else {
      isDateColumn = true;
      totalColumns = value[0].data;
      const removeCharactersCol = totalColumns[totalColumns.length - 1].slice(
        0,
        -1
      );
      totalColumns[totalColumns.length - 1] = removeCharactersCol;
      totalDetails.push(valueUpload.slice(1));
      detail.push(totalDetails[0].map(({ data }) => [data.join(' ')]));
      detail[0].pop();
    }

    for (let index = 0; index < totalColumns.length; index++) {
      columns = columns + totalColumns[index].trim() + ',';
    }

    const infoUploadFile = {
      wells_id: wellId,
      encabezado: headers,
      columnas: columns.slice(0, -1),
      usuario_id_creacion: userStorage.id_usuario_sesion,
      tipo_archivo_id: TYPE_OF_FILES[fileType],
      detalle: detail[0],
      nombre_archivo: file.name.split('.')[0],
      extension_archivo: file.name.split('.')[1],
      isTime: isDateColumn,
    };
    setPayload(infoUploadFile);
  };

  const handleOpenDialog = e => {
    if (buttonRefUpload.current) {
      buttonRefUpload.current.open(e);
    }
  };
  const wellOnSelect = value => {
    setWellId(value);
    setPayload({ ...payload, wells_id: value });
  };

  const props = {
    multiple: false,
    showUploadList: false,
    accept: EXTENSIONS_LIST[fileType].toString(),
    async onChange(info) {
      pdfToBase64(info.file).then(response => {
        const infoUploadFile = {
          wells_id: wellId,
          base64upload: response,
          usuario_id_creacion: userStorage.id_usuario_sesion,
          tipo_archivo_id: TYPE_OF_FILES[fileType],
          nombre_archivo: info.file.name.split('.')[0],
          extension_archivo: info.file.name.split('.')[1],
        };
        setPayload(infoUploadFile);
      });
    },
  };

  const onCancel = () => {
    onClickCancel();
    setWellId(' ');
    setPayload(null);
  };

  return (
    <Modal
      destroyOnClose={true}
      centered
      visible={isActive}
      title={<label htmlFor="nombre">{`Nuevo Archivo ${fileType}`}</label>}
      onCancel={onCancel}
      footer={
        <Row justify="end">
          <Col>
            <Space>
              <Button
                disabled={
                  payload
                    ? payload.extension_archivo && wellId !== ''
                      ? EXTENSIONS_LIST[fileType].filter(
                          ext => ext === `.${payload.extension_archivo}`
                        ).length >= 1
                        ? false
                        : true
                      : true
                    : true
                }
                className="button-insert"
                onClick={() => {
                  onClickInsert(payload);
                  onCancel();
                }}
                icon={<SaveOutlined />}
              >
                Insertar
              </Button>
              <Button
                className="button-cancel"
                onClick={onCancel}
                icon={<CloseCircleOutlined />}
              >
                Cancelar
              </Button>
            </Space>
          </Col>
        </Row>
      }
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <label htmlFor="title-wells">Wells</label>
        </Col>
        <Col span={24}>
          <Select onChange={wellOnSelect} style={{ width: '100%' }}>
            <Option value="" onChange={wellOnSelect} disabled>
              Seleccionar
            </Option>
            {listWells &&
              listWells.map((well, idKey) => (
                <Option
                  key={idKey}
                  value={well.id}
                >{`${well.tag} - ${well.nombre}`}</Option>
              ))}
          </Select>
        </Col>
        <Col span={24}>
          {fileType === 'LAS' || fileType === 'CAVING' ? (
            <CSVReader
              ref={buttonRefUpload}
              onFileLoad={handleOnFileLoad}
              noDrag
              accept={EXTENSIONS_LIST[fileType].toString()}
            >
              {({ file }) => {
                return (
                  <Space style={{ marginBottom: '14px' }}>
                    <Button
                      onClick={e => {
                        handleOpenDialog(e);
                      }}
                      icon={<UploadOutlined />}
                    >
                      Adjuntar archivo
                    </Button>
                    <span>{file && file.name}</span>
                  </Space>
                );
              }}
            </CSVReader>
          ) : (
            <Upload {...props}>
              <Space style={{ marginBottom: '14px' }}>
                <Button icon={<UploadOutlined />}>Adjuntar archivo</Button>
                {payload && payload.nombre_archivo && (
                  <span>
                    {payload.nombre_archivo + '.' + payload.extension_archivo}
                  </span>
                )}
              </Space>
            </Upload>
          )}
        </Col>
      </Row>
    </Modal>
  );
};

export default ModalUpload;
