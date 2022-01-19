import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Router } from '@reach/router';
import { Button, Layout } from 'antd';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import HeaderBar from '../libs/HeaderBar/HeaderBar';
import MenuBar from '../libs/MenuBar/MenuBar';
import RoutesModules from '../routes/routes';
const { Header, Sider, Content } = Layout;

const routes = new RoutesModules();
const AdminLayout = () => {
  const [userState, userdispatch] = useContext(UserContext);
  const [collapsed, setCollapsed] = useState(false);
  const [modules, SetModules] = useState([]);

  useEffect(() => {
    const modulesList = new RoutesModules();
    SetModules(modulesList);
    userdispatch({
      type: 'ACTIONS_MODULES',
      payload: modulesList,
    });
  }, []);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const getMergedRoutes = routes => {
    const mergedRoutes = [];

    routes.forEach(route => {
      mergedRoutes.push(route);
      if (route.children) {
        route.children.forEach(children => {
          if (children.children) {
            children.children.forEach(child => {
              mergedRoutes.push(child);
            });
          } else {
            mergedRoutes.push(children);
          }
        });
      }
    });
    return mergedRoutes;
  };
  return (
    <Fragment>
      <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed} width={224}>
          <Button
            type="primary"
            onClick={toggleCollapsed}
            style={{ marginBottom: 16 }}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </Button>
          <MenuBar routesByRole={routes} />
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }}>
            <HeaderBar />
          </Header>
          <Layout
            className="mainLayaout"
            style={{
              paddingBottom: '24px',
              height: 'calc(100vh - 64px)',
              backgroundColor: '#fff',
              overflow: 'hidden',
            }}
          >
            <Content
              className="site-layout-background"
              style={{
                margin: '24px 16px',
                padding: 24,
                minHeight: 280,
              }}
            >
              {getMergedRoutes(routes).map((route, i) => {
                if (route.active) {
                  return (
                    <Router key={i}>
                      <route.main path={route.path} exact />
                    </Router>
                  );
                }
              })}
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </Fragment>
  );
};

export default AdminLayout;
