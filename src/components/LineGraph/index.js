// MODULES
import { useState, useEffect, useRef } from 'react';
import cn from 'classnames';

// ICONS
import TwitterIcon from '../../components/Icons/Twitter';

// COMPONENTS
import Anchor from '../Anchor';

// UTILS
import shortenNum from '../../utils/shortenNum';
import displayDate from '../../utils/displayDate';
import displayFloat from '../../utils/displayFloat';
import addCommas from '../../utils/addCommas';

// STYLES
import styles from './LineGraph.module.scss';

// Map
function calcY(height, highest, lowest, value) {
  // one height percentage
  const ohp = height / 100;

  // current member percentage
  const mp = 100 / ((highest - lowest) / (value - lowest));

  /**
   *
   * 100 / (highest - lowest)
   */

  return parseInt(ohp * (100 - mp));
}

function LineGraph({ data, info }) {
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
  let lowest = Number.MAX_SAFE_INTEGER;
  for (let i = 0; i < data.length; i++) {
    if (data[i].value > highest) {
      highest = data[i].value;
    }

    if (data[i].value < lowest) {
      lowest = data[i].value;
    }
  }

  const containerRef = useRef();
  const columnsRef = useRef();
  const svgRef = useRef();
  const stickRef = useRef();
  const dotRef = useRef();
  const infoRef = useRef();
  const [timeoutId, setTimeoutId] = useState(0);
  const [lmc, setLMC] = useState(0);
  const [path, setPath] = useState('');

  function createPath() {
    if (!columnsRef.current) {
      return;
    }

    let d = '';
    const rect = columnsRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const lineSpace = width / (data.length - 1);

    let mX = 0;
    let mY = 0;
    let lX = 0;
    let lY = 0;

    for (let i = 0; i < data.length; i++) {
      mY = calcY(height, highest, lowest, data[i].value);

      if (data[i + 1]) {
        lY = calcY(height, highest, lowest, data[i + 1].value);
        lX = lX + lineSpace;
      }

      d = d + `M ${mX} ${mY} L ${lX} ${lY} `;
      mX = mX + lineSpace;
    }

    setPath(d);

    return d;
  }

  function updateSVG() {
    if (!columnsRef.current || !svgRef.current) {
      return;
    }

    const columns = columnsRef.current;
    const svg = svgRef.current;
    const rect = columns.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
  }

  function onMouseMove(e) {
    if (!columnsRef.current || !stickRef.current || !dotRef.current || !infoRef.current) {
      return;
    }

    const columns = columnsRef.current;
    const coords = columns.getBoundingClientRect();
    const stick = stickRef.current;
    const dot = dotRef.current;
    const info = infoRef.current;
    const mouseY = e.clientY - coords.y;
    const mouseX = e.clientX - coords.x;

    if (mouseX >= coords.width) {
      return;
    }

    const lineSpace = coords.width / (data.length - 1);
    const index = Math.round(mouseX / lineSpace);
    const current = data[index];

    if (!current) {
      return;
    }

    if (coords.width - mouseX <= info.getBoundingClientRect().width) {
      info.style.left = mouseX - info.getBoundingClientRect().width - 15 + 'px';
    } else {
      info.style.left = mouseX + 15 + 'px';
    }

    info.style.top = mouseY + 10 + 'px';

    info.children[0].textContent = displayDate(current.date.toISOString());
    info.children[1].children[1].textContent = shortenNum(current.value);

    dot.style.top = (100 / ((highest - lowest) / (current.value - lowest)) - 100) * -1 - dot.getBoundingClientRect().height / 5 + '%';
    dot.style.left = mouseX - dot.getBoundingClientRect().width / 2.3 + 'px';
    stick.style.left = mouseX + 'px';

    if (!(parseInt(mouseX) % parseInt(lineSpace))) {
    }
  }

  function onResize() {
    clearTimeout(timeoutId);

    const id = setTimeout(() => {
      createPath();
      updateSVG();
    }, 500);

    setTimeoutId(id);
  }

  useEffect(() => {
    updateSVG();
    createPath();

    if (data[0] && data[data.length - 1]) {
      const first = data[0];
      const last = data[data.length - 1];

      if (first.value > last.value) {
        const change = (100 - 100 / (first.value / last.value)) * -1;

        setLMC(change);
      } else {
        const change = 100 * (last.value / first.value);
        setLMC(change);
      }
    }

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div ref={containerRef} className={cn(styles['container'])}>
      <div className={cn(styles['title-area'], 'flx-btw-str')}>
        <div className={cn(styles['title-area-left'], 'flx-str-ctr')}>
          <div className={cn(styles['title-icon'], 'flx-ctr-ctr')}>
            <TwitterIcon />
          </div>

          <div className={cn(styles['title'])}>
            <div className={cn(styles['main-title'])}>Twitter Followers</div>

            <Anchor className={cn(styles['domain'])} href={info.url} target="_blank">
              @{info.url?.split('/')[info.url?.split('/').length - 1]}
            </Anchor>
          </div>
        </div>

        <div className={cn(styles['title-area-right'])}>
          <div className={cn(styles['last-month-change-area'])}>
            <div className={cn(styles['last-month-change'], lmc > 0 ? styles['last-month-change-gain'] : styles['last-month-change-loss'])}>{displayFloat(lmc)}%</div>
            <div className={cn(styles['last-month-change-title'])}>Last Month Change</div>
          </div>
        </div>
      </div>

      <div className={cn(styles['info-area'], 'flx-str-ctr')}>
        <div className={cn(styles['last-visits-area'])}>
          <div className={cn(styles['last-visits'])}>{addCommas(data[0] ? data[0].value : null)}</div>
          <div className={cn(styles['last-visits-title'])}>Last Month Followers</div>
        </div>
      </div>

      <div className={cn(styles['chart-area'])}>
        <div className={cn(styles['row'])}>
          <div className={cn(styles['row-value'])}>{shortenNum(highest)}</div>
          <div className={cn(styles['row-line'])} />
        </div>
        <div className={cn(styles['row'])}>
          <div className={cn(styles['row-value'])}>{shortenNum(parseInt(((highest - lowest) / 4) * 3 + lowest))}</div>
          <div className={cn(styles['row-line'])} />
        </div>
        <div className={cn(styles['row'])}>
          <div className={cn(styles['row-value'])}>{shortenNum(parseInt((highest - lowest) / 2 + lowest))}</div>
          <div className={cn(styles['row-line'])} />
        </div>
        <div className={cn(styles['row'])}>
          <div className={cn(styles['row-value'])}>{shortenNum(parseInt((highest - lowest) / 4 + lowest))}</div>
          <div className={cn(styles['row-line'])} />
        </div>
        <div className={cn(styles['row'])}>
          <div className={cn(styles['row-value'])}>{shortenNum(lowest)}</div>
          <div className={cn(styles['row-line'])} />
        </div>

        <div
          className={cn(styles['columns'])}
          ref={columnsRef}
          onMouseEnter={(e) => {
            stickRef.current.style.visibility = 'visible';
            dotRef.current.style.visibility = 'visible';
            infoRef.current.style.visibility = 'visible';
            onMouseMove(e);
          }}
          onMouseMove={onMouseMove}
          onMouseLeave={(e) => {
            stickRef.current.style.visibility = 'hidden';
            dotRef.current.style.visibility = 'hidden';
            infoRef.current.style.visibility = 'hidden';
          }}
        >
          <div ref={stickRef} className={cn(styles['stick'])} />
          <div ref={dotRef} className={cn(styles['dot'])} />
          <div ref={infoRef} className={cn(styles['info'])}>
            <div className={cn(styles['info-date'])}></div>
            <div className={cn(styles['info-value-area'], 'flx-str-ctr')}>
              <div className={cn(styles['info-dot'])} />
              <div className={cn(styles['info-value'])}></div>
            </div>
          </div>

          <svg ref={svgRef}>
            <path id="line" stroke="#9a7aef" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" d={path}></path>
          </svg>
        </div>
      </div>
    </div>
  );
}

export default LineGraph;
