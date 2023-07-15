function displayNetworkImg(chainId) {
  if (!chainId) {
    return null;
  }

  switch (chainId) {
    case 56 || 'BSC':
      return <img src="/assets/images/bnb.png" />;

    default:
      return <img src="/assets/images/bnb.png" />;
  }
}

export default displayNetworkImg;
