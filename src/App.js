import React, { Suspense } from "react";
import AdminLayout from "./layout/AdminLayout";
import Login from "./layout/Login";
import NotFound from "./views/NotFound";
import './css/styles.css'
import { Redirect, Router } from "@reach/router";
const App = () => {
  const userStorage = JSON.parse(sessionStorage.getItem('user'))


  return (
    <Suspense fallback={<div />}>
      <Router>
        {/* <Login path='/' /> */}
        {/* <NotFound default /> */}
        <AdminLayout path='/eco' default />
        {!userStorage && <Login path='/' />}
        {userStorage && <Redirect from='/' to='/eco' />}
      </Router>
    </Suspense>
  )
}
export default App