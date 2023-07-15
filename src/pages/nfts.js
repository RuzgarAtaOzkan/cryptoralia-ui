// COMPONENT
import DefaultLayout from '../components/Layouts/Default';
import Head from '../components/Head';

// PAGE COMPONENTS
import NFTsPage from '../page-components/NFTs';

// This gets called on every request
export async function getServerSideProps({ req }) {
  const url = 'https://cryptoralia.com' + req.url;

  return {
    props: {
      url,
    },
  };
}

export default function NFTs({ url }) {
  return (
    <>
      <Head title="NFT Marketplace | Cryptoralia" canonical={url} />
      <DefaultLayout element={<NFTsPage />} />
    </>
  );
}
