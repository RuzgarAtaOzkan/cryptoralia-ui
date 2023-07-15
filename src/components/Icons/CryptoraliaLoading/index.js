// MODULES
import cn from 'classnames';

// STYLES
import styles from './Cryptoralia.module.scss';

function CryptoraliaLoading({ active }) {
  return <div className={cn(styles['circle'])}></div>;
}

export default CryptoraliaLoading;
