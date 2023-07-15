// MODULES
import Script from 'next/script';

// PAGE COMPONENTS
import LaunchpadPage from '../../page-components/Launchpad';

// COMPONENT
import DefaultLayout from '../../components/Layouts/Default';
import Head from '../../components/Head';

// UTILS
import getAds from '../../utils/getAds';

export async function getServerSideProps({ req }) {
  const url = 'https://cryptoralia.com' + req.url;
  const resolves = await Promise.all([getAds()]);

  if (!resolves) {
    return {
      props: {
        data: {},
        ads: [],
      },
    };
  }

  const ads = resolves[0] ? resolves[0].data : [];

  return {
    props: {
      data: {
        name: 'cryptoralia',
        displayName: 'Cryptoralia',
        symbol: 'TKNH',
        network: 'BSC',
        address: '0x1f35c32cbbf2c175d8f2f8b0d00b41978a5be6c1',
        imgURL: '/assets/images/cryptoralia-logo.png',
        startDate: '2022-07-28T17:16:28',
        endDate: '2022-08-30T17:16:28',
        priceUsd: 1.45,
        presaleType: 'seed',
        targetPrice: 100,
        minBuy: 0.1,
        maxBuy: 1,
        accessType: 'public',
        youtube: 'https://www.youtube.com/watch?v=w3nH0uEHh7Y&ab_channel=HotSince82',
        description: 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked\n\n up one of the more obscure Latin words, consectetur cites of the word in classical literature. The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from “de Finibus Bonorum et Malorum” by Cicero are also reproduced in their exact original',
        twitter: 'https://twitter.com/Cryptoralia',
        telegram: 'https://t.me/Cryptoralia.com',
        website: 'https://Cryptoralia.com',
        discord: 'https://discord',
        reddit: 'https://reddit.com/Cryptoralia',
        github: 'https://github.com/Cryptoralia',
        tokenomics: 'Marketing-18.55_Private Sale-30_Staking-34.45_Liquidity-17',
        roadmap: '2022-1-Launch on GamFi-Auction system integration.-Mobile app for iOS and Android.-Development of NFT Marketplace_2022-2-Launch on GamFi-Auction system integration.-Mobile app for iOS and Android.-Development of NFT Marketplace_2022-3-Launch on GamFi-Auction system integration.-Mobile app for iOS and Android.-Development of NFT Marketplace_2023-1-Launch on GamFi-Auction system integration.-Mobile app for iOS and Android.-Development of NFT Marketplace',
      },
      ads,
    },
  };
}

export default function Launchpad({ data, url, ads }) {
  return (
    <>
      <Head canonical={url} />
      <DefaultLayout element={<LaunchpadPage data={data} />} ads={ads} />
    </>
  );
}
