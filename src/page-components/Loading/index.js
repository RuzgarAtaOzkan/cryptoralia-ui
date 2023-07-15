// MODULES
import React from 'react';
import cn from 'classnames';

// ICONS
import LoadingCircleIcon from '../../components/Icons/LoadingCircle';

// STYLES
import styles from './Loading.module.scss';

function Loading() {
  return (
    <section className={cn(styles['loading'], 'flx-ctr-ctr')}>
      <LoadingCircleIcon />
    </section>
  );
}

export default Loading;
