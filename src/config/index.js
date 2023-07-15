const config = {
  env: {
    NODE_ENV: 'production',
    CAPTCHA_SITE_KEY: '62897407-6529-471a-a2d3-c0e9e0a7ce20',
    MAIN_WALLET: '0x34aa495429563b51A6D4De611338f4e8F0FcffB5',
  },
  captchaSiteKey: '62897407-6529-471a-a2d3-c0e9e0a7ce20',
  networks: {
    BSC: {
      chainId: 56,
      img: '/assets/images/bnb.png',
    },
  },
  mainWallet: '0x34aa495429563b51A6D4De611338f4e8F0FcffB5',
  premium: {
    price: 19,
  },
  api: {
    domain: 'https://api.cryptoralia.com',
    methods: {
      GET: 'GET',
      POST: 'POST',
      PUT: 'PUT',
      DELETE: 'DELETE',
    },
    versions: {
      first: 1,
    },
    version: 1,
  },
  dev: {
    dataTypes: {
      objectId: 'objectId',
      string: 'string',
      number: 'number',
      int: 'int',
      float: 'float',
      date: 'date',
      double: 'double',
      boolean: 'boolean',
      bool: 'bool',
      object: 'object',
      array: 'array',
      function: 'function',
      null: 'null',
      undefined: 'undefined',
    },
  },
  keyCodes: {
    enter: 13,
    esc: 27,
  },
  style: {
    mediaQueryWidths: {
      mobile: 650,
      tablet: 950,
      desktop: 1250,
    },
  },
  times: {
    alert: 3000,
  },
};

Object.freeze(config);

export default config;
