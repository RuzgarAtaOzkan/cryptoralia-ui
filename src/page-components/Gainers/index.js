// MODULES
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import cn from 'classnames';

// COMPONENTS
import Button from '../../components/Button';
import Table from '../../components/Table';
import TableMobile from '../../components/TableMobile';

// ICONS
import ChartIcon from '../../components/Icons/Chart';
import FlameIcon from '../../components/Icons/Flame';
import HistoryIcon from '../../components/Icons/History';

// STYLES
import styles from './Gainers.module.scss';

function GainersPage({ data, votes }) {
  const tokens = data || [];

  return (
    <>
      <section className={cn(styles['table-section'], 'flx-ctr-ctr')}>
        <div className={cn(styles['table-area'])}>
          <Table data={tokens} title="<h1>Gainers</h1>" desc="You can find the gainers in the last 24 hours on Cryptoralia!" votes={votes} />
          <TableMobile data={tokens} title="Gainers" desc="You can find the gainers in the last 24 hours on Cryptoralia!" votes={votes} />
        </div>
      </section>
    </>
  );
}

export default GainersPage;
