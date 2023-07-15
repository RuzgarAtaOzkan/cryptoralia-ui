// CONFIG
import config from '../config';

// CONTEXT
import gdt from '../context/global/types';

// UTILS
import reqInstance from '../utils/axios';

async function createPremium(query = '', body, store) {
  if (!body || !store) {
    throw new Error('Too few arguments specified in signup');
  }

  const domain = config.api.domain;
  const apiVersion = config.api.version;
  const endpoint = '/v' + apiVersion + '/premiums';
  const url = domain + endpoint + query;

  try {
    const response = await reqInstance.post(url, body);

    console.log(response.data);

    store.dispatchGlobal({
      type: gdt.SET_ALERT,
      payload: {
        message: 'You premium request has been successfully made.',
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
            type: gdt.SET_ALERT,
            payload: {
              message: title,
              type: 'error',
            },
          });
        }
      }
    } else {
      store.dispatchGlobal({
        type: gdt.SET_ALERT,
        payload: {
          message: 'Something went wrong',
          type: 'error',
        },
      });
    }

    return null;
  }
}

export default createPremium;
