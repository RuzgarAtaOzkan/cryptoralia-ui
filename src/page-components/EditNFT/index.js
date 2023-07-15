// MODULES
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import cn from 'classnames';

// COMPONENTS
import Button from '../../components/Button';
import Table from '../../components/Table';
import Ads from '../../components/Ads';
import NFTForm from '../../components/NFTForm';

// ICONS
import ChartIcon from '../../components/Icons/Chart';
import FlameIcon from '../../components/Icons/Flame';
import HistoryIcon from '../../components/Icons/History';

// STYLES
import styles from './EditNFT.module.scss';

function EditNFT() {
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

export default EditNFT;
