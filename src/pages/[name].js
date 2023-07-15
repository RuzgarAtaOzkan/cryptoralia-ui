// PAGE COMPONENTS
import TokenPage from '../page-components/Token';

// COMPONENT
import DefaultLayout from '../components/Layouts/Default';
import Head from '../components/Head';

// UTILS
import getToken from '../utils/getToken';
import getAds from '../utils/getAds';
import getVotes from '../utils/getVotes';

export async function getServerSideProps({ req, query }) {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const url = 'https://cryptoralia.com' + req.url;
  const name = query.name;
  const resolves = await Promise.all([getToken(name.replace(/-/g, ' ').toLowerCase()), getAds(), getVotes(ip)]);

  if (!resolves) {
    return {
      props: {
        url,
        data: [],
        ads: [],
      },
    };
  }

  const token = resolves[0] ? resolves[0].data : null;
  const ads = resolves[1] ? resolves[1].data : [];
  const votes = resolves[2] ? resolves[2].data : '';

  if (!token) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      url,
      data: token,
      ads,
      votes,
    },
  };
}

export default function Token({ data, url, ads, votes }) {
  let title = 'Not Found';
  let description = '';
  let thumbnail = '';
  let token = {
    name: '',
    displayName: '',
    symbol: '',
    priceUsd: 0,
    description: '',
    imgURL: '',
  };

  if (data) {
    title = `${data.displayName} (${data.symbol}) Coin Price, Market Cap, & Price Prediction`;
    description = `${data.displayName} (${data.symbol}) price data, market cap, charts, volume, liquidity and price prediction. Get the latest news.`;
    thumbnail = data.imgURL;
    token = data;
  }

  return (
    <>
      <Head
        title={title}
        description={description}
        token={token}
        thumbnail={thumbnail}
        canonical={url}
        schema={
          <>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: `{"@context":"http://schema.org/","@type":"ExchangeRateSpecification","url":"https://cryptoralia.com/${token.name?.replace(/\s/g, '-')}","name":"${token.displayName}","currency":"${token.symbol}","currentExchangeRate":{"@type":"UnitPriceSpecification","price": "${token.priceUsd}","priceCurrency":"USD"}}`,
              }}
            ></script>

            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: `{
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  "mainEntity": {
                    "@type": "Question",
                    "name": "What is ${token.displayName} ?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "${token.description}"
                    }
                  }
                }`,
              }}
            ></script>
          </>
        }
        og={{
          description: token.description,
          image: token.imgURL,
        }}
      />

      <DefaultLayout element={<TokenPage data={data} votes={votes} />} ads={ads} />
    </>
  );
}
