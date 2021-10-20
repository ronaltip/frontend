import React from 'react';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
 

const url = "http://localhost:9000/archivolas"; 
 const urlAuxiliar = "http://localhost:9000/tipo_curvas"; 
   
class ComboLabelHomologacionLas extends React.Component {

    state = {
        dataTipoCurva: [], 
        data:[], 
        tipo_curva_nombre :''        
    }  

    seleccionarRegistro = (id, nombre) => { 
        axios.get(url + '?ad=' + id+'&no='+nombre).then(response => {
            this.setState({ data: response.data });
            this.setState({ tipo_curva_nombre: response.data[0].tipo_curva_nombre });                         
        }).catch(error => {
            console.log(error.message);
        })
    }

     
    peticionTipoCurvasGet = () => {
        axios.get(urlAuxiliar).then(response => {
            this.setState({ dataTipoCurva: response.data });
        }).catch(error => {
            console.log(error.message);
        })
    }

    componentDidMount() {
        this.peticionTipoCurvasGet();
        this.seleccionarRegistro(this.props.id, this.props.campo);
    }

    handleChange = async e => {
        e.persist();
        await this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        });

        var valor = [e.target.name] + ':' + e.target.value;        
        this.getRespuesta(valor);
         
    }

    getRespuesta(result) {        
        this.props.callback(result);
    }

    render() { 
        let campo = this.props.campo; 
        let tipo_curva_componente = campo; 
         
        return (
            <div>   
                <label htmlFor='Nombre'  ><b>{campo}</b> asignada al tipo de curva: <b> {this.state.tipo_curva_nombre}</b></label> 
                <br /> 
                <select name={tipo_curva_componente} id={tipo_curva_componente} className="form-control" onChange={this.handleChange} defaultValue={this.state.pk_tipo_curva_id} >
                    <option key="0" value="0">Seleccionar nuevo tipo de curva</option>
                    {this.state.dataTipoCurva.map(elemento => (<option key={elemento.id} value={elemento.id} >{elemento.referencia_nombre} - [{elemento.tag}] {elemento.nombre}</option>))}
                </select>
                <br /> 
            </div>
        )
    }
}
export default ComboLabelHomologacionLas
