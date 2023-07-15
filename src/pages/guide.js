// COMPONENT
import DefaultLayout from '../components/Layouts/Default';
import Head from '../components/Head';

// PAGE COMPONENTS
import GuidesPage from '../page-components/Guides';

// UTILS
import getGuides from '../utils/getGuides';
import getAds from '../utils/getAds';

export async function getServerSideProps({ req }) {
  const url = 'https://cryptoralia' + req.url;
  const resolves = await Promise.all([getGuides('?limit=20&title=0'), getAds()]);

  if (!resolves) {
    return {
      notFound: true,
    };
  }

  const guides = resolves[0] ? resolves[0].data : [];
  const ads = resolves[1] ? resolves[1].data : [];

  return {
    props: {
      url,
      data: guides,
      ads,
    },
  };
}

function Guides({ data, url, ads }) {
  return (
    <>
      <Head title="Guide | Cryptoralia" description="Find out what you don't know right away with the crypto guide. Learning more about crypto always puts you one step ahead. Start learning now with Cryptoralia Guide." canonical={url} />
      <DefaultLayout element={<GuidesPage data={data} />} ads={ads} />
    </>
  );
}

export default Guides;
