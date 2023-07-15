// PAGE COMPONENTS
import LaunchpadsPage from '../page-components/Launchpads';

// COMPONENT
import DefaultLayout from '../components/Layouts/Default';
import Head from '../components/Head';

export default function Launchpads({ data, url }) {
  return (
    <>
      <Head />
      <DefaultLayout element={<LaunchpadsPage />} />
    </>
  );
}
