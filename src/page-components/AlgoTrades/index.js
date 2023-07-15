// MODULES
import { useState, useEffect, useRef } from 'react';
import cn from 'classnames';

// CONTEXT
import { useStore } from '../../context';

// SELF COMPONENTS
import Post from './Post';

// UTILS
import getAlgoTrades from '../../utils/getAlgoTrades';

// STYLES
import styles from './AlgoTrades.module.scss';

async function placeAlgoTrades(setData, setLoading) {
  setLoading(true);
  const response = await getAlgoTrades();

  if (!response) {
    setLoading(false);
    return;
  }

  setLoading(false);
  setData(response.data);
}

function AlgoTradesPage() {
  const store = useStore();
  const [loading, setLoading] = useState(true);
  const [algoTrades, setAlgoTrades] = useState([]);

  useEffect(() => {
    placeAlgoTrades(setAlgoTrades, setLoading);
  }, [store.auth.authState]);

  return (
    <>
      <section className={cn(styles['algo-trades-section'], 'flx-ctr-ctr')}>
        <div className={cn(styles['algo-trades'], 'flx-ctr-ctr-clm')}>
          {!algoTrades.length ? (
            <>
              <Post data={null} loading={loading} />
              <Post data={null} loading={loading} />
              <Post data={null} loading={loading} />
            </>
          ) : null}

          {algoTrades.map((current, index) => {
            return <Post data={current} loading={loading} key={index} />;
          })}
        </div>
      </section>
    </>
  );
}

export default AlgoTradesPage;
