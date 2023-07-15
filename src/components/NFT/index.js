// MODULES
import cn from 'classnames';

// COMPONENTS
import Anchor from '../Anchor';

// UTILS
import shortenText from '../../utils/shortenText';

// STYLES
import styles from './NFT.module.scss';

function NFT({ data }) {
  if (!data) {
    throw new Error('Too few arguments specified in NFT Component');
  }

  const { name, username, img, price } = data;

  return (
    <div
      className={cn(
        styles['container'],
        'trnstn',
        data.promoted ? styles['promotion-container'] : null
      )}
    >
      <Anchor>
        <div className={cn(styles['top'])}>
          <div className={cn(styles['img-container'], 'flx-ctr-ctr')}>
            <img alt="NFT Thumbnail" src={img} />
          </div>
        </div>
        <div className={cn(styles['bottom'], 'flx-btw-ctr')}>
          <div className={cn(styles['left'])}>
            <h5>{shortenText(name, 17)}</h5>
            <div className={cn(styles['username'])}>{username}</div>
          </div>
          <div className={cn(styles['right'])}>
            <div className={cn(styles['title'])}>Price</div>
            <div className={cn(styles['value-area'], 'flx-ctr-ctr')}>
              <img alt="BNB Logo" src="/assets/images/bnb.png" />
              <div className={cn(styles['value'])}>{price} BNB</div>
            </div>
          </div>
        </div>
      </Anchor>
    </div>
  );
}

export default NFT;
