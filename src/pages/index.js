// MODULES

// COMPONENT
import DefaultLayout from '../components/Layouts/Default';
import Head from '../components/Head';

// PAGE COMPONENTS
import HomePage from '../page-components/Home';

// UTILS
import getTokens from '../utils/getTokens';
import getAds from '../utils/getAds';
import getVotes from '../utils/getVotes';

export async function getServerSideProps({ req }) {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const url = 'https://cryptoralia.com' + req.url;
  let resolves = [];

  try {
    resolves = await Promise.all([getTokens('?status=2&limit=20&name=0&promoted=1&gainer=0&recent=0&trending=0&presale=0'), getTokens('?status=2&limit=20&name=0&promoted=0&gainer=0&recent=0&trending=1&presale=0'), getTokens('?status=2&limit=20&name=0&promoted=0&gainer=1&recent=0&trending=0&presale=0'), getTokens('?status=2&limit=20&name=0&promoted=&gainer=0&recent=1&trending=0&presale=0'), getAds(), getVotes(ip)]);

    if (!resolves) {
      return {
        props: {
          data: [],
          promotedTokens: [],
          gainerTokens: [],
          newTokens: [],
          url,
        },
      };
    }

    const promotedTokens = resolves[0] ? resolves[0].data : [];
    const trendingTokens = resolves[1] ? resolves[1].data : [];
    const gainerTokens = resolves[2] ? resolves[2].data : [];
    const newTokens = resolves[3] ? resolves[3].data : [];
    const ads = resolves[4] ? resolves[4].data : [];
    const votes = resolves[5] ? resolves[5].data : [];

    return {
      props: {
        data: trendingTokens,
        promotedTokens,
        gainerTokens,
        newTokens,
        url,
        ads,
        votes,
      },
    };
  } catch (error) {
    return {
      props: {
        data: [],
        promotedTokens: [],
        gainerTokens: [],
        newTokens: [],
        url,
        ads: [],
        votes: '',
      },
    };
  }
}

export default function Home({ data, promotedTokens, gainerTokens, newTokens, url, ads, votes }) {
  return (
    <>
      <Head
        thumbnail="/assets/images/cryptoralia-logo.png"
        canonical={url}
        schema={
          <>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: '{"@context":"http://schema.org","@type":"Organization","name":"Cryptoralia","url":"https://cryptoralia.com","logo":"https://cryptoralia.com/assets/images/cryptoralia-icon.png","sameAs":["https://www.facebook.com/cryptoralia/","https://twitter.com/cryptoralia"]}',
              }}
            ></script>

            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: '{"@context":"http://schema.org","@type":"Table","about":"Today\'s Best Cryptocurrencies"}',
              }}
            ></script>
          </>
        }
      />

      <DefaultLayout element={<HomePage data={data} promotedTokens={promotedTokens} gainerTokens={gainerTokens} newTokens={newTokens} votes={votes} />} ads={ads} />
    </>
  );
}

/**
 
server {
  if ($host = cryptoralia.com) {
      return 301 https://$host$request_uri;
  } # managed by Certbot


  listen 80;
  listen [::]:80;
  server_name cryptoralia.com;
  return 404; # managed by Certbot


}

server {
  if ($host = admin.cryptoralia.com) {
      return 301 https://$host$request_uri;
  } # managed by Certbot



  listen 80;
  listen [::]:80;
  server_name admin.cryptoralia.com;
  return 404; # managed by Certbot


}

server {
  if ($host = api.cryptoralia.com) {
      return 301 https://$host$request_uri;
  } # managed by Certbot



  listen 80 default_server;
  listen [::]:80 default_server;
  server_name api.cryptoralia.com;
  return 404; # managed by Certbot


}


server {
  if ($host = static.cryptoralia.com) {
      return 301 https://$host$request_uri;
  } # managed by Certbot



  listen 80;
  listen [::]:80;
  server_name static.cryptoralia.com;
  return 404; # managed by Certbot


}

server {
  if ($host = www.cryptoralia.com) {
      return 301 https://$host$request_uri;
  } # managed by Certbot



  listen 80;
  listen [::]:80;
  server_name www.cryptoralia.com;
  return 404; # managed by Certbot


}}* 
 */
