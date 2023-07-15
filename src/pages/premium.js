// COMPONENT
import DefaultLayout from '../components/Layouts/Default';
import Head from '../components/Head';

// PAGE COMPONENTS
import PremiumPage from '../page-components/Premium';

// UTILS
import getTokens from '../utils/getTokens';
import getAds from '../utils/getAds';

// This gets called on every request
export async function getServerSideProps({ req }) {
  const url = 'https://cryptoralia.com' + req.url;
  const resolves = await Promise.all([getAds()]);

  if (!resolves) {
    return {
      props: {
        url,
        data: {},
        ads,
      },
    };
  }

  const ads = resolves[0] ? resolves[0].data : [];

  return {
    props: {
      url,
      data: {},
      ads,
    },
  };
}

export default function Premium({ url, data, ads }) {
  return (
    <>
      <Head title="Premium | Cryptoralia" description="You can enjoy many privileges by upgrading to Cryptoralia Premium. Premium customers can access and review a lot of data. Cryptoralia is a premium privilege." canonical={url} />
      <DefaultLayout element={<PremiumPage />} ads={ads} />
    </>
  );
}
