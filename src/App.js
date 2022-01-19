import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Login from './views/login';

import Routes from './routes/routes';

const App = () => {
  const userStorage = sessionStorage.getItem('user');
  if (!userStorage && window.location.pathname !== '/') {
    sessionStorage.removeItem('user');
    return (window.location.href = '/');
  } else {
    return (
      <Routes />
    );
  }
};
export default App;
