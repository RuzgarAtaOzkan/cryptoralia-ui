// COMPONENT
import DefaultLayout from '../components/Layouts/Default';
import Head from '../components/Head';

// PAGE COMPONENTS
import AirdropsPage from '../page-components/Airdrops';

// UTILS
import getAirdrops from '../utils/getAirdrops';
import getAds from '../utils/getAds';

// This gets called on every request
export async function getServerSideProps({ req }) {
  const url = 'https://cryptoralia.com' + req.url;
  const resolves = await Promise.all([getAirdrops('?name=0&limit=20&status=2'), getAds()]);

  if (!resolves) {
    return {
      props: {
        url,
        data: [],
        ads: [],
      },
    };
  }

  const airdrops = resolves[0] ? resolves[0].data : [];
  const ads = resolves[1] ? resolves[1].data : [];

  return {
    props: {
      url,
      data: airdrops,
      ads,
    },
  };
}

export default function Airdrops({ url, data, ads }) {
  return (
    <>
      <Head title="Crypto Airdrops | Cryptoralia" description="You can win hundreds of rewards by participating in crypto airdrops. With Cryptoralia, you can join the most popular and real airdrops with one click." canonical={url} />
      <DefaultLayout element={<AirdropsPage data={data} />} ads={ads} />
    </>
  );
}
