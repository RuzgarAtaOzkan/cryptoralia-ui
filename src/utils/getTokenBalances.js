// API
import reqInstance from '../api/instance';

// CONFIG
import config from '../config';

async function getTokenBalances(address) {
  const domain = config.api.domain;
  const apiVersion = config.api.version;
  const endpoint = '/v' + apiVersion + '/blockchain/token-balances/' + address;
  const url = domain + endpoint;

  try {
    const response = await reqInstance.get(url);
    return response;
  } catch (err) {
    return null;
  }
}

export default getTokenBalances;
