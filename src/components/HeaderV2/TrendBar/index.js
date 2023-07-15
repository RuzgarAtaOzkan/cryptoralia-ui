// MODULES
import { useState, useEffect, useRef } from 'react';
import cn from 'classnames';

// COMPONENTS
import Anchor from '../../../components/Anchor';
import TrendIcon from '../../../components/Icons/Trend';

// STYLES
import styles from './TrendBar.module.scss';

function TrendBar({ data }) {
  const [update, setUpdate] = useState(0);
  const bar1Ref = useRef();
  const bar2Ref = useRef();

  useEffect(() => {
    if (!data.length) {
      return;
    }

    const WIDTH = window.innerWidth;
    let fromL = 1500;
    let toL = 0;
    let s = 40;

    if (WIDTH <= 1500) {
      fromL = WIDTH;
    }

    if (WIDTH <= 650) {
      s = 60;
    }

    toL = fromL - 3500;

    const animation = `@keyframes slide { from {  left: ${fromL}px; } to { left: ${toL}px; } } `;

    const style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    document.head.appendChild(style);
    style.sheet.insertRule(animation, 0);

    bar1Ref.current.style.animation = `${s}s linear 0s infinite slide`;
    bar2Ref.current.style.animation = `${s}s linear ${s / 2}s infinite slide`;

    setUpdate(update + 1);
  }, [data]);

  return (
    <div className={cn(styles['container'], 'trendbar-border', 'flx-ctr-ctr')}>
      <div className={cn(styles['title-out'], 'flx-ctr-ctr')}>
        <TrendIcon /> Trending
      </div>

      <div
        onMouseEnter={() => {
          bar1Ref.current.style.animationPlayState = 'paused';
          bar2Ref.current.style.animationPlayState = 'paused';
        }}
        onMouseLeave={() => {
          bar1Ref.current.style.animationPlayState = 'running';
          bar2Ref.current.style.animationPlayState = 'running';
        }}
        className={cn(styles['trend-bar'], 'flx-ctr-ctr')}
      >
        <div className={cn(styles['title-in'], 'flx-ctr-ctr')}>
          <TrendIcon /> Trending
        </div>

        <div ref={bar1Ref} className={cn(styles['bar'], 'flx-str-ctr')}>
          {data.map((current, index) => {
            return (
              <Anchor
                key={index}
                href={'/' + current.name.replace(/\s/g, '-')}
                target="_self"
              >
                #{index + 1} {current.displayName}
              </Anchor>
            );
          })}
        </div>

        <div ref={bar2Ref} className={cn(styles['bar'], 'flx-str-ctr')}>
          {data.map((current, index) => {
            return (
              <Anchor key={index} href={'/' + current.name} target="_self">
                #{index + 1} {current.displayName}
              </Anchor>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default TrendBar;
