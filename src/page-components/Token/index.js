// MODULES
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import AdSense from 'react-ssr-adsense';
import cn from 'classnames';

// CONTEXT
import { useStore } from '../../context';

// PAGES
import Page404 from '../404';

// COMPONENTS
import Anchor from '../../components/Anchor';
import Button from '../../components/Button';
import Table from '../../components/Table';
import TableMobile from '../../components/TableMobile';
import BarGraph from '../../components/BarGraph';
import LineGraph from '../../components/LineGraph';
import Swapper from '../../components/Swapper/index';

// COMPONENTS > ICONS
import CopyIcon from '../../components/Icons/Copy';
import TelegramIcon from '../../components/Icons/Telegram';
import EarthIcon from '../../components/Icons/Earth';
import TwitterIcon from '../../components/Icons/Twitter';
import LoadingCircleIcon from '../../components/Icons/LoadingCircle';
import AngleDown from '../../components/Icons/AngleDown';
import AngleUp from '../../components/Icons/AngleUp';
import GithubIcon from '../../components/Icons/Github';
import RedditIcon from '../../components/Icons/Reddit';
import DiscordIcon from '../../components/Icons/Discord';

// UTILS
import processTokenProps from '../../utils/processTokenProps';
import voteToken from '../../utils/voteToken';
import copy from '../../utils/copy';
import getTokens from '../../utils/getTokens';
import displayFloat from '../../utils/displayFloat';
import addCommas from '../../utils/addCommas';

// STYLES
import styles from './Token.module.scss';

function placeWebsiteMonthlyVisits(str, setData) {
  if (!str || typeof str !== 'string') {
    return;
  }

  const arr = [];
  const data = JSON.parse(str);

  for (const key in data) {
    const obj = {
      date: new Date(),
      visits: 0,
    };

    obj.date = new Date(key);
    obj.visits = data[key];
    arr.push(obj);
  }

  setData(arr);
}

function placeTwitterDailyFollowers(str, setData) {
  if (!str || typeof str !== 'string') {
    return;
  }

  const data = JSON.parse(str);
  const arr = [];

  for (const key in data) {
    arr.push({ date: new Date(key), value: data[key] });
  }

  setData(arr);
}

function Token({ data, votes = '' }) {
  const store = useStore();
  const tableSectionRef = useRef();

  const [width, setWidth] = useState(1500);
  const [websiteMonthlyVisits, setWebsiteMonthlyVisits] = useState([]);
  const [twitterDailyFollowers, setTwitterDailyFollowers] = useState([]);
  const [token, setToken] = useState(processTokenProps(data));
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [description, setDescription] = useState([]);
  const [tokenVotes, setTokenVotes] = useState(votes);
  const [trendingTokens, setTrendingTokens] = useState([]);
  const [promotedTokens, setPromotedTokens] = useState([]);
  const [scrolledLoading, setScrolledLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [chartActive, setChartActive] = useState(false);

  async function getScrollTokens() {
    setScrolledLoading(true);

    const response = await Promise.all([getTokens('?status=2&limit=10&name=0&trending=1'), getTokens('?status=2&limit=10&name=0&promoted=1')]);

    setScrolledLoading(false);

    if (!response) {
      return;
    }

    if (!response[0] || !response[1]) {
      return;
    }

    const trendingTokens = response[0].data;
    const promotedTokens = response[1].data;
    const reducedTrendingTokens = [];

    for (let i = 0; i < trendingTokens.length; i++) {
      let exists = false;

      for (let j = 0; j < promotedTokens.length; j++) {
        if (trendingTokens[i].name === promotedTokens[j].name) {
          exists = true;
        }
      }

      if (!exists) {
        reducedTrendingTokens.push(trendingTokens[i]);
      }
    }

    setTrendingTokens(reducedTrendingTokens);
    setPromotedTokens(promotedTokens);
  }

  function onScroll() {
    if (tableSectionRef.current) {
      const tableSectionY = tableSectionRef.current.getBoundingClientRect().y;

      if (tableSectionY + 150 < window.innerHeight && !scrolled) {
        setScrolled(true);
      }
    }
  }

  function onResize() {
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    onScroll();
    onResize();

    let sellAmount = '1';
    for (let i = 0; i < token.decimals; i++) {
      sellAmount += '0';
    }

    axios.get(`https://bsc.api.0x.org/swap/v1/price?sellToken=${token.address}&buyToken=BUSD&sellAmount=${sellAmount}`).then((res) => {
      console.log(res);
      setToken({
        ...token,
        priceUsd: addCommas(displayFloat(Number(res.data.price))),
      });
    });

    setTimeout(() => {
      if (!chartActive) {
        setChartActive(true);
      }
    }, 2000);

    placeWebsiteMonthlyVisits(token.websiteMonthlyVisits, setWebsiteMonthlyVisits);

    placeTwitterDailyFollowers(token.twitterDailyFollowers, setTwitterDailyFollowers);

    window.addEventListener('scroll', onResize);
    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('scroll', onResize);
    };
  }, []);

  useEffect(() => {
    if (scrolled) {
      getScrollTokens();
    }
  }, [scrolled]);

  useEffect(() => {
    if (data) {
      setDescription(data.description.split('\n'));
    }
  }, [data]);

  return !token ? (
    <Page404 href="/" title="Home" />
  ) : (
    <>
      <Swapper data={token} />

      <section className={cn(styles['token-section'], 'flx-ctr-ctr')}>
        <div className={cn(styles['container'], 'flx-btw-str')}>
          <div className={cn(styles['left'])}>
            <div className={cn(styles['logo-names-address-socials'], 'flx-str-ctr')}>
              <div className={cn(styles['logo-container'], 'flx-ctr-ctr')}>
                <img title={token.displayName + ' Token'} alt={token.name.replace(/\s/g, '-') + '-logo'} src={token.imgURL} width="150" height="150" loading="lazy" decoding="async" />
              </div>

              <div className={cn(styles['names-address'])}>
                <div className={cn(styles['name-symbol-network'], 'flx-str-ctr')}>
                  <h1>{token.displayName}</h1>

                  {token.verified ? (
                    <div className={cn(styles['verified'])}>
                      <img src="/assets/images/cryptoralia-verified.png" alt="cryptoralia-verified" title="Verified" />
                    </div>
                  ) : null}

                  <div className={cn(styles['symbol'])}>${token.symbol}</div>
                  <div className={cn(styles['network'], 'flx-ctr-ctr')}>
                    <img title="BSC Network Logo" alt="BSC Network Logo" src="/assets/images/bnb.png" />
                    <div className={cn(styles['channel-name'])}>{token.network}</div>
                  </div>
                </div>

                <div className={cn(styles['contract-address'], 'flx-str-ctr')}>
                  <span className={cn(styles['address-title'])}>BSCContract Address:</span>

                  <span className={cn(styles['address'])}>{copied ? 'Copied!' : token.address}</span>

                  <div
                    onClick={async () => {
                      setCopied(true);
                      await copy(data.address);

                      setTimeout(() => {
                        setCopied(false);
                      }, 700);
                    }}
                    className={cn(styles['copy-icon'], 'flx-ctr-ctr')}
                  >
                    <CopyIcon />
                  </div>
                </div>

                <div className={cn(styles['socials'], 'flx-str-ctr')}>
                  <Anchor rel="nofollow" href={token.website} target="_blank" className={cn(styles['social'])}>
                    <EarthIcon />
                  </Anchor>

                  {token.telegram ? (
                    <Anchor rel="nofollow" href={token.telegram} target="_blank">
                      <TelegramIcon />
                    </Anchor>
                  ) : null}

                  {token.twitter ? (
                    <Anchor rel="nofollow" href={token.twitter} target="_blank">
                      <TwitterIcon />
                    </Anchor>
                  ) : null}

                  {token.discord ? (
                    <Anchor rel="nofollow" href={token.discord} target="_blank">
                      <DiscordIcon />
                    </Anchor>
                  ) : null}

                  {token.github ? (
                    <Anchor rel="nofollow" href={token.github} target="_blank">
                      <GithubIcon />
                    </Anchor>
                  ) : null}

                  {token.reddit ? (
                    <Anchor rel="nofollow" href={token.reddit} target="_blank">
                      <RedditIcon />
                    </Anchor>
                  ) : null}

                  <Anchor rel="nofollow" href={'https://bscscan.com/token/' + token.address} target="_blank" className={cn(styles['social'], 'flx-str-ctr')}>
                    <img src="/assets/icons/bscscan.png" alt="bscscan-icon" title="Bscscan Icon" />
                  </Anchor>
                </div>
              </div>
            </div>

            <div className={cn(styles['chart'], width <= 650 && token.priceUsd === null ? styles['delete'] : null)}>
              <div className={styles['dexscreener-embed']}>{chartActive ? <iframe src={'https://dexscreener.com/bsc/' + token.address + '?embed=1&theme=dark&info=0'}></iframe> : null}</div>
            </div>

            {websiteMonthlyVisits.length || twitterDailyFollowers.length ? (
              <div className={cn(styles['left-graphs'])}>
                {websiteMonthlyVisits.length ? (
                  <div className={cn(styles['bar-graph'])}>
                    <BarGraph
                      data={websiteMonthlyVisits}
                      info={{
                        url: token.website,
                        categoryRank: token.websiteCategoryRank,
                        globalRank: token.websiteGlobalRank,
                      }}
                    />
                  </div>
                ) : null}

                {twitterDailyFollowers.length ? (
                  <div className={cn(styles['line-graph'])}>
                    <LineGraph
                      data={twitterDailyFollowers}
                      info={{
                        url: token.twitter,
                      }}
                    />
                  </div>
                ) : null}
              </div>
            ) : null}

            {token.priceUsd ? (
              <div className={cn(styles['left-faq'])}>
                <h2>Frequently Asked Questions</h2>

                <div className={cn(styles['faq-part'])}>
                  <h3>What is the {token.displayName} price?</h3>
                  <p>
                    what is price of {token.displayName} is <strong>${token.priceUsd}</strong>.
                  </p>
                </div>
                <div className={cn(styles['faq-part'])}>
                  <h3>What is the market cap of {token.displayName}?</h3>
                  <p>
                    {token.displayName} market cap of <strong>${token.marketCapUsd}</strong> and fully diluted market cap of <strong>${token.fdv}</strong>.
                  </p>
                </div>
                <div className={cn(styles['faq-part'])}>
                  <h3>What is the known liquidity of {token.displayName}?</h3>
                  <p>
                    Total known liquidity of {token.displayName} is <strong>${token.totalReserveUsd}</strong>.
                  </p>
                </div>
                <div className={cn(styles['faq-part'])}>
                  <h3>What is the price change of {token.displayName} in the last 24 hours?</h3>
                  <p>
                    {token.displayName}
                    {"'"}s price change in the last 24 hours is <strong>{token.priceChange24h}%</strong>.
                  </p>
                </div>
                <div className={cn(styles['faq-part'])}>
                  <h3>
                    What{"'"}s the last 24h {token.displayName} trading volume?
                  </h3>
                  <p>
                    Trading volume of {token.displayName} in the last 24h was <strong>${token.volume ? token.volume.h24 : null}</strong>.
                  </p>
                </div>
                <div className={cn(styles['faq-part'])}>
                  <h3>What is {token.displayName} official website?</h3>
                  <p>
                    The official website of {token.displayName} is{' '}
                    <Anchor target="_blank" rel="nofollow" href={token.website}>
                      {token.website.split('/')[2]}
                    </Anchor>
                    .
                  </p>
                </div>
                <div className={cn(styles['faq-part'])}>
                  <h3>What is {token.displayName} smart contract address?</h3>
                  <p>
                    {token.displayName} official smart contract address is{' '}
                    <Anchor href={'https://bscscan.com/token/' + token.address} rel="nofollow" target="_blank">
                      {token.address}
                    </Anchor>
                    .
                  </p>
                </div>
                <div className={cn(styles['faq-part'])}>
                  <h3>How do I buy {token.displayName}?</h3>
                  <p>
                    You can buy {token.displayName} on many decentralized exchanges. The best options are, for example, on{' '}
                    <Anchor target="_blank" rel="nofollow" href={'https://pancakeswap.finance/swap?outputCurrency=' + token.address}>
                      PancakeSwap
                    </Anchor>
                    .
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          <div className={cn(styles['right'])}>
            <div className={cn(styles['token-info'], 'flx-btw-str-clm')}>
              <div className={cn(styles['token-info-top'])}>
                <h3 className={cn(styles['token-info-title'])}>Token Information</h3>

                <div className={cn(styles['token-info-section'], 'flx-btw-ctr')}>
                  <div className={cn(styles['key'])}>{new Date(token.launchDate).valueOf() < new Date().valueOf() ? 'Launched' : 'Launching On'}</div>
                  <div className={cn(styles['value'])}>{token.launchDate}</div>
                </div>
                <div className={cn(styles['token-info-section'], 'flx-btw-ctr')}>
                  <div className={cn(styles['key'])}>Votes</div>
                  <div className={cn(styles['value'])}>{token.votes}</div>
                </div>
                <div className={cn(styles['token-info-section'], 'flx-btw-ctr')}>
                  <div className={cn(styles['key'])}>Votes Today</div>
                  <div className={cn('flx-ctr-ctr', styles['value'], token.votes24h > 0 ? styles['gain'] : null)}>
                    {token.votes24h > 0 ? <AngleUp /> : null}
                    {token.votes24h}
                  </div>
                </div>

                {token.kyc ? (
                  <div className={cn(styles['token-info-section'], 'flx-btw-ctr')}>
                    <div className={cn(styles['key'])}>KYC</div>
                    <div className={cn(styles['value'])}>
                      <Anchor className={cn(styles['kyc'])} target="_blank" href={token.kyc}>
                        KYC
                      </Anchor>
                    </div>
                  </div>
                ) : null}

                {token.audit ? (
                  <div className={cn(styles['token-info-section'], 'flx-btw-ctr')}>
                    <div className={cn(styles['key'])}>Audit</div>
                    <div className={cn(styles['value'])}>
                      <Anchor className={cn(styles['audit'])} target="_blank" href={token.audit}>
                        Audit
                      </Anchor>
                    </div>
                  </div>
                ) : null}

                {!token.priceUsd && token.presale ? (
                  <div className={cn(styles['token-info-section'], 'flx-btw-ctr')}>
                    <div className={cn(styles['key'])}>Presale Link</div>
                    <div className={cn(styles['value'])}>
                      <Anchor target="_blank" href={token.presale} className={cn(styles['presale'])}>
                        View Presale
                      </Anchor>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className={cn(styles['token-info-bottom'])}>
                <Button
                  onClick={async () => {
                    setLoading(true);
                    const response = await voteToken(token._id, store);
                    setLoading(false);

                    if (!response) {
                      return;
                    }

                    setTokenVotes(tokenVotes + '_' + token._id);

                    const updatedToken = {
                      ...token,
                      votes: token.votes + 1,
                      votes24h: token.votes24h + 1,
                    };

                    setToken(updatedToken);
                  }}
                  disabled={loading || tokenVotes.includes(token._id)}
                  className={loading || tokenVotes.includes(token._id) ? styles['no-shadow'] : null}
                  title={tokenVotes.includes(token._id) ? 'Voted for ' + token.displayName : 'Vote for ' + token.displayName}
                  primary
                />
              </div>
            </div>

            <div className={cn(styles['market-data'])}>
              <div className={cn(styles['market-data-info'], 'flx-btw-str-clm')}>
                <div className={cn(styles['market-data-info-top'])}>
                  <h3 className={cn(styles['market-data-info-title'])}>{token.displayName} Market Data</h3>

                  <div className={cn(styles['market-data-section'], 'flx-btw-ctr')}>
                    <div className={cn(styles['key'])}>Price (USD)</div>
                    <div className={cn(styles['value'])}>{token.priceUsd ? token.priceUsd + '$' : '-'}</div>
                  </div>
                  <div className={cn(styles['market-data-section'], 'flx-btw-ctr')}>
                    <div className={cn(styles['key'])}>Price Change (24h)</div>

                    <div className={cn('flx-ctr-ctr', styles['value'], Number(token.priceChange24h) > 0 ? styles['gain'] : styles['loss'])}>
                      {token.priceChange24h === null || token.priceChange24h === undefined ? (
                        '-'
                      ) : Number(token.priceChange24h) < 0 ? (
                        <>
                          <AngleDown /> {token.priceChange24h}
                        </>
                      ) : (
                        <>
                          <AngleUp /> {token.priceChange24h}
                        </>
                      )}

                      {token.priceChange24h === 0 ? token.priceChange24h : null}
                    </div>
                  </div>

                  <div className={cn(styles['market-data-section'], 'flx-btw-ctr')}>
                    <div className={cn(styles['key'])}>Volume 24h</div>
                    <div className={cn(styles['value'])}>{token.volume === undefined || token.volume === null ? '-' : '$' + token.volume.h24}</div>
                  </div>

                  <div className={cn(styles['market-data-section'], 'flx-btw-ctr')}>
                    <div className={cn(styles['key'])}>Marketcap</div>
                    <div className={cn(styles['value'])}>{token.marketCapUsd === undefined || token.marketCapUsd === null ? '-' : '$' + token.marketCapUsd}</div>
                  </div>

                  <div className={cn(styles['market-data-section'], 'flx-btw-ctr')}>
                    <div className={cn(styles['key'])}>Fully Diluted Market Cap</div>
                    <div className={cn(styles['value'])}>{token.fdv === undefined || token.fdv === null ? '-' : '$' + token.fdv}</div>
                  </div>
                  <div className={cn(styles['market-data-section'], 'flx-btw-ctr')}>
                    <div className={cn(styles['key'])}>Total Liquidity</div>
                    <div className={cn(styles['value'])}>{token.totalReserveUsd === undefined || token.totalReserveUsd === null ? '-' : '$' + token.totalReserveUsd}</div>
                  </div>
                </div>
              </div>
            </div>

            <div itemScope itemType="https://schema.org/Table" className={cn(styles['desc'])}>
              <h2 className={cn(styles['desc-title'])}>{token.displayName} Token</h2>

              <div className={cn(styles['desc-sentences'])}>
                {description.map((current, index) => {
                  if (current === '') {
                    return <br key={index}></br>;
                  }

                  return <p key={index}>{current}</p>;
                })}
              </div>
            </div>

            <div className={cn(styles['ads-area'])}>
              <AdSense client="ca-pub-7884391113621264" slot="3969267655" style={{ display: 'block' }} layout="in-article" format="fluid" />
            </div>

            <div className={cn(styles['charts-prices'])}>
              <h3 className={cn(styles['charts-prices-title'])}>{token.displayName} Price & Charts</h3>

              <div className={cn(styles['charts-prices-components'], 'flx-str-ctr')}>
                <Anchor target="_blank" href={'https://poocoin.app/tokens/' + token.address} className={cn(styles['component'], 'flx-ctr-ctr')}>
                  <img alt="Poocoin Logo" src="/assets/images/poocoin.png" />

                  <div className={cn(styles['component-title'])}>Poocoin</div>
                </Anchor>

                <Anchor target="_blank" href={'https://charts.bogged.finance/?token=' + token.address} className={cn(styles['component'], 'flx-ctr-ctr')}>
                  <img alt="Poocoin Logo" src="/assets/images/bogged.png" />

                  <div className={cn(styles['component-title'])}>Bogged Finance</div>
                </Anchor>
                <Anchor target="_blank" href={'https://pancakeswap.finance/swap?outputCurrency=' + token.address} className={cn(styles['component'], 'flx-ctr-ctr')}>
                  <img alt="Poocoin Logo" src="/assets/images/pancakeswap.png" />

                  <div className={cn(styles['component-title'])}>PancakeSwap</div>
                </Anchor>
                <Anchor target="_blank" href={'https://flooz.trade/trade/' + token.address + '?refId=sn6j3v'} className={cn(styles['component'], 'flx-ctr-ctr')}>
                  <img alt="Poocoin Logo" src="/assets/images/flooztrade.png" />

                  <div className={cn(styles['component-title'])}>Flooz.Trade</div>
                </Anchor>
              </div>
            </div>

            {websiteMonthlyVisits.length || twitterDailyFollowers.length ? (
              <div className={cn(styles['right-graphs'])}>
                {websiteMonthlyVisits.length ? (
                  <div className={cn(styles['bar-graph'])}>
                    <BarGraph
                      data={websiteMonthlyVisits}
                      info={{
                        url: token.website,
                        globalRank: token.websiteGlobalRank,
                        categoryRank: token.websiteCategoryRank,
                      }}
                    />
                  </div>
                ) : null}

                {twitterDailyFollowers.length ? (
                  <div className={cn(styles['line-graph'])}>
                    <LineGraph
                      data={twitterDailyFollowers}
                      info={{
                        url: token.twitter,
                      }}
                    />
                  </div>
                ) : null}
              </div>
            ) : null}

            {token.priceUsd ? (
              <div className={cn(styles['right-faq'])}>
                <h2>Frequently Asked Questions</h2>

                <div className={cn(styles['faq-part'])}>
                  <h3>What is the {token.displayName} price?</h3>
                  <p>
                    what is price of {token.displayName} is <strong>${token.priceUsd}</strong>.
                  </p>
                </div>
                <div className={cn(styles['faq-part'])}>
                  <h3>What is the market cap of {token.displayName}?</h3>
                  <p>
                    {token.displayName} market cap of <strong>${token.marketCapUsd}</strong> and fully diluted market cap of <strong>${token.fdv}</strong>.
                  </p>
                </div>
                <div className={cn(styles['faq-part'])}>
                  <h3>What is the known liquidity of {token.displayName}?</h3>
                  <p>
                    Total known liquidity of {token.displayName} is <strong>${token.totalReserveUsd}</strong>.
                  </p>
                </div>
                <div className={cn(styles['faq-part'])}>
                  <h3>What is the price change of {token.displayName} in the last 24 hours?</h3>
                  <p>
                    {token.displayName}
                    {"'"}s price change in the last 24 hours is <strong>{token.priceChange24h}%</strong>.
                  </p>
                </div>
                <div className={cn(styles['faq-part'])}>
                  <h3>
                    What{"'"}s the last 24h {token.displayName} trading volume?
                  </h3>
                  <p>
                    Trading volume of {token.displayName} in the last 24h was <strong>${token.volume ? token.volume.h24 : null}</strong>.
                  </p>
                </div>
                <div className={cn(styles['faq-part'])}>
                  <h3>What is {token.displayName} official website?</h3>
                  <p>
                    The official website of {token.displayName} is{' '}
                    <Anchor target="_blank" rel="nofollow" href={token.website}>
                      {token.website.split('/')[2]}
                    </Anchor>
                    .
                  </p>
                </div>
                <div className={cn(styles['faq-part'])}>
                  <h3>What is {token.displayName} smart contract address?</h3>
                  <p>
                    {token.displayName} official smart contract address is{' '}
                    <Anchor href={'https://bscscan.com/token/' + token.address} rel="nofollow" target="_blank">
                      {token.address}
                    </Anchor>
                    .
                  </p>
                </div>
                <div className={cn(styles['faq-part'])}>
                  <h3>How do I buy {token.displayName}?</h3>
                  <p>
                    You can buy {token.displayName} on many decentralized exchanges. The best options are, for example, on{' '}
                    <Anchor target="_blank" rel="nofollow" href={'https://pancakeswap.finance/swap?outputCurrency=' + token.address}>
                      PancakeSwap
                    </Anchor>
                    .
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className={cn(styles['table-section'], 'flx-ctr-ctr-clm')} ref={tableSectionRef}>
        <Table data={trendingTokens} title="Today's Best" promotedTokens={promotedTokens} votes={votes} />
        <TableMobile data={trendingTokens} title="Today's Best" promotedTokens={promotedTokens} votes={votes} />

        {scrolledLoading ? (
          <div className={cn(styles['table-loading'], 'flx-ctr-ctr')}>
            <LoadingCircleIcon />
          </div>
        ) : null}
      </section>
    </>
  );
}

export default Token;
