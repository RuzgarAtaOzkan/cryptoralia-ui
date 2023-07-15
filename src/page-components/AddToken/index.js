// MODULES
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import cn from 'classnames';

// API
import Request from '../../api/request';

// CONFIG
import config from '../../config';

// CONTEXT
import { useStore } from '../../context';
import globalDispatchTypes from '../../context/global/types';

// COMPONENTS

import TokenForm from '../../components/TokenForm';

// STYLES
import styles from './AddToken.module.scss';

function AddTokenPage() {
  const placeholder = {
    name: '',
    symbol: '',
    logoBase64: '',
    logoFile: {},
    network: 'BSC',
    address: '',
    description: '',
    audit: '',
    kyc: '',
    launchDate: '',
    presale: '',
    website: '',
    github: '',
    telegram: '',
    twitter: '',
    discord: '',
    reddit: '',
  };
  const store = useStore();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(placeholder);

  function clearData() {
    setData(placeholder);
  }

  async function createToken(body) {
    if (!body) {
      throw new Error('Too few arguments specified in createToken');
    }

    const domain = config.api.domain;
    const apiVersion = config.api.version;

    setLoading(true);

    try {
      const response = await Request.post({
        baseURL: domain,
        endpoint: '/v' + apiVersion + '/tokens',
        body,
      });

      setLoading(false);

      store.dispatchGlobal({
        type: globalDispatchTypes.SET_ALERT,
        payload: {
          message: 'Successfully submited token for listing.',
          type: 'success',
        },
      });

      clearData();

      setTimeout(() => {
        router.push('/my-tokens');
      }, 1500);

      return response;
    } catch (error) {
      setLoading(false);

      if (error.response) {
        if (error.response.data) {
          const errors = error.response.data;

          for (let i = 0; i < errors.length; i++) {
            const title = errors[i].description;

            store.dispatchGlobal({
              type: globalDispatchTypes.SET_ALERT,
              payload: {
                message: title,
                type: 'error',
              },
            });
          }
        }
      } else {
        store.dispatchGlobal({
          type: globalDispatchTypes.SET_ALERT,
          payload: {
            message: 'Something went wrong',
            type: 'error',
          },
        });
      }
    }
  }

  useEffect(() => {
    const exists = document.getElementById('hcaptcha-script');

    if (exists) {
      return;
    }

    const script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('id', 'hcaptcha-script');
    script.setAttribute('src', 'https://js.hcaptcha.com/1/api.js');
    document.body.appendChild(script);
  }, []);

  return (
    <>
      <section className={cn(styles['form-section'], 'flx-ctr-ctr')}>
        <div className={cn(styles['form-area'])}>
          <TokenForm
            onSubmit={(onSubmitData) => {
              const launchDate = onSubmitData.launchDate;
              const captchaToken = onSubmitData.captchaToken;
              const createTokenData = data;

              createTokenData.launchDate = launchDate;
              createTokenData.captchaToken = captchaToken;

              createToken(createTokenData);
            }}
            data={data}
            setData={setData}
            loading={loading}
            setLoading={setLoading}
          />
        </div>
      </section>
    </>
  );
}

export default AddTokenPage;
