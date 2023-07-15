// API
import reqInstance from './axios';

// CONFIG
import config from '../config';

async function getAds(query = '?limit=20') {
  const domain = config.api.domain;
  const apiVersion = config.api.version;
  const endpoint = '/v' + apiVersion + '/ads' + query;
  const url = domain + endpoint;

  try {
    const response = await reqInstance.get(url);

    return response;
  } catch (error) {
    return null;
  }
}

export default getAds;
