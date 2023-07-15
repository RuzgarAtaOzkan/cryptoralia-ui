// MODULES
import { useState, useEffect, useRef } from 'react';
import cn from 'classnames';

// CONFIG
import config from '../../config';

// CONTEXT
import { useStore } from '../../context';
import gdt from '../../context/global/types';

// COMPONENTS
import Dropdown from '../Dropdown';
import Checkbox from '../Checkbox';
import Anchor from '../Anchor';
import Button from '../Button';
import DateDropdowns from '../DateDropdowns';

// UTILS
import processImg from '../../utils/processImg';

// STYLES
import styles from './TokenForm.module.scss';

function TokenForm({ title = 'Submit a token for listing in Cryptoralia.com', description = 'The submission will be checked according to the terms and conditions. After the approval, it will be listed in the recent coins. Earn badges to gain popularity and free promotion days.', onSubmit = async () => {}, data = {}, setData = () => {}, loading = false, edit = false }) {
  const networks = Object.keys(config.networks);
  const captchaSiteKey = config.captchaSiteKey;

  const imgRef = useRef();
  const formRef = useRef();
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

      return;
    }
  }, []);

  return (
    <div className={cn(styles['container'])}>
      <h1>{title}</h1>

      <h5>{description}</h5>

      <div className={cn(styles['input-area'])}>
        <div className={cn(styles['label'])}>
          <label>Name*</label>
        </div>

        <input
          className={cn(styles['input'], edit ? styles['disabled'] : null)}
          type="text"
          placeholder="Token Name..."
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
          placeholder="Token Symbol..."
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
          <label>Address*</label>
        </div>

        <input
          className={cn(styles['input'], edit ? styles['disabled'] : null)}
          type="text"
          placeholder="0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"
          value={data.address}
          onChange={(e) => {
            if (edit) {
              return;
            }

            setData({ ...data, address: e.target.value });
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

          <img ref={imgRef} onClick={() => {}} src={data.imgURL} alt={data.name + ' Logo'} className={cn(styles['img'], (data.logoBase64 || data.imgURL) && !imgErrMsg ? styles['img-active'] : null)} />
        </div>
      </div>

      <div className={cn(styles['input-area'])}>
        <div className={cn(styles['label'])}>
          <label>Description*</label>
        </div>

        <textarea
          className={cn(styles['textarea'])}
          type="text"
          placeholder="Token Description..."
          value={data.description}
          onChange={(e) => {
            setData({ ...data, description: e.target.value });
          }}
        />
      </div>

      <div className={cn(styles['input-area'])}>
        <div className={cn(styles['label'])}>
          <label>Audit</label>
        </div>

        <input
          className={cn(styles['input'])}
          type="text"
          placeholder="https://github.com/Company/audit"
          value={data.audit}
          onChange={(e) => {
            setData({ ...data, audit: e.target.value });
          }}
        />
      </div>

      <div className={cn(styles['input-area'])}>
        <div className={cn(styles['label'])}>
          <label>KYC</label>
        </div>

        <input
          className={cn(styles['input'])}
          type="text"
          placeholder="https://github.com/Company/kyc"
          value={data.kyc}
          onChange={(e) => {
            setData({ ...data, kyc: e.target.value });
          }}
        />
      </div>

      <div className={cn(styles['input-area'], 'flx-str-ctr')}>
        <div className={cn(styles['label'])}>
          <label>Is this a Presale?</label>
        </div>

        <div className={cn(styles['checkbox-area'])}>
          <Checkbox
            value={isPresale}
            onClick={() => {
              if (edit) {
                return;
              }

              setIsPresale(!isPresale);
            }}
          />
        </div>
      </div>

      {isPresale ? (
        <div className={cn(styles['input-area'])}>
          <div className={cn(styles['label'])}>
            <label>Presale Link (Optional)</label>
          </div>

          <input
            className={cn(styles['input'])}
            type="text"
            placeholder="Your Presale Link"
            value={data.presale}
            onChange={(e) => {
              setData({ ...data, presale: e.target.value });
            }}
          />
        </div>
      ) : null}

      <div className={cn(styles['input-area'])}>
        <div className={cn(styles['label'])}>
          <label>{isPresale ? 'Launch Date' : 'Launch Date'}*</label>
        </div>

        <div className={cn(styles['date-dropdowns'])}>
          <DateDropdowns data={dateData} setData={setDateData} period={isPresale ? 'future' : 'past'} disabled={edit} />
        </div>
      </div>

      <div className={cn(styles['input-area'])}>
        <div className={cn(styles['label'])}>
          <label>Website*</label>
        </div>

        <input
          className={cn(styles['input'])}
          type="text"
          placeholder="https://cryptoralia.com"
          value={data.website}
          onChange={(e) => {
            setData({ ...data, website: e.target.value });
          }}
        />
      </div>

      <div className={cn(styles['input-area'])}>
        <div className={cn(styles['label'])}>
          <label>Twitter</label>
        </div>

        <input
          className={cn(styles['input'])}
          type="text"
          placeholder="https://twitter.com/cryptoralia"
          value={data.twitter}
          onChange={(e) => {
            setData({ ...data, twitter: e.target.value });
          }}
        />
      </div>

      <div className={cn(styles['input-area'])}>
        <div className={cn(styles['label'])}>
          <label>Telegram</label>
        </div>

        <input
          className={cn(styles['input'])}
          type="text"
          placeholder="https://t.me/cryptoralia"
          value={data.telegram}
          onChange={(e) => {
            setData({ ...data, telegram: e.target.value });
          }}
        />
      </div>

      <div className={cn(styles['input-area'])}>
        <div className={cn(styles['label'])}>
          <label>Discord</label>
        </div>

        <input
          className={cn(styles['input'])}
          type="text"
          placeholder="https://discord.gg/cryptoralia"
          value={data.discord}
          onChange={(e) => {
            setData({ ...data, discord: e.target.value });
          }}
        />
      </div>

      <div className={cn(styles['input-area'])}>
        <div className={cn(styles['label'])}>
          <label>Reddit</label>
        </div>

        <input
          className={cn(styles['input'])}
          type="text"
          placeholder="https://reddit.com/r/cryptoralia"
          value={data.reddit}
          onChange={(e) => {
            setData({ ...data, reddit: e.target.value });
          }}
        />
      </div>

      <div className={cn(styles['input-area'])}>
        <div className={cn(styles['label'])}>
          <label>Github</label>
        </div>

        <input
          className={cn(styles['input'])}
          type="text"
          placeholder="https://github.com/cryptoralia"
          value={data.github}
          onChange={(e) => {
            setData({ ...data, github: e.target.value });
          }}
        />
      </div>

      <div className={cn(styles['submit-area'], 'flx-end-ctr')}>
        <div className={cn(styles['terms-and-conditions-area'], 'flx-end-ctr')}>
          <Checkbox value={termsAndConditions} onClick={() => setTermsAndConditions(!termsAndConditions)} />
          <div className={cn(styles['terms-and-conditions'])}>
            I agree to <Anchor href="/terms-and-conditions" content="Terms and Conditions" />
          </div>
        </div>

        {edit ? null : (
          <div className={cn(styles['captcha-area'])}>
            <form ref={formRef} method="POST" action="">
              <div className="h-captcha" data-sitekey={captchaSiteKey}></div>
            </form>
          </div>
        )}

        <div className={cn(styles['buttons'], 'flx-ctr-ctr')}>
          <Button
            onClick={async () => {
              if (store.auth.authState !== 2 && config.env.NODE_ENV === 'production') {
                store.dispatchGlobal({
                  type: gdt.SET_LOGIN_MODAL,
                  payload: true,
                });

                return;
              }

              if (!termsAndConditions) {
                store.dispatchGlobal({
                  type: gdt.SET_ALERT,
                  payload: {
                    message: 'You have to accept Terms and Conditions first.',
                    type: 'error',
                  },
                });

                return;
              }

              const year = dateData.year;
              const month = dateData.month;
              const day = dateData.day;
              const launchDate = new Date(year, month - 1, day).toISOString();
              let captchaToken = '';

              if (!edit) {
                captchaToken = formRef.current.elements[0].value || '';
              }

              if (!captchaToken) {
                captchaToken = '';
              }

              const response = await onSubmit({ launchDate, captchaToken });

              if (!response) {
                return;
              }

              setTermsAndConditions(false);
              setData({ ...data, logoBase64: '' });
            }}
            primary
            href="#"
            disabled={loading}
            title={edit ? 'Submit Edit' : 'Submit'}
          />
        </div>
      </div>
    </div>
  );
}

export default TokenForm;
