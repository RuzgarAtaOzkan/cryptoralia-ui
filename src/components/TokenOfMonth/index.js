// MODULES
import cn from 'classnames';

// ICONS
import AngleUpIcon from '../Icons/AngleUp';
import AngleDownIcon from '../Icons/AngleDown';

// COMPONENTS

import Anchor from '../Anchor';

// STYLES
import styles from './TokenOfMonth.module.scss';

function TokenOfMonth({ data }) {
  if (!data) {
    throw new Error('Too few arguments specified in TokenOfMonth');
  }

  return (
    <Anchor href="#" className={styles['container']}>
      <div className={cn(styles['token-of-month'], 'trsntn')}>
        <div className={cn(styles['top'], 'fx-btw')}>
          <span className={cn(styles['name'], 'trsntn')}>{data.name}</span>
          <span
            className={cn(
              styles['change'],
              data.change > 0 ? styles['green'] : styles['red']
            )}
          >
            {data.change > 0 ? <AngleUpIcon /> : <AngleDownIcon />}
            {data.change}%
          </span>
        </div>
        <div className={cn(styles['bottom'], 'trnstn')}>
          <span>${data.price}</span>
        </div>
      </div>
    </Anchor>
  );
}

export default TokenOfMonth;
