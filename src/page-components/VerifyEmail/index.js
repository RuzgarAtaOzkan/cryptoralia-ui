// MODULES
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import cn from 'classnames';

// CONTEXT
import { useStore } from '../../context';

// COMPONETS
import EmailSubscription from '../../components/EmailSubscription';

// UTILS
import verifyEmail from '../../utils/verifyEmail';

// STYLES
import styles from './VerifyEmail.module.scss';

function HomePage({}) {
  const router = useRouter();
  const store = useStore();

  const [loading, setLoading] = useState(false);

  async function redirect() {
    if (!router) {
      return null;
    }

    const token = router.query.token;
    await verifyEmail(token, store, setLoading);

    setTimeout(() => {
      router.push('/');
    }, 700);
  }

  useEffect(() => {
    redirect();
  }, [router]);

  return (
    <>
      <section className={cn(styles['title-section'], 'flx-str-ctr')}>
        <h1>Cryptoralia</h1>
      </section>

      <section className={cn(styles['email-subscription-section'])}>
        <EmailSubscription />
      </section>
    </>
  );
}

export default HomePage;
