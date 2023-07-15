// MODULES
import React, { useState, useEffect, useRef } from 'react';
import cn from 'classnames';

// ICONS
import CopyIcon from '../../../components/Icons/Copy';

// UTILS
import shortenText from '../../../utils/shortenText';
import copy from '../../../utils/copy';

// STYLES
import styles from './InfoBox.module.scss';

function displayValue(items, key, copying) {
  if (key === 'Address' && copying) {
    return 'Copied';
  }

  if (key === 'Address') {
    return shortenText(items[key], 10);
  }

  return items[key];
}

function InfoBox({ title, items }) {
  const [copying, setCopying] = useState(false);
  const keys = Object.keys(items);
  const address = items.Address;

  return (
    <div className={cn(styles['container'])}>
      <h3 className={cn(styles['title'])}>{title}</h3>
      <div className={cn(styles['items'])}>
        {keys.map((current, index) => {
          return (
            <div key={index} className={cn(styles['item'], 'flx-btw-ctr')}>
              <div className={cn(styles['key'])}>{current}</div>
              <div className={cn(styles['value'], 'flx-ctr-ctr')}>
                {current === 'Address' ? (
                  <CopyIcon
                    onClick={async () => {
                      setCopying(true);
                      copy(items[current]);

                      setTimeout(() => {
                        setCopying(false);
                      }, 1000);
                    }}
                  />
                ) : null}

                {displayValue(items, current, copying)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default InfoBox;
