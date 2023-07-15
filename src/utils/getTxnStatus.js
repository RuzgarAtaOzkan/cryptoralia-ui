// API
import reqInstance from '../utils/axios';

// CONFIG
import config from '../config';

async function getTxnStatus(txnhash) {
  if (!txnhash) {
    return null;
  }

  const domain = config.api.domain;
  const apiVersion = config.api.version;
  const endpoint = '/v' + apiVersion + '/blockchain/txn-status/' + txnhash;
  const url = domain + endpoint;

  try {
    const response = await reqInstance.get(url);
    return response;
  } catch (err) {
    return null;
  }
}

export default getTxnStatus;
