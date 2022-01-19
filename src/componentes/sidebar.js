import React, { useEffect } from 'react';
import { slide as Menu } from 'react-burger-menu';
import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import AttachmentIcon from '@material-ui/icons/Attachment';
import BlurLinearIcon from '@material-ui/icons/BlurLinear';
//import FormatListNumberedRtlIcon from '@material-ui/icons/FormatListNumberedRtl';
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
let modules = null;
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

  useEffect(() => {
    modules = JSON.parse(sessionStorage.getItem('modules'));
  }, []);

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

  return (
    <div className="props">
      <Menu>
        <List
          component="nav"
          aria-labelledby="nested-list-subheader"
          className={classes.root}
        >
          <ListItem className={classes.nested}>
            <ListItemText primary="Men&uacute; Principal" />
          </ListItem>
          {modules && (modules.configuration.users.visual ||
            modules.configuration.unitMeasurement.visual ||
            modules.configuration.typesEvents.visual) &&
            <ListItem button onClick={handleClick}>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Configuraci&oacute;n" />
              {open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
          }
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {modules && modules.configuration.users.visual &&
                <ListItem
                  button
                  className={classes.nested}
                  component={Link}
                  to="/usuarios"
                >
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText primary="Usuarios" />
                </ListItem>
              }{modules && modules.configuration.unitMeasurement.visual &&
                <ListItem
                  button
                  className={classes.nested}
                  component={Link}
                  to="/unidades"
                >
                  <ListItemIcon>
                    <FormatUnderlinedIcon />
                  </ListItemIcon>
                  <ListItemText primary="Unidades de medida" />
                </ListItem>
              }{modules && modules.configuration.typesEvents.visual &&
                <ListItem
                  button
                  className={classes.nested}
                  component={Link}
                  to="/tipo_eventos"
                >
                  <ListItemIcon>
                    <ListAltIcon />
                  </ListItemIcon>
                  <ListItemText primary="Tipos de eventos" />
                </ListItem>
              }
            </List>
          </Collapse>
          {modules && (modules.curves.fields.visual ||
            modules.curves.wells.visual ||
            modules.curves.tableWits.visual) &&
            <ListItem button onClick={handleClick2}>
              <ListItemIcon>
                <TimelineIcon />
              </ListItemIcon>
              <ListItemText primary="Curvas" />
              {open2 ? <ExpandLess /> : <ExpandMore />}
            </ListItem>}
          <Collapse in={open2} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {modules && modules.curves.fields.visual &&
                <ListItem
                  button
                  className={classes.nested}
                  component={Link}
                  to="/fields"
                >
                  <ListItemIcon>
                    <ViewListIcon />
                  </ListItemIcon>
                  <ListItemText primary="Campos" />
                </ListItem>
              }
              {modules && modules.curves.wells.visual &&
                <ListItem
                  button
                  className={classes.nested}
                  component={Link}
                  to="/wells"
                >
                  <ListItemIcon>
                    <GradientIcon />
                  </ListItemIcon>
                  <ListItemText primary="Pozos" />
                </ListItem>}
              {/*<ListItem button className={classes.nested} component={Link} to="/tipo_curvas" >  <ListItemIcon> <AccountTreeIcon /> </ListItemIcon> <ListItemText primary="Tipos de Curvas" /> </ListItem>*/}
              {modules && modules.curves.tableWits.visual &&
                <ListItem
                  button
                  className={classes.nested}
                  component={Link}
                  to="/wits"
                >
                  <ListItemIcon>
                    <BlurLinearIcon />
                  </ListItemIcon>
                  <ListItemText primary="Tabla Wits 0" />
                </ListItem>}
            </List>
          </Collapse>
          {modules && (modules.loadData.operations.visual ||
            modules.loadData.events.visual ||
            modules.loadData.cavings.visual ||
            modules.loadData.las.visual ||
            modules.loadData.fels.visual) &&
            <ListItem button onClick={handleClick3}>
              <ListItemIcon>
                <PostAddIcon />
              </ListItemIcon>
              <ListItemText primary="Cargue de Datos" />
              {open3 ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
          }
          <Collapse in={open3} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {modules && modules.loadData.operations.visual &&
                <ListItem
                  button
                  className={classes.nested}
                  component={Link}
                  to="/operaciones"
                >
                  <ListItemIcon>
                    <DateRangeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Operaciones" />
                </ListItem>}
              {modules && modules.loadData.events.visual &&
                <ListItem
                  button
                  className={classes.nested}
                  component={Link}
                  to="/eventos"
                >
                  <ListItemIcon>
                    <EventAvailable />
                  </ListItemIcon>
                  <ListItemText primary="Eventos" />
                </ListItem>}
              {modules && modules.loadData.cavings.visual &&
                <ListItem
                  button
                  className={classes.nested}
                  component={Link}
                  to="/cavings"
                >
                  <ListItemIcon>
                    <EventNote />
                  </ListItemIcon>
                  <ListItemText primary="Cavings" />
                </ListItem>
              }
              {modules && modules.loadData.las.visual &&
                <ListItem
                  button
                  className={classes.nested}
                  component={Link}
                  to="/archivolas"
                >
                  <ListItemIcon>
                    <AttachmentIcon />
                  </ListItemIcon>
                  <ListItemText primary="Archivos .Las" />
                </ListItem>}
              {modules && modules.loadData.fels.visual &&
                <ListItem
                  button
                  className={classes.nested}
                  component={Link}
                  to="/fels"
                >
                  <ListItemIcon>
                    <AllInbox />
                  </ListItemIcon>
                  <ListItemText primary="Fels" />
                </ListItem>
              }
              {/* <ListItem
                button
                className={classes.nested}
                component={Link}
                to="/homologacion_archivos"
              >
                <ListItemIcon>
                  <FormatListNumberedRtlIcon />
                </ListItemIcon>
                <ListItemText primary="Configuraci&oacute;n de Archivos" />
              </ListItem> */}
            </List>
          </Collapse>
          {modules && (modules.visualization.realTime.visual ||
            modules.plotter.events.visual) &&
            <ListItem button onClick={handleClick4}>
              <ListItemIcon>
                <GraphicEqIcon />
              </ListItemIcon>
              <ListItemText primary="Visualizaci&oacute;n" />
              {open4 ? <ExpandLess /> : <ExpandMore />}
            </ListItem>}
          <Collapse in={open4} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {modules && modules.visualization.realTime.visual &&
                <ListItem
                  button
                  className={classes.nested}
                  component={Link}
                  to="/tiemporeal"
                >
                  <ListItemIcon>
                    <SpeedIcon />
                  </ListItemIcon>
                  <ListItemText primary="Tiempo Real" />
                </ListItem>}
              {/* <ListItem button className={classes.nested} component={Link} to="/visual_historicos" > <ListItemIcon> <SettingsSystemDaydreamIcon />  </ListItemIcon> <ListItemText primary="Hist&oacute;ricos" /> </ListItem>                           */}
              {modules && modules.visualization.plotter.visual &&
                <ListItem
                  button
                  className={classes.nested}
                  component={Link}
                  to="/graficador"
                >
                  <ListItemIcon>
                    <SettingsSystemDaydreamIcon />
                  </ListItemIcon>
                  <ListItemText primary="Hist&oacute;ricos" />
                </ListItem>}
            </List>
          </Collapse>
          <ListItem button>
            <ListItemIcon>
              <PowerSettingsNewIcon />
            </ListItemIcon>
            <ListItemText
              primary="Cerrar Sesi&oacute;n"
              onClickCapture={cerrarSesion}
            />
          </ListItem>
        </List>
      </Menu>
    </div>
  );
};
