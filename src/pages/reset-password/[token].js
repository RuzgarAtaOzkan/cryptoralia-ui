// COMPONENT
import DefaultLayout from '../../components/Layouts/Default';
import Head from '../../components/Head';

// PAGE COMPONENTS
import ResetPasswordPage from '../../page-components/ResetPassword';

export default function PasswordReset() {
  return (
    <>
      <Head />
      <DefaultLayout element={<ResetPasswordPage />} />
    </>
  );
}
