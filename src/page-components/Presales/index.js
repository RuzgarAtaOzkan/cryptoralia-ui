// MODULES
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import cn from 'classnames';

// COMPONENTS
import Anchor from '../../components/Anchor';
import FAQ from '../../components/FAQ';
import TokenTable from '../../components/Table';
import TokenTableMobile from '../../components/TableMobile';
import PresaleTable from '../../components/PresaleTable';
import PresaleTableMobile from '../../components/PresaleTableMobile';

// STYLES
import styles from './Presales.module.scss';

function PresalesPage({ data, promotedTokens, votes }) {
  const [tokens, setTokens] = useState(data || []);

  useEffect(() => {
    if (data) {
      setTokens([...data]);
    }
  }, [data]);

  useEffect(() => {
    console.log(promotedTokens);
  });

  return (
    <>
      <section className={cn(styles['presales-section'], 'flx-ctr-ctr-clm')}>
        <PresaleTable data={tokens} promotedTokens={promotedTokens} title="<h1>Presale Tokens</h1>" desc="Find your favorite presale token and buy presale tokens. Always do your own research." votes={votes} />
        <PresaleTableMobile data={tokens} promotedTokens={promotedTokens} title="<h1>Presale Tokens</h1>" desc="Find your favorite presale token and buy presale tokens. Always do your own research." votes={votes} />
      </section>

      <section className={cn(styles['faq-section'], 'flx-ctr-ctr-clm')}>
        <FAQ title="What are Presale Tokens?" content={<>Projects on the blockchain of a cryptocurrency are called tokens. Tokens do not have a blockchain of their own. They use the blockchain technology of their cryptocurrency. Hundreds of new tokens are released every day. These tokens can be released directly or are first presale and then released on the market. The prices of the pre-sale tokens will be the initial first-to-market prices. The market value is calculated according to the cheapest. This situation is different in scam projects. As soon as the token is released, its price may drop. Therefore, care must be taken when participating in presales of tokens.</>} />

        <FAQ
          title="Discover Presale Tokens with Cryptoralia"
          content={
            <>
              How do investors discover the best cryptocurrency projects like shiba, doge or stepn before you do? Those investors are using Cryptoralia. They are the first to discover presale tokens thanks to Cryptoralia. These coins or tokens are listed on Cryptoralia before being listed on Coinmarketcap or any exchange. You can find <Anchor href="https://cryptoralia.com/presale-tokens">presale tokens</Anchor> on Cryptoralia. You can earn income by buying presale tokens. But before investing in presale tokens, you should do extensive research. You can find reviews, research reports and market values of new tokens on Cryptoralia. You should follow the developments and news of the token you want to invest. When investing, you should do really good research. Otherwise, your fund may drop to zero. You can research on <Anchor href="https://cryptoralia.com">Cryptoralia</Anchor> to avoid losing money against scammers. As of 2021, participation in crypto presales has increased. In addition,
              the number of new tokens has increased a lot. That{"'"}s why investors who participate in crypto presales need to be very selective. Many cryptocurrencies are listed on Cryptoralia before they are listed anywhere. This way, you can discover before anyone else. Always do your own research. Do not choose based on the investment advice that anyone will give you.
            </>
          }
        />
      </section>
    </>
  );
}

export default PresalesPage;
