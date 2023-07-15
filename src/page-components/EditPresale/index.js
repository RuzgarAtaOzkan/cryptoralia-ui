// MODULES
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import cn from 'classnames';

// COMPONENTS
import Button from '../../components/Button';
import Table from '../../components/Table';
import Ads from '../../components/Ads';
import PresaleForm from '../../components/PresaleForm';

// ICONS
import ChartIcon from '../../components/Icons/Chart';
import FlameIcon from '../../components/Icons/Flame';
import HistoryIcon from '../../components/Icons/History';

// STYLES
import styles from './EditPresale.module.scss';

function EditPresale() {
  return (
    <>
      <section className={cn('ads-section', 'flx-ctr-ctr')}>
        {
          //  <Ads />
        }
      </section>
      <section className={cn(styles['form-section'], 'flx-ctr-ctr')}>
        <div className={cn(styles['form-area'])}>
          <PresaleForm />
        </div>
      </section>
    </>
  );
}

export default EditPresale;
