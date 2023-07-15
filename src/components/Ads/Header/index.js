// MODULES
import { useEffect, useState, useRef } from 'react';
import Script from 'next/script';
import AdSense from 'react-ssr-adsense';
import cn from 'classnames';

// UTILS
import randomHeaderAds from '../../../utils/randomHeaderAds';

// STYLES
import styles from './Header.module.scss';

function HeaderAds({ data = [] }) {
  let timerId = 0;
  let mobadi = 0; // mobile ad index.

  const ads = data.filter((current) => current.section === 'header');
  const desktopAds = randomHeaderAds(ads, 'desktopURL', 2);
  const mobileAds = randomHeaderAds(ads, 'mobileURL', 3);

  const containerRef = useRef();
  const mobileAdsRef = useRef();
  const desktopAdsRef = useRef();

  const [width, setWidth] = useState(0);
  const [hidden, setHidden] = useState(false);

  function onResize() {
    if (!containerRef.current || !desktopAdsRef.current || !mobileAdsRef.current) {
      return;
    }

    const WIDTH = window.innerWidth;
    const containerEl = containerRef.current;

    if (WIDTH <= 650) {
      if (!mobileAds.length) {
        return;
      } else {
        setHidden(false);
      }

      const childrens = mobileAdsRef.current.children;
      const ad = childrens[0];

      if (!ad) {
        return;
      }

      const rect = ad.getBoundingClientRect();

      containerEl.style.width = rect.width ? rect.width + 'px' : 300 + 'px';

      clearInterval(timerId);

      timerId = setInterval(() => {
        if (mobadi >= childrens.length - 1) {
          mobadi = 0;

          containerEl.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth',
          });

          containerEl.style.width = childrens[0].getBoundingClientRect().width + 'px';

          return;
        }

        mobadi++;

        const rect = childrens[mobadi].getBoundingClientRect();

        containerEl.style.width = rect.width + 'px';
        containerEl.scrollTo({
          top: 0,
          left: containerEl.scrollLeft + rect.width,
          behavior: 'smooth',
        });
      }, 4000);
    } else {
      if (WIDTH <= 1500) {
        containerEl.style.width = '100%';
      } else {
        containerEl.style.width = '1500px';
      }

      if (desktopAds.length === 1) {
        desktopAdsRef.current.style.justifyContent = 'center';
      }

      if (!desktopAds.length) {
        //setHidden(true);
      } else {
        setHidden(false);
      }

      clearInterval(timerId);
      timerId = 0;
    }

    setWidth(WIDTH);
  }

  useEffect(() => {
    onResize();

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <section className={cn(styles['ads-header-section'], 'flx-ctr-ctr', hidden ? styles['display-none'] : null)}>
      <div ref={containerRef} className={cn(styles['container'])}>
        <div ref={desktopAdsRef} className={cn(styles['ads'], styles['desktop'])}>
          {desktopAds.map((ad, index) => {
            return (
              <a key={index} href={ad.link} target="_blank" rel="noreferrer">
                <img src={ad.desktopURL} title={ad.title} alt={ad.title.replace(/\s/g, '-').toLowerCase()} />
              </a>
            );
          })}

          {!desktopAds.length ? (
            <>
              <AdSense client="ca-pub-7884391113621264" slot="4951176839" style={{ width: 728, height: 90, float: 'center' }} format="" />
            </>
          ) : null}

          {desktopAds.length === 1 ? null : null}
        </div>

        <div ref={mobileAdsRef} className={cn(styles['ads'], styles['mobile'])}>
          {mobileAds.length ? (
            mobileAds.map((ad, index) => {
              return (
                <a key={index} href={ad.link} target="_blank" rel="noreferrer">
                  <img src={ad.mobileURL} title={ad.title} alt={ad.title.replace(/\s/g, '-').toLowerCase()} />
                </a>
              );
            })
          ) : (
            // responsive and native ads
            <AdSense client="ca-pub-7884391113621264" slot="8480192450" style={{ width: 300, height: 100, float: 'center' }} format="" />
          )}
        </div>
      </div>
    </section>
  );
}

export default HeaderAds;
