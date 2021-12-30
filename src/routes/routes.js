import React from 'react';
import Cavings from '../views/components/Cavings'
import Fels from '../views/components/Fels'
import ArchivoLas from '../views/components/ArchivoLas'
import Usuarios from '../views/usuarios'
import Unidades from '../views/unidades'
import TipoEventos from '../views/tipo_eventos'
import Fields from '../views/fields'
import Wells from '../views/wells';
import Wits from '../views/wits';
import Operaciones from '../views/operaciones';
import Eventos from '../views/eventos';
import Graficador from '../views/graficador';
import TiempoReal from '../views/tiemporeal';
import viewVisualConfig from '../views/visual_config';

class RoutesModules {
  routes;
  constructor(modules) {
    return (this.routes = [
      {
        path: '/configuracion',
        name: 'configuration',

        text: 'Configuración',
        icon: null,
        main: () => { },
        active: true,
        // active: modules
        //   ? modules.configuration.users.edit ||
        //     modules.configuration.users.read ||
        //     modules.configuration.unitMeasurement.edit ||
        //     modules.configuration.unitMeasurement.read ||
        //     modules.configuration.typesEvents.edit ||
        //     modules.configuration.typesEvents.read
        //   : false,
        children: [
          {
            path: '/usuarios',
            name: 'users',
            icon: null,
            main: () => <Usuarios />,
            text: 'Usuarios',
            // active: modules
            //   ? modules.configuration.users.edit ||
            //     modules.configuration.users.read
            //   : false,
            hidden: false,
            active: true,
          },
          {
            path: '/unidades',
            name: 'units',
            icon: null,
            main: () => <Unidades />,
            text: 'Unidades',
            // active: modules
            //   ? modules.configuration.unitMeasurement.edit ||
            //     modules.configuration.unitMeasurement.read
            //   : false,
            hidden: false,
            active: true,
          },
          {
            path: '/tipo_eventos',
            name: 'eventsType',
            icon: null,
            main: () => <TipoEventos />,
            text: 'Tipos de eventos',
            // active: modules
            //   ? modules.configuration.typesEvents.edit ||
            //     modules.configuration.typesEvents.read
            //   : false,
            hidden: false,
            active: true,
          },
        ]
      },
      {
        path: '/curvas',
        name: 'curves',

        text: 'Curvas',
        icon: null,
        main: () => { },
        active: true,
        // active: modules
        //   ? modules.curves.felds.edit ||
        //     modules.curves.felds.read ||
        //     modules.curves.wills.edit ||
        //     modules.curves.wills.read ||
        //     modules.curves.tableWits.edit ||
        //     modules.curves.tableWits.read
        //   : false,
        children: [
          {
            path: '/fields',
            name: 'fields',
            icon: null,
            main: () => <Fields />,
            text: 'Campos',
            // active: modules
            //   ? modules.curves.felds.edit || modules.curves.felds.read
            //   : false,
            hidden: false,
            active: true,
          },
          {
            path: '/pozos',
            name: 'wells',
            icon: null,
            main: () => <Wells />,
            text: 'Pozos',
            // active: modules
            //   ? modules.curves.wills.edit || modules.curves.wills.read
            //   : false,
            hidden: false,
            active: true,
          },
          {
            path: '/wits',
            name: 'wits',
            icon: null,
            main: () => <Wits />,
            text: 'Tabla Wits 0',
            // active: modules
            //   ? modules.curves.tableWits.edit || modules.curves.tableWits.read
            //   : false,
            hidden: false,
            active: true,
          },
        ]
      },
      {
        path: '/cargue_datos',
        name: 'loadData',

        text: 'Cargue de datos',
        icon: null,
        main: () => { },
        active: true,
        // active: modules
        //   ? modules.loadData.operations.edit ||
        //     modules.loadData.operations.read ||
        //     modules.loadData.events.edit ||
        //     modules.loadData.events.read ||
        //     modules.loadData.cavings.edit ||
        //     modules.loadData.cavings.edit ||
        //     modules.loadData.las.edit ||
        //     modules.loadData.las.edit ||
        //     modules.loadData.fels.edit ||
        //     modules.loadData.fels.read ||
        //     modules.loadData.fileSettings.edit ||
        //     modules.loadData.fileSettings.read
        //   : false,
        children: [
          {
            path: '/operaciones',
            name: 'operations',
            icon: null,
            main: () => <Operaciones />,
            text: 'Operaciones',
            // active: modules
            //   ? modules.loadData.operations.edit ||
            //     modules.loadData.operations.read
            //   : false,
            hidden: false,
            active: true,
          },
          {
            path: '/eventos',
            name: 'events',
            icon: null,
            main: () => <Eventos />,
            text: 'Eventos',
            // active: modules
            //   ? modules.loadData.events.edit || modules.loadData.events.read
            //   : false,
            hidden: false,
            active: true,
          },
          {
            path: '/cavings',
            name: 'cavings',
            icon: null,
            main: () => <Cavings />,
            text: 'Cavings',
            // active: modules
            //   ? modules.loadData.cavings.edit || modules.loadData.cavings.read
            //   : false,
            hidden: false,
            active: true,
          },
          {
            path: '/archivolas',
            name: 'archivolas',
            icon: null,
            main: () => <ArchivoLas />,
            text: 'Archivo Las',
            // active: modules
            //   ? modules.loadData.las.edit || modules.loadData.las.read
            //   : false,
            hidden: false,
            active: true,
          },
          {
            path: '/archivofels',
            name: 'fels',
            icon: null,
            main: () => <Fels />,
            text: 'Archivo Fels',
            // active: modules
            //   ? modules.loadData.fels.edit || modules.loadData.fels.read
            //   : false,
            hidden: false,
            active: true,
          },
          {
            path: '/configuracion_archivos',
            name: 'configurationsFile',
            icon: null,
            main: () => <viewVisualConfig />,
            text: 'Configuración de archivos',
            // active: modules
            //   ? modules.fileSettings.las.edit || modules.fileSettings.las.read
            //   : false,
            hidden: false,
            active: true,
          },
        ]
      },
      {
        path: '/visualizacion',
        name: 'visualization',

        text: 'Visualización',
        icon: null,
        main: () => { },
        active: true,
        // active: modules
        //   ? modules.visualization.realTime.edit ||
        //     modules.visualization.realTime.read ||
        //     modules.visualization.plotter.edit ||
        //     modules.visualization.plotter.read
        //   : false,
        children: [
          {
            path: '/tiemporeal',
            name: 'realTime',
            icon: null,
            main: () => <TiempoReal />,
            text: 'Tiempo real',
            // active: modules
            //   ? modules.visualization.realTime.edit ||
            //     modules.visualization.realTime.read
            //   : false,
            hidden: false,
            active: true,
          },
          {
            path: '/graficador',
            name: 'plotter',
            icon: null,
            main: () => <Graficador />,
            text: 'Graficador',
            // active: modules
            //   ? modules.visualization.plotter.edit ||
            //     modules.visualization.plotter.read
            //   : false,
            hidden: false,
            active: true,
          },

        ]
      },
    ]);
  }
}

export default RoutesModules;
