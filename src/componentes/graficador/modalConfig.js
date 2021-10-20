import React, { useState, useEffect } from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Accordion, Card } from "react-bootstrap";
import BrushIcon from '@material-ui/icons/Brush';

export default function ModalTemplate (props)  {

    const [principal_gp, setPrincipal] = useState([]);
    
    const handleConfigChange = (id) => {
        const updatedCheckedState = principal.map(element => {
            if (element.id === id) 
                element.mostrar = !element.mostrar
            return element
        });
        setPrincipal(updatedCheckedState)
    }

    const handleConfigGrupoChange = (id, e) => {
        const updatedCheckedState = props.dataCurvas.map(element => {
            if (element.id === id) 
                element.grupo = e.target.value
            return element
        });
        //props.setDataTH(updatedCheckedState);
        //console.log(updatedCheckedState);
    }

    function Actualizar() {
        props.toggle(false, true, principal_gp)
    }

    function Cerrar() {
        props.toggle(false, false, null)
    }

    const principal  = props.dataCurvas.filter( c =>  c.grupo === null )
    const horizontal = props.dataCurvas.filter( c =>  c.grupo !== null )
return (
    <>
    <Modal isOpen={props.modalConfig} size="lg" >
        <ModalHeader>
            <BrushIcon fontSize="large" className="btn-circle bg-primary text-white"/> <b>Configuración Template: {props.template.template_nombre}</b>
        </ModalHeader>
        <ModalBody>
            <Accordion defaultActiveKey="0" >
                <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="0" className="alert-primary  small cursor-pointer">
                        GRÁFICA PRINCIPAL
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                        <Card.Body>
                            {
                                principal != null ?
                                principal.map((tipo) => (
                                    <div key={'dgp_'+tipo.id} className="form-check">
                                        <input className="form-check-input" type="checkbox" checked={tipo.mostrar} onChange={() => handleConfigChange(tipo.id)} id={`chkgp_${tipo.id}`} />
                                        <label className="form-check-label" htmlFor={`chkgp_${tipo.id}`}>
                                            {tipo.short_mnemonico + ' - ' + tipo.descripcion}
                                        </label>
                                    </div>
                                ))
                                : null
                            }
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>

                <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="0" className="alert-primary  small cursor-pointer">
                        TRACKS HORIZONTALES
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                        <Card.Body>
                            <table className="table table-sm">
                                <tbody>
                                <tr><td></td><td style={{widt: '50px'}}># de Track</td></tr>
                                {
                                    horizontal.map((tipo) => (
                                        <tr key={'gth_'+tipo.id}>
                                            <td>
                                                <div className="form-check">
                                                    <input className="form-check-input" type="checkbox" checked={tipo.mostrar} onChange={() => handleConfigChange(tipo.id)} id={`chkth_${tipo.id}`} />
                                                    <label className="form-check-label" htmlFor={`chkth_${tipo.id}`}>
                                                        {tipo.short_mnemonico + ' - ' + tipo.descripcion}
                                                    </label>   
                                                </div>
                                            </td>
                                            <td >
                                                <input type="number" className="form-control form-control-sm" min="1" max="10" value={tipo.grupo} id={`grup_${tipo.id}`} onChange={(e) => handleConfigGrupoChange(tipo.id, e)}/>
                                            </td>
                                        </tr>
                                    ))
                                }
                                </tbody>
                            </table>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>

                <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="1" className="alert-primary  small cursor-pointer">
                        CAVINGS
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="1">
                        <Card.Body>
                            CAving 1 , 2 , 3,
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>

                <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="2" className="alert-primary  small cursor-pointer">
                        LAS
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="2">
                        <Card.Body>
                            LAS 1 , 2 , 3,
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>

                <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="3" className="alert-primary  small cursor-pointer">
                        FEL
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="3">
                        <Card.Body>
                            FEL 1 , 2 , 3,
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
        </ModalBody>
        <ModalFooter>
            <button className="btn btn-success"   onClick={() => Actualizar()}>Aplicar</button>
            <button className="btn btn-secondary" onClick={() => Cerrar()}>Cerrar</button>
        </ModalFooter>
    </Modal>
    </>
    )
}