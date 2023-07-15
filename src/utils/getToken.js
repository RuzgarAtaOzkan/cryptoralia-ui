// API
import reqInstance from '../api/instance';

// CONFIG
import config from '../config';

async function getToken(uid) {
  if (!uid) {
    return null;
  }

  const domain = config.api.domain;
  const apiVersion = config.api.version;
  const endpoint = '/v' + apiVersion + '/tokens/' + uid;
  const url = domain + endpoint;

  try {
    const response = await reqInstance.get(url);
    return response;
  } catch (error) {
    return null;
  }
}

export default getToken;
