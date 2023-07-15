// MODULES
import { FaFire } from 'react-icons/fa';
import cn from 'classnames';

// STYLES
import styles from './Flame.module.scss';

function Flame({ active }) {
  return <FaFire className={cn(styles['svg'])} />;
}

export default Flame;
