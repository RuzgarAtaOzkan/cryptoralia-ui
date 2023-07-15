// CONFIG
import config from '../config';

// UTILS
import reqInstance from '../utils/axios';

async function getVotes(ip = '') {
  const domain = config.api.domain;
  const apiVersion = config.api.version;
  const endpoint = '/v' + apiVersion + '/votes/' + ip;
  const url = domain + endpoint;

  try {
    const response = await reqInstance.get(url);

    return response;
  } catch (error) {
    return null;
  }
}

export default getVotes;
