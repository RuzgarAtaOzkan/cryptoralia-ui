// API
import reqInstance from '../api/instance';

// CONFIG
import config from '../config';

async function getGuides(query = '?limit=20&title=0') {
  const domain = config.api.domain;
  const apiVersion = config.api.version;
  const endpoint = '/v' + apiVersion + '/guides' + query;
  const url = domain + endpoint;

  try {
    const response = await reqInstance.get(url);

    return response;
  } catch (error) {
    return null;
  }
}

export default getGuides;
