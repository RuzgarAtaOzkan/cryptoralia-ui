function getGuideImg(content) {
  if (!content) {
    return '';
  }

  let newContent = '';

  for (let i = 0; i < content.length; i++) {
    if (content[i] !== '\n' && content[i] !== ' ') {
      newContent += content[i];
    }
  }

  let search = false;
  let load = false;
  let quoteCtr = 0;
  let src = '';

  for (let i = 0; i < newContent.length; i++) {
    if (
      newContent[i] === '<' &&
      newContent[i + 1] === 'i' &&
      newContent[i + 2] === 'm' &&
      newContent[i + 3] === 'g'
    ) {
      search = true;
    }

    if (search) {
      if (
        newContent[i] === 's' &&
        newContent[i + 1] === 'r' &&
        newContent[i + 2] === 'c' &&
        newContent[i + 3] === '=' &&
        newContent[i + 4] === '"'
      ) {
        load = true;
      }

      if (newContent[i] === '"') {
        quoteCtr++;

        if (quoteCtr >= 2) {
          break;
        }
      }
    }

    if (load) {
      if (quoteCtr < 2) {
        src += newContent[i];
      }
    }
  }

  return src.replace('src="', '');
}

export default getGuideImg;
