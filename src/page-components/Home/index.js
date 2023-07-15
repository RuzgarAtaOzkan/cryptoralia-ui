// MODULES
import { useState, useEffect } from 'react';
import axios from 'axios';
import cn from 'classnames';

// PAGE COMPONENTS
import NotFound from '../NotFound';

// COMPONETS
import EmailSubscription from '../../components/EmailSubscription';
import Anchor from '../../components/Anchor';
import TrendBox from '../../components/TrendBox';
import FAQ from '../../components/FAQ';

// ICONS
import FlameIcon from '../../components/Icons/Flame';
import ChartIcon from '../../components/Icons/Chart';
import HistoryIcon from '../../components/Icons/History';

// STYLES
import styles from './Home.module.scss';
import Table from '../../components/Table';
import TableMobile from '../../components/TableMobile';

function HomePage({ data, promotedTokens, gainerTokens, newTokens, votes }) {
  const [tokens, setTokens] = useState(data);

  return !data ? (
    <NotFound />
  ) : (
    <>
      <section className={cn(styles['title-section'], 'flx-str-ctr')}>
        <h1>Cryptoralia</h1>
      </section>
      <section className={cn(styles['boxes-section'], 'flx-ctr-ctr', 'trnstn')}>
        <div className={cn(styles['boxes-container'], 'flx-btw-ctr')}>
          <TrendBox data={[data[0], data[1], data[2]]} title="Trending" icon={<FlameIcon />} iconColor="orange" href="/trending" />
          <TrendBox data={[gainerTokens[0], gainerTokens[1], gainerTokens[2]]} title="Gainers" icon={<ChartIcon />} iconColor="green" href="/gainers" />
          <TrendBox data={[newTokens[0], newTokens[1], newTokens[2]]} title="New Listings" icon={<HistoryIcon />} iconColor="grey" href="/new" />
        </div>
      </section>
      <section className={cn(styles['table-section'], 'flx-ctr-ctr-clm', 'trnstn')}>
        <Table data={promotedTokens} title="Featured Tokens" votes={votes} />
        <TableMobile data={promotedTokens} title="Featured Tokens" votes={votes} />

        <div className={cn(styles['seperator'])} />

        <Table data={tokens} title="Today's Best" votes={votes} />
        <TableMobile data={tokens} title="Today's Best" votes={votes} />
      </section>
      <section className={cn(styles['email-subscription-section'])}>
        <EmailSubscription />
      </section>
    </>
  );
}

export default HomePage;
