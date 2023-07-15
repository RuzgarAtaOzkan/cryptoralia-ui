// COMPONENT
import DefaultLayout from '../components/Layouts/Default';
import Head from '../components/Head';

// PAGE COMPONENTS
import MyAirdropsPage from '../page-components/MyAirdrops';

function MyAirdrops() {
  return (
    <>
      <Head title="My Airdops | Cryptoralia" />
      <DefaultLayout auth element={<MyAirdropsPage />} />
    </>
  );
}

export default MyAirdrops;
