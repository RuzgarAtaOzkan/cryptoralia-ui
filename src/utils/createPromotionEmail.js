// API
import reqInstance from '../api/instance';

// CONTEXT
import globalDispatchTypes from '../context/global/types';

// CONFIG
import config from '../config';

async function createPromotionEmail(email, store) {
  if (!email || !store) {
    return null;
  }

  const domain = config.api.domain;
  const apiVersion = config.api.version;
  const endpoint = '/v' + apiVersion + '/promotion-emails';
  const url = domain + endpoint;

  const body = {
    email,
  };

  console.log(email);

  try {
    const response = await reqInstance.post(url, body);
    store.dispatchGlobal({
      type: globalDispatchTypes.SET_ALERT,
      payload: {
        message: 'Successfully registered a promotion email',
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
    return null;
  }
}

export default createPromotionEmail;
