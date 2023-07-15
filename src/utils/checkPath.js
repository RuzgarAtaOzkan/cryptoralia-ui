// CONFIG
import config from '../config';

function checkPath(pathname) {
  const pages = config.dev.pages;

  if (!pathname) {
    return false;
  }

  let validityCount = 0;
  const pathnames = pathname.split('/');

  for (let i = 0; i < pages.length; i++) {
    const pagePaths = pages[i].split('/');

    for (let j = 0; j < pathnames.length; j++) {
      if (pagePaths[j] !== undefined && pagePaths[j] !== null) {
        if (pathnames[j] !== pagePaths[j]) {
          if (pagePaths[j].includes('[') && pagePaths[j].includes(']')) {
            validityCount++;
          }
        }

        if (pathnames[j] === pagePaths[j]) {
          validityCount++;
        }
      }
    }

    if (validityCount === pathnames.length) {
      return true;
    }

    validityCount = 0;
  }

  return false;
}

export default checkPath;
