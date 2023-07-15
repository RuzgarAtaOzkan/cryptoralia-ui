// API
import reqInstance from '../api/instance';

// CONFIG
import config from '../config';

// CONTEXT
import gdt from '../context/global/types';

// UTILS
import getProfile from './getProfile';

async function editProfile(body, store, setLoading) {
  if (!body || !store) {
    throw new Error('Too few arguments specified in editProfile');
  }

  const domain = config.api.domain;
  const apiVersion = config.api.version;
  const endpoint = '/v' + apiVersion + '/profile';
  const url = domain + endpoint;

  try {
    const response = await reqInstance.put(url, body);
    const data = response.data;

    store.dispatchGlobal({
      type: gdt.SET_ALERT,
      payload: {
        message: data.message,
        type: 'success',
      },
    });

    await getProfile(store, setLoading);
  } catch (error) {
    await getProfile(store, setLoading);

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
  }
}

export default editProfile;
