// MODULES
import { useState, useEffect } from 'react';
import cn from 'classnames';

// COMPONENTS
import Anchor from '../Anchor';

// ICONS
import SearchIcon from '../Icons/Search';
import LoadingCircleIcon from '../Icons/LoadingCircle';

// UTILS
import getTokens from '../../utils/getTokens';

// STYLES
import styles from './Search.module.scss';

function Search() {
  const [value, setValue] = useState('');
  const [timerId, setTimerId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  async function search(value = '') {
    setLoading(true);

    try {
      const response = await getTokens(
        '?name=' +
          value +
          '&status=2&limit=20&promoted=0gainer=0&recent=0&trending=0&presale=0'
      );
      setResults(response.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  }

  function displayChange24h(change24h) {
    if (change24h === undefined || change24h === null) {
      return <div className={cn(styles['grey'])}>-</div>;
    }

    if (Number(change24h) === 0) {
      <div className={cn(styles['grey'])}>0.00%</div>;
    }

    return (
      <div
        className={cn(Number(change24h) > 0 ? styles['green'] : styles['red'])}
      >
        {Number(change24h)}%
      </div>
    );
  }

  return (
    <div className={cn(styles['container'], 'flx-str-ctr')}>
      <div
        className={cn(
          styles['results'],
          results.length ? styles['results-active'] : null
        )}
      >
        {results.map((current, index) => {
          return (
            <Anchor
              href={'/' + current.name.replace(/\s/g, '-')}
              key={index}
              className={cn(styles['result'], 'flx-btw-ctr')}
            >
              <div className={cn(styles['result-left'], 'flx-ctr-ctr')}>
                <img
                  src={current.imgURL}
                  alt={current.displayName + ' Token'}
                />
                <div className={cn(styles['name-symbol'])}>
                  <div className={cn(styles['symbol'])}>{current.symbol}</div>
                  <div className={cn(styles['name'])}>
                    {current.displayName}
                  </div>
                </div>
              </div>
              <div className={cn(styles['result-right'])}>
                <div className={cn(styles['change24h'])}>
                  {displayChange24h(current.change24h)}
                </div>
              </div>
            </Anchor>
          );
        })}
      </div>
      <div className={cn(styles['left'], 'flx-ctr-ctr')}>
        {loading ? (
          <LoadingCircleIcon className={cn(styles['spin'])} />
        ) : (
          <SearchIcon />
        )}
      </div>
      <div className={styles['right']}>
        <input
          placeholder="Search Coin, Symbol..."
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            clearTimeout(timerId);

            const id = setTimeout(() => {
              let isSearchable = false;
              for (let i = 0; i < e.target.value.length; i++) {
                if (e.target.value[i] !== ' ') {
                  isSearchable = true;
                }
              }

              if (isSearchable) {
                search(e.target.value);
              } else {
                setResults([]);
              }
            }, 300);

            setTimerId(id);
          }}
        />
      </div>
    </div>
  );
}

export default Search;
