import React from 'react';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
 
const URL = process.env.REACT_APP_API_HOST; 

//const url  = "http://localhost:9000/homologacion_archivos"; 
//const urlAuxiliar = "http://localhost:9000/tipo_curvas"; 
   
class ComboLabelHomologacionArchivos extends React.Component {

    state = {
        dataTipoCurva: [], 
        data:[],  
        tipo_curva_nombre: '', 
    }  

    seleccionarRegistro=(id) => {
        axios.get(URL + 'homologacion_archivos' , { params: {id: id }} ).then(response => {
            this.setState({ data: response.data });
            this.setState({ tipo_curva_nombre: response.data[0].tipo_curva_nombre });            
        }).catch(error => {
            console.log(error.message);
        })
    }

     
    peticionTipoCurvasGet = () => {
        axios.get(URL + 'tipo_curvas').then(response => {
            this.setState({ dataTipoCurva: response.data });
        }).catch(error => {
            console.log(error.message);
        })
    }

    componentDidMount() {
        this.peticionTipoCurvasGet();
        this.seleccionarRegistro(this.props.id);
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
        let id = this.props.id;
        let campo = this.props.campo; 
        let tipo_curva_componente = "tipocurvaid_" + id; 
        
        return (
            <div>   
                <label htmlFor='Nombre'><b>{campo.toUpperCase()}</b> asignada al tipo de curva: <b>{this.state.tipo_curva_nombre}</b></label> 
                <br /> 
                <select name={tipo_curva_componente} id={tipo_curva_componente} className="form-control" onChange={this.handleChange} defaultValue={this.state.pk_tipo_curva_id}   >
                    <option key="0" value="0">Seleccionar</option>
                    {this.state.dataTipoCurva.map(elemento => (<option key={elemento.id} value={elemento.id} >[{elemento.tag}] {elemento.nombre}</option>))}
                </select>
                <br /> 
            </div>
        )
    }
}
export default ComboLabelHomologacionArchivos
