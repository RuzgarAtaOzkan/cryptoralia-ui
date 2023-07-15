// COMPONENT
import DefaultLayout from '../components/Layouts/Default';
import Head from '../components/Head';

// PAGE COMPONENTS
import ProfilePage from '../page-components/Profile';

// This gets called on every request
export async function getServerSideProps({ req }) {
  const url = 'https://cryptoralia.com' + req.url;

  return {
    props: {
      url,
    },
  };
}

export default function Profile({ url }) {
  return (
    <>
      <Head title="Profile | Cryptoralia" canonical={url} />
      <DefaultLayout auth element={<ProfilePage />} />
    </>
  );
}
