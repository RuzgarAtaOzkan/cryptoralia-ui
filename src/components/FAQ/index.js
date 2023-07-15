// MODULES
import cn from 'classnames';

// COMPONENTS
import Anchor from '../../components/Anchor';

// STYLES
import styles from './FAQ.module.scss';

function FAQ({ title, content, imgURL = '/assets/images/cryptoralia-icon.png' }) {
  return (
    <div className={cn(styles['container'], 'flx-btw-ctr')}>
      <div className={cn(styles['left'])}>
        <h2>{title}</h2>
        <p>{content}</p>
      </div>

      <div className={cn(styles['right'])}>
        <img src={imgURL} alt="presale-tokens" title="Presale Tokens" />
      </div>
    </div>
  );
}

export default FAQ;
