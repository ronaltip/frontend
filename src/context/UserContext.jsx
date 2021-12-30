import React, { createContext, useReducer, useEffect } from 'react';
import RoutesModules from '../routes/routes';
import ROOT_ROLE from '../util/constants/accessByRoles';

export const UserContext = createContext([]);

const initialState = null;

const userReducer = (state, action) => {
  switch (action.type) {
    case 'ACTIONS_MODULES':
      return action.payload;
    case 'NEW_PATHNAME':
      return { ...state, pathname: action.payload };
    default:
      return initialState;
  }
};

export const UserProvider = ({ children }) => {
  const [state, userdispath] = useReducer(userReducer, initialState);

  return (
    <UserContext.Provider value={[state, userdispath]}>
      {children}
    </UserContext.Provider>
  );
};
