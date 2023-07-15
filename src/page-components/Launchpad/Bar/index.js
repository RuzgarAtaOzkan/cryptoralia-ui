// MODULES
import React, { useState, useEffect, useRef } from 'react';
import cn from 'classnames';

// COMPONENTS
import Anchor from '../../../components/Anchor';

// ICONS
import TwitterIcon from '../../../components/Icons/Twitter';
import TelegramIcon from '../../../components/Icons/Telegram';
import EarthIcon from '../../../components/Icons/Earth';
import DiscordIcon from '../../../components/Icons/Discord';
import RedditIcon from '../../../components/Icons/Reddit';
import GithubIcon from '../../../components/Icons/Github';

// UTILS
import displayNetworkImg from '../../../utils/displayNetworkImg';

// STYLES
import styles from './Bar.module.scss';

function Bar({ data }) {
  const progressRef = useRef();
  const [remainigTime, setRemainingTime] = useState(
    new Date(data.endDate).valueOf() - new Date().valueOf()
  );
  const [update, setUpdate] = useState(0);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Update update var with settimeout at every re render
  useEffect(() => {
    setTimeout(() => {
      setUpdate(update + 1);
    }, 1000);

    setRemainingTime(new Date(data.endDate).valueOf() - new Date().valueOf());

    const oneDay = 1000 * 60 * 60 * 24;
    const oneHour = 1000 * 60 * 60;
    const oneMinute = 1000 * 60;
    const oneSecond = 1000;

    let seconds = remainigTime / 1000;
    let minutes = seconds / 60;
    let hours = minutes / 60;
    let days = hours / 24;

    let daysf = days % 1;
    let hoursf = hours % 1;
    let minutesf = minutes % 1;

    const remainingDays = Math.floor(days);
    const remainingHours = Math.floor((daysf * oneDay) / oneHour);
    const remainingMinutes = Math.floor((hoursf * oneHour) / oneMinute);
    const remainingSeconds = Math.floor((minutesf * oneMinute) / oneSecond);

    if (
      remainingDays <= 0 &&
      remainingHours <= 0 &&
      remainingMinutes <= 0 &&
      remainingSeconds <= 0
    ) {
      setCountdown({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      });
      return;
    }

    setCountdown({
      days: remainingDays,
      hours: remainingHours,
      minutes: remainingMinutes,
      seconds: remainingSeconds,
    });
  }, [update]);

  return (
    <>
      <div className={cn(styles['container'])}>
        <div className={cn(styles['top'], 'flx-btw-ctr')}>
          <div className={cn(styles['top-left'], 'flx-ctr-str')}>
            <img
              src={data.imgURL}
              alt={data.name.replace(/\s/g, '-')}
              title={data.displayName}
            />

            <div className={cn(styles['name-price'], 'flx-btw-str-clm')}>
              <div className={cn(styles['name-symbol-network'], 'flx-ctr-ctr')}>
                <div className={cn(styles['name'])}>{data.displayName}</div>

                <div className={cn(styles['symbol-network'], 'flx-str-ctr')}>
                  <div className={cn(styles['symbol'])}>({data.symbol})</div>
                  <div className={cn(styles['network'])}>
                    {displayNetworkImg(data.network)}
                  </div>
                </div>
              </div>
              <div className={cn(styles['price'])}>
                PRICE = {data.priceUsd} $
              </div>
            </div>
          </div>

          <div className={cn(styles['top-right'], 'flx-btw-str-clm')}>
            <div className={cn(styles['end-date-title'])}>SALE END IN</div>

            <div className={cn(styles['end-date'], 'flx-str-ctr')}>
              <div className={cn(styles['days'])}>
                <div>
                  {countdown.days < 10 ? '0' + countdown.days : countdown.days}
                </div>
                <span>d</span>
              </div>
              <div className={cn(styles['hours'])}>
                <div>
                  {countdown.hours < 10
                    ? '0' + countdown.hours
                    : countdown.hours}
                </div>
                <span>h</span>
              </div>
              <div className={cn(styles['minutes'])}>
                <div>
                  {countdown.minutes < 10
                    ? '0' + countdown.minutes
                    : countdown.minutes}
                </div>
                <span>m</span>
              </div>
              <div className={cn(styles['seconds'])}>
                <div>
                  {countdown.seconds < 10
                    ? '0' + countdown.seconds
                    : countdown.seconds}
                </div>
                <span>s</span>
              </div>
            </div>
          </div>
        </div>
        <div className={cn(styles['mid'])}>
          <div className={cn(styles['mid-top'], 'flx-btw-ctr')}>
            <div className={cn(styles['total-raised'])}>
              <span>Total Raise</span> 9.33 BNB (37%)
            </div>

            <div className={cn(styles['target'])}>
              <span>Target</span> 300 BNB
            </div>
          </div>

          <div className={cn(styles['mid-bottom'])}>
            <div className={cn(styles['bar'])}>
              <div ref={progressRef} className={cn(styles['progress'])}>
                <div
                  className={cn(
                    styles['reflection'],
                    update % 3 === 2 ? styles['reflection-active'] : null
                  )}
                />
              </div>
            </div>
          </div>
        </div>
        <div className={cn(styles['bottom'], 'flx-end-ctr')}>
          {data.website ? (
            <Anchor target="_blank" href={data.website}>
              <EarthIcon />
            </Anchor>
          ) : null}

          {data.twitter ? (
            <Anchor target="_blank" href={data.twitter}>
              <TwitterIcon />
            </Anchor>
          ) : null}

          {data.telegram ? (
            <Anchor target="_blank" href={data.telegram}>
              <TelegramIcon />
            </Anchor>
          ) : null}

          {data.discord ? (
            <Anchor target="_blank" href={data.discord}>
              <DiscordIcon />
            </Anchor>
          ) : null}

          {data.reddit ? (
            <Anchor target="_blank" href={data.reddit}>
              <RedditIcon />
            </Anchor>
          ) : null}

          {data.github ? (
            <Anchor target="_blank" href={data.github}>
              <GithubIcon />
            </Anchor>
          ) : null}

          <Anchor
            rel="nofollow"
            href={'https://bscscan.com/token/' + data.address}
            target="_blank"
            className={cn(styles['social'], 'flx-str-ctr')}
          >
            <img
              src="/assets/icons/bscscan.png"
              alt="bscscan-icon"
              title="Bscscan Icon"
            />
          </Anchor>
        </div>
      </div>
    </>
  );
}

export default Bar;
