// MODULES
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import cn from 'classnames';

// API
import reqInstance from '../../api/instance';

// CONFIG
import config from '../../config';

// CONTEXT
import { useStore } from '../../context';
import globalDispatchTypes from '../../context/global/types';

// COMPONENTS
import AirdropForm from '../../components/AirdropForm';

// STYLES
import styles from './AddAirdrop.module.scss';

function AddAirdropPage() {
  const store = useStore();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: '',
    symbol: '',
    logoBase64: '',
    logoFile: {},
    network: 'BSC',
    reward: '',
    link: '',
    endDate: '',
  });

  function clearData() {
    setData({
      name: '',
      symbol: '',
      logoBase64: '',
      logoFile: {},
      network: 'BSC',
      reward: '',
      link: '',
      endDate: '',
    });
  }

  async function createAirdrop(body) {
    if (!body) {
      throw new Error('Too few arguments specified in createToken');
    }

    const domain = config.api.domain;
    const apiVersion = config.api.version;
    const url = domain + '/v' + apiVersion + '/airdrops';

    setLoading(true);

    try {
      const response = await reqInstance.post(url, body);

      setLoading(false);

      store.dispatchGlobal({
        type: globalDispatchTypes.SET_ALERT,
        payload: {
          message: 'Successfully submited airdrop for listing.',
          type: 'success',
        },
      });

      clearData();

      setTimeout(() => {
        router.push('/my-airdrops');
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

  return (
    <>
      <section className={cn(styles['form-section'], 'flx-ctr-ctr')}>
        <div className={cn(styles['form-area'])}>
          <AirdropForm
            onSubmit={(onSubmitData) => {
              if (!onSubmitData) {
                createAirdrop(data);
                return;
              }

              if (onSubmitData.endDate) {
                const endDate = onSubmitData.endDate;
                createAirdrop({ ...data, endDate });
                return;
              }
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

export default AddAirdropPage;
