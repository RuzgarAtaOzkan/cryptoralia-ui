// MODULES
import { useState, useEffect } from 'react';
import cn from 'classnames';

// COMPONENTS
import Anchor from '../Anchor';
import Button from '../Button';

// ICONS
import SortIcon from '../Icons/Sort';

// UTILS
import shortenText from '../../utils/shortenText';
import sort from '../../utils/sortTable';
import displayDate from '../../utils/displayDate';

// STYLES
import styles from './AirdropsTableMobile.module.scss';

function AirdropsTableMobile({ data, title, desc = '' }) {
  const [airdrops, setAirdrops] = useState(data || []);
  const [sortedBy, setSortedBy] = useState('');

  function onTitleClick(filter) {
    let newList = [];

    if (sortedBy === filter) {
      setSortedBy(filter + '-reverse');
      newList = sort(data, filter + '-reverse');
    } else {
      setSortedBy(filter);
      newList = sort(data, filter);
    }

    setAirdrops(newList);
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

  useEffect(() => {
    if (data) {
      setAirdrops([...data]);
    }
  }, [data]);

  return (
    <div className={cn(styles['container'])}>
      <div className={cn(styles['title-area'])}>
        <div className={cn(styles['title-area-title'])} dangerouslySetInnerHTML={{ __html: title }}></div>
        <p className={cn(styles['title-area-desc'])}>{desc}</p>
      </div>

      <div className={cn(styles['tables'])}>
        <div className={cn(styles['table-left'])}>
          <div className={cn(styles['titles'], 'flx-btw-ctr')}>
            <div className={cn(styles['order'])}>
              <span>#</span>
            </div>

            <div className={styles['name']}>
              <span
                onClick={() => {
                  onTitleClick('name');
                }}
              >
                NAME {displaySortIcon('name')}
              </span>
            </div>
          </div>

          <div className={styles['rows']}>
            {airdrops.map((current, index) => {
              return (
                <Anchor key={index} className={cn('flx-btw-ctr')} href={current.link} target="_blank">
                  <div className={cn(styles['order'])}>{index + 1}</div>

                  <div className={styles['symbol-name']}>
                    <img title={current.displayName + ' Logo'} alt={current.name + '-logo'} src={current.imgURL} width="45" height="45" />
                    <div className={styles['symbol']}>{shortenText(current.symbol, 6)}</div>
                    <div className={styles['name']}>{shortenText(current.name, 20)}</div>
                  </div>
                </Anchor>
              );
            })}
          </div>
        </div>

        <div className={cn(styles['table-right-scroll'])}>
          <div className={cn(styles['table-right'])}>
            <div className={cn(styles['titles'], 'flx-btw-ctr')}>
              <div className={styles['network']}>
                <span>NETWORK {displaySortIcon('network')}</span>
              </div>

              <div className={cn(styles['reward'])}>
                <span>REWARD</span>
              </div>

              <div className={styles['end-date']}>
                <span
                  onClick={() => {
                    onTitleClick('end-date');
                  }}
                >
                  END DATE {displaySortIcon('end-date')}
                </span>
              </div>

              <div className={cn(styles['view'], 'flx-ctr-ctr')}>
                <span>VIEW {displaySortIcon('view')}</span>
              </div>

              <div className={styles['status']}>
                <span>STATUS {displaySortIcon('status')}</span>
              </div>
            </div>
            <div className={styles['rows']}>
              {airdrops.map((current, index) => {
                return (
                  <Anchor key={index} className={cn('flx-btw-ctr')} href={current.link} target="_blank">
                    <div className={cn(styles['network'])}>{current.network}</div>

                    <div className={cn(styles['reward'])}>{current.reward}</div>

                    <div className={styles['end-date']}>{current.endDate ? displayDate(current.endDate) : '-'}</div>

                    <div className={cn(styles['view'], 'flx-ctr-ctr')}>
                      <Button title="View" primary />
                    </div>

                    <div className={cn(styles['status'], new Date(current.endDate).valueOf() >= new Date().valueOf() ? styles['gain'] : styles['loss'])}>{new Date(current.endDate).valueOf() >= new Date().valueOf() ? 'Ongoing' : 'Ended'}</div>
                  </Anchor>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AirdropsTableMobile;
