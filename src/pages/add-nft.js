// COMPONENT
import DefaultLayout from '../components/Layouts/Default';
import Head from '../components/Head';

// PAGE COMPONENTS
import AddNFTPage from '../page-components/AddNFT';

// This gets called on every request
export async function getServerSideProps({ req }) {
  const url = 'https://cryptoralia.com' + req.url;

  return {
    props: {
      url,
    },
  };
}

export default function AddNFT({ url }) {
  return (
    <>
      <Head title="Add NFT | Cryptoralia" canonical={url} />
      <DefaultLayout auth element={<AddNFTPage />} />
    </>
  );
}
