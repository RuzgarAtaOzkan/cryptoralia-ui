// CONFIG
import config from '../config';

// API
import Request from '../api/request';

// CONTEXT
import gdt from '../context/global/types';
import adt from '../context/auth/types';

async function verifyEmail(token, store, setLoading) {
  if (!token) {
    throw new Error('Too few arguments specified in login');
  }

  const domain = config.api.domain;
  const apiVersion = config.api.version;

  if (!setLoading) {
    setLoading(true);
  }

  try {
    const response = await Request.get({
      baseURL: domain,
      endpoint: '/v' + apiVersion + '/verify-email/' + token,
    });

    const data = response.data;

    store.dispatchGlobal({
      type: gdt.SET_ALERT,
      payload: {
        message: 'Successfully verified email',
        type: 'success',
      },
    });

    store.dispatchAuth({
      type: adt.SET_USER,
      payload: data,
    });

    if (!setLoading) {
      setLoading(false);
    }

    return response;
  } catch (error) {
    if (!setLoading) {
      setLoading(false);
    }

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

export default verifyEmail;
