// API
import instance from './instance';

class Request {
  static async get(data) {
    if (!data) {
      throw new Error('Too few arguments specified in request');
    }

    const { baseURL, endpoint = '', config } = data;

    if (!baseURL) {
      throw new Error('Missing credentials in request');
    }

    let url = baseURL + endpoint;
    const response = await instance.get(url, config);
    return response;
  }

  static async post(data) {
    if (!data) {
      throw new Error('Too few arguments specified in request');
    }

    const { baseURL, endpoint = '', body, config } = data;

    if (!baseURL) {
      throw new Error('Missing credentials in request');
    }

    let url = baseURL + endpoint;
    const response = await instance.post(url, body, config);
    return response;
  }

  static async put(data) {
    if (!data) {
      throw new Error('Too few arguments specified in request');
    }

    const { baseURL, endpoint = '', body, config } = data;

    if (!baseURL) {
      throw new Error('Missing credentials in request');
    }

    let url = baseURL + endpoint;
    const response = await instance.put(url, body, config);
    return response;
  }
}

export default Request;
