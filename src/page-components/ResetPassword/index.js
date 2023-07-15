// MODULES
import { useState, useEffect } from 'react';
import cn from 'classnames';

// CONTEXT
import { useStore } from '../../context';
import globalDispatchTypes from '../../context/global/types';

// COMPONETS
import Table from '../../components/Table';
import EmailSubscription from '../../components/EmailSubscription';

// STYLES
import styles from './ResetPassword.module.scss';

function PasswordResetPage() {
  const store = useStore();

  useEffect(() => {
    store.dispatchGlobal({
      type: globalDispatchTypes.SET_RESET_PASSWORD_MODAL,
      payload: true,
    });
  }, []);

  return (
    <>
      <section className={cn(styles['email-subscription-section'])}>
        <EmailSubscription />
      </section>
    </>
  );
}

export default PasswordResetPage;
