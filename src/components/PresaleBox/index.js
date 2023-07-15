// MODULES
import { useState, useEffect, useRef } from 'react';
import cn from 'classnames';

// COMPONENTS
import Anchor from '../Anchor';

// ICONS
import TwitterIcon from '../Icons/Twitter';
import TelegramIcon from '../Icons/Telegram';
import EarthIcon from '../Icons/Earth';

// UTILS
import addDots from '../../utils/addDots';
import preventDefault from '../../utils/preventDefault';

// STYLES
import styles from './PresaleBox.module.scss';

function PresaleBox({ data }) {
  if (!data) {
    throw new Error('Too few arguments specified in Table.js');
  }

  const { name, symbol, popularity, launchpad, launchDate } = data;

  return (
    <>
      <div className={cn(styles['container'])}>
        <div className={cn(styles['top'], 'flx-btw-ctr')}>
          <div className={cn(styles['left'], 'flx-ctr-ctr')}>
            <img alt="Token Symbol" src="/assets/images/ruberium192.png" />

            <div className={cn(styles['title-area'])}>
              <h3>{name}</h3>
              <div className={cn(styles['symbol'])}>${symbol}</div>
            </div>
          </div>

          <div className={cn(styles['right'])}>
            <div className={cn(styles['title'])}>Popularity</div>
            <div className={cn(styles['value'])}>{popularity}</div>
          </div>
        </div>
        <div className={cn(styles['mid'])}>
          <div className={cn(styles['launchpad'], 'flx-str-ctr')}>
            <div className={cn(styles['title'])}>Launchpad: </div>
            <div className={cn(styles['value'])}>{launchpad}</div>
          </div>
          <div className={cn(styles['launch-date'], 'flx-str-ctr')}>
            <div className={cn(styles['title'])}>Launching on: </div>
            <div className={cn(styles['value'])}>{launchDate}</div>
          </div>
        </div>
        <div className={cn(styles['bottom'], 'flx-btw-ctr')}>
          <div className={cn(styles['left'])}>
            <div className={cn(styles['socials'])}>
              <TwitterIcon />
              <TelegramIcon />
              <EarthIcon />
            </div>
          </div>

          <div className={cn(styles['right'])}>
            <div className={cn(styles['view'])}>VIEW</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PresaleBox;
