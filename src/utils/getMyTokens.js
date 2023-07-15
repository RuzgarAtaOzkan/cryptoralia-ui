// API
import Request from '../api/request';
import reqInstance from '../api/instance';

// CONFIG
import config from '../config';

async function getMyTokens(query) {
  const domain = config.api.domain;
  const apiVersion = config.api.version;
  const endpoint = '/v' + apiVersion + '/tokens/my' + query;
  const url = domain + endpoint;

  try {
    const response = await reqInstance.get(url);

    return response;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export default getMyTokens;
