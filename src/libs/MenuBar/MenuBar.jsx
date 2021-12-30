import React, { Fragment, useState } from 'react';
import { Button, Menu } from 'antd';

import { Link } from '@reach/router';
const { SubMenu } = Menu;

const MenuBar = ({ routesByRole }) => {
  return (
    <Fragment>
      <div>
        <Menu
          mode="inline"
          theme="ligth"
          style={{
            height: 'calc(100vh - 135px)',
            borderRight: 0,
            boxShadow: 'inset -1px 0px 0px rgba(0, 0, 0, 0.09)',
            overflowY: 'scroll',
            overflowX: 'hidden',
          }}
          className="scrollTheme"
        >
          {routesByRole.map(route => {
            if (route.active && !route.hidden) {
              return (
                <SubMenu
                  className={`sidebar__submenu ${
                    route.children ? '' : 'sidebar_no-childs'
                  }`}
                  key={route.path}
                  title={
                    <span>
                      {route.icon && <route.icon />}
                      {!route.children ? (
                        <Link to={route.path} key={route.path}>
                          <span className="Link-noChilds">{route.text}</span>
                        </Link>
                      ) : (
                        <span>{route.text}</span>
                      )}
                    </span>
                  }
                >
                  {route.children &&
                    route.children.map(children => {
                      if (
                        children.children &&
                        children.children.length >= 0 &&
                        children.active &&
                        !children.hidden
                      ) {
                        return (
                          <SubMenu
                            key={children.path + '-sub'}
                            title={children.text}
                          >
                            {children.children.map(child => {
                              if (child.active && !child.hidden) {
                                return (
                                  <Menu.Item
                                    key={child.path}
                                    className="sidebar__item"
                                  >
                                    <Link
                                      to={child.path}
                                      key={child.name}
                                      className="sidebar__link"
                                    >
                                      {child.text}
                                    </Link>
                                  </Menu.Item>
                                );
                              }
                            })}
                          </SubMenu>
                        );
                      } else {
                        if (children.active && !children.hidden) {
                          return (
                            <Menu.Item
                              key={children.path}
                              className="sidebar__item"
                            >
                              <Link
                                to={children.path}
                                key={children.name}
                                className="sidebar__link"
                              >
                                {children.text}
                              </Link>
                            </Menu.Item>
                          );
                        }
                      }
                    })}
                </SubMenu>
              );
            }
          })}
        </Menu>
      </div>
    </Fragment>
  );
};
export default MenuBar;
