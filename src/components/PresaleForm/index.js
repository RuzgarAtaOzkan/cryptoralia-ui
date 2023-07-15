// MODULES
import { useState, useRef } from 'react';
import cn from 'classnames';

// COMPONENTS
import Dropdown from '../Dropdown';
import Checkbox from '../Checkbox';
import Anchor from '../Anchor';
import Button from '../Button';
import DateDropdowns from '../DateDropdowns';

// STYLES
import styles from './PresaleForm.module.scss';

function PresaleForm({ onSubmit = () => {} }) {
  const [network, setNetwork] = useState('BSC');
  const [day, setDay] = useState(new Date().getDate() + 1);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const [data, setData] = useState({
    name: '',
    symbol: '',
    logo: {},
    network: network,
    address: '',
    description: '',
    launchDate: '',
    launchpadLink: '',
    website: '',
    telegram: '',
    twitter: '',
    discord: '',
    reddit: '',
  });

  const [termsAndConditions, setTermsAndConditions] = useState(false);

  const imgRef = useRef();

  const networks = ['BSC'];

  function handleImageFile(file) {
    if (!file) {
      throw new Error('Too few arguments specified in handleImageFile');
    }

    const sizeOffset = 10000000;
    const allowedTypes = ['image/jpg', 'image/jpeg', 'image/png'];

    if (file.size > sizeOffset) {
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      return;
    }

    const reader = new FileReader();

    reader.onloadend = function (e) {
      imgRef.current.src = reader.result;
    };

    reader.readAsDataURL(file);

    setData({ ...data, logo: file });
  }

  return (
    <div className={cn(styles['container'])}>
      <h1>Submit a presale for listing in Cryptoralia.com</h1>

      <h5>The submission will be checked according to the terms and conditions. After the approval, it will be listed in the recent coins. Earn badges to gain popularity and free promotion days.</h5>

      <div className={cn(styles['input-area'])}>
        <div className={cn(styles['label'])}>
          <label>Name*</label>
        </div>

        <input
          className={cn(styles['input'])}
          type="text"
          placeholder="Token Name..."
          value={data.name}
          onChange={(e) => {
            setData({ ...data, name: e.target.value });
          }}
        />
      </div>
      <div className={cn(styles['input-area'])}>
        <div className={cn(styles['label'])}>
          <label>Symbol*</label>
        </div>

        <input
          className={cn(styles['input'])}
          type="text"
          placeholder="Token Symbol..."
          value={data.symbol}
          onChange={(e) => {
            setData({ ...data, symbol: e.target.value });
          }}
        />
      </div>
      <div className={cn(styles['input-area'])}>
        <div className={cn(styles['label'])}>
          <label>Network</label>
        </div>
        <div className={cn(styles['dropdown-area'])}>
          <Dropdown data={networks} setValue={setNetwork} value={network} />
        </div>
      </div>
      <div className={cn(styles['input-area'])}>
        <div className={cn(styles['label'])}>
          <label>Address*</label>
        </div>

        <input
          className={cn(styles['input'])}
          type="text"
          placeholder="0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"
          value={data.address}
          onChange={(e) => {
            setData({ ...data, address: e.target.value });
          }}
        />
      </div>

      <div className={cn(styles['input-area'])}>
        <div className={cn(styles['label'])}>
          <label>Logo*</label>
        </div>

        <div className={cn(styles['img-input-container'], 'flx-ctr-ctr')}>
          {data.logo.name ? null : <div className={cn(styles['title'])}>Drag and drop or select your image file.</div>}

          <input
            className={cn(styles['input'])}
            type="file"
            accept="image/png, image/jpeg"
            placeholder="Token Logo..."
            onChange={(e) => {
              handleImageFile(e.target.files[0]);
            }}
          />

          <img ref={imgRef} src="" alt="" className={cn(styles['img'], data.logo.name ? styles['img-active'] : null)} />
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
          <label>Launch Date</label>
        </div>

        <DateDropdowns day={day} setDay={setDay} month={month} setMonth={setMonth} year={year} setYear={setYear} />
      </div>

      <div className={cn(styles['input-area'])}>
        <div className={cn(styles['label'])}>
          <label>Launchpad Link</label>
        </div>

        <input
          className={cn(styles['input'])}
          type="text"
          placeholder="https://pinksale.com/playtosurvive"
          value={data.launchpadLink}
          onChange={(e) => {
            setData({ ...data, launchpadLink: e.target.value });
          }}
        />
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
          <label>Telegram</label>
        </div>

        <input
          className={cn(styles['input'])}
          type="text"
          placeholder="https://t.me/Cryptoralia"
          value={data.telegram}
          onChange={(e) => {
            setData({ ...data, telegram: e.target.value });
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

      <div className={cn(styles['submit-area'], 'flx-end-ctr')}>
        <div className={cn(styles['terms-and-conditions-area'], 'flx-ctr-ctr')}>
          <Checkbox value={termsAndConditions} onClick={() => setTermsAndConditions(!termsAndConditions)} />
          <div className={cn(styles['terms-and-conditions'])}>
            I agree to <Anchor href="/terms-and-conditions" content="Terms and Conditions" />
          </div>
        </div>

        <Button
          primary
          href="#"
          title="Submit"
          onClick={() => {
            onSubmit();
          }}
        />
      </div>
    </div>
  );
}

export default PresaleForm;
