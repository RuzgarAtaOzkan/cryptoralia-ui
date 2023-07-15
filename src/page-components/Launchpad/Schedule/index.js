// MODULES
import React, { useState, useEffect, useRef } from 'react';
import cn from 'classnames';

// STYLES
import styles from './Schedule.module.scss';

function Schedule({ data }) {
  return (
    <div className={cn(styles['container'])}>
      <div className={cn(styles['title'])}>SCHEDULE</div>
      <div className={cn(styles['table-container'])}>
        <div className={cn(styles['table'])}>
          <div className={cn(styles['titles'], 'flx-str-ctr')}>
            <div className={cn(styles['title-round'])}>ROUND</div>
            <div className={cn(styles['title-opens'])}>OPENS</div>
            <div className={cn(styles['title-closes'])}>CLOSES</div>
          </div>
          <div className={cn(styles['rows'], 'flx-str-ctr')}>
            <div className={cn(styles['row-round'])}>Allocation</div>
            <div className={cn(styles['row-opens'])}>
              20.02.2022 08:00:00 UTC
            </div>
            <div className={cn(styles['row-closes'])}>
              22.02.2022 24:00:00 UTC
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Schedule;
