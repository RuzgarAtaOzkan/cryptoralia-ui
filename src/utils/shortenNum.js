// UTILS
import addDots from '../utils/addDots';

function shortenNum(num, fix = 1) {
  if (!num) {
    return 0;
  }

  num = num.toString().split('.')[0];
  let ctr = 0;
  let result = '';

  if (num.length > 3 && num.length < 7) {
    num = addDots(Number(num));
    return num.split('.')[0] + 'K';
  }

  if (num.length > 6 && num.length < 10) {
    num = addDots(Number(num));
    const parts = num.split('.');

    for (let i = 0; i < parts[1].length; i++) {
      result = result + parts[1][i];

      ctr++;

      if (ctr === fix) {
        break;
      }
    }

    return parts[0] + '.' + result + 'M';
  }

  if (num.length > 9 && num.length < 13) {
    num = addDots(Number(num));
    const parts = num.split('.');

    for (let i = 0; i < parts[1].length; i++) {
      result = result + parts[1][i];

      ctr++;

      if (ctr === fix) {
        break;
      }
    }

    return parts[0] + '.' + result + 'B';
  }

  return num;
}

export default shortenNum;
