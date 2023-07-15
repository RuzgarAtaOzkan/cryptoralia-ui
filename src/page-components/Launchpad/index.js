// MODULES
import React, { useState, useEffect, useRef } from 'react';
import cn from 'classnames';

// SELF COMPONENTS
import Bar from './Bar';
import InfoBox from './InfoBox';
import Tokenomics from './Tokenomics';
import Roadmap from './Roadmap';
import Schedule from './Schedule';

// COMPONENTS
import LineGraph from '../../components/LineGraph';

// UTILS
import addCommas from '../../utils/addCommas';
import getStrPart from '../../utils/getStrPart';
import displayDate from '../../utils/displayDate';

// STYLES
import styles from './Launchpad.module.scss';

function Launchpad({ data }) {
  const videoId = getStrPart(data.youtube, 'watch?v=', '&');
  const infoBoxLeftItems = {
    'Token Distribution': displayDate(data.startDate),
    'Min Buy': data.minBuy + ' BNB',
    'Max Buy': data.maxBuy + ' BNB',
    'Token Price': '1 BNB = ' + data.priceUsd,
    'Access Type': data.accessType,
  };

  const infoBoxRightItems = {
    'Token Name': data.displayName,
    'Token Symbol': data.symbol,
    Decimals: 18,
    Address: data.address,
    'Total Supply': addCommas(100000000),
  };

  const traffic = [
    {
      date: new Date().toLocaleDateString(),
      visits: 967777,
    },
    {
      date: new Date().toLocaleDateString(),
      visits: 1700000,
    },
    {
      date: new Date().toLocaleDateString(),
      visits: 3400232,
    },
    {
      date: new Date().toLocaleDateString(),
      visits: 1200345,
    },
    {
      date: new Date().toLocaleDateString(),
      visits: 2567343,
    },
    {
      date: new Date().toLocaleDateString(),
      visits: 850326,
    },
  ];

  const annual = [];
  for (let i = 0; i < 160; i++) {
    const oneDay = 1000 * 60 * 60 * 24;
    let members = 23 + i;

    if (i % 20 === 0) {
      //members = members - Math.floor(Math.random() * 12);
    }

    annual.push({
      date: new Date(new Date().valueOf() + oneDay * (i + 1)),
      value: members,
      id: i + 1,
    });
  }

  return (
    <>
      <section className={cn(styles['launchpad-section'], 'flx-ctr-ctr')}>
        <div className={cn(styles['launchpad'])}>
          <Bar data={data} />

          <div className={cn(styles['info-boxes'], 'flx-btw-str')}>
            <InfoBox title={data.displayName} items={infoBoxLeftItems} />
            <div id={styles['info-box-seperator']} />
            <InfoBox title="Token Info" items={infoBoxRightItems} />
          </div>

          <div className={cn(styles['summary'], 'flx-str-str')}>
            <div className={cn(styles['summary-left'])}>
              <div className={cn(styles['summary-title'])}>DESCRIPTION</div>

              {data.description.split('\n').map((current, index) => {
                return <p key={index}>{current}</p>;
              })}
            </div>

            <div className={cn(styles['summary-right'])}>
              <iframe
                width="560"
                height="315"
                src={'https://www.youtube.com/embed/' + videoId}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>

          <Tokenomics data={data} />

          <Roadmap data={data} />

          <Schedule data={data} />
        </div>
      </section>
    </>
  );
}

export default Launchpad;
