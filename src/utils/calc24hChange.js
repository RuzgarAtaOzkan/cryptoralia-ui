function calc24hChange(price, price24hAgo) {
  if (
    price === undefined ||
    price === null ||
    price24hAgo === undefined ||
    price24hAgo === null
  ) {
    return null;
  }

  const difference = price - price24hAgo;

  const difference100x = difference * 100;
  const result = difference100x / price24hAgo;

  return result;
}

export default calc24hChange;
