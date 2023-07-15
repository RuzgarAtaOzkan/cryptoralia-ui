// CONFIG
import config from '../config';

// CONTEXT
import gdt from '../context/global/types';

// UTILS
import reqInstance from '../utils/axios';

async function voteToken(id, store) {
  if (!id || !store) {
    throw new Error('Too few arguments specified in voteToken');
  }

  const domain = config.api.domain;
  const apiVersion = config.api.version;
  const endpoint = '/v' + apiVersion + '/votes/vote/' + id;
  const url = domain + endpoint;

  try {
    const response = await reqInstance.get(url);

    /**
     * 
     *
      store.dispatchGlobal({
        type: gdt.SET_ALERT,
        payload: {
          message: 'Sucessfully voted token',
          type: 'success',
        },
      });
     */

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

        return null;
      }
    }

    return null;
  }
}

export default voteToken;
