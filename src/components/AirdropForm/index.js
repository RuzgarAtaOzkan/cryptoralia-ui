// MODULES
import { useState, useEffect, useRef } from 'react';
import cn from 'classnames';

// API
import Request from '../../api/request';

// CONFIG
import config from '../../config';

// CONTEXT
import { useStore } from '../../context';
import globalDispatchTypes from '../../context/global/types';

// COMPONENTS
import Dropdown from '../Dropdown';
import Checkbox from '../Checkbox';
import Anchor from '../Anchor';
import Button from '../Button';
import DateDropdowns from '../DateDropdowns';

// UTILS
import processImg from '../../utils/processImg';

// STYLES
import styles from './AirdropForm.module.scss';

function TokenForm({ onSubmit = () => {}, data = {}, setData = () => {}, loading = false, setLoading = () => {}, edit = false }) {
  const networks = Object.keys(config.networks);

  const imgRef = useRef();
  const store = useStore();

  const [network, setNetwork] = useState(edit ? data.network : networks[0]);
  const [termsAndConditions, setTermsAndConditions] = useState(false);
  const [isPresale, setIsPresale] = useState(false);
  const [imgErrMsg, setImgErrMsg] = useState('');

  const [dateData, setDateData] = useState({
    day: 1,
    month: 1,
    year: 2022,
  });

  useEffect(() => {
    setData({ ...data, network: network });
  }, [network]);

  useEffect(() => {
    if (edit) {
      if (!data.priceUsd && data.presale) {
        setIsPresale(true);
      }

      const launchDate = new Date(data.launchDate);

      setDateData({
        day: launchDate.getDate(),
        month: launchDate.getMonth() + 1,
        year: launchDate.getFullYear(),
      });
    }
  }, []);

  return (
    <div className={cn(styles['container'])}>
      <h1>Submit an airdrop for listing in Cryptoralia.com</h1>

      <h5>The submission will be checked according to the terms and conditions. After the approval, it will be listed in the recent airdrops. Earn badges to gain popularity and free promotion days.</h5>

      <div className={cn(styles['input-area'])}>
        <div className={cn(styles['label'])}>
          <label>Name*</label>
        </div>

        <input
          className={cn(styles['input'], edit ? styles['disabled'] : null)}
          type="text"
          placeholder="Airdrop Name..."
          value={edit ? data.displayName : data.name}
          onChange={(e) => {
            if (edit) {
              return;
            }

            setData({ ...data, name: e.target.value });
          }}
        />
      </div>
      <div className={cn(styles['input-area'])}>
        <div className={cn(styles['label'])}>
          <label>Symbol*</label>
        </div>

        <input
          className={cn(styles['input'], edit ? styles['disabled'] : null)}
          type="text"
          placeholder="Airdrop Symbol..."
          value={data.symbol}
          onChange={(e) => {
            if (edit) {
              return;
            }

            setData({ ...data, symbol: e.target.value });
          }}
        />
      </div>
      <div className={cn(styles['input-area'])}>
        <div className={cn(styles['label'])}>
          <label>Network</label>
        </div>
        <div className={cn(styles['dropdown-area'])}>
          <Dropdown data={networks} setValue={setNetwork} value={network} disabled={edit} />
        </div>
      </div>

      <div className={cn(styles['input-area'])}>
        <div className={cn(styles['label'])}>
          <label>Link</label>
        </div>

        <input
          className={cn(styles['input'])}
          type="text"
          placeholder="https://cryptoralia.com/airdrops/AIRDROP-TOKEN"
          value={data.link}
          onChange={(e) => {
            setData({ ...data, link: e.target.value });
          }}
        />
      </div>

      <div className={cn(styles['input-area'])}>
        <div className={cn(styles['label'])}>
          <label>Logo*</label>
        </div>

        <div className={cn(styles['img-input-container'], 'flx-ctr-ctr')}>
          {data.logoBase64 || data.imgURL || imgErrMsg ? null : <div className={cn(styles['title'])}>Drag and drop or select your image file.</div>}

          {imgErrMsg ? <div className={cn(styles['title'])}>{imgErrMsg}</div> : null}

          <input
            className={cn(styles['input'])}
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            placeholder="Token Logo..."
            onChange={(e) => {
              const file = e.target.files[0];

              processImg(file, null, imgRef, (result) => {
                if (result.includes('-error')) {
                  if (result === 'size-error') {
                    setImgErrMsg('File size cannot exceed 1mb');
                  }

                  if (result === 'type-error') {
                    setImgErrMsg('Invalid file type specified; Only jpeg, png, jpg');
                  }

                  if (result === 'dimension-error') {
                    setImgErrMsg('Width or height cannot be lower than 200px. Width and Height has to be same (Square).');
                  }

                  setData({ ...data, logoBase64: '', logoFile: {} });
                  return;
                }

                setImgErrMsg('');
                setData({
                  ...data,
                  logoBase64: result,
                  logoFile: file,
                });
              });
            }}
          />

          <img ref={imgRef} onClick={() => {}} src={data.imgURL} alt={data.name + '-logo'} className={cn(styles['img'], (data.logoBase64 || data.imgURL) && !imgErrMsg ? styles['img-active'] : null)} />
        </div>
      </div>

      <div className={cn(styles['input-area'])}>
        <div className={cn(styles['label'])}>
          <label>Reward</label>
        </div>

        <input
          className={cn(styles['input'])}
          type="text"
          placeholder="100 Token Name"
          value={data.reward}
          onChange={(e) => {
            setData({ ...data, reward: e.target.value });
          }}
        />
      </div>

      <div className={cn(styles['input-area'])}>
        <div className={cn(styles['label'], 'flx-str-ctr')}>
          <label>Airdrop End Date</label>
        </div>

        <div className={cn(styles['date-dropdowns'])}>
          <DateDropdowns data={dateData} setData={setDateData} period="future" disabled={edit} />
        </div>
      </div>

      <div className={cn(styles['submit-area'], 'flx-end-ctr')}>
        <div className={cn(styles['terms-and-conditions-area'], 'flx-end-ctr')}>
          <Checkbox value={termsAndConditions} onClick={() => setTermsAndConditions(!termsAndConditions)} />
          <div className={cn(styles['terms-and-conditions'])}>
            I agree to <Anchor href="/terms-and-conditions" content="Terms and Conditions" />
          </div>
        </div>

        <div className={cn(styles['buttons'], 'flx-ctr-ctr')}>
          <Button
            onClick={() => {
              if (!termsAndConditions) {
                store.dispatchGlobal({
                  type: globalDispatchTypes.SET_ALERT,
                  payload: {
                    message: 'You have to accept Terms and Conditions first.',
                    type: 'error',
                  },
                });

                return;
              }

              if (store.auth.authState !== 2 && config.env.NODE_ENV === 'production') {
                store.dispatchGlobal({
                  type: globalDispatchTypes.SET_LOGIN_MODAL,
                  payload: true,
                });

                return;
              }

              const year = dateData.year;
              const month = dateData.month;
              const day = dateData.day;
              const endDate = new Date(year, month - 1, day).toISOString();

              onSubmit({ endDate });
            }}
            primary
            href="#"
            disabled={loading}
            title="Submit"
          />
        </div>
      </div>
    </div>
  );
}

export default TokenForm;
