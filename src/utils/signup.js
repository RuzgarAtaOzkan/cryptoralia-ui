// API
import reqInstance from '../api/instance';

// CONTEXT
import authDispatchTypes from '../context/auth/types';
import globalDispatchTypes from '../context/global/types';

// CONFIG
import config from '../config';

async function signup(body, store, setLoading) {
  if (!body || !store || !setLoading) {
    throw new Error('Too few arguments specified in signup');
  }

  const domain = config.api.domain;
  const apiVersion = config.api.version;
  const endpoint = '/v' + apiVersion + '/signup';
  const url = domain + endpoint;

  setLoading(true);

  try {
    const response = await reqInstance.post(url, body);
    const user = response.data;

    store.dispatchGlobal({
      type: globalDispatchTypes.SET_ALERT,
      payload: {
        message: 'Successfully signed up.',
        type: 'success',
      },
    });

    store.dispatchGlobal({
      type: globalDispatchTypes.SET_ALERT,
      payload: {
        message: 'Email verification link has been sent to your email.',
        type: 'info',
      },
    });

    store.dispatchGlobal({
      type: globalDispatchTypes.SET_SIGNUP_MODAL,
      payload: false,
    });

    store.dispatchAuth({
      type: authDispatchTypes.SIGNUP,
      payload: user,
    });
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

      setLoading(false);
      return;
    }

    store.dispatchGlobal({
      type: globalDispatchTypes.SET_ALERT,
      payload: {
        message: 'Something went wrong',
        type: 'error',
      },
    });
  }

  setLoading(false);
}

export default signup;
