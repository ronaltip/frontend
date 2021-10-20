import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Login from '../views/login';
import Home from '../views/home';
import viewUsuario from '../views/usuarios';
import viewCavings from '../views/cavings';
import viewArchivoLas from '../views/archivolas';
import viewEventos from '../views/eventos';
//import viewArchivoLase from '../views/archivolase';
import viewGrupoCurvas from '../views/grupo_curvas';
import viewOperaciones from '../views/operaciones';
import viewTiposCurvas from '../views/tipo_curvas';
import viewTiposEventos from '../views/tipo_eventos';
import viewUnidades from '../views/unidades';

import viewVisualConfig from '../views/visual_config';
import viewVisualConfigEdi from '../views/visual_config_edi';
import viewVisualConfigTrack from '../views/visual_config_track';
import viewVisualConfigLista from '../views/visual_config_lista';

import viewVisualHistorico from '../views/visual_historicos';
import viewVisualHistoricoDP from '../views/visual_historicos_dp';
import viewVisualHistoricoDPC from '../views/visual_historicos_dc';

import viewWells from '../views/wells';
import viewFields from '../views/fields';

import viewWitsHomologacion from '../views/wits_homologacion';
import viewHomologacionArchivos from '../views/homologacion_archivos';

import viewGraficador from '../views/graficador';


class Routes extends Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={Login} /> 
                    <Route exact path="/home" component={Home} />
                    <Route exact path="/usuarios" component={viewUsuario} />
                    <Route exact path="/unidades" component={viewUnidades} />
                    <Route exact path="/cavings" component={viewCavings} />
                    <Route exact path="/grupo_curvas" component={viewGrupoCurvas} />
                    <Route exact path="/operaciones" component={viewOperaciones} />
                    <Route exact path="/archivolas" component={viewArchivoLas} />
                    <Route exact path="/homologacion_archivos" component={viewHomologacionArchivos} />                 
                    <Route exact path="/eventos" component={viewEventos} />
                    <Route exact path="/tipo_eventos" component={viewTiposEventos} />
                    <Route exact path="/tipo_curvas" component={viewTiposCurvas} />

                    <Route path='/visual_config_edi:id' component={viewVisualConfigEdi} />
                    <Route exact path="/visual_config_lista" component={viewVisualConfigLista} />
                    <Route exact path="/visual_config_track" component={viewVisualConfigTrack} />
                    <Route exact path="/visual_config" component={viewVisualConfig} />                       

                    <Route exact path="/visual_historicos" component={viewVisualHistorico} />  
                    <Route exact path="/visual_historicos_dp:id" component={viewVisualHistoricoDP} />  
                    <Route exact path="/visual_historicos_dc/:id" component={viewVisualHistoricoDPC} />  
                    
                    <Route exact path="/fields" component={viewFields} />
                    <Route exact path="/wells" component={viewWells} />
                    <Route exact path="/wits_homologacion" component={viewWitsHomologacion} />     

                    <Route exact path="/graficador" component={viewGraficador} />     

                </Switch>
            </BrowserRouter>
        );
    }
}
export default Routes;