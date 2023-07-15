// CONFIG
import config from '../config';

function makeUpper(str, conf = '') {
  if (!str) {
    return null;
  }

  if (typeof str !== config.dev.dataTypes.string) {
    return null;
  }

  if (conf && conf.includes('g')) {
    let result = '';

    for (let i = 0; i < str.length; i++) {
      if ((str[i] !== ' ' && str[i - 1] === ' ') || !i) {
        result = result + str[i].toUpperCase();
      } else {
        result = result + str[i];
      }
    }

    return result;
  }

  return str[0].toUpperCase() + str.substr(1, str.length - 1);
}

export default makeUpper;
