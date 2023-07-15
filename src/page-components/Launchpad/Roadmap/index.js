// MODULES
import React, { useState, useEffect, useRef } from 'react';
import cn from 'classnames';

// STYLES
import styles from './Roadmap.module.scss';

function Roadmap({ data }) {
  const roadmap = data.roadmap.split('_');

  return (
    <div className={cn(styles['container'])}>
      <div className={cn(styles['title'])}>ROADMAP</div>
      <div className={cn(styles['roadmap'], 'flx-btw-str')}>
        {roadmap.map((current, index) => {
          const road = current.split('-');

          return (
            <div key={index} className={cn(styles['road'])}>
              <div className={cn(styles['year'])}>
                {'Q' + road[1] + ' ' + road[0]}
              </div>
              <div className={cn(styles['items'])}>
                {road.map((item, i) => {
                  if (i < 2) {
                    return;
                  }

                  return (
                    <div key={i} className={cn(styles['item'])}>
                      - {item}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Roadmap;
