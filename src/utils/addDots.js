function addDots(num) {
  if (!num || typeof num !== 'number') {
    return null;
  }
  //
  num = num.toString();
  let newNum = '';
  let ctr = 0;

  for (let i = num.length - 1; i > -1; i--) {
    if (ctr && ctr % 3 === 0) {
      newNum = num[i] + '.' + newNum;
    } else {
      newNum = num[i] + newNum;
    }

    ctr++;
  }

  return newNum;
}

export default addDots;
