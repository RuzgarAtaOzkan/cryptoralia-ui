// API
import reqInstance from '../api/instance';

// CONFIG
import config from '../config';

async function getTokens(query = '?status=2&limit=20&name=0') {
  const domain = config.api.domain;
  const apiVersion = config.api.version;
  const endpoint = '/v' + apiVersion + '/tokens' + query;
  const url = domain + endpoint;

  try {
    const response = await reqInstance.get(url);
    return response;
  } catch (err) {
    return null;
  }
}

export default getTokens;
