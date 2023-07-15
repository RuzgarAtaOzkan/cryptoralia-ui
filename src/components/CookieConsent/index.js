// MODULES
import { useState, useEffect } from 'react';
import cn from 'classnames';

// CONTEXT
import { useStore } from '../../context';
import gdt from '../../context/global/types';

// COMPONENTS
import Button from '../Button';

// ICONS
import CookieIcon from '../Icons/Cookie';

// STYLES
import styles from './CookieConsent.module.scss';

function CookieConsent() {
  const store = useStore();
  const open = store.global.ccOpen;

  return (
    <section
      className={cn(
        styles['cookie-consent-section'],
        open ? styles['cookie-consent-section-active'] : null
      )}
    >
      <div className={cn(styles['container'])}>
        <div className={cn(styles['description'])}>
          This website uses cookies to ensure you get the best experience on our
          website.
        </div>

        <div className={cn(styles['buttons'], 'flx-str-ctr')}>
          <Button
            title="Accept"
            icon={<CookieIcon />}
            className={cn(styles['accept-btn'])}
            primary
            onClick={() => {
              store.dispatchGlobal({
                type: gdt.SET_CCOPEN,
                payload: false,
              });

              // 2 means user accepted the cookie consent
              window.localStorage.setItem('cc', '2');
            }}
          />
          <Button
            title="reject"
            className={cn(styles['reject-btn'])}
            onClick={() => {
              store.dispatchGlobal({
                type: gdt.SET_CCOPEN,
                payload: false,
              });

              // 2 means user accepted the cookie consent
              window.localStorage.setItem('cc', '1');
            }}
          />
        </div>
      </div>
    </section>
  );
}

export default CookieConsent;
