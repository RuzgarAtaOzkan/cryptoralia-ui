// API
import Request from '../api/request';

// DISPATCH TYPES
import authDispatchTypes from '../context/auth/types';

// CONFIG
import config from '../config';

async function getProfile(store, setLoading) {
  if (!store) {
    throw new Error('Too few arguments specified in getProfile');
  }

  const domain = config.api.domain;
  const apiVersion = config.api.version;

  if (setLoading) {
    setLoading(true);
  }

  try {
    const response = await Request.get({
      baseURL: domain,
      endpoint: '/v' + apiVersion + '/profile',
    });

    if (setLoading) {
      setLoading(false);
    }

    const data = response.data;

    if (!data) {
      store.dispatchAuth({ type: authDispatchTypes.SIGNOUT });
      return;
    }

    store.dispatchAuth({
      type: authDispatchTypes.GET_PROFILE,
      payload: data,
    });

    return response;
  } catch (err) {
    if (setLoading) {
      setLoading(false);
    }

    store.dispatchAuth({ type: authDispatchTypes.SIGNOUT });
    return null;
  }
}

export default getProfile;
