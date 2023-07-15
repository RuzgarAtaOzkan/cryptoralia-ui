// API
import reqInstance from '../utils/axios';

// CONFIG
import config from '../config';

async function requestMessage(body) {
  const domain = config.api.domain;
  const apiVersion = config.api.version;
  const endpoint = '/v' + apiVersion + '/blockchain/request-message';
  const url = domain + endpoint;

  try {
    const response = await reqInstance.post(url, body);
    return response;
  } catch (error) {
    return null;
  }
}

export default requestMessage;
