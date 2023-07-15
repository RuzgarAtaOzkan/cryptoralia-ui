import { useState, useEffect } from 'react';
import cn from 'classnames';

// CONTEXT
import { useStore } from '../../../context';
import globalDispatchTypes from '../../../context/global/types';

// COMPONENTS
import Button from '../../Button';

// ICONS
import CloseIcon from '../../Icons/Close';

// STYLES
import styles from './Payment.module.scss';

function Payment({
  active,
  metamaskAction = async () => {},
  paypalAction = async () => {},
}) {
  const store = useStore();
  const [loading, setLoading] = useState(false);

  function closeModal() {
    store.dispatchGlobal({
      type: globalDispatchTypes.SET_PAYMENT_MODAL,
      payload: false,
    });
  }

  return (
    <section
      className={cn(
        styles['container'],
        'flx-ctr-ctr',
        active ? styles['active-container'] : null
      )}
    >
      <div
        onClick={() => {
          closeModal();
        }}
        className={cn(styles['background'], 'trnstn')}
      />
      <div className={cn(styles['modal'])}>
        <div className={cn(styles['title-area'], 'flx-btw-ctr')}>
          <div className={cn(styles['title'])}>Choose Payment</div>
          <CloseIcon
            onClick={() => {
              closeModal();
            }}
          />
        </div>

        <div className={cn(styles['buttons-area'])}>
          <div className={cn(styles['button'])}>
            <img
              src="/assets/images/metamask.png"
              title="Metamask"
              alt="metamask"
            />
            <Button title="MetaMask" onClick={metamaskAction} />
          </div>

          <div className={cn(styles['button'])}>
            <img src="/assets/images/paypal.png" title="Paypal" alt="paypal" />
            <Button title="PayPal" onClick={paypalAction} />
          </div>
        </div>

        <div className={cn(styles['subtitle'])}>
          No payment information of yours is kept on our website.
        </div>
      </div>
    </section>
  );
}

export default Payment;
