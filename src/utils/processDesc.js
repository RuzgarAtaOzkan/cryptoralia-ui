function processDesc(desc) {
  if (!desc) {
    throw new Error('Too few arguments specified in processDesc');
  }

  const words = desc.split('');
  let nCount = 1;

  for (let i = 0; i < words.length; i++) {
    if (words[i] === '\n') {
      nCount++;
    }
  }

  const descArr = [];

  for (let i = 0; i < nCount; i++) {
    descArr[i] = '';
  }

  let index = 0;

  for (let i = 0; i < words.length; i++) {
    if (words[i] === '\n') {
      index++;
    } else {
      descArr[index] = descArr[index] + words[i];
    }
  }

  return descArr;
}

export default processDesc;
