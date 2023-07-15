// COMPONENT
import DefaultLayout from '../components/Layouts/Default';
import Head from '../components/Head';

// PAGE COMPONENTS
import BlogPage from '../page-components/Blog';

export async function getServerSideProps({ req }) {
  const url = 'https://cryptoralia' + req.url;

  return {
    props: {
      url,
      data: [],
    },
  };
}

function Blog({ data, url }) {
  return (
    <>
      <Head title="Blog | Cryptoralia" canonical={url} />
      <DefaultLayout element={<BlogPage data={data} />} />
    </>
  );
}

export default Blog;
