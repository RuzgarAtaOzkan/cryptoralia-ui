// MODULES
import React, { useState, useEffect, useRef } from 'react';
import cn from 'classnames';

// DISPATCH TYPES
import { useStore } from '../../context';

// STYLES
import styles from './Launchpads.module.scss';

function Launchpads() {
  const store = useStore();

  return (
    <>
      <section className={cn(styles['launchpads-section'], 'flx-ctr-ctr')}>Launchpads</section>
    </>
  );
}

export default Launchpads;
