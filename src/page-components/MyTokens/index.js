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
import getMyTokens from '../../utils/getMyTokens';

// STYLES
import styles from './MyTokens.module.scss';

function MyTokensPage() {
  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(20);
  const [tokens, setTokens] = useState([]);

  async function placeTokens() {
    const response = await getMyTokens('?limit=20');

    setPageLoading(false);

    if (response) {
      const tokens = response.data;

      for (let i = 0; i < tokens.length; i++) {
        for (let j = 0; j < tokens.length; j++) {
          if (tokens[j + 1]) {
            const current = tokens[j];
            const next = tokens[j + 1];

            if (
              new Date(current.createdAt).valueOf() <
              new Date(next.createdAt).valueOf()
            ) {
              tokens[j] = next;
              tokens[j + 1] = current;
            }
          }
        }
      }

      setTokens(tokens);
    }
  }

  useEffect(() => {
    placeTokens();
  }, []);

  return (
    <>
      {pageLoading ? (
        <LoadingPage />
      ) : (
        <section className={cn(styles['my-tokens-section'], 'flx-ctr-str')}>
          <div className={cn(styles['my-tokens'])}>
            <div className={cn(styles['title-area'], 'flx-str-ctr', 'trnstn')}>
              <h1>My Tokens</h1>
              <Anchor href="/add-token">
                <div className={cn(styles['add-btn'], 'flx-ctr-ctr')}>
                  <div className={cn(styles['icon-container'], 'flx-ctr-ctr')}>
                    <PlusIcon />
                  </div>
                  Add
                </div>
              </Anchor>
            </div>

            <MyTable data={tokens} />

            <div className={cn(styles['load-more-btn'], 'flx-ctr-ctr')}>
              <Button
                primary
                disabled={loading}
                title="Load More..."
                onClick={async () => {
                  const newLimit = limit + 20;

                  setLoading(true);

                  try {
                    const response = await getMyTokens('?limit=' + newLimit);

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

export default MyTokensPage;
