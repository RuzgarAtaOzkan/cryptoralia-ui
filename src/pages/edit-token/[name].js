// COMPONENT
import DefaultLayout from '../../components/Layouts/Default';
import Head from '../../components/Head';

// PAGE COMPONENTS
import EditTokenPage from '../../page-components/EditToken';

// UTILS
import getToken from '../../utils/getToken';

export async function getServerSideProps({ req, params }) {
  const url = 'https://cryptoralia.com' + req.url;
  const name = params.name;

  try {
    const response = await getToken(name.replace(/-/g, ' '));

    if (!response) {
      return {
        props: {
          data: null,
          url,
        },
      };
    }

    return {
      props: {
        data: response.data,
        url,
      },
    };
  } catch (err) {}
}

export default function EditToken({ data, url }) {
  return (
    <>
      <Head title="Edit Token | Cryptoralia" canonical={url} />
      <DefaultLayout auth element={<EditTokenPage data={data} />} />
    </>
  );
}
