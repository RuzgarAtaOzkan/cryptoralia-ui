// MODULES
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import cn from 'classnames';
import Web3 from 'web3';

// CONTEXT
import { useStore } from '../../context';
import gdt from '../../context/global/types';

// CONFIG
import config from '../../config';

// COMPONENTS
import Button from '../../components/Button';
import PaymentModal from '../../components/Modals/Payment';

// UTILS
import configMetamask from '../../utils/configMetamask';
import createPremium from '../../utils/createPremium';

// STYLES
import styles from './Premium.module.scss';

function Premium({}) {
  const store = useStore();
  const router = useRouter();

  return (
    <>
      <PaymentModal
        active={store.global.modals.payment}
        metamaskAction={async () => {
          try {
            if (store.auth.state !== 2) {
              store.dispatchGlobal({
                type: gdt.SET_PAYMENT_MODAL,
                payload: false,
              });

              store.dispatchGlobal({
                type: gdt.SET_LOGIN_MODAL,
                payload: true,
              });

              return;
            }

            await configMetamask(store);

            const res = await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT');
            const bnbPrice = res.data.price + 2.0;
            const bnb = (1 / (bnbPrice / config.premium.price)).toString();
            const transactionParameters = {
              to: config.mainWallet,
              from: ethereum.selectedAddress,
              value: Web3.utils.toHex(Web3.utils.toWei(bnb, 'ether')),
              chainId: Web3.utils.toHex(97),
            };

            const txHash = await ethereum.request({
              method: 'eth_sendTransaction',
              params: [transactionParameters],
            });

            const body = {
              hash: txHash,
              payment: 'metamask',
              endDate: new Date(new Date().valueOf() + 1000 * 60 * 60 * 24 * 30).toString(),
            };

            await createPremium('', body, store);
          } catch (error) {
            store.dispatchGlobal({
              type: gdt.SET_ALERT,
              payload: {
                message: error.message,
                type: 'error',
              },
            });
          }
        }}
        paypalAction={async () => {
          if (store.auth.state !== 2) {
            store.dispatchGlobal({
              type: gdt.SET_PAYMENT_MODAL,
              payload: false,
            });

            store.dispatchGlobal({
              type: gdt.SET_LOGIN_MODAL,
              payload: true,
            });

            return;
          }

          const body = {
            payment: 'paypal',
          };

          await createPremium('', body, store);
        }}
      />

      <section className={cn(styles['premium-section'], 'flx-ctr-ctr-clm')}>
        <div className={cn(styles['container'])}>
          <div className={cn(styles['premium'], 'flx-btw-str')}>
            <div className={cn(styles['left'])}>
              <div className={cn(styles['title'])}>
                Join 200,000+ <br />
                <span className={cn(styles['title-premium'])}>Premium</span> <br />
              </div>

              <div className={cn(styles['subtitle'])}>
                Get unlimited access to all Premium <br />
                articles and news as well <br />
                as our exclusive stock ratings
                <br />
                <br />
                In fact, our <span>Strong Buy</span> stocks <br />
                are beating the market by more than texxxx.
              </div>

              <div className={cn(styles['offer-text'], 'flx-str-ctr')}>
                <img src="/assets/images/star.png" alt="premium-star" title="Premium Star" /> Special Offer: <span> Only $19.90 </span>
              </div>

              <div className={cn(styles['button'])}>
                <Button
                  title="TRY PREMIUM NOW"
                  primary
                  onClick={() => {
                    store.dispatchGlobal({
                      type: gdt.SET_PAYMENT_MODAL,
                      payload: true,
                    });
                  }}
                />
              </div>

              <div className={cn(styles['description'])}>Tired of hearing about stocks that already made investors a lot of money? Our Stock Screener picks top value stocks with strong long-term growth potential.</div>
            </div>
            <div className={cn(styles['right'])}>
              <img src="/assets/images/cryptoralia-premium-algo-trade.png" />
            </div>
          </div>

          <div className={cn(styles['features'])}>
            <h3 className={cn(styles['features-title'])}>Invest in your financial future today</h3>

            <div className={cn(styles['features-subtitle'])}>Market-beating stocks. Powerful real-time signals and stock news.</div>

            <div className={cn(styles['feature-boxes'], 'flx-ctr-ctr')}>
              <div className={cn(styles['feature'])}>
                <div className={cn(styles['box-title'])}>Powerful screeners</div>
                <div className={cn(styles['box-subtitle'])}>Use our cutting-edge stock screeners to discover hidden gems.</div>
              </div>
              <div className={cn(styles['feature'])}>
                <div className={cn(styles['box-title'])}>Powerful screeners</div>
                <div className={cn(styles['box-subtitle'])}>Use our cutting-edge stock screeners to discover hidden gems.</div>
              </div>
              <div className={cn(styles['feature'])}>
                <div className={cn(styles['box-title'])}>Powerful screeners</div>
                <div className={cn(styles['box-subtitle'])}>Use our cutting-edge stock screeners to discover hidden gems.</div>
              </div>
              <div className={cn(styles['feature'])}>
                <div className={cn(styles['box-title'])}>Powerful screeners</div>
                <div className={cn(styles['box-subtitle'])}>Use our cutting-edge stock screeners to discover hidden gems.</div>
              </div>
              <div className={cn(styles['feature'])}>
                <div className={cn(styles['box-title'])}>Powerful screeners</div>
                <div className={cn(styles['box-subtitle'])}>Use our cutting-edge stock screeners to discover hidden gems.</div>
              </div>
              <div className={cn(styles['feature'])}>
                <div className={cn(styles['box-title'])}>Powerful screeners</div>
                <div className={cn(styles['box-subtitle'])}>Use our cutting-edge stock screeners to discover hidden gems.</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Premium;
