// COMPONENT
import DefaultLayout from '../../components/Layouts/Default';
import Head from '../../components/Head';

// PAGE COMPONENTS
import GuidePage from '../../page-components/Guide';

// UTILS
import getGuide from '../../utils/getGuide';
import getGuides from '../../utils/getGuides';
import getAds from '../../utils/getAds';
import getGuideImg from '../../utils/getGuideImg';

export async function getServerSideProps({ req, query }) {
  const title = query.title;
  const url = 'https://cryptoralia' + req.url;
  const resolves = await Promise.all([getGuide(title.replace(/-/g, ' ')), getGuides('?limit=20&title=0'), getAds()]);

  const guide = resolves[0] ? resolves[0].data : null;
  const guides = resolves[1] ? resolves[1].data : [];
  const ads = resolves[2] ? resolves[2].data : [];

  if (!guide) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      url,
      data: guide,
      guides,
      ads,
    },
  };
}

function Guide({ data, guides, url, ads }) {
  let title = 'Not Found';
  let description = '';
  let ogImage = '';

  if (data) {
    title = data.displayTitle + ' | Cryptoralia';
    description = data.description;
    ogImage = getGuideImg(data.content);
  }

  return (
    <>
      <Head title={title} description={description} canonical={url} og={{ description, image: ogImage }} />
      <DefaultLayout element={<GuidePage data={data} guides={guides} />} ads={ads} />
    </>
  );
}

export default Guide;
