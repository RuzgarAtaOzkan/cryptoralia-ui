// COMPONENT
import DefaultLayout from '../components/Layouts/Default';
import Head from '../components/Head';

// PAGE COMPONENTS
import PresalesPage from '../page-components/Presales';

// UTILS
import getTokens from '../utils/getTokens';
import getAds from '../utils/getAds';
import getVotes from '../utils/getVotes';

// This gets called on every request
export async function getServerSideProps({ req }) {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const url = 'https://cryptoralia.com' + req.url;
  const resolves = await Promise.all([getTokens('?status=2&limit=20&name=0&promoted=0&gainer=0&new=0&trending=0&presale=1'), getTokens('?status=2&limit=20&name=0&promoted=1&gainer=0&new=0&trending=0&presale=1'), getAds(), getVotes(ip)]);

  if (!resolves) {
    return {
      props: {
        url,
        data: [],
        ads: [],
      },
    };
  }

  const tokens = resolves[0] ? resolves[0].data : [];
  const promotedTokens = resolves[1] ? resolves[1].data : [];
  const ads = resolves[2] ? resolves[2].data : [];
  const votes = resolves[3] ? resolves[3].data : '';

  return {
    props: {
      url,
      data: tokens,
      promotedTokens,
      ads,
      votes,
    },
  };
}

export default function PresaleTokens({ data, promotedTokens, url, ads, votes }) {
  return (
    <>
      <Head title="Presale Tokens 2022 | Cryptoralia" description="Check out the newly released crypto presale now. Access popular presale coins with Cryptoralia. Check out the presale tokens." canonical={url} />
      <DefaultLayout element={<PresalesPage data={data} promotedTokens={promotedTokens} votes={votes} />} ads={ads} />
    </>
  );
}
