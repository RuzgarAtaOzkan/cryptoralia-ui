// MODULES
import { FaHistory } from 'react-icons/fa';
import cn from 'classnames';

// STYLES
import styles from './History.module.scss';

function History() {
  return <FaHistory className={cn(styles['svg'])} />;
}

export default History;
