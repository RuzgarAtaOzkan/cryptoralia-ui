// MODULES
import { useState, useEffect } from 'react';
import cn from 'classnames';

// CONFIG
import config from '../../config';

// CONTEXT
import { useStore } from '../../context';

// COMPONENTS
import Anchor from '../Anchor';

// ICONS
import SortIcon from '../Icons/Sort';

// UTILS
import shortenText from '../../utils/shortenText';
import processTokenProps from '../../utils/processTokenProps';
import voteToken from '../../utils/voteToken';

import sort from '../../utils/sortTable';

// STYLES
import styles from './PresaleTable.module.scss';

function PresaleTable({ data, promotedTokens = [], title = 'Presale Tokens', desc = '', votes = '' }) {
  const updated_tokens = [];
  if (data) {
    for (let i = 0; i < data.length; i++) {
      let exists = false;

      for (let j = 0; j < promotedTokens.length; j++) {
        if (promotedTokens[j]._id === data[i]._id) {
          exists = true;
        }
      }

      if (!exists) {
        updated_tokens.push(data[i]);
      }
    }
  }

  const store = useStore();

  const networks = config.networks;
  const [loading, setLoading] = useState(false);
  const [tokens, setTokens] = useState(updated_tokens || []);
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

  async function vote(tokenId) {
    if (!tokenId) {
      return null;
    }

    setLoading(true);

    const response = await voteToken(tokenId, store);

    setLoading(false);

    if (response) {
      setTokenVotes(tokenVotes + '_' + tokenId);

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

  return (
    <>
      <div className={cn(styles['container'], 'trnstn')}>
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

          <div className={styles['launch-date']}>
            <span
              onClick={() => {
                onTitleClick('launch-date');
              }}
            >
              LAUNCH DATE {displaySortIcon('launch-date')}
            </span>
          </div>

          <div className={cn(styles['audit'], 'flx-ctr-ctr')}>
            <span>AUDIT</span>
          </div>

          <div className={cn(styles['kyc'], 'flx-ctr-ctr')}>
            <span>KYC</span>
          </div>

          <div className={cn(styles['presale'], 'flx-ctr-ctr')}>
            <span>PRESALE</span>
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
          {promotedTokens.map((current, index) => {
            const token = processTokenProps(current);

            if (!token) {
              return null;
            }

            if (!token.name) {
              return null;
            }

            return (
              <div key={index} className={cn(styles['row'], 'flx-btw-ctr', styles['promoted-row'])}>
                <div className={cn(styles['order'])}>#</div>
                <div className={cn(styles['logo'], 'flx-end-ctr')}>
                  <Anchor href={'/' + token.name.replace(/\s/g, '-')}>
                    <img title={token.displayName + ' Logo'} alt={token.displayName + ' Logo'} src={token.imgURL} width="45" height="45" />
                  </Anchor>
                </div>
                <Anchor href={'/' + token.name.replace(/\s/g, '-')} className={styles['symbol-name']}>
                  <div className={cn(styles['symbol'], 'flx-str-ctr')}>
                    {shortenText(token.symbol, 6)}
                    {token.verified ? <img src="/assets/images/cryptoralia-verified.png" alt="cryptoralia-verified" /> : null}
                  </div>
                  <div className={styles['name']}>{shortenText(token.displayName, 20)}</div>
                </Anchor>
                <div className={cn(styles['network'])}>
                  <img alt={token.network.toLowerCase() + '-network'} title={token.network + ' Network'} src={networks[token.network].img} />
                  <div>{token.network}</div>
                </div>

                <div className={styles['launch-date']}>{token.launchDate}</div>

                <div className={cn(styles['audit'], 'flx-ctr-ctr')}>
                  {!token.audit ? (
                    '-'
                  ) : (
                    <Anchor href={token.audit} target="_blank">
                      Audit
                    </Anchor>
                  )}
                </div>

                <div className={cn(styles['kyc'], 'flx-ctr-ctr')}>
                  {!token.kyc ? (
                    '-'
                  ) : (
                    <Anchor href={token.kyc} target="_blank">
                      KYC
                    </Anchor>
                  )}
                </div>

                <div className={cn(styles['presale'], 'flx-ctr-ctr')}>
                  {!token.presale ? (
                    '-'
                  ) : (
                    <Anchor href={token.presale} target="_blank">
                      Presale
                    </Anchor>
                  )}
                </div>
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
              </div>
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
              <div key={index} className={cn(styles['row'], 'flx-btw-ctr')}>
                <div className={cn(styles['order'])}>{index + 1}</div>
                <div className={cn(styles['logo'], 'flx-end-ctr')}>
                  <Anchor href={'/' + token.name.replace(/\s/g, '-')}>
                    <img title={token.displayName + ' Logo'} alt={token.displayName + ' Logo'} src={token.imgURL} width="45" height="45" />
                  </Anchor>
                </div>
                <Anchor href={'/' + token.name.replace(/\s/g, '-')} className={styles['symbol-name']}>
                  <div className={cn(styles['symbol'], 'flx-str-ctr')}>
                    {shortenText(token.symbol, 6)}
                    {token.verified ? <img src="/assets/images/cryptoralia-verified.png" alt="cryptoralia-verified" /> : null}
                  </div>
                  <div className={styles['name']}>{shortenText(token.displayName, 20)}</div>
                </Anchor>
                <div className={cn(styles['network'])}>
                  <img alt={token.network.toLowerCase() + '-network'} title={token.network + ' Network'} src={networks[token.network].img} />
                  <div>{token.network}</div>
                </div>

                <div className={styles['launch-date']}>{token.launchDate}</div>

                <div className={cn(styles['audit'], 'flx-ctr-ctr')}>
                  {!token.audit ? (
                    '-'
                  ) : (
                    <Anchor href={token.audit} target="_blank">
                      Audit
                    </Anchor>
                  )}
                </div>

                <div className={cn(styles['kyc'], 'flx-ctr-ctr')}>
                  {!token.kyc ? (
                    '-'
                  ) : (
                    <Anchor href={token.kyc} target="_blank">
                      KYC
                    </Anchor>
                  )}
                </div>

                <div className={cn(styles['presale'], 'flx-ctr-ctr')}>
                  {!token.presale ? (
                    '-'
                  ) : (
                    <Anchor href={token.presale} target="_blank">
                      Presale
                    </Anchor>
                  )}
                </div>
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
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default PresaleTable;
