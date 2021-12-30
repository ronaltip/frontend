import React from 'react';
import { slide as Menu } from 'react-burger-menu';

import { makeStyles } from '@material-ui/core/styles';
import AttachmentIcon from '@material-ui/icons/Attachment';
import BlurLinearIcon from '@material-ui/icons/BlurLinear';
import FormatListNumberedRtlIcon from '@material-ui/icons/FormatListNumberedRtl';
import Collapse from '@material-ui/core/Collapse';
import DateRangeIcon from '@material-ui/icons/DateRange';
import ExpandLess from '@material-ui/icons/ExpandLess';
import SettingsSystemDaydreamIcon from '@material-ui/icons/SettingsSystemDaydream';
import ExpandMore from '@material-ui/icons/ExpandMore';
import FormatUnderlinedIcon from '@material-ui/icons/FormatUnderlined';
import GradientIcon from '@material-ui/icons/Gradient';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import GraphicEqIcon from '@material-ui/icons/GraphicEq';
import SpeedIcon from '@material-ui/icons/Speed';
import ListItemText from '@material-ui/core/ListItemText';
import ListAltIcon from '@material-ui/icons/ListAlt';
import PostAddIcon from '@material-ui/icons/PostAdd';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import PersonIcon from '@material-ui/icons/Person';
import SettingsIcon from '@material-ui/icons/Settings';
import TimelineIcon from '@material-ui/icons/Timeline';
import ViewListIcon from '@material-ui/icons/ViewList';
import AllInbox from '@material-ui/icons/AllInbox';
import EventAvailable from '@material-ui/icons/EventAvailable';
import EventNote from '@material-ui/icons/EventNote';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#55c21b',
    font_size: '10px',
  },
  nested: {
    paddingLeft: theme.spacing(5),
  },
  a: {
    color: '#fff',
  },
}));

export default props => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [open3, setOpen3] = React.useState(false);
  const [open4, setOpen4] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleClick2 = () => {
    setOpen2(!open2);
  };

  const handleClick3 = () => {
    setOpen3(!open3);
  };

  const handleClick4 = () => {
    setOpen4(!open4);
  };
  const cerrarSesion = () => {
    sessionStorage.removeItem('user');
    window.location.href = './';
  };

  return <h1>hola</h1>;
};
