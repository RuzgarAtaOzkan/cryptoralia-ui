// COMPONENT
import DefaultLayout from '../components/Layouts/Default';
import Head from '../components/Head';

// PAGE COMPONENTS
import MyTokensPage from '../page-components/MyTokens';

// UTILS
import getAds from '../utils/getAds';

export async function getServerSideProps({ req }) {
  const url = 'https://cryptoralia' + req.url;
  const resolves = await Promise.all([getAds()]);

  if (!resolves) {
    return {
      url,
      data: [],
      ads: [],
    };
  }

  const ads = resolves[0] ? resolves[0].data : [];

  return {
    props: {
      url,
      data: [],
      ads,
    },
  };
}

function MyTokens({ url, ads }) {
  return (
    <>
      <Head title="My Tokens | Cryptoralia" />
      <DefaultLayout auth element={<MyTokensPage />} ads={ads} />
    </>
  );
}

export default MyTokens;
