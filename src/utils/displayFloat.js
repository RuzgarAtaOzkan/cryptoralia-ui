// CONFIG
import config from '../config';

function displayFloat(num, index = 2) {
  if (typeof num !== config.dev.dataTypes.number) {
    return null;
  }

  let strNum = num.toString();
  let newFloat = '';
  let ctr = 0;
  const strNumParts = strNum.split('.');

  const strNumLeft = strNumParts[0];
  const strNumRight = strNumParts[1];

  if (!strNumLeft || !strNumRight) {
    return num;
  }

  if (strNum.includes('e-')) {
    const numparts = strNum.split('e-');
    const zeroCount = Number(numparts[1]);
    const value = numparts[0].split('.').join('');
    let finalValue = '0.';

    for (let i = 0; i < zeroCount - 1; i++) {
      finalValue = finalValue + '0';
    }

    finalValue = finalValue + value;

    for (let i = 0; i < finalValue.length; i++) {
      if (ctr < index) {
        newFloat = newFloat + finalValue[i];
      }

      if ((finalValue[i] !== '0' && finalValue[i] !== '.') || ctr) {
        ctr++;
      }
    }

    return newFloat;
  } else {
    for (let i = 0; i < strNumRight.length; i++) {
      if (ctr < index) {
        newFloat = newFloat + strNumRight[i];
      }

      if (strNumRight[i] !== '0' || ctr) {
        ctr++;
      }
    }
  }

  return Number(strNumLeft + '.' + newFloat);
}

export default displayFloat;
