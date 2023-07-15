// MODULES
import { useState, useEffect } from 'react';
import cn from 'classnames';

// COMPONENTS
import Table from '../../components/Table';
import TableMobile from '../../components/TableMobile';

// ICONS
import ChartIcon from '../../components/Icons/Chart';
import FlameIcon from '../../components/Icons/Flame';
import HistoryIcon from '../../components/Icons/History';

// STYLES
import styles from './New.module.scss';

function GainersPage({ data, votes = '' }) {
  const [tokens, setTokens] = useState(data ? data : []);

  return (
    <>
      <section className={cn(styles['table-section'], 'flx-ctr-ctr')}>
        <div className={cn(styles['table-area'])}>
          <Table data={tokens} title="<h1>New Listings</h1>" desc="You can view the last 20 tokens listed on Cryptoralia here!" votes={votes} />
          <TableMobile data={tokens} title="<h1>New Listings</h1>" desc="You can view the last 20 tokens listed on Cryptoralia here!" votes={votes} />
        </div>
      </section>
    </>
  );
}

export default GainersPage;
