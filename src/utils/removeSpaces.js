function removeSpaces(str) {
  if (!str) {
    return '';
  }

  let newName = '';

  for (let i = 0; i < str.length; i++) {
    const current = str[i];
    const next = str[i + 1];

    if (current === ' ') {
      if (next && next !== ' ') {
        if (newName.length) {
          newName = newName + current;
        }
      }
    } else {
      newName = newName + current;
    }
  }

  return newName;
}

export default removeSpaces;
