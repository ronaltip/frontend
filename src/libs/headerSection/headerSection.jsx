import React from 'react';
import Cabecera from '../../componentes/cabecera';
import SideBar from '../../componentes/sidebar';
import AddBox from '@material-ui/icons/AddBox';
import iconList from '../../util/iconList';
import './_headerSection.css';

const HeaderSection = ({ onClick, titleButton, title, content, disabled }) => {
  return (
    <>
      <Cabecera />
      <SideBar />
      <nav aria-label="breadcrumb" className="small">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">{content}</li>
          <li className="breadcrumb-item active" aria-current="page">
            {title}
          </li>
        </ol>
      </nav>
      {titleButton !== '' && (
        <div className="buttonHeader">
          <button
            style={disabled ? { cursor: 'pointer' } : { cursor: 'no-drop' }}
            className="btn btn-success"
            onClick={onClick}
            disabled={!disabled}
          >
            <AddBox icon={iconList.Add} />
            {titleButton}
          </button>
        </div>
      )}
    </>
  );
};

export default HeaderSection;
