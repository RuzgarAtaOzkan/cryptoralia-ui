// COMPONENT
import DefaultLayout from '../components/Layouts/Default';
import Head from '../components/Head';

// PAGE COMPONENTS
import PrivacyPolicyPage from '../page-components/PrivacyPolicy';

// This gets called on every request
export async function getServerSideProps({ req }) {
  const url = 'https://cryptoralia.com' + req.url;

  return {
    props: {
      url,
    },
  };
}

export default function PrivacyPolicy({ url }) {
  return (
    <>
      <Head title="Privacy Policy | Cryptoralia" description="Cryptoralia built the Cryptoralia app as an Ad Supported app. This SERVICE is provided by Cryptoralia at no cost and is intended for use as is." canonical={url} />
      <DefaultLayout element={<PrivacyPolicyPage />} />
    </>
  );
}
