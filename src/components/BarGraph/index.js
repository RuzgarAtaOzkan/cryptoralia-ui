// MODULES
import { useState, useEffect, useRef } from 'react';
import cn from 'classnames';

// COMPONENTS
import TrafficIcon from '../../components/Icons/Traffic';
import Anchor from '../../components/Anchor';

// UTILS
import shortenNum from '../../utils/shortenNum';
import displayDate from '../../utils/displayDate';
import addCommas from '../../utils/addCommas';
import displayFloat from '../../utils/displayFloat';

// STYLES
import styles from './BarGraph.module.scss';

function BarGraph({ data, info = {} }) {
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data.length; j++) {
      if (data[j + 1]) {
        const current = data[j];
        const next = data[j + 1];

        if (new Date(current.date.toString()).valueOf() > new Date(next.date.toString()).valueOf()) {
          data[j] = next;
          data[j + 1] = current;
        }
      }
    }
  }

  let highest = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i].visits >= highest) {
      highest = data[i].visits;
    }
  }

  const columnsRef = useRef();

  const [hoveredCol, setHoveredCol] = useState(-1);
  const [colInfoTop, setColInfoTop] = useState(0);
  const [lastMonthChange, setLastMonthChange] = useState(0);

  useEffect(() => {
    if (data[data.length - 1] && data[data.length - 2]) {
      const last = data[data.length - 1];
      const beforelast = data[data.length - 2];

      setLastMonthChange(beforelast.visits >= last.visits ? (100 - 100 / (beforelast.visits / last.visits)) * -1 : 100 - 100 / (last.visits / beforelast.visits));
    }
  }, [data]);

  return (
    <div className={cn(styles['container'])}>
      <div className={cn(styles['top'], 'flx-btw-str')}>
        <div className={cn(styles['top-left'], 'flx-str-ctr')}>
          <TrafficIcon />

          <div className={cn(styles['title'])}>
            <div className={cn(styles['main-title'])}>Website Traffic</div>
            <div className={cn(styles['domain'])}>
              <Anchor target="_blank" rel="noreferrer" href={info.url}>
                {info.url}
              </Anchor>
            </div>
          </div>
        </div>

        <div className={cn(styles['top-right'])}>
          <div className={cn(styles['last-month-change'], lastMonthChange < 0 ? styles['last-month-change-loss'] : styles['last-month-change-gain'])}>{displayFloat(lastMonthChange)}%</div>
          <div className={cn(styles['last-month-change-title'])}>Last Month Change</div>
        </div>
      </div>

      <div className={cn(styles['info-area'], 'flx-str-str')}>
        <div className={cn(styles['global-rank-area'])}>
          <div className={cn(styles['global-rank-title'])}>{addCommas(info.globalRank)}</div>
          <div className={cn(styles['global-rank-subtitle'])}>Global Rank</div>
        </div>

        <div className={cn(styles['category-rank-area'])}>
          <div className={cn(styles['category-rank-title'])}>{addCommas(info.categoryRank)}</div>
          <div className={cn(styles['category-rank-subtitle'])}>Website Category Rank</div>
        </div>
      </div>

      <div className={cn(styles['chart-area'])}>
        <div className={cn(styles['row'])}>
          <div className={cn(styles['row-value'])}>{shortenNum(highest)}</div>
          <div className={cn(styles['row-line'])} />
        </div>
        <div className={cn(styles['row'])}>
          <div className={cn(styles['row-value'])}>{shortenNum(parseInt((highest / 4) * 3))}</div>
          <div className={cn(styles['row-line'])} />
        </div>
        <div className={cn(styles['row'])}>
          <div className={cn(styles['row-value'])}>{shortenNum(parseInt(highest / 2))}</div>
          <div className={cn(styles['row-line'])} />
        </div>
        <div className={cn(styles['row'])}>
          <div className={cn(styles['row-value'])}>{shortenNum(parseInt((highest / 4) * 1))}</div>
          <div className={cn(styles['row-line'])} />
        </div>
        <div className={cn(styles['row'])}>
          <div className={cn(styles['row-value'])}>0</div>
          <div className={cn(styles['row-line'])} />
        </div>

        <div ref={columnsRef} className={cn(styles['columns'])}>
          {data.map((current, index) => {
            return (
              <div
                key={index}
                onMouseMove={(e) => {
                  const coords = columnsRef.current.getBoundingClientRect();
                  const mouseY = e.clientY - coords.y;

                  setColInfoTop(mouseY + 12);
                  setHoveredCol(index);
                }}
                onMouseLeave={(e) => {
                  setHoveredCol(-1);
                }}
                className={cn(styles['column'])}
              >
                <div className={cn(styles['column-date'])}>{displayDate(current.date.toString())}</div>
                <div style={{ height: 100 / (highest / current.visits) + '%' }} className={cn(styles['bar'])}></div>

                {index === hoveredCol ? (
                  <div style={{ top: colInfoTop }} className={cn(styles['hover-info'], index === 4 || index === 5 ? styles['hover-info-right'] : null)}>
                    <div className={cn(styles['hover-info-date'])}>{displayDate(current.date.toString())}</div>
                    <div className={cn(styles['hover-info-visits'], 'flx-str-ctr')}>
                      <div className={cn(styles['hover-info-dot'])} />
                      {shortenNum(current.visits)}
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default BarGraph;
