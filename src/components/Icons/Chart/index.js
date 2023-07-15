// MODULES
import { FaChartLine } from 'react-icons/fa';
import cn from 'classnames';

// STYLES
import styles from './Chart.module.scss';

function Chart({ active }) {
  return <FaChartLine className={cn(styles['svg'])} />;
}

export default Chart;
