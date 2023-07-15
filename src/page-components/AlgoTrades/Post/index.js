// MODULES
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import cn from 'classnames';

// CONTEXT
import { useStore } from '../../../context';
import gdt from '../../../context/global/types';

// COMPONENTS
import Button from '../../../components/Button';
import PaymentModal from '../../../components/Modals/Payment';

// UTILS
import displayDate from '../../../utils/displayDate';
import configMetamask from '../../../utils/configMetamask';

// STYLES
import styles from './Post.module.scss';

function AlgoTradePost({ data, loading }) {
  const placeholder = {
    imgURL: '',
    blurredImgURL: '',
    premium: false,
    auth: false,
    ended: false,
    currency: '',
    position: '',
    description: '',
    entry: '',
    target: '',
    stop: '',
    profitLoss: '',
  };

  const store = useStore();
  const [forbidden, setForbidden] = useState(false);
  const [algoTrade, setAlgoTrade] = useState(placeholder);

  useEffect(() => {
    if (store.auth.user.role !== 'admin' && data) {
      if (!data.ended) {
        if (data.premium && !store.auth.user.premium) {
          setAlgoTrade(placeholder);
          setForbidden(true);
          return;
        }

        if (data.auth && store.auth.state !== 2) {
          setAlgoTrade(placeholder);
          setForbidden(true);
          return;
        }
      }
    }

    setForbidden(false);
    setAlgoTrade({ ...data });
  }, [store.auth, data]);

  return loading ? (
    <div className={cn(styles['placeholder'])}>
      <div className={cn(styles['placeholder-top'])}>
        <div className={cn(styles['frame'])}>
          <div className={cn(styles['reflection'])}></div>
        </div>
      </div>

      <div className={cn(styles['placeholder-mid'], 'flx-str-ctr')}>
        <div className={cn(styles['mid-left'])}>
          <div className={cn(styles['frame'])}>
            <div className={cn(styles['reflection'])}></div>
          </div>
        </div>
        <div className={cn(styles['mid-right'], 'flx-btw-ctr')}>
          <div className={cn(styles['info'])}>
            <div className={cn(styles['frame'])}>
              <div className={cn(styles['reflection'])}></div>
            </div>
          </div>
          <div className={cn(styles['info'])}>
            <div className={cn(styles['frame'])}>
              <div className={cn(styles['reflection'])}></div>
            </div>
          </div>
          <div className={cn(styles['info'])}>
            <div className={cn(styles['frame'])}>
              <div className={cn(styles['reflection'])}></div>
            </div>
          </div>
        </div>
      </div>

      <div className={cn(styles['placeholder-bottom'], 'flx-btw-ctr')}>
        <div className={cn(styles['frame'])}>
          <div className={cn(styles['reflection'])}></div>
        </div>
      </div>
    </div>
  ) : (
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
              chainId: Web3.utils.toHex(56),
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
      />
      <div className={cn(styles['container'])}>
        {forbidden ? (
          <div className={cn(styles['premium-layout'], 'flx-ctr-ctr-clm')}>
            <img src={data.blurredImgURL} alt="algo-trade" title="Algo Trade" />

            <h3>{store.auth.state !== 2 ? 'This analysis is for Cryptoralia users only! Please login to view this analysis.' : 'Only users with Cryptoralia Premium can see this analysis. Check out Premium now and take advantage of the privileges!'}</h3>

            <div className={cn(styles['buttons'], 'flx-ctr-ctr')}>
              {store.auth.authState !== 2 ? (
                <>
                  <Button
                    title="Login"
                    onClick={() => {
                      store.dispatchGlobal({
                        type: gdt.SET_LOGIN_MODAL,
                        payload: true,
                      });
                    }}
                  />

                  <Button
                    title="Signup"
                    primary
                    onClick={() => {
                      store.dispatchGlobal({
                        type: gdt.SET_SIGNUP_MODAL,
                        payload: true,
                      });
                    }}
                  />
                </>
              ) : (
                <Button
                  title="Premium"
                  primary
                  onClick={() => {
                    store.dispatchGlobal({
                      type: gdt.SET_PAYMENT_MODAL,
                      payload: true,
                    });
                  }}
                />
              )}
            </div>
          </div>
        ) : null}

        <div className={cn(styles['top'], 'flx-ctr-ctr')}>
          {forbidden ? null : (
            <>
              <div className={cn(styles['currency'])}>{algoTrade.currency}</div>
              <div className={cn(styles['position'], algoTrade.position === 'LONG' ? styles['long'] : styles['short'])}>{algoTrade.position}</div>

              <img src={algoTrade.imgURL} alt="algo-trade" title="Algo Trade" />
            </>
          )}
        </div>

        <div className={cn(styles['mid'], 'flx-str-ctr')}>
          <div className={cn(styles['mid-left'])}>
            <div className={cn(styles['description'])}>{algoTrade.description}</div>
          </div>
          <div className={cn(styles['mid-right'], 'flx-ctr-ctr')}>
            <div className={cn(styles['info-row'], styles['first-info-row'])}>
              <div className={cn(styles['info'])}>
                <div className={cn(styles['title'])}>Entry Price</div>
                <div className={cn(styles['value'])}>{algoTrade.entry}$</div>
              </div>
              <div className={cn(styles['info'])}>
                <div className={cn(styles['title'])}>Target Price</div>
                <div className={cn(styles['value'])}>{algoTrade.target}$</div>
              </div>
            </div>

            <div className={cn(styles['info-row'])}>
              <div className={cn(styles['info'])}>
                <div className={cn(styles['title'])}>Stop Loss</div>
                <div className={cn(styles['value'])}>{algoTrade.stop}$</div>
              </div>
              <div className={cn(styles['info'])}>
                <div className={cn(styles['title'])}>Profit/Loss</div>
                <div className={cn(styles['value'], algoTrade.profitLoss > 0 ? styles['profit'] : null, algoTrade.profitLoss < 0 ? styles['loss'] : null)}>{algoTrade.profitLoss === undefined || algoTrade.profitLoss === null ? '-' : algoTrade.profitLoss + '%'}</div>
              </div>
            </div>
          </div>
        </div>

        <div className={cn(styles['bottom'], 'flx-btw-ctr')}>
          <div className={cn(styles['date'])}>
            <span>Date: </span>
            {displayDate(algoTrade.createdAt)}
          </div>
          {algoTrade.premium ? <div className={cn(styles['premium'])}>PREMIUM</div> : null}
        </div>
      </div>
    </>
  );
}

export default AlgoTradePost;
