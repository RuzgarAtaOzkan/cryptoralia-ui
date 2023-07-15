function shortenText(str, offset) {
  if (!str) {
    return null;
  }

  str = str.toString();
  const defaultOffset = 15;
  const strLen = str.length;
  let newStr = '';

  if (offset) {
    if (str.length > offset) {
      for (let i = 0; i < offset; i++) {
        if (str[i]) {
          newStr = newStr + str[i];
        }
      }
    } else {
      newStr = str;
    }

    return strLen > offset ? newStr + '...' : newStr;
  }

  for (let i = 0; i < defaultOffset; i++) {
    if (str[i]) {
      newStr = newStr + str[i];
    }
  }

  return strLen > defaultOffset ? newStr + '...' : newStr;
}

export default shortenText;
