import React, { Component } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import iconList from '../util/iconList';
import '../css/styles.css';
import {
  Col,
  message,
  Row,
  Table,
  Tooltip,
  Input
} from 'antd';
import Cabecera from '../componentes/cabecera';
import Sidebar from '../componentes/sidebar';
import Footer from '../componentes/footer';


const URL = process.env.REACT_APP_API_HOST; 
const { Search } = Input;

class viewWits extends Component {

    state = {
        data: [],  dataSearch: [],
    }
       
    peticionGet = async () => {
        axios.get(URL + 'wits_detalle').then(response => {
            if (response.status === 200)
                this.setState({ data: response.data, dataSearch: response.data });
            else
            {
                console.log(response.data);
                message.error('Ocurrió un error consultando la tabla wits0, intente nuevamente')
            }
        }).catch(error => {
            message.error('Ocurrió un error consultando la tabla wits0, intente nuevamente')
            console.log(error.message);
        })
    };
    
    onFilter = search => {
        let searched = search.target.value.toLowerCase();
        const responseSearch = this.state.data.filter( ({level, codigo, descripcion, nombre, short_mnemonico }) => {
          level = level.toLowerCase();
          codigo = codigo.toLowerCase();
          descripcion = descripcion.toLowerCase();
          nombre = nombre.toLowerCase();
          short_mnemonico = short_mnemonico.toLowerCase();
        
          return level.includes(searched) || codigo.includes(searched) || 
          descripcion.includes(searched) || 
          nombre.includes(searched) || 
          short_mnemonico.includes(searched) 
        });
        this.setState({dataSearch:  responseSearch});
    };
   
    componentDidMount() {
        this.peticionGet();
    }

    render() {
                
        return (
            <>                
                <Cabecera />
                <Sidebar />
                <nav aria-label="breadcrumb" className='small'>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">Curvas</li>
                        <li className="breadcrumb-item active" aria-current="page">Estandar Wits 0</li>
                    </ol>
                </nav>

                <div className='container-xl'>
                    <Row >
                        <Col span={24}>
                            <h3>Estandar Wits 0</h3>
                        </Col>
                    </Row>
                    <Row >
                        <Col span={12}>
                        <Search
                            placeholder="Buscar"
                            onChange={(value) => this.onFilter(value)}
                            enterButton={false}
                        />
                        </Col>
                    </Row>
                    <Row >
                        <Col span={24}>
                        <Table
                            tableLayout="fixed"
                            pagination={{ pageSize: 10 }}
                            dataSource={this.state.dataSearch}
                            rowKey="id"
                            key="id"
                            columns={[
                            {
                                title: 'Level',
                                dataIndex: 'level',
                                key: 'level',
                            },
                            {
                                title: 'Codigo Wits',
                                dataIndex: 'codigo',
                                key: 'codigo',
                            },
                            {
                                title: 'Mnemonico',
                                dataIndex: 'short_mnemonico',
                                key: 'short_mnemonico',
                            },
                            {
                                title: 'Descripción',
                                dataIndex: 'descripcion',
                                key: 'descripcion',
                            }
                            ]}
                            bordered
                        />
                        </Col>
                    </Row>
                </div>   

                <Footer />            
            </>
        );
    }
     
}
export default viewWits;

