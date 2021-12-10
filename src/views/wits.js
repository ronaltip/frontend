import React, {  Component, forwardRef } from 'react'; 
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import Materialtable from 'material-table';

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import CancelIcon from '@material-ui/icons/Cancel';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';

import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

//import Cookies from 'universal-cookie';
import SideBar from "../componentes/sidebar";
import Cabecera from "../componentes/cabecera";
import '../css/styles.css';
//const cookies = new Cookies();

const URL = process.env.REACT_APP_API_HOST; 
//const url = "http://localhost:9000/wits_homologacion";
//const urlAuxiliar = "http://localhost:9000/tipo_curvas"; 
//const urlAuxilir2 = "http://localhost:9000/wits_detalle";
 

const columns = [
    { title: 'Level', field: 'level' },
    { title: 'Codigo Wits', field: 'codigo' },
    { title: 'Mnemonico', field: 'short_mnemonico' },
    { title: 'Descripción', field: 'descripcion' }
];

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
} 


class viewWits extends Component {

    state = {
        data: [],
    }
       
    peticionGet = async () => {
        axios.get(URL + 'wits_detalle').then(response => {
            this.setState({ data: response.data });
        }).catch(error => {
            console.log(error.message);
        })
    };

  
    useEffect = () => {
        this.peticionGet();
    };
     
   
    componentDidMount() {
        this.peticionGet();
    }

    NoAction = () => {

    }
    

    render() {
                
        return (
            <div className="App">                
                <Cabecera />
                <SideBar pageWrapId={"page-wrap"} outerContainerId={"App"} />
              
                <div className="container-fluid" >
                    <div className="col-md-12">
                    <Materialtable
                        title={"Tabla WITS 0"}
                        columns={columns}
                        data={this.state.data}
                        icons={tableIcons}
                        actions={[]}
                        options={{
                            actionsColumnIndex: -1,
                            pageSize: 10,
                           
                        }}
                        localization={{
                            header: { actions: 'Acciones' }
                        }}
                        onPageChange={() => this.NoAction()}
                        onChangeRowsPerPage= {() => this.NoAction()}
                        forwardRef={()=>this.NoAction()}
                    />
                    </div>
                </div>
                
            </div>
        );
    }
     
}
export default viewWits;

