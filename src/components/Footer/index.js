// MODULES
import { useState, useEffect, useContext } from 'react';
import cn from 'classnames';

// COMPONENTS
import Anchor from '../Anchor';

// STYLES
import styles from './Footer.module.scss';

function Footer() {
  return (
    <footer id={styles['footer']} className="fx-ctr trnstn">
      <div className={cn(styles['content'], 'trnstn')}>
        <div className={cn(styles['top'], 'flx-btw-ctr', 'trnstn')}>
          <div className={cn(styles['left'], 'trnstn')}>
            <Anchor href="/">
              <img width="250" alt="cryptoralia" src="/assets/images/logo.png" />
            </Anchor>
          </div>

          <div className={cn(styles['right'], 'flx-ctr-ctr', 'trnstn')}>
            <div className={styles['list']}>
              <h5>Quick Access</h5>
              <div className={cn(styles['items'])}>
                <Anchor href="/new" className={cn(styles['item'])}>
                  New Listings
                </Anchor>

                <Anchor href="/presales" className={cn(styles['item'])}>
                  Presale Tokens
                </Anchor>

                <Anchor href="/airdrops" className={cn(styles['item'])}>
                  Crypto Airdrops
                </Anchor>

                <Anchor href="/algo-trade" className={cn(styles['item'])}>
                  Algo Trade
                </Anchor>

                <Anchor href="/guide" className={cn(styles['item'])}>
                  Guide
                </Anchor>
              </div>
            </div>
            <div className={styles['list']}>
              <h5>Cryptoralia</h5>
              <div className={cn(styles['items'])}>
                <Anchor href="/add-token" className={cn(styles['item'])}>
                  Add Token
                </Anchor>

                <Anchor href="/promote" className={cn(styles['item'])}>
                  Promote
                </Anchor>

                <Anchor href="/" className={cn(styles['item'])}>
                  Cookie Policy
                </Anchor>

                <Anchor href="/terms-and-conditions" className={cn(styles['item'])}>
                  Terms & Conditions
                </Anchor>

                <Anchor href="/privacy-policy" className={cn(styles['item'])}>
                  Privacy Policy
                </Anchor>
              </div>
            </div>
            <div className={styles['list']}>
              <h5>Socials</h5>
              <div className={cn(styles['items'])}>
                <Anchor target="_blank" href="https://twitter.com/cryptoralia" className={cn(styles['item'])}>
                  Twitter
                </Anchor>

                <Anchor target="_blank" href="https://instagram.com/cryptoralia" className={cn(styles['item'])}>
                  Instagram
                </Anchor>

                <Anchor target="_blank" href="https://facebook.com/cryptoralia" className={cn(styles['item'])}>
                  Facebook
                </Anchor>

                <Anchor target="_blank" href="https://t.me/cryptoralia" className={cn(styles['item'])}>
                  Telegram
                </Anchor>

                <Anchor target="_blank" href="https://github.com/cryptoralia" className={cn(styles['item'])}>
                  Github
                </Anchor>
              </div>
            </div>
          </div>
        </div>

        <div className={cn(styles['bottom'], 'fx-ctr', 'trnstn')}>
          <div className={cn(styles['left'], 'trnstn')}>© {new Date().getFullYear()} Cryptoralia.com | All rights reserved.</div>
          <div className={cn(styles['right'], 'trnstn')}></div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
