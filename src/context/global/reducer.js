// TYPES
import types from './types';

export const initialState = {
  modals: {
    login: false,
    signup: false,
    changePassword: false,
    resetPassword: false,
    info: false,
    payment: false,
  },
  alerts: [],
  lang: 'en',
  ccOpen: false,
};

const alertTypes = ['success', 'error', 'info'];
const languages = ['en', 'tr', 'fr'];

export default function reducer(state = initialState, action) {
  switch (action.type) {
    // MODAL ACTIONS
    case types.SET_LOGIN_MODAL:
      return {
        ...state,
        modals: {
          ...state.modals,
          login: action.payload,
        },
      };

    case types.SET_SIGNUP_MODAL:
      return {
        ...state,
        modals: {
          ...state.modals,
          signup: action.payload,
        },
      };

    case types.SET_CHANGE_PASSWORD_MODAL:
      return {
        ...state,
        modals: {
          ...state.modals,
          changePassword: action.payload,
        },
      };

    case types.SET_RESET_PASSWORD_MODAL:
      return {
        ...state,
        modals: {
          ...state.modals,
          resetPassword: action.payload,
        },
      };

    case types.SET_INFO_MODAL:
      return {
        ...state,
        modals: {
          ...state.modals,
          info: action.payload,
        },
      };

    case types.SET_PAYMENT_MODAL:
      return {
        ...state,
        modals: {
          ...state.modals,
          payment: action.payload,
        },
      };
    // ALERT ACTIONS
    case types.SET_ALERT:
      if (!alertTypes.includes(action.payload.type)) {
        throw new Error('Invalid alert type specified');
      }

      action.payload.id = state.alerts.length + 1;

      return {
        ...state,
        alerts: [...state.alerts, action.payload],
      };

    case types.SET_ALERTS:
      for (let i = 0; i < action.payload.length; i++) {
        if (!alertTypes.includes(action.payload[i].type)) {
          throw new Error('Invalid alert type specified');
        }
      }

      return {
        ...state,
        alerts: [...action.payload],
      };

    case types.CLEAR_ALERTS:
      return {
        ...state,
        alerts: [],
      };

    case types.SET_LANGUAGE:
      if (!languages.includes(action.payload)) {
        throw new Error('Invalid language specified');
      }

      return {
        ...state,
        lang: action.payload,
      };

    case types.SET_CCOPEN:
      return {
        ...state,
        ccOpen: action.payload,
      };

    default:
      return state;
  }
}
