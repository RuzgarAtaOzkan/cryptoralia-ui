// COMPONENT
import DefaultLayout from '../components/Layouts/Default';
import Head from '../components/Head';

// PAGE COMPONENTS
import MyNFTsPage from '../page-components/MyNFTs';

// This gets called on every request
export async function getServerSideProps({ req }) {
  const url = 'https://cryptoralia.com' + req.url;

  return {
    props: {
      url,
    },
  };
}

export default function MyNFTs({ url }) {
  return (
    <>
      <Head title="My NFTs | Cryptoralia" canonical={url} />
      <DefaultLayout auth element={<MyNFTsPage />} />
    </>
  );
}
