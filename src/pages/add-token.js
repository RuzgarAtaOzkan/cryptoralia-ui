// COMPONENT
import DefaultLayout from '../components/Layouts/Default';
import Head from '../components/Head';

// PAGE COMPONENTS
import AddTokenPage from '../page-components/AddToken';
import getAds from '../utils/getAds';

// This gets called on every request
export async function getServerSideProps({ req }) {
  const url = 'https://cryptoralia.com' + req.url;
  const resolves = await Promise.all([getAds()]);

  if (!resolves) {
    return {
      props: {
        url,
        ads: [],
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

export default function AddToken({ url, ads }) {
  return (
    <>
      <Head title="Add Token | Cryptoralia" description="You can add your token to Cryptoralia immediately. Get listed on Cryptoralia, which has thousands of tokens." canonical={url} />
      <DefaultLayout element={<AddTokenPage />} ads={ads} />
    </>
  );
}
