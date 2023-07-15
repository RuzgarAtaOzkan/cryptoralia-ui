// MODULES
import { useState, useEffect } from 'react';
import cn from 'classnames';

// STYLES
import styles from './Hamburger.module.scss';

function Hamburger({ active, onClick = () => {}, className }) {
  return (
    <div
      onClick={onClick}
      className={cn(
        styles['container'],
        active ? styles['active'] : null,
        className
      )}
    >
      <div className={cn(styles['bars'])}>
        <div className={cn(styles['top'], 'trnstn')} />
        <div className={cn(styles['mid'], 'trnstn')} />
        <div className={cn(styles['bottom'], 'trnstn')} />
      </div>
    </div>
  );
}

export default Hamburger;
