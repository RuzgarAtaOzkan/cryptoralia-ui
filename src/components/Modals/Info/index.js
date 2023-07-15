// MODULES
import { useState } from 'react';
import cn from 'classnames';

// CONTEXT
import { useStore } from '../../../context';

// ICONS
import CloseIcon from '../../Icons/Close';
// STYLES
import styles from './Info.module.scss';

function Info({ active, setActive, title }) {
  const store = useStore();

  function closeModal() {
    setActive(false);
  }

  return (
    <section
      className={cn(
        styles['container'],
        'flx-ctr-ctr',
        active ? styles['active-container'] : null
      )}
    >
      <div
        onClick={() => closeModal()}
        className={cn(styles['background'], 'trnstn')}
      />

      <div className={cn(styles['modal'], 'trnstn')}>
        <div className={cn(styles['title-area'], 'flx-btw-ctr', 'trnstn')}>
          <div className={cn(styles['title'])}>Maintenance</div>
          <CloseIcon
            onClick={() => {
              closeModal();
            }}
          />
        </div>

        <div className={cn(styles['subtitle'], 'trnstn')}>{title}</div>
      </div>
    </section>
  );
}

export default Info;
