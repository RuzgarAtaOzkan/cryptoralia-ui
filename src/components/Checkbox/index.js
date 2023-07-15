// MODULES
import cn from 'classnames';

// ICONS
import CheckIcon from '../Icons/Check';

// STYLES
import styles from './Checkbox.module.scss';

function Checkbox({ value = false, onClick = () => {} }) {
  return (
    <div
      onClick={onClick}
      className={cn(
        styles['container'],
        'flx-ctr-ctr',
        value ? styles['checked'] : null
      )}
    >
      <CheckIcon />
    </div>
  );
}

export default Checkbox;
