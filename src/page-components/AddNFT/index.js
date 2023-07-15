// MODULES
import { useState, useEffect } from 'react';
import cn from 'classnames';

// API
import request from '../../api/request';

// COMPONENTS

import NFTForm from '../../components/NFTForm';

// STYLES
import styles from './AddNFT.module.scss';

function AddNFTPage() {
  return (
    <>
      <section className={cn('ads-section', 'flx-ctr-ctr')}>
        {
          //  <Ads />
        }
      </section>
      <section className={cn(styles['form-section'], 'flx-ctr-ctr')}>
        <div className={cn(styles['form-area'])}>
          <NFTForm />
        </div>
      </section>
    </>
  );
}

export default AddNFTPage;
