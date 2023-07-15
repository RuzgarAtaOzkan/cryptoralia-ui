// MODULES
import Head from 'next/head';

export default function HeadTag({
  description = 'Discover the best new presale tokens. Find crypto airdrops on Cryptoralia! Explore trending tokens and start earning now.',
  title = 'Cryptoralia | New Presale Tokens & Crypto Airdrops',
  token = {
    name: '',
    displayName: '',
    imgURL: '',
  },
  noIndex,
  thumbnail = '',
  canonical = 'https://cryptoralia.com',
  schema,
  og = {
    description: '',
    image: 'https://imgur.com/a/582dLmj',
  },
}) {
  return (
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta httpEquiv="content-language" content="en" />
      <meta name="title" content={title} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#000000" />
      <meta name="description" content={description} />
      {thumbnail ? <meta name="thumbnail" content={thumbnail} /> : null}

      <meta property="fb:pages" content="100540389287041" />

      <meta property="og:image" content={og.image} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="200" />
      <meta property="og:image:height" content="200" />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:site_name" content="Cryptoralia" />
      <meta property="og:title" content={title} />

      <meta property="og:description" content={og.description} />

      <meta name="twitter:site" content="@Cryptoralia" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={token.imgURL ? token.imgURL : 'https://imgur.com/a/582dLmj'} />
      <meta name="twitter:creator" content="@cryptoralia" />

      <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      <link rel="apple-touch-icon" href="assets/icons/logo192.png" />
      <link rel="manifest" href="/manifest.json" />
      <link rel="canonical" href={canonical} />

      <meta name="a.validate.02" content="iK8ZNkcR5zfkqKJKRl0jRfVvJ3UMjhs-1eH0" />

      {schema ? schema : null}
    </Head>
  );
}
