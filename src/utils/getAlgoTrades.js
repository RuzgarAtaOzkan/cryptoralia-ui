// API
import reqInstance from '../api/instance';

// CONFIG
import config from '../config';

async function getAlgoTrades(query = '?limit=20') {
  const domain = config.api.domain;
  const apiVersion = config.api.version;
  const endpoint = '/v' + apiVersion + '/algo-trades' + query;
  const url = domain + endpoint;

  try {
    const response = await reqInstance.get(url);

    return response;
  } catch (error) {
    return null;
  }
}

export default getAlgoTrades;
