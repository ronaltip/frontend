import React from 'react';
import './_buttonUpload.css';
import { Button } from 'antd';
import { FileAddOutlined } from '@ant-design/icons';

const ButtonUpload = ({ onClick, titleButton }) => {
  return (
    <div className="buttonHeader">
      <Button className="btn-success" type="primary" onClick={onClick}>
        <FileAddOutlined />
        {titleButton}
      </Button>
    </div>
  );
};

export default ButtonUpload;
