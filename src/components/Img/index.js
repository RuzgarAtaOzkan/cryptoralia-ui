// MODULES
import cn from 'classnames';

// STYLES
import styles from './Img.module.scss';

function Img({ src = '', alt = 'Image', className = '' }) {
  return <img className={cn(styles['img'], className)} src={src} alt={alt} />;
}

export default Img;
