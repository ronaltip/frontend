import React, { Component, Fragment } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/styles.css';
import {
    Col,
    message,
    Row,
    Table,
    Spin,
    Input
} from 'antd'; import Footer from '../componentes/footer';
import HeaderSection from '../libs/headerSection/headerSection';


const URL = process.env.REACT_APP_API_HOST;
const { Search } = Input;
let modules = null;
class viewWits extends Component {

    state = {
        data: [], dataSearch: [], loading: false
    }

    peticionGet = () => {
        this.setLoading(true)
        axios.get(URL + 'wits_detalle').then(response => {
            if (response.status === 200)
                this.setState({ data: response.data, dataSearch: response.data, loading: false });
            else {
                console.log(response.data);
                message.error('Ocurrió un error consultando la tabla wits 0, intente nuevamente')
                this.setLoading(false)
            }
        }).catch(error => {
            message.error('Ocurrió un error consultando la tabla wits 0, intente nuevamente')
            console.log(error.message)
            this.setLoading(false)
        })
    };

    onFilter = search => {
        let searched = search.target.value.toLowerCase();
        const responseSearch = this.state.data.filter(({ level, codigo, descripcion, nombre, short_mnemonico }) => {
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
        this.setState({ dataSearch: responseSearch });
    };

    setLoading = e => {
        this.setState({ loading: e })
    }

    componentDidMount() {
        this.peticionGet();
        modules = JSON.parse(sessionStorage.getItem('modules'));
    }

    render() {

        return (
            <Fragment>
                <HeaderSection
                    onClick={() => { }}
                    titleButton=""
                    content='Curvas'
                    title={'Estandar Wits 0'}
                    disabled={modules && modules.curves.tableWits.edit}
                />
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
                    <Row style={{ marginTop: '10px' }}>
                        <Col span={24}>
                            <Table
                                tableLayout="fixed"
                                pagination={{ pageSize: 10 }}
                                dataSource={this.state.dataSearch}
                                rowKey="id"
                                key="id"
                                loading={{ indicator: <div><Spin /></div>, spinning: this.state.loading }}
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
                                        title: 'Mnemónico',
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
            </Fragment>
        );
    }

}
export default viewWits;

