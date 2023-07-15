function rand(length) {
  const rand = Math.floor(Math.random() * length);
  return rand;
}

function randomHeaderAds(data, prop = 'desktopURL', length = 2) {
  const ads = [];
  const result = [];
  const randoms = [];

  for (let i = 0; i < data.length; i++) {
    if (data[i][prop]) {
      ads.push(data[i]);
    }
  }

  if (ads.length < length) {
    length = ads.length;
  }

  for (let i = 0; i < length; i++) {
    let random = rand(ads.length);

    while (randoms.includes(random)) {
      random = rand(ads.length);
    }

    randoms.push(random);
    result.push(ads[random]);
  }

  return result;
}

export default randomHeaderAds;
