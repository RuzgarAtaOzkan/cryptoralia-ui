// MODULES
import { useState, useRef } from 'react';
import cn from 'classnames';

// COMPONENTS
import Checkbox from '../Checkbox';
import Anchor from '../Anchor';
import Button from '../Button';

// STYLES
import styles from './NFTForm.module.scss';

function NFTForm({ values = {}, onSubmit = () => {} }) {
  const [data, setData] = useState({
    asset: {},
    title: '',
    description: '',
    price: '',
    saleLink: '',
  });

  const [termsAndConditions, setTermsAndConditions] = useState(false);

  const imgRef = useRef();

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

    setData({ ...data, asset: file });
  }

  return (
    <div className={cn(styles['container'])}>
      <h1>Submit a NFT for promotion in Cryptoralia.com</h1>

      <h5>The submission will be checked according to the terms and conditions. After the approval, it will be listed in the recent coins. Earn badges to gain popularity and free promotion days.</h5>

      <div className={cn(styles['input-area'])}>
        <div className={cn(styles['label'])}>
          <label>NFT*</label>
        </div>

        <div className={cn(styles['img-input-container'], 'flx-ctr-ctr')}>
          {data.asset.name ? null : (
            <div className={cn(styles['title'])}>
              PNG, GIF, JPG (Max 8Mb).
              <br />
              Select or drop file
            </div>
          )}

          <input
            className={cn(styles['input'])}
            type="file"
            accept="image/png, image/jpeg"
            placeholder="NFT..."
            onChange={(e) => {
              handleImageFile(e.target.files[0]);
            }}
          />

          <img ref={imgRef} src="" alt="" className={cn(styles['img'], data.asset.name ? styles['img-active'] : null)} />
        </div>
      </div>

      <div className={cn(styles['input-area'])}>
        <div className={cn(styles['label'])}>
          <label>Title*</label>
        </div>

        <input
          className={cn(styles['input'])}
          type="text"
          placeholder="NFT Title..."
          value={data.title}
          onChange={(e) => {
            setData({ ...data, title: e.target.value });
          }}
        />
      </div>

      <div className={cn(styles['input-area'])}>
        <div className={cn(styles['label'])}>
          <label>Description*</label>
        </div>

        <textarea
          className={cn(styles['textarea'])}
          type="text"
          placeholder="NFT Description..."
          value={data.description}
          onChange={(e) => {
            setData({ ...data, description: e.target.value });
          }}
        />
      </div>

      <div className={cn(styles['input-area'])}>
        <div className={cn(styles['label'])}>
          <label>Price*</label>
        </div>

        <div className={cn(styles['price-input'], 'flx-ctr-ctr', 'pos-rel')}>
          <input
            className={cn(styles['input'])}
            type="text"
            placeholder="NFT Price in BNB (example 2.1)"
            value={data.price}
            onChange={(e) => {
              const lastChar = e.target.value[e.target.value.length - 1];
              console.log(lastChar);

              if (e.target.value.length <= 9) {
                if (isNaN(parseInt(lastChar))) {
                  if (lastChar === '.' || lastChar === undefined) {
                    setData({ ...data, price: e.target.value });
                  }
                } else {
                  setData({ ...data, price: e.target.value });
                }
              }
            }}
          />
          <div className={cn(styles['bnb-logo'])}>
            <img src="/assets/images/bnb.png" alt="BNB Logo" />
          </div>
        </div>
      </div>

      <div className={cn(styles['input-area'])}>
        <div className={cn(styles['label'])}>
          <label>Sale Link*</label>
        </div>

        <input
          className={cn(styles['input'])}
          type="text"
          placeholder="https://opensea.io/assets/0x5d949a57a4dfc1fa0dc63e992fa28175f4b9c094/3300"
          value={data.saleLink}
          onChange={(e) => {
            setData({ ...data, saleLink: e.target.value });
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
          onClick={() => {
            onSubmit();
          }}
          primary
          href="#"
          title="Submit"
        />
      </div>
    </div>
  );
}

export default NFTForm;
