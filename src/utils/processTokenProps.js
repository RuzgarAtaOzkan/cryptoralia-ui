// CONFIG
import config from '../config';

// UTILS
import addCommas from './addCommas';
import displayDate from './displayDate';
import displayFloat from './displayFloat';
import calc24hChange from './calc24hChange';

// Responsible for visualizing token values for people to see, like adding commas to market cap or displaying date pieces
// Should only be used for displaying values at the end layer.

// function name should be visualizeTokenProps
function processTokenProps(data) {
  if (!data) {
    return null;
  }

  const dataTypes = config.dev.dataTypes;

  let {
    marketCapUsd,
    totalReserveUsd,
    launchDate,
    priceUsd,
    priceUsd24hAgo,
    priceChange24h,
    volume,
    fdv,
  } = data;

  //marketCapUsd = Number(marketCapUsd);
  //totalReserveUsd = Number(totalReserveUsd);
  //priceUsd = Number(priceUsd);
  //priceUsd24hAgo = Number(priceUsd24hAgo);

  let _marketCapUsd = null;
  let _totalReserveUsd = null;
  let _launchDate = null;
  let _priceUsd = null;
  let _change24h = null;
  let _priceChange24h = null;
  let _fdv = null;
  let _volume = null;

  if (marketCapUsd !== undefined && marketCapUsd !== null) {
    _marketCapUsd = addCommas(marketCapUsd.toFixed(2));
  }

  if (totalReserveUsd !== undefined && totalReserveUsd !== null) {
    _totalReserveUsd = addCommas(totalReserveUsd.toFixed(2));
  }

  if (launchDate) {
    _launchDate = displayDate(launchDate);
  }

  if (priceUsd !== undefined && priceUsd !== null) {
    _priceUsd = addCommas(displayFloat(priceUsd));
  }

  if (
    priceUsd !== undefined &&
    priceUsd !== null &&
    priceUsd24hAgo !== undefined &&
    priceUsd24hAgo !== null
  ) {
    _change24h = Number(calc24hChange(priceUsd, priceUsd24hAgo).toFixed(2));
  }

  if (priceUsd !== undefined && priceUsd !== null && !priceUsd24hAgo) {
    _change24h = 0;
  }

  if (
    priceChange24h !== null &&
    priceChange24h !== undefined &&
    typeof priceChange24h === dataTypes.number
  ) {
    _priceChange24h = Number(priceChange24h).toFixed(2);
  }

  if (fdv) {
    _fdv = addCommas(displayFloat(fdv));
  }

  if (volume) {
    _volume = JSON.parse(volume);
    _volume.h24 = addCommas(displayFloat(_volume.h24));
  }

  const token = {
    ...data,
  };

  token.marketCapUsd = _marketCapUsd;
  token.totalReserveUsd = _totalReserveUsd;
  token.launchDate = _launchDate;
  token.priceUsd = _priceUsd;
  token.priceChange24h = _priceChange24h;
  token.votes = Number(token.votes);
  token.votes24h = Number(token.votes24h);
  token.fdv = _fdv;
  token.volume = _volume;

  return token;
}

export default processTokenProps;
