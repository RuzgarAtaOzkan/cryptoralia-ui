// CONFIG
import config from '../config';

function addCommas(num) {
  if (
    !num &&
    typeof num !== config.dev.dataTypes.number &&
    typeof num !== config.dev.dataTypes.string
  ) {
    return null;
  }

  num = num.toString();
  let newNum = '';
  let ctr = 0;
  let start = false;

  if (num.includes('.')) {
    for (let i = num.length - 1; i > -1; i--) {
      if (num[i + 1] === '.') {
        start = true;
      }

      if (start) {
        if (ctr && ctr % 3 === 0) {
          newNum = num[i] + ',' + newNum;
        } else {
          newNum = num[i] + newNum;
        }

        ctr++;
      } else {
        newNum = num[i] + newNum;
      }
    }
  } else {
    for (let i = num.length - 1; i > -1; i--) {
      if (ctr && ctr % 3 === 0) {
        newNum = num[i] + ',' + newNum;
      } else {
        newNum = num[i] + newNum;
      }

      ctr++;
    }
  }

  return newNum;
}

export default addCommas;
