// COMPONENT
import DefaultLayout from '../components/Layouts/Default';
import Head from '../components/Head';

// PAGE COMPONENTS
import PromotePage from '../page-components/Promote';

export async function getServerSideProps({ req }) {
  const url = 'https://cryptoralia.com' + req.url;

  return {
    props: {
      url,
    },
  };
}

// Recently Added | Trending | Sffsdsdf
export default function Promote({ url }) {
  return (
    <>
      <Head title="Promote | Cryptoralia" description="Advertising on Cryptoralia is easy. You can reach potential investors by advertising on Cryptoralia, which receives thousands of visitors per day." canonical={url} />
      <DefaultLayout element={<PromotePage />} />
    </>
  );
}
