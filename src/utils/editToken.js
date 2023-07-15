// API
import Request from '../api/request';

// DISPATCH TYPES
import globalDispatchTypes from '../context/global/types';

// CONFIG
import config from '../config';

async function editToken(payload, store, setLoading) {
  if (!payload) {
    return null;
  }

  const domain = config.api.domain;
  const apiVersion = config.api.version;

  try {
    const response = await Request.put({
      baseURL: domain,
      endpoint: '/v' + apiVersion + '/tokens',
      body: payload,
    });

    store.dispatchGlobal({
      type: globalDispatchTypes.SET_ALERT,
      payload: {
        message: 'Successfully edited token',
        type: 'success',
      },
    });

    return response;
  } catch (error) {
    if (error.response) {
      if (error.response.data) {
        const errors = error.response.data;

        for (let i = 0; i < errors.length; i++) {
          const title = errors[i].description;

          store.dispatchGlobal({
            type: globalDispatchTypes.SET_ALERT,
            payload: {
              type: 'error',
              message: title,
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

    return null;
  }
}

export default editToken;
