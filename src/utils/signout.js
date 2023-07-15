// API
import Request from '../api/request';

// DISPATCH TYPES
import globalDispatchTypes from '../context/global/types';
import authDispatchTypes from '../context/auth/types';

// CONFIG
import config from '../config';

// UTILS
import reqInstance from '../utils/axios';

async function signout(store, setLoading) {
  if (!store) {
    throw new Error('Too few arguments specified in signout');
  }

  const domain = config.api.domain;
  const apiVersion = config.api.version;
  const endpoint = '/v' + apiVersion + '/signout';
  const url = domain + endpoint;

  if (setLoading) {
    setLoading(true);
  }

  try {
    const response = await reqInstance.get(url);
    const data = response.data;
    const message = response.data.message;
    const user = data.user;

    store.dispatchAuth({
      type: authDispatchTypes.SIGNOUT,
      payload: user,
    });

    store.dispatchGlobal({
      type: globalDispatchTypes.SET_ALERT,
      payload: {
        message,
        type: 'success',
      },
    });

    if (setLoading) {
      setLoading(false);
    }

    return response;
  } catch (error) {
    if (setLoading) {
      setLoading(false);
    }

    if (error.response) {
      if (error.response.data) {
        const errors = error.response.data;

        for (let i = 0; i < errors.length; i++) {
          const title = errors[i].description;

          store.dispatchGlobal({
            type: globalDispatchTypes.SET_ALERT,
            payload: {
              message: title,
              type: 'error',
            },
          });
        }
      }
    } else {
      store.dispatchGlobal({
        type: globalDispatchTypes.SET_ALERT,
        payload: {
          message: 'Something went wrong',
          type: 'error',
        },
      });
    }
  }
}

export default signout;
