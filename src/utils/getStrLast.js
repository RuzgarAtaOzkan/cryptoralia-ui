function getStrLast(str, index = 4) {
  if (!str || typeof str !== 'string') {
    return '';
  }

  if (!index) {
    return str[str.length - 1];
  }

  let result = '';
  let ctr = 0;
  for (let i = str.length - 1; i > -1; i--) {
    if (ctr >= index) {
      return result;
    }

    result = str[i] + result;

    ctr++;
  }

  return result;
}

export default getStrLast;
