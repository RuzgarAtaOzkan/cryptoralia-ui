// CONFIG
import config from '../../config';

// TYPES
import types from './types';

export const initialState = {
  authState: 0, // deprecated
  state: 0,
  user: {
    _id: '',
    username: '',
    email: '',
    emailVerified: false,
    role: '',
    profileImgURL: '',
    premium: false,
  },
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    // API ACTIONS
    case types.SIGNUP:
      return {
        authState: 2,
        state: 2,
        user: { ...action.payload },
      };

    case types.LOGIN:
      return {
        authState: 2,
        state: 2,
        user: { ...action.payload },
      };

    case types.SIGNOUT:
      return {
        authState: config.env.NODE_ENV === 'development' ? 2 : 1,
        state: 1,
        user: {
          _id: 0,
          username: '',
          email: '',
          emailVerified: false,
          role: '',
          profileImgURL: '',
          premium: false,
        },
      };

    case types.GET_PROFILE:
      return {
        authState: 2,
        state: 2,
        user: { ...action.payload },
      };

    // IN APP ACTIONS
    case types.SET_USER:
      return {
        authState: 2,
        state: 2,
        user: { ...action.payload },
      };

    default:
      return state;
  }
}
