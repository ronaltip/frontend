import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Login from './views/login';

import Routes from './routes/routes';

const App = () => {
  const userStorage = sessionStorage.getItem('user');
  if (!userStorage && window.location.pathname !== '/') {
    window.location.href = '/';
    sessionStorage.removeItem('user');
  }

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Login} />
        <Routes />
      </Switch>
    </BrowserRouter>
  );
};
export default App;
