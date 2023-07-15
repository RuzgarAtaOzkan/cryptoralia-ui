// MODULES
import React from 'react';

// CONTEXT
import { Provider } from '../context';

// COMPONENTS
import HeaderV2 from '../components/HeaderV2'; // uses store so provider has to be the parent.

// PAGE COMPONENTS
import Page404 from '../page-components/404';

// COMPONENTS
import Footer from '../components/Footer';

// STYLES
import '../styles/index.scss';

function App({ Component, pageProps }) {
  if (pageProps.statusCode) {
    return (
      <>
        <main>
          <Page404 />
          <Footer />
        </main>
      </>
    );
  }

  return (
    <>
      <Provider>
        <Component {...pageProps} />
      </Provider>
    </>
  );
}

export default App;
