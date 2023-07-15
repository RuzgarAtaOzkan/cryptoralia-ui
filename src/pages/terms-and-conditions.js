// COMPONENT
import DefaultLayout from '../components/Layouts/Default';
import Head from '../components/Head';

// PAGE COMPONENTS
import TermsAndConditionsPage from '../page-components/TermsAndConditions';

// This gets called on every request
export async function getServerSideProps({ req }) {
  const url = 'https://cryptoralia.com' + req.url;

  return {
    props: {
      url,
    },
  };
}

export default function TermsAndConditions({ url }) {
  return (
    <>
      <Head title="Terms & Conditions | Cryptoralia" description="By downloading or using the app, these terms will automatically apply to you – you should make sure therefore that you read them carefully before using the app." canonical={url} />
      <DefaultLayout element={<TermsAndConditionsPage />} />
    </>
  );
}
