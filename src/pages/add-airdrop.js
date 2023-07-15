// COMPONENT
import DefaultLayout from '../components/Layouts/Default';
import Head from '../components/Head';

// PAGE COMPONENTS
import AddAirdropPage from '../page-components/AddAirdrop';

// UTILS
import getAirdrops from '../utils/getAirdrops';

// This gets called on every request
export async function getServerSideProps({ req }) {
  const url = 'https://Cryptoralia.com' + req.url;

  return {
    props: {
      url,
    },
  };
}

export default function AddAirdrop({ url }) {
  return (
    <>
      <Head title="Add Airdrop | Cryptoralia" canonical={url} />
      <DefaultLayout element={<AddAirdropPage />} />
    </>
  );
}
