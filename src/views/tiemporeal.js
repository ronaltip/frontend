import React, { useState, useEffect } from 'react';
import { ProgressBar } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/button.css';
import SideBar from '../componentes/sidebar';

const URL = process.env.REACT_APP_API_HOST;

const TiempoReal = () => {
  const [count, setCount] = useState(0);
  const [showgrafica, setShowGrafica] = useState(false);
  const [intervalId, setIntervalId] = useState(0);
  const [intervalo, setIntervalo] = useState(5000);
  const [dataFields, setField] = useState([]);
  const [dataWells, setWell] = useState([]);
  const [dataRegistro, setRegistro] = useState({
    Inicio: '',
    Fin: '',
    Total: '',
  });
  const [form, setState] = useState({
    field_id: 0,
    wells_id: 0,
  });

  function getWells(id) {
    return new Promise((resolve, reject) => {
      axios
        .get(URL + 'wells/field/' + id)
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  function getRegistro(id) {
    if (id != 0) {
      return new Promise((resolve, reject) => {
        axios
          .get(URL + 'datos_wits/registro/wells/' + id)
          .then(response => {
            resolve(response.data);
          })
          .catch(error => {
            reject(error);
          });
      });
    } else return {};
  }

  const handleChangeForm = e => {
    const { name, value } = e.target;

    if (e.target.name === 'field_id') {
      getWells(e.target.value)
        .then(res => {
          setWell(res);
          setRegistro({
            Inicio: null,
            Fin: null,
            Total: null,
          });
        })
        .catch(err => console.log(err.response));
    }
    if (e.target.name === 'wells_id') {
      getRegistro(e.target.value)
        .then(res => {
          const [regs] = res;

          setRegistro({
            Inicio: regs.Inicio,
            Fin: regs.Fin,
            Total: regs.Total,
          });
        })
        .catch(err => console.log(err.response));
    }

    setState(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChange = e => {
    let valor = 1000 * Number(e.target.value);
    setIntervalo(valor);

    if (showgrafica) {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(0);
      }

      const newIntervalId = setInterval(() => {
        setCount(prevCount => prevCount + 1);
      }, valor);
      setIntervalId(newIntervalId);
    }
  };

  const handleClick = () => {
    setShowGrafica(true);
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(0);
      return;
    }

    const newIntervalId = setInterval(() => {
      setCount(prevCount => prevCount + 1);
    }, intervalo);
    setIntervalId(newIntervalId);
  };

  useEffect(() => {
    axios
      .get(URL + 'fields')
      .then(response => {
        setField(response.data);
      })
      .catch(error => {
        console.log(error.message);
      });
  }, []);

  return (
    <div className="App">
      <SideBar pageWrapId={'page-wrap'} outerContainerId={'App'} />
      <div className="container-fluid ">
        <div className="row border-bottom bg-verdeoscuro">
          <div className="col-md-5 col-lg-5 small text-left mt-2"></div>
          <div className="col-md-4 col-lg-4 text-left  mt-1"></div>
          <div className="col-md-3 col-lg-3 text-right  mt-1">
            <small>
              {JSON.parse(sessionStorage.getItem('user')).nombre_usuario_sesion}
            </small>
          </div>
        </div>

        <div className="row">
          <div className="col-md-3">
            <div className="card mt-3" style={{ height: '92vh' }}>
              <div className="card-header bg-verdeclaro">
                Seleccione el Pozo
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label>
                        <b>Campo: </b>
                      </label>
                      <select
                        name="field_id"
                        id="field_id"
                        className="form-control"
                        onChange={handleChangeForm}
                        defaultValue={form ? form.field_id : 0}
                      >
                        <option key="0" value="0">
                          Seleccionar
                        </option>
                        {dataFields
                          ? dataFields.map(elemento => (
                              <option key={elemento.id} value={elemento.id}>
                                {elemento.nombre}
                              </option>
                            ))
                          : null}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label>
                        <b>Pozo: </b>
                      </label>
                      <select
                        name="wells_id"
                        id="wells_id"
                        className="form-control"
                        onChange={handleChangeForm}
                        defaultValue={form ? form.wells_id : 0}
                      >
                        <option key="0" value="0">
                          Seleccionar
                        </option>
                        {dataWells
                          ? dataWells.map(elemento => (
                              <option key={elemento.id} value={elemento.id}>
                                {elemento.nombre}
                              </option>
                            ))
                          : null}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-header bg-verdeclaro">Datos de Conexión</div>
              <div className="card-body">
                <div className="form-group">
                  <label>Primera Fecha</label>
                  <input
                    type="text"
                    className="form-control"
                    readOnly={true}
                    defaultValue={dataRegistro.Inicio}
                  />
                </div>
                <div className="form-group">
                  <label>Última Fecha</label>
                  <input
                    type="text"
                    className="form-control"
                    readOnly={true}
                    defaultValue={dataRegistro.Fin}
                  />
                </div>{' '}
                <div className="form-group">
                  <label>Total registros</label>
                  <input
                    type="text"
                    className="form-control"
                    readOnly={true}
                    defaultValue={dataRegistro.Total}
                  />
                </div>
                <hr />
                <div className="form-group">
                  <label>Intervalo de consulta [Sg]</label>
                  <select className="form-control" onChange={handleChange}>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="30">30</option>
                    <option value="60">60</option>
                  </select>
                </div>
              </div>
              <div className="card-footer">
                <button
                  className="btn btn-primary btn-block"
                  onClick={handleClick}
                >
                  {' '}
                  {intervalId ? 'Detener' : 'Iniciar'}
                </button>
              </div>
            </div>
          </div>
          <div className="col-md-9">
            {showgrafica ? (
              <div className="card mt-3" style={{ height: '92vh' }}>
                <div className="card-header">
                  <ProgressBar animated now={intervalId ? 100 : 0} />
                </div>
                <div className="card-body">{count} veces se ha consultado</div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TiempoReal;
