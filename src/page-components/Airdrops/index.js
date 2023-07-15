// MODULES
import { useState, useEffect } from 'react';
import cn from 'classnames';

// PAGES
import NotFound from '../404';

// COMPONENTS
import AirdropsTable from '../../components/AirdropsTable';
import AirdropsTableMobile from '../../components/AirdropsTableMobile';

// UTILS
import sortTable from '../../utils/sortTable';

// STYLES
import styles from './Airdrops.module.scss';

function AirdropsPage({ data }) {
  data = sortTable(data, 'end-date');

  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data.length; j++) {
      if (data[j + 1]) {
        const current = data[j];
        const next = data[j + 1];

        if (new Date(next.endDate).valueOf() > new Date().valueOf()) {
          data[j] = next;
          data[j + 1] = current;
        }
      }
    }
  }

  const [airdrops, setAirdrops] = useState(data ? data : []);

  return data === null ? (
    <NotFound href="/" />
  ) : (
    <>
      <section className={cn(styles['airdrops-section'], 'flx-ctr-ctr-clm')}>
        <AirdropsTable data={airdrops} title="<h1>Crypto Airdrops</h1>" desc="You can earn rewards by getting crypto airdrops." />
        <AirdropsTableMobile data={airdrops} title="Crypto Airdrops" desc="You can earn rewards by getting crypto airdrops." />
      </section>
    </>
  );
}

export default AirdropsPage;
