// MODULES
import { useState, useEffect } from 'react';
import cn from 'classnames';

// ICONS
import DropdownArrowDown from '../Icons/DropdownArrowDown';

// STYLES
import styles from './Dropdown.module.scss';

function Dropdown({ data = [], setValue = () => {}, value = {}, disabled }) {
  if (!data || !setValue || value === undefined || value === null) {
    throw new Error('Too few arguments specified in Dropdown');
  }

  const [open, setOpen] = useState(false);

  return (
    <div
      onClick={() => {
        if (disabled) {
          return;
        }

        setOpen(!open);
      }}
      className={cn(styles['container'], 'flx-str-ctr')}
    >
      <div className={cn(styles['bg'], open ? styles['bg-active'] : null)} />
      <div className={cn(styles['value'], 'flx-btw-ctr')}>
        <div
          className={cn(styles['title'], disabled ? styles['disabled'] : null)}
        >
          {value}
        </div>
        <div className={cn(styles['icon'], 'flx-ctr-ctr')}>
          <DropdownArrowDown />
        </div>
      </div>

      <div
        className={cn(
          styles['dropdown'],
          open ? styles['dropdown-active'] : null
        )}
      >
        {data.map((current, index) => {
          if (current) {
            return (
              <div onClick={() => setValue(current)} key={index}>
                {current}
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}

export default Dropdown;
