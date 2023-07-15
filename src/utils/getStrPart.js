function getStrPart(str, start, end) {
  if (!str) {
    return null;
  }

  const secondPart = str.split(start)[1];

  let result = '';

  for (let i = 0; i < secondPart.length; i++) {
    if (secondPart[i] === end) {
      break;
    }

    result = result + secondPart[i];
  }

  return result;
}

export default getStrPart;
