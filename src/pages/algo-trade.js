// COMPONENT
import DefaultLayout from '../components/Layouts/Default';
import Head from '../components/Head';

// PAGE COMPONENTS
import AlgoTradesPage from '../page-components/AlgoTrades';
import getAds from '../utils/getAds';

export async function getServerSideProps({ req }) {
  const url = 'https://cryptoralia' + req.url;
  const resolves = await Promise.all([getAds()]);

  if (!resolves) {
    return {
      props: {
        url,
      },
    };
  }

  const ads = resolves[0] ? resolves[0].data : [];

  return {
    props: {
      url,
      ads,
    },
  };
}

function AlgoTrade({ url, ads }) {
  return (
    <>
      <Head title="Algo Trade | Cryptoralia" description="Get the latest crypto signals now with Algo Trade. Start earning now with Cryptoralia Algo Trade. Algo Trade sends signals from certain indicators." canonical={url} />
      <DefaultLayout element={<AlgoTradesPage />} ads={ads} />
    </>
  );
}

export default AlgoTrade;
