// MODULES
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import cn from 'classnames';

// CONTEXT
import { useStore } from '../../context';

// PAGE COMPONENTS
import Page404 from '../404';

// COMPONENTS
import TokenForm from '../../components/TokenForm';

// UTILS
import editToken from '../../utils/editToken';

// STYLES
import styles from './EditToken.module.scss';

function EditTokenPage({ data }) {
  const store = useStore();
  const router = useRouter();

  const [token, setToken] = useState({
    logoBase64: '',
    logoFile: {},
    ...data,
  });

  useEffect(() => {
    if (!router || !store || !data) {
      return;
    }

    if (!store.auth.user._id) {
      return;
    }

    if (data.ownerId !== store.auth.user._id) {
      return router.push('/');
    }
  }, [router, store]);

  const [loading, setLoading] = useState(false);

  return (
    <>
      {data ? (
        <section className={cn(styles['form-section'], 'flx-ctr-ctr')}>
          <div className={cn(styles['form-area'])}>
            <TokenForm
              onSubmit={async () => {
                setLoading(true);
                const editData = {
                  logoBase64: token.logoBase64,
                  description: token.description,
                  audit: token.audit,
                  kyc: token.kyc,
                  presale: token.presale,
                  website: token.website,
                  telegram: token.telegram,
                  twitter: token.twitter,
                  discord: token.discord,
                  github: token.github,
                  reddit: token.reddit,
                };

                const payload = { ...token, editData };
                const response = await editToken(payload, store);
                setLoading(false);
                return response;
              }}
              data={token}
              setData={setToken}
              loading={loading}
              edit
            />
          </div>
        </section>
      ) : (
        <Page404 />
      )}
    </>
  );
}

export default EditTokenPage;
