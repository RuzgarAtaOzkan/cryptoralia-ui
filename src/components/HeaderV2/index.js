// MODULES
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Web3 from 'web3';
import cn from 'classnames';

// CONTEXT
import { useStore } from '../../context';

// DISPATCH TYPES
import gdt from '../../context/global/types';

// SELF COMPONENTS
import TrendBar from './TrendBar';

// COMPONENTS
import Search from '../Search';
import Anchor from '../Anchor';
import ProfileDropdown from './Dropdown';
import Button from '../Button';

// ICONS
import Hamburger from '../Icons/Hamburger';
import SearchIcon from '../Icons/Search';
import LoadingCircleIcon from '../Icons/LoadingCircle';
import WalletIcon from '../Icons/Wallet';
import LogoutIcon from '../Icons/Logout';

// UTILS
import shortenText from '../../utils/shortenText';
import signout from '../../utils/signout';
import getTokens from '../../utils/getTokens';
import rs from '../../utils/removeSpaces';
import connectWallet from '../../utils/connectWallet';
import getStrLast from '../../utils/getStrLast';
import displayFloat from '../../utils/displayFloat';

// STYLES
import styles from './HeaderV2.module.scss';

async function ready_wallet(wallet, setWallet, address) {
  let bnbPrice = 0;
  try {
    const swapbnbres = await axios.get('https://bsc.api.0x.org/swap/v1/price?sellToken=BNB&buyToken=BUSD&sellAmount=1000000000000000000');

    bnbPrice = Number(swapbnbres.data.price);
  } catch (err) {}

  const web3 = new Web3(window.ethereum);
  const balance = await web3.eth.getBalance(address);
  const bnbAmount = Web3.utils.fromWei(balance);

  setWallet({
    ...wallet,
    address: address,
    balances: [
      {
        symbol: 'BNB',
        name: 'BNB',
        decimals: 18,
        amount: Number(bnbAmount),
        balanceUsd: bnbAmount * bnbPrice,
        address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      },
    ],
  });
}

async function placeTrendingTokens(setData) {
  const response = await getTokens('?status=2&limit=12&name=0&trending=1');

  if (!response) {
    return;
  }

  setData(response.data);
}

function Header({}) {
  const store = useStore();
  const user = store.auth.user;

  const [loading, setLoading] = useState(false);
  const [navActive, setNavActive] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [searchTimeoutId, setSearchTimeoutId] = useState(0);
  const [searchResults, setSearchResults] = useState([]);
  const [trendingTokens, setTrendingTokens] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [promotedTokenPrice, setPromotedTokenPrice] = useState(0);
  const [wallet, setWallet] = useState({
    address: '',
    balances: [
      {
        symbol: 'BNB',
        name: 'BNB',
        decimals: 18,
        amount: 0,
        balanceUsd: 0,
        address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      },
    ],
  });
  const profileDropdownData = [
    {
      title: 'Profile',
      href: '/profile',
    },
    { type: 'seperator' },
    {
      title: 'My Tokens',
      href: '/my-tokens',
    },
    {
      title: 'My Airdrops',
      href: '/my-airdrops',
    },
    { type: 'seperator' },
    {
      title: 'Add Token',
      href: '/add-token',
    },
    {
      title: 'Add Airdrop',
      href: '/add-airdrop',
    },
    { type: 'seperator' },
    {
      onClick: async () => {
        await signout(store);
      },
      title: 'Sign out',
    },
  ];

  function displayAuthArea(authState) {
    if (!authState) {
      return null;
    }

    switch (authState) {
      case 1:
        return (
          <>
            <Anchor
              onClick={() => {
                store.dispatchGlobal({
                  type: gdt.SET_LOGIN_MODAL,
                  payload: true,
                });

                store.dispatchGlobal({
                  type: gdt.SET_SIGNUP_MODAL,
                  payload: false,
                });

                setNavActive(false);
              }}
              href="#"
            >
              Login
            </Anchor>

            <Anchor
              onClick={() => {
                store.dispatchGlobal({
                  type: gdt.SET_LOGIN_MODAL,
                  payload: false,
                });

                store.dispatchGlobal({
                  type: gdt.SET_SIGNUP_MODAL,
                  payload: true,
                });

                setNavActive(false);
              }}
              className={styles['signup']}
              href="#"
            >
              Signup
            </Anchor>
          </>
        );

      case 2:
        return (
          <>
            <div
              onClick={() => {
                setProfileDropdown(true);
              }}
              onMouseEnter={() => {
                setProfileDropdown(true);
              }}
              onMouseLeave={() => {
                setProfileDropdown(false);
              }}
              className={cn(styles['profile'], 'pos-rel')}
            >
              <div className={cn(styles['profile-img-area'])}>
                <img alt="profile-image" title="Profile Image" src={user.profileImgURL || '/assets/images/cryptoralia-logo.png'} />
              </div>
              <div className={cn(styles['username'])}>{shortenText(user.username, 14)}</div>
              <ProfileDropdown active={profileDropdown} data={profileDropdownData} />
            </div>

            {profileDropdownData.map((current, index) => {
              if (current.type !== 'seperator') {
                return (
                  <div
                    key={index}
                    onClick={() => {
                      setNavActive(false);
                    }}
                    className={cn(styles['dropdown-item'])}
                  >
                    <Anchor
                      onClick={() => {
                        if (current.onClick) {
                          current.onClick();
                        }
                      }}
                      className={cn(!index ? styles['primary-bg'] : null)}
                      href={current.href}
                    >
                      {current.title}
                    </Anchor>
                  </div>
                );
              }
            })}
          </>
        );
    }
  }

  function displayChange24h(change24h) {
    if (change24h === undefined || change24h === null) {
      return <div className={cn(styles['grey'])}>-</div>;
    }

    if (Number(change24h) === 0) {
      <div className={cn(styles['grey'])}>0.00%</div>;
    }

    return <div className={cn(Number(change24h) > 0 ? styles['green'] : styles['red'])}>{Number(change24h)}%</div>;
  }

  async function searchTokens(value) {
    setLoading(true);

    const response = await getTokens('?name=' + value + '&status=2&limit=20&promoted=0gainer=0&recent=0&trending=0&presale=0');

    if (response) {
      setSearchResults(response.data);
    }

    setLoading(false);
  }

  function onResize() {
    if (window.innerWidth > 950) {
      setSearchActive(false);
      setNavActive(false);
    }
  }

  useEffect(() => {
    setTimeout(() => {
      placeTrendingTokens(setTrendingTokens);
    }, 3000);

    if (Web3.givenProvider && Web3.givenProvider.selectedAddress) {
      ready_wallet(wallet, setWallet, Web3.givenProvider.selectedAddress);
    }

    window.addEventListener('resize', onResize);

    axios.get('https://bsc.api.0x.org/swap/v1/price?sellToken=0x8F5A25BFA6cE7bcF1517148724beB3649aC49d64&buyToken=BUSD&sellAmount=1000000000000000000').then((res) => {
      const price = Number(res.data.price).toFixed(2);
      setPromotedTokenPrice(price);
    });

    setInterval(() => {
      axios.get('https://bsc.api.0x.org/swap/v1/price?sellToken=0x8F5A25BFA6cE7bcF1517148724beB3649aC49d64&buyToken=BUSD&sellAmount=1000000000000000000').then((res) => {
        const price = Number(res.data.price).toFixed(2);
        setPromotedTokenPrice(price);
      });
    }, 4000);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <header className={cn(styles['container'], 'flx-ctr-ctr-clm')}>
      <TrendBar data={trendingTokens} />

      <div className={cn(styles['header'], 'flx-btw-ctr', 'trnstn')}>
        <Hamburger
          onClick={(e) => {
            if (!navActive) {
              setSearchActive(false);
            }

            setNavActive(!navActive);
          }}
          className={styles['hamburger']}
          active={navActive}
        />

        <div className={cn(styles['header-left'], searchActive ? styles['display-none'] : null)}>
          <Anchor href="/" className={cn('flx-ctr-ctr')}>
            <img src="/assets/images/logo.png" alt="cryptoralia-logo" title="Cryptoralia Logo" />
          </Anchor>
        </div>

        <div className={cn('flx-str-ctr', styles['mobile-search'], searchActive ? styles['mobile-search-active'] : null, navActive ? styles['display-none'] : null)}>
          <div className={cn(styles['search-results'], searchResults.length ? styles['search-results-active'] : null, !searchActive ? styles['display-none'] : null)}>
            {searchResults.map((current, index) => {
              return (
                <Anchor key={index} className={cn(styles['search-result'], 'flx-btw-ctr')} href={'/' + current.name.replace(/\s/g, '-')}>
                  <div className={cn(styles['search-result-left'], 'flx-ctr-ctr')}>
                    <img src={current.imgURL} alt={current.name.replace(/\s/g, '-')} title={current.displayName} />
                    <div className={cn(styles['name-symbol'])}>
                      <div className={cn(styles['symbol'])}>{current.symbol}</div>
                      <div className={cn(styles['name'])}>{current.displayName}</div>
                    </div>
                  </div>
                  <div className={cn(styles['search-result-right'])}>
                    <div className={cn(styles['change24h'])}>{displayChange24h(current.change24h)}</div>
                  </div>
                </Anchor>
              );
            })}
          </div>

          <div className={cn(styles['search-icons'], 'flx-ctr-ctr')}>
            {loading ? (
              <LoadingCircleIcon className={cn(styles['loading-icon'])} />
            ) : (
              <SearchIcon
                onClick={() => {
                  if (!searchActive) {
                    setNavActive(false);
                  }

                  setSearchActive(!searchActive);
                  setSearchResults([]);
                }}
              />
            )}
          </div>

          {searchActive ? (
            <input
              placeholder="Search Token..."
              onChange={(e) => {
                setSearchValue(e.target.value);

                clearTimeout(searchTimeoutId);

                const id = setTimeout(() => {
                  let value = rs(e.target.value);

                  if (value) {
                    searchTokens(e.target.value);
                  } else {
                    setSearchResults([]);
                  }
                }, 300);

                setSearchTimeoutId(id);
              }}
              value={searchValue}
              type="text"
            />
          ) : null}
        </div>

        <div className={styles['header-mid']}>
          <Search />
        </div>

        <div className={cn(styles['header-right'], 'flx-str-ctr')}>
          <Anchor href="https://cryptoralia.com/quontral" className={cn(styles['header-right-promoted'])}>
            <div className={cn(styles['header-right-promoted-titleprice'])}>
              <span className={cn(styles['header-right-promoted-titleprice-title'])}>QUONTRAL</span> <span className={cn(styles['header-right-promoted-titleprice-price'])}>${promotedTokenPrice}</span>
            </div>

            <div className={cn(styles['header-right-promoted-buynow'])}>BUY NOW</div>
          </Anchor>

          {wallet.address ? (
            <div className={cn(styles['header-right-walletinfo'], 'flx-ctr-ctr')}>
              <div className={cn(styles['header-right-walletinfo-con'], 'flx-ctr-ctr')}>
                <div className={cn(styles['header-right-walletinfo-con-icon'], 'flx-ctr-ctr')}>
                  <WalletIcon />
                </div>

                <div className={cn(styles['header-right-walletinfo-con-balance'])}>{displayFloat(wallet.balances.find((current) => current.address === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')?.amount, 2)} BNB</div>

                <div className={cn(styles['header-right-walletinfo-con-address'])}>{shortenText(wallet.address, 6) + getStrLast(wallet.address, 4)}</div>
              </div>

              <div
                onClick={async () => {
                  try {
                    await Web3.currentProvider.disconnect();
                  } catch (err) {
                    console.log(err);
                  }

                  try {
                  } catch (err) {
                    console.log(err);
                  }

                  setWallet({
                    ...wallet,
                    address: '',
                  });
                }}
                className={cn(styles['header-right-walletinfo-logout'], 'flx-ctr-ctr')}
              >
                <LogoutIcon />
              </div>
            </div>
          ) : (
            <Button
              className={cn(styles['submit-coin-btn'])}
              title="Connect Wallet"
              onClick={async () => {
                await connectWallet(store);

                const accounts = await ethereum.request({
                  method: 'eth_requestAccounts',
                });

                const chainId = await ethereum.request({
                  method: 'eth_chainId',
                });

                if (!accounts[0] || chainId !== '0x38') {
                  store.dispatchGlobal({
                    type: gdt.SET_ALERT,
                    payload: {
                      type: 'error',
                      message: 'Binance Smart Chain required for wallet',
                    },
                  });

                  return;
                }

                ready_wallet(wallet, setWallet, accounts[0]);
              }}
            />
          )}
        </div>
      </div>

      <nav>
        <div className={cn(styles['nav'], searchResults.length && searchActive ? styles['nav-search-hide'] : null, 'flx-btw-ctr')}>
          <div className={cn(styles['nav-left'], 'flx-str-ctr')}>
            <Anchor href="/">{"Today's Best"}</Anchor>
            <Anchor href="/new">New Listings</Anchor>
            <Anchor href="/presale-tokens">Presales</Anchor>
            <Anchor href="/airdrops">Airdrops</Anchor>

            {/**
             * <Anchor href="/algo-trade">Algo Trade</Anchor>
             * */}
            {/**
             * *
             *  <Anchor href="/guide">Guide</Anchor>
             */}
          </div>

          {navActive ? (
            <div
              onClick={() => {
                setNavActive(false);
              }}
              className={cn(styles['nav-right-background'])}
            />
          ) : null}

          <div className={cn(styles['nav-right'], navActive ? styles['right-active'] : null)}>
            <div className={cn(styles['nav-right-top'])}>
              <div className={cn(styles['close-icon'])}>
                <Hamburger
                  onClick={() => {
                    setNavActive(false);
                  }}
                  active={true}
                />
              </div>

              <Anchor href="/" className={cn('flx-ctr-ctr')}>
                <img src="/assets/images/logo.png" alt="cryptoralia-logo" title="Cryptoralia Logo" />
              </Anchor>
            </div>

            <div className={cn(styles['nav-right-auth'], 'flx-ctr-ctr')}>{displayAuthArea(store.auth.state)}</div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
