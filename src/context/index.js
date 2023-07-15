// MODULES
import { createContext, useContext, useReducer } from 'react';

// REDUCERS
import authReducer, { initialState as authInitialState } from './auth/reducer';
import globalReducer, { initialState as globalInitialState } from './global/reducer';

export const Context = createContext();

export function useStore() {
  return useContext(Context);
}

export function Provider({ children }) {
  const [auth, dispatchAuth] = useReducer(authReducer, authInitialState);
  const [global, dispatchGlobal] = useReducer(globalReducer, globalInitialState);

  let initialValue = {
    auth,
    dispatchAuth,
    global,
    dispatchGlobal,
  };

  return <Context.Provider value={initialValue}>{children}</Context.Provider>;
}
