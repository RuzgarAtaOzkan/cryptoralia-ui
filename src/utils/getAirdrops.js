// API
import reqInstance from '../api/instance';

// CONFIG
import config from '../config';

async function getAirdrops(query = '') {
  const domain = config.api.domain;
  const apiVersion = config.api.version;
  const endpoint = '/v' + apiVersion + '/airdrops' + query;
  const url = domain + endpoint;

  try {
    const response = await reqInstance.get(url);

    return response;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export default getAirdrops;
