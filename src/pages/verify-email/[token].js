// COMPONENT
import DefaultLayout from '../../components/Layouts/Default';
import Head from '../../components/Head';

// PAGE COMPONENTS
import VerifyEmailPage from '../../page-components/VerifyEmail';

// This gets called on every request
export async function getServerSideProps({ req }) {
  const url = 'https://cryptoralia.com' + req.url;

  return {
    props: {
      url,
    },
  };
}

export default function VerifyEmail({ url }) {
  return (
    <>
      <Head canonical={url} />
      <DefaultLayout element={<VerifyEmailPage />} />
    </>
  );
}
