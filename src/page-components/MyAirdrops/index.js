// MODULES
import { useState, useEffect } from 'react';
import cn from 'classnames';

// PAGES
import LoadingPage from '../Loading';

// COMPONENTS

import Anchor from '../../components/Anchor';
import MyTable from '../../components/MyTable';
import Button from '../../components/Button';

// ICONS
import PlusIcon from '../../components/Icons/Plus';

// UTILS
import getMyAirdrops from '../../utils/getMyAirdrops';

// STYLES
import styles from './MyAirdrops.module.scss';

function MyAirdropsPage() {
  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(20);
  const [airdrops, setAirdrops] = useState([]);

  async function placeAirdrops() {
    const response = await getMyAirdrops('?limit=20');

    setPageLoading(false);

    if (response) {
      const airdrops = response.data;

      for (let i = 0; i < airdrops.length; i++) {
        for (let j = 0; j < airdrops.length; j++) {
          if (airdrops[j + 1]) {
            const current = airdrops[j];
            const next = airdrops[j + 1];

            if (
              new Date(current.createdAt).valueOf() <
              new Date(next.createdAt).valueOf()
            ) {
              airdrops[j] = next;
              airdrops[j + 1] = current;
            }
          }
        }
      }

      setAirdrops(airdrops);
    }
  }

  useEffect(() => {
    placeAirdrops();
  }, []);

  return (
    <>
      {pageLoading ? (
        <LoadingPage />
      ) : (
        <section className={cn(styles['my-airdrops-section'], 'flx-ctr-str')}>
          <div className={cn(styles['my-airdrops'])}>
            <div className={cn(styles['title-area'], 'flx-str-ctr', 'trnstn')}>
              <h1>My Airdrops</h1>
              <Anchor href="/add-token">
                <div className={cn(styles['add-btn'], 'flx-ctr-ctr')}>
                  <div className={cn(styles['icon-container'], 'flx-ctr-ctr')}>
                    <PlusIcon />
                  </div>
                  Add
                </div>
              </Anchor>
            </div>

            <MyTable data={airdrops} type="airdrop" />

            <div className={cn(styles['load-more-btn'], 'flx-ctr-ctr')}>
              <Button
                primary
                disabled={loading}
                title="Load More..."
                onClick={async () => {
                  const newLimit = limit + 20;

                  setLoading(true);

                  try {
                    const response = await getMyAirdrops('?limit=' + newLimit);

                    setLoading(false);
                    setLimit(newLimit);

                    setTokens(response.data);
                  } catch (error) {
                    setLoading(false);
                  }
                }}
              />
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default MyAirdropsPage;
