function sortTable(_list, filter) {
  if (!_list) {
    throw new Error('Too few arguments specified in sort');
  }

  let list = [..._list];

  for (let i = 0; i < list.length; i++) {
    if (list[i].change24h !== null && list[i].change24h !== undefined) {
      list[i].change24h = Number(list[i].change24h);
    }

    if (list[i].priceUsd !== null && list[i].priceUsd !== undefined) {
      list[i].priceUsd = Number(list[i].priceUsd);
    }

    if (
      list[i].priceUsd24hAgo !== null &&
      list[i].priceUsd24hAgo !== undefined
    ) {
      list[i].priceUsd24hAgo = Number(list[i].priceUsd24hAgo);
    }

    if (list[i].marketCapUsd !== null && list[i].marketCapUsd !== undefined) {
      list[i].marketCapUsd = Number(list[i].marketCapUsd);
    }

    list[i].votes = Number(list[i].votes);
  }

  const newList = [];

  switch (filter) {
    case 'name':
    case 'name-reverse':
      const names = list.map((current) => current.name);

      if (filter === 'name') {
        names.sort();
      }

      if (filter === 'name-reverse') {
        names.sort();
        names.reverse();
      }

      for (let i = 0; i < list.length; i++) {
        for (let j = 0; j < list.length; j++) {
          if (names[i] && list[j]) {
            if (names[i] === list[j].name) {
              newList.push(list[j]);
            }
          }
        }
      }

      return newList;

    case 'price':
    case 'price-reverse':
      const withoutPrices = list.filter((current) => {
        if (current.priceUsd !== null && current.priceUsd !== undefined) {
          return null;
        }

        return current;
      });

      const withPrices = list.filter((current) => {
        if (current.priceUsd === undefined || current.priceUsd === null) {
          return null;
        }

        return current;
      });

      for (let i = 0; i < withPrices.length; i++) {
        for (let j = 0; j < withPrices.length; j++) {
          if (withPrices[j + 1]) {
            const current = withPrices[j];
            const next = withPrices[j + 1];

            const currentVal = current.priceUsd;
            const nextVal = next.priceUsd;

            if (filter === 'price') {
              if (currentVal < nextVal) {
                withPrices[j] = next;
                withPrices[j + 1] = current;
              }
            }

            if (filter === 'price-reverse') {
              if (currentVal > nextVal) {
                withPrices[j] = next;
                withPrices[j + 1] = current;
              }
            }
          }
        }
      }

      for (let i = 0; i < withoutPrices.length; i++) {
        withPrices.push(withoutPrices[i]);
      }

      return withPrices;

    case 'change-24h':
    case 'change-24h-reverse':
      const withoutChange24h = list.filter((current) => {
        if (current.change24h !== null && current.change24h !== undefined) {
          return null;
        }

        return current;
      });

      const withChange24h = list.filter((current) => {
        if (current.change24h === undefined || current.change24h === null) {
          return null;
        }

        return current;
      });

      for (let i = 0; i < withChange24h.length; i++) {
        for (let j = 0; j < withChange24h.length; j++) {
          if (withChange24h[j + 1]) {
            const current = withChange24h[j];
            const next = withChange24h[j + 1];

            if (filter === 'change-24h') {
              if (current.change24h < next.change24h) {
                withChange24h[j] = next;
                withChange24h[j + 1] = current;
              }
            }

            if (filter === 'change-24h-reverse') {
              if (current.change24h > next.change24h) {
                withChange24h[j] = next;
                withChange24h[j + 1] = current;
              }
            }
          }
        }
      }

      for (let i = 0; i < withoutChange24h.length; i++) {
        withChange24h.push(withoutChange24h[i]);
      }

      return withChange24h;

    case 'marketcap':
    case 'marketcap-reverse':
      const withoutMarketcap = list.filter((current) => {
        if (
          current.marketCapUsd !== null &&
          current.marketCapUsd !== undefined
        ) {
          return null;
        }

        return current;
      });

      const withMarketcap = list.filter((current) => {
        if (
          current.marketCapUsd === undefined ||
          current.marketCapUsd === null
        ) {
          return null;
        }

        return current;
      });

      for (let i = 0; i < withMarketcap.length; i++) {
        for (let j = 0; j < withMarketcap.length; j++) {
          if (withMarketcap[j + 1]) {
            const current = withMarketcap[j];
            const next = withMarketcap[j + 1];

            if (filter === 'marketcap') {
              if (current.marketCapUsd < next.marketCapUsd) {
                withMarketcap[j] = next;
                withMarketcap[j + 1] = current;
              }
            }

            if (filter === 'marketcap-reverse') {
              if (current.marketCapUsd > next.marketCapUsd) {
                withMarketcap[j] = next;
                withMarketcap[j + 1] = current;
              }
            }
          }
        }
      }

      for (let i = 0; i < withoutMarketcap.length; i++) {
        withMarketcap.push(withoutMarketcap[i]);
      }

      return withMarketcap;

    case 'launch-date':
    case 'launch-date-reverse':
      for (let i = 0; i < list.length; i++) {
        for (let j = 0; j < list.length; j++) {
          if (list[j + 1]) {
            const current = list[j];
            const next = list[j + 1];

            const currentVal = new Date(current.launchDate).valueOf();
            const nextVal = new Date(next.launchDate).valueOf();

            if (filter === 'launch-date') {
              if (currentVal < nextVal) {
                list[j] = next;
                list[j + 1] = current;
              }
            }

            if (filter === 'launch-date-reverse') {
              if (currentVal > nextVal) {
                list[j] = next;
                list[j + 1] = current;
              }
            }
          }
        }
      }

      return list;

    case 'votes':
    case 'votes-reverse':
      for (let i = 0; i < list.length; i++) {
        for (let j = 0; j < list.length; j++) {
          if (list[j + 1]) {
            const current = list[j];
            const next = list[j + 1];

            if (filter === 'votes') {
              if (current.votes < next.votes) {
                list[j] = next;
                list[j + 1] = current;
              }
            }

            if (filter === 'votes-reverse') {
              if (current.votes > next.votes) {
                list[j] = next;
                list[j + 1] = current;
              }
            }
          }
        }
      }

      return list;

    case 'end-date':
    case 'end-date-reverse':
      for (let i = 0; i < list.length; i++) {
        for (let j = 0; j < list.length; j++) {
          if (list[j + 1]) {
            const current = list[j];
            const next = list[j + 1];

            if (filter === 'end-date') {
              if (
                new Date(current.endDate).valueOf() <
                new Date(next.endDate).valueOf()
              ) {
                list[j] = next;
                list[j + 1] = current;
              }
            }

            if (filter === 'end-date-reverse') {
              if (
                new Date(current.endDate).valueOf() >
                new Date(next.endDate).valueOf()
              ) {
                list[j] = next;
                list[j + 1] = current;
              }
            }
          }
        }
      }

      return list;

    default:
      return list;
  }
}

export default sortTable;
