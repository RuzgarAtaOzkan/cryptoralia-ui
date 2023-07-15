// MODULES
import { useState, useEffect } from 'react';
import cn from 'classnames';

// COMPONENTS
import Table from '../../components/Table';
import TableMobile from '../../components/TableMobile';

// STYLES
import styles from './Trending.module.scss';

function TrendingPage({ data, votes }) {
  const [tokens, setTokens] = useState(data ? data : []);

  return (
    <>
      <section className={cn(styles['table-section'], 'flx-ctr-ctr')}>
        <div className={cn(styles['table-area'])}>
          <Table
            data={tokens}
            title="<h1>Trending</h1>"
            desc="You can find the trending tokens in the last 24 hours on
            Cryptoralia!"
            votes={votes}
          />
          <TableMobile
            data={tokens}
            title="Trending"
            desc="You can find the trending tokens in the last 24 hours on
            Cryptoralia!"
            votes={votes}
          />
        </div>
      </section>
    </>
  );
}

export default TrendingPage;
