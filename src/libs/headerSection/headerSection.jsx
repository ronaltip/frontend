import React from 'react';
import Cabecera from '../../componentes/cabecera';
import SideBar from '../../componentes/sidebar';
import AddBox from '@material-ui/icons/AddBox';
import iconList from '../../util/iconList';
import './_headerSection.css';

const HeaderSection = ({ onClick, titleButton }) => {
  return (
    <div>
      <Cabecera />
      <SideBar pageWrapId={'page-wrap'} outerContainerId={'App'} />
      <div className="buttonHeader">
        <button className="btn btn-success" onClick={onClick}>
          <AddBox icon={iconList.Add} />
          {titleButton}
        </button>
      </div>
    </div>
  );
};

export default HeaderSection;
