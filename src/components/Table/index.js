// MODULES
import { useState, useEffect } from 'react';
import Image from 'next/image';
import cn from 'classnames';

// CONFIG
import config from '../../config';

// CONTEXT
import { useStore } from '../../context';

// COMPONENTS
import Anchor from '../Anchor';
import SortIcon from '../Icons/Sort';
import AngleUp from '../Icons/AngleUp';
import AngleDown from '../Icons/AngleDown';
import SandWatch from '../Icons/SandWatch';

// UTILS
import shortenText from '../../utils/shortenText';
import processTokenProps from '../../utils/processTokenProps';
import voteToken from '../../utils/voteToken';
import sort from '../../utils/sortTable';

// STYLES
import styles from './Table.module.scss';

function Table({ data, title = "Today's Best", desc = '', promotedTokens, votes = '' }) {
  const store = useStore();

  const networks = config.networks;
  const [loading, setLoading] = useState(false);
  const [tokens, setTokens] = useState([...data] || []);
  const [promoteds, setPromoteds] = useState(promotedTokens || []);
  const [sortedBy, setSortedBy] = useState('');
  const [tokenVotes, setTokenVotes] = useState(votes);

  function onTitleClick(filter) {
    let newList = [];

    if (sortedBy === filter) {
      setSortedBy(filter + '-reverse');
      newList = sort(data, filter + '-reverse');
    } else {
      setSortedBy(filter);
      newList = sort(data, filter);
    }

    setTokens(newList);
  }

  function displaySortIcon(filter) {
    if (!filter) {
      throw new Error('Too few arguments specified in displaySortIcon');
    }

    if (filter === sortedBy) {
      return <SortIcon />;
    }

    if (filter + '-reverse' === sortedBy) {
      return <SortIcon active />;
    }
  }

  async function vote(tokenId, promotion = false) {
    if (!tokenId) {
      return null;
    }

    setLoading(true);

    const response = await voteToken(tokenId, store);

    setLoading(false);

    if (response) {
      setTokenVotes(tokenVotes + '_' + tokenId);

      if (promotion) {
        const updatedPromoteds = promoteds.map((current) => {
          if (current._id === tokenId) {
            const updatedToken = {
              ...current,
              votes: Number(current.votes) + 1,
            };

            return updatedToken;
          }

          return current;
        });

        setPromoteds(updatedPromoteds);

        return;
      }

      const updatedTokens = tokens.map((current) => {
        if (current._id === tokenId) {
          const updatedToken = {
            ...current,
            votes: Number(current.votes) + 1,
          };

          return updatedToken;
        }

        return current;
      });

      setTokens(updatedTokens);
    }
  }

  useEffect(() => {
    if (data) {
      setTokens([...data]);
    }
  }, [data]);

  useEffect(() => {
    if (promotedTokens) {
      setPromoteds([...promotedTokens]);
    }
  }, [promotedTokens]);

  return (
    <div className={cn(styles['container'])}>
      <div className={cn(styles['title-area'])}>
        <div className={cn(styles['title-area-title'])} dangerouslySetInnerHTML={{ __html: title }}></div>
        <p className={cn(styles['title-area-desc'])}>{desc}</p>
      </div>
      <div className={cn(styles['titles'], 'flx-btw-ctr')}>
        <div className={cn(styles['order'])}>
          <span>#</span>
        </div>
        <div className={cn(styles['logo'])}></div>
        <div className={styles['name']}>
          <span
            onClick={() => {
              onTitleClick('name');
            }}
          >
            NAME {displaySortIcon('name')}
          </span>
        </div>
        <div className={styles['network']}>
          <span>CHAIN {displaySortIcon('network')}</span>
        </div>
        <div className={styles['price']}>
          <span
            onClick={() => {
              onTitleClick('price');
            }}
          >
            PRICE {displaySortIcon('price')}
          </span>
        </div>
        <div className={styles['change-24h']}>
          <span
            onClick={() => {
              onTitleClick('change-24h');
            }}
          >
            24H CHANGE {displaySortIcon('change-24h')}
          </span>
        </div>
        <div className={styles['marketcap']}>
          <span
            onClick={() => {
              onTitleClick('marketcap');
            }}
          >
            MARKETCAP {displaySortIcon('marketcap')}
          </span>
        </div>

        <div className={styles['launch-date']}>
          <span
            onClick={() => {
              onTitleClick('launch-date');
            }}
          >
            LAUNCH DATE {displaySortIcon('launch-date')}
          </span>
        </div>

        <div className={cn(styles['votes'], 'flx-ctr-ctr')}>
          <span
            onClick={() => {
              onTitleClick('votes');
            }}
          >
            VOTES {displaySortIcon('votes')}
          </span>
        </div>
      </div>
      <div className={styles['rows']}>
        {promoteds.map((current, index) => {
          const token = processTokenProps(current);

          if (!token) {
            return null;
          }

          if (!token.name) {
            return null;
          }

          return (
            <Anchor key={index} className={cn(styles['promoted-row'], 'flx-btw-ctr')} href={'/' + token.name.replace(/\s/g, '-')}>
              <div className={cn(styles['order'])}>#</div>
              <div className={cn(styles['logo'], 'flx-end-ctr')}>
                <Image title={token.displayName + ' Logo'} alt={token.displayName + ' Logo'} src={token.imgURL} width="45" height="45" />
              </div>
              <div className={styles['symbol-name']}>
                <div className={cn(styles['symbol'], 'flx-str-ctr')}>
                  {shortenText(token.symbol, 6)}
                  {token.verified ? <img src="/assets/images/cryptoralia-verified.png" alt="cryptoralia-verified" /> : null}
                </div>
                <div className={styles['name']}>{shortenText(token.displayName, 20)}</div>
              </div>
              <div className={cn(styles['network'])}>
                <img src={networks[token.network].img} alt={token.network.toLowerCase() + '-network'} title={token.network + ' Network'} />
                <div>{token.network}</div>
              </div>
              {token.priceUsd === null || token.priceUsd === undefined ? <div className={styles['price']}></div> : <div className={cn(styles['price'], token.priceUsd.length >= 16 ? styles['price-reduce'] : null)}>{token.priceUsd}$</div>}

              {token.change24h === null || token.change24h === undefined ? (
                <div className={cn(styles['change-24h'])}>
                  Presale <SandWatch />
                </div>
              ) : Number(token.change24h) === 0 ? (
                <div className={cn(styles['change-24h'])}>- 0.00%</div>
              ) : (
                <div className={cn(styles['change-24h'], Number(token.change24h) > 0 ? styles['gain'] : styles['loss'])}>
                  {Number(token.change24h) > 0 ? <AngleUp /> : <AngleDown />} {token.change24h}%
                </div>
              )}

              {token.marketCapUsd === null || token.marketCapUsd === undefined ? <div className={styles['marketcap']}></div> : <div className={styles['marketcap']}>{token.marketCapUsd}$</div>}
              <div className={styles['launch-date']}>{token.launchDate}</div>
              <div className={cn(styles['votes'], 'flx-ctr-ctr')}>
                <div
                  className={cn(styles['vote-btn'], tokenVotes.includes(token._id) ? styles['vote-btn-voted'] : null, 'flx-ctr-ctr', 'trnstn')}
                  onClick={(e) => {
                    e.preventDefault();

                    if (loading) {
                      return;
                    }

                    vote(token._id, true);
                  }}
                >
                  {token.votes} Votes
                </div>
              </div>
            </Anchor>
          );
        })}

        {tokens.map((current, index) => {
          const token = processTokenProps(current);

          if (!token) {
            return null;
          }

          if (!token.name) {
            return null;
          }

          return (
            <Anchor key={index} className={cn('flx-btw-ctr')} href={'/' + token.name.replace(/\s/g, '-')}>
              <div className={cn(styles['order'])}>{index + 1}</div>
              <div className={cn(styles['logo'], 'flx-end-ctr')}>
                <Image title={token.displayName + ' Logo'} alt={token.name.replace(/\s/g, '-') + '-logo'} src={token.imgURL} width="45" height="45" />
              </div>
              <div className={styles['symbol-name']}>
                <div className={cn(styles['symbol'], 'flx-str-ctr')}>
                  {shortenText(token.symbol, 6)}
                  {token.verified ? <img src="/assets/images/cryptoralia-verified.png" alt="cryptoralia-verified" /> : null}
                </div>
                <div className={styles['name']}>{shortenText(token.displayName, 20)}</div>
              </div>

              <div className={cn(styles['network'])}>
                <img src={networks[token.network].img} alt={token.network.toLowerCase() + '-network'} title={token.network + ' Network'} />

                <div>{token.network}</div>
              </div>

              {token.priceUsd === null || token.priceUsd === undefined ? <div className={styles['price']}></div> : <div className={cn(styles['price'], token.priceUsd.length >= 16 ? styles['price-reduce'] : null)}>{token.priceUsd}$</div>}

              {token.change24h === null || token.change24h === undefined ? (
                <div className={cn(styles['change-24h'])}>
                  Presale <SandWatch />
                </div>
              ) : Number(token.change24h) === 0 ? (
                <div className={cn(styles['change-24h'])}>- 0.00%</div>
              ) : (
                <div className={cn(styles['change-24h'], Number(token.change24h) > 0 ? styles['gain'] : styles['loss'])}>
                  {Number(token.change24h) > 0 ? <AngleUp /> : <AngleDown />} {token.change24h}%
                </div>
              )}

              {token.marketCapUsd === null || token.marketCapUsd === undefined ? <div className={styles['marketcap']}></div> : <div className={styles['marketcap']}>{token.marketCapUsd}$</div>}
              <div className={styles['launch-date']}>{token.launchDate}</div>
              <div className={cn(styles['votes'], 'flx-ctr-ctr')}>
                <div
                  className={cn(styles['vote-btn'], tokenVotes.includes(token._id) ? styles['vote-btn-voted'] : null, 'flx-ctr-ctr', 'trnstn')}
                  onClick={(e) => {
                    e.preventDefault();

                    if (loading) {
                      return;
                    }

                    vote(token._id);
                  }}
                >
                  {token.votes} Votes
                </div>
              </div>
            </Anchor>
          );
        })}
      </div>
    </div>
  );
}

export default Table;
