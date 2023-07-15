// COMPONENT
import DefaultLayout from '../components/Layouts/Default';
import Head from '../components/Head';

// PAGE COMPONENTS
import TrendingPage from '../page-components/Trending';

// UTILS
import getTokens from '../utils/getTokens';
import getAds from '../utils/getAds';
import getVotes from '../utils/getVotes';

// This gets called on every request
export async function getServerSideProps({ req }) {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const url = 'https://cryptoralia.com' + req.url;
  const resolves = await Promise.all([getTokens('?status=2&limit=20&name=0&promoted=0&gainer=0&recent=0&trending=1&presale=0'), getAds(), getVotes(ip)]);

  if (!resolves) {
    return {
      props: {
        url,
        data: [],
        ads: [],
        votes: '',
      },
    };
  }

  const tokens = resolves[0] ? resolves[0].data : [];
  const ads = resolves[1] ? resolves[1].data : [];
  const votes = resolves[2] ? resolves[2].data : '';

  return {
    props: {
      url,
      data: tokens,
      ads,
      votes,
    },
  };
}

export default function Trending({ url, data, ads, votes }) {
  return (
    <>
      <Head title="Trending | Cryptoralia" description="You can find and review trending tokens on Cryptoralia. Trend tokens show the tokens that have been bullish in the last 24 hours." canonical={url} />
      <DefaultLayout element={<TrendingPage data={data} votes={votes} />} ads={ads} />
    </>
  );
}
