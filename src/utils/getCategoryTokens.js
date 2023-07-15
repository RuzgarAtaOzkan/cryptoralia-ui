// API
import Request from '../api/request';

// CONFIG
import config from '../config';

async function getCategoryTokens(category) {
  if (!category) {
    return null;
  }

  const domain = config.api.domain;
  const apiVersion = config.api.version;

  try {
    const response = await Request.get({
      baseURL: domain,
      endpoint: '/v' + apiVersion + '/tokens/categories/' + category,
    });

    return response;
  } catch (error) {
    return null;
  }
}

export default getCategoryTokens;
