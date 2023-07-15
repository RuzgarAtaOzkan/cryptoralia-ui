// MODULES
import { useState, useEffect } from 'react';
import Web3 from 'web3';
import axios from 'axios';
import cn from 'classnames';
import BigNumber from 'bignumber.js';

// CONTEXT
import { useStore } from '../../context';

// COMPONENTS
import Button from '../Button';
import LoadingCircleIcon from '../Icons/LoadingCircle';
import AngleUpIcon from '../Icons/AngleUp';
import AngleDownIcon from '../Icons/AngleDown';
import ExchangeIcon from '../Icons/Exchange';
import SearchIcon from '../Icons/Search';
import SettingsIcon from '../Icons/Settings';
import Modal from '../Swapper/Modal';

// UTILS
import shortenText from '../../utils/shortenText';
import getStrLast from '../../utils/getStrLast';
import getTokens from '../../utils/getTokens';
import removeSpaces from '../../utils/removeSpaces';
import configMetamask from '../../utils/configMetamask';
import getTokenBalances from '../../utils/getTokenBalances';
import addCommas from '../../utils/addCommas';
import displayFloat from '../../utils/displayFloat';

// STYLES
import styles from './Swapper.module.scss';

function add_decimals(value, decimals) {
  value = value.toString();

  if (value.includes('.')) {
    const parts = value.split('.');
    let nleft = parts[0];
    let nright = parts[1];

    for (let i = 0; i < decimals; i++) {
      nleft += nright[i] || '0';
    }

    for (let i = 0; i < decimals; i++) {
      nright = nright.substring(1, nright.length);
    }

    let started = false;
    let final = '';
    for (let i = 0; i < nleft.length; i++) {
      if (Number(nleft[i])) {
        started = true;
      }

      if (started) {
        final += nleft[i];
      }
    }

    return final + (nright ? '.' + nright : '');
  } else {
    let started = false;
    let final = '';
    for (let i = 0; i < value.length; i++) {
      if (Number(value[i])) {
        started = true;
      }

      if (started) {
        final += value[i];
      }
    }

    for (let i = 0; i < decimals; i++) {
      final += '0';
    }

    return final;
  }
}

async function update_txn_info(selectedPayVal, selectedReceiveVal, swapperconf, wallet, selectedPay, selectedReceive, txninfo, settxninfo, data) {
  if (!selectedPay.decimals || !data) {
    return;
  }

  let viadex = '';
  const estimatedPriceImpact = data.estimatedPriceImpact;
  const allsources = data.sources;
  const sources = allsources.filter((current) => Number(current.proportion));

  for (let i = 0; i < sources.length; i++) {
    for (let j = 0; j < sources.length; j++) {
      if (sources[j + 1]) {
        const current = sources[j];
        const next = sources[j + 1];

        if (Number(current.proportion) < Number(next.proportion)) {
          sources[j] = next;
          sources[j + 1] = current;
        }
      }
    }
  }

  let viadexctr = 0;
  for (let i = 0; i < sources.length; i++) {
    viadexctr++;

    if (sources.length === 1) {
      viadex += `${sources[i].name}`;
    } else {
      if (viadexctr >= 3) {
        break;
      }

      viadex += `${sources[i].name} (%${(Number(sources[i].proportion) * 100).toFixed(2)}), `;
    }
  }

  const bnbres = await axios.get('https://bsc.api.0x.org/swap/v1/price?sellToken=BNB&buyToken=BUSD&sellAmount=1000000000000000000');
  const bnbPrice = Number(bnbres.data.price);

  // Gas amount in BNB
  let gasAmount = Number(data.gas);

  for (let i = 0; i < 9; i++) {
    gasAmount = gasAmount * 0.1;
  }

  // Fee amount in selected receive token
  const feeAmount = selectedReceiveVal * swapperconf.buyTokenPercentageFee;

  // values in usd
  const feeUsd = selectedReceive.priceUsd * (selectedReceiveVal * swapperconf.buyTokenPercentageFee);
  const gasUsd = bnbPrice * gasAmount;

  settxninfo({
    ...txninfo,
    viadex: 'via ' + viadex + (viadexctr >= 3 ? ' +2 more' : ''),
    priceImpact: estimatedPriceImpact ? estimatedPriceImpact : '-',
    gas: displayFloat(gasAmount),
    fee: addCommas(displayFloat(feeAmount)),
    totalFeeUsd: (gasUsd + feeUsd).toFixed(2),
    expRecAmount: addCommas(Number(displayFloat(Number(data.buyAmount) * 0.1 ** selectedReceive.decimals, 2))),
  });
}

async function has_allowance(swapperconf, selectedPay, selectedReceive, wallet) {
  if ((!swapperconf, !selectedPay || !selectedReceive || !wallet)) {
    throw new Error('Too few arguments for has_allowance');
  }

  if (!wallet.address) {
    return false;
  }

  if (!selectedPay.decimals) {
    return false;
  }

  if (selectedPay.address === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
    return true;
  }

  try {
    const amount = add_decimals('1', selectedPay.decimals);

    let url = `https://bsc.api.0x.org/swap/v1/quote?sellToken=${selectedPay.address}&buyToken=${selectedReceive.address}&takerAddress=${wallet.address}&sellAmount=${amount}&feeRecipient=${swapperconf.feeRecipient}&buyTokenPercentageFee=${swapperconf.buyTokenPercentageFee}&slippagePercentage=${swapperconf.slippage}`;
    // Check if current selected is same with selectedReceive,
    // If so, buy token address must be selected pay

    await axios.get(url);
  } catch (err) {
    if (!err.response || !err.response.data) {
      return;
    }

    console.log(err.response.data);

    if (err.response.data.code === 105) {
      return false;
    }
  }

  return true;
}

async function ready_wallet(wallet, setWallet, address, button, setbutton) {
  let bnbPrice = 0;
  try {
    const swapbnbres = await axios.get('https://bsc.api.0x.org/swap/v1/price?sellToken=BNB&buyToken=BUSD&sellAmount=1000000000000000000');

    bnbPrice = Number(swapbnbres.data.price);
  } catch (err) {}

  setbutton({
    ...button,
    title: 'Connecting wallet',
    loading: true,
    disabled: true,
  });

  const web3 = new Web3(window.ethereum);
  const balance = await web3.eth.getBalance(address);
  const bnb = Web3.utils.fromWei(balance);
  const tbres = await getTokenBalances(address);

  if (!tbres) {
    setbutton({
      ...button,
      loading: false,
      disabled: true,
      title: 'Something went wrong',
    });

    return;
  }

  const balances = [];
  const tbdata = tbres.data;

  for (let i = 0; i < tbdata.length; i++) {
    let sellAmount = '1';
    for (let j = 0; j < tbdata[i].decimals; j++) {
      sellAmount += '0';
    }

    let amount = Number(tbdata[i].balance);

    for (let j = 0; j < tbdata[i].decimals; j++) {
      amount = amount * 0.1;
    }

    amount = parseInt(amount);

    console.log(amount);

    balances.push({
      name: tbdata[i].name,
      symbol: tbdata[i].symbol,
      balanceUsd: 0,
      amount,
      address: tbdata[i].token_address,
      decimals: tbdata[i].decimals,
    });
  }

  balances.push({
    name: 'BNB',
    symbol: 'BNB',
    balanceUsd: bnb * bnbPrice,
    amount: Number(bnb),
    address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    decimals: 18,
  });

  setWallet({
    ...wallet,
    balances,
    address,
  });

  setbutton({
    ...button,
    disabled: false,
    loading: false,
    title: 'Swap',
    type: 'swap',
  });
}

function reduce_float(num, offset = 4) {
  if (typeof num !== 'number' && !Number(num)) {
    return 0;
  }

  num = num.toString();

  let final = '';
  if (num.includes('.')) {
    if (Number(num) < 0.000001) {
      return 0.0;
    }

    const parts = num.split('.');
    final = parts[0] + '.';

    if (parts[1].length > offset) {
      for (let i = 0; i < offset; i++) {
        final += parts[1][i];
      }
    } else {
      for (let i = 0; i < parts[1].length; i++) {
        final += parts[1][i];
      }
    }

    return final;
  }

  return num;
}

// Check if current selectedPay.value is insufficient balance
function is_insufficient_balance(wallet, selectedPay) {
  const walletToken = wallet.balances.find((current) => current.address.toLowerCase() === selectedPay.address.toLowerCase());

  if (!selectedPay.value) {
    return false;
  }

  if (!walletToken) {
    return true;
  }

  if (walletToken.amount < Number(selectedPay.value)) {
    return true;
  }

  return false;
}

// returns the token amount in  the client wallet with the given address, simple function
function get_token_amount(wallet, address) {
  const result = wallet.balances.find((current) => current.address.toLowerCase() === address.toLowerCase());

  if (!result) {
    return null;
  }

  return result.amount;
}

function search_token(search, setSearch, setSearchOptions, setSearchLoading, allTokens, setAllTokens, searchTimer, setSearchTimer) {
  if (!setSearch || !setSearchOptions || !setSearchLoading || !allTokens || !setAllTokens || !setSearchTimer) {
    throw new Error('Missing arguments in search');
  }

  setSearch(search);

  clearTimeout(searchTimer);

  const id = setTimeout(async () => {
    setSearchLoading(true);

    const value = removeSpaces(search).toLowerCase();

    if (!value) {
      setSearchOptions([]);
      setSearchLoading(false);
      return;
    }

    const token = allTokens.find((current) => removeSpaces(current.name) === value);

    if (token) {
      setSearchOptions([token]);
      setSearchLoading(false);
      return;
    }

    const response = await getTokens('?limit=20&status=2&name=' + value);

    setSearchLoading(false);

    if (!response) {
      return;
    }

    const data = response.data;
    const newTokens = [];

    setSearchOptions(data);

    for (let i = 0; i < data.length; i++) {
      let exists = false;

      for (let j = 0; j < allTokens.length; j++) {
        if (data[i]._id === allTokens[j]._id) {
          exists = true;
        }
      }

      if (!exists) {
        newTokens.push(data[i]);
      }
    }

    setAllTokens([...allTokens, ...newTokens]);
  }, 400);

  setSearchTimer(id);
}

// updates the selected token prices.
async function update_prices(swapperconf, selectedPay, setSelectedPay, selectedReceive, setSelectedReceive) {
  if (!selectedPay.decimals || !selectedReceive.decimals) {
    return;
  }

  let paySellAmount = '1';
  if (selectedPay.decimals) {
    for (let i = 0; i < selectedPay.decimals; i++) {
      paySellAmount += '0';
    }
  }

  let receiveSellAmount = '1';
  if (selectedReceive.decimals) {
    for (let i = 0; i < selectedReceive.decimals; i++) {
      receiveSellAmount += '0';
    }
  }

  let resolves = [];
  try {
    resolves = await Promise.all([axios.get(`https://bsc.api.0x.org/swap/v1/price?sellToken=${selectedPay.symbol === 'BNB' ? 'BNB' : selectedPay.address}&buyToken=BUSD&sellAmount=${paySellAmount}&buyTokenPercentageFee=${swapperconf.buyTokenPercentageFee}&feeRecipient=${swapperconf.feeRecipient}`), axios.get(`https://bsc.api.0x.org/swap/v1/price?sellToken=${selectedReceive.symbol === 'BNB' ? 'BNB' : selectedReceive.address}&buyToken=BUSD&sellAmount=${receiveSellAmount}&buyTokenPercentageFee=${swapperconf.buyTokenPercentageFee}&feeRecipient=${swapperconf.feeRecipient}`)]);
  } catch (err) {}

  const payPrice = Number(resolves[0] ? resolves[0].data.price : 0);
  const receivePrice = Number(resolves[1] ? resolves[1].data.price : 0);

  setSelectedPay({
    ...selectedPay,
    priceUsd: payPrice,
  });

  setSelectedReceive({
    ...selectedReceive,
    priceUsd: receivePrice,
  });
}

function Swapper({ data }) {
  const store = useStore();

  const [txninfo, settxninfo] = useState({
    fee: '0',
    gas: '0',
    totalFeeUsd: '0.00',
    expRecAmount: '0',
    slippage: '',
    priceImpact: '-',
    viadex: 'Cryptoralia will find the best price for you',
  });

  const [modalinfo, setmodalinfo] = useState({
    state: 1,
    title: 'Waiting for confirmation',
    desc: '',
    err: '',
    txnhash: '',
    active: false,
    type: 'txn', // txn, slippage
  });

  const [swapperconf, setswapperconf] = useState({
    buyTokenPercentageFee: '0.005',
    feeRecipient: '0xF3E9e07913f764DdDA51cD8934A11ab9AcCEfcf8',
    slippage: '0.01',
    gasPrice: '',
  });

  const [update, setUpdate] = useState(0);

  // Is swapper slided or at the bottom
  const [componentActive, setComponentActive] = useState(false);
  const [componentOpened, setComponentOpened] = useState(false);

  const [ERC20_ABI] = useState([
    {
      constant: true,
      inputs: [],
      name: 'name',
      outputs: [
        {
          name: '',
          type: 'string',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_spender',
          type: 'address',
        },
        {
          name: '_value',
          type: 'uint256',
        },
      ],
      name: 'approve',
      outputs: [
        {
          name: '',
          type: 'bool',
        },
      ],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'totalSupply',
      outputs: [
        {
          name: '',
          type: 'uint256',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_from',
          type: 'address',
        },
        {
          name: '_to',
          type: 'address',
        },
        {
          name: '_value',
          type: 'uint256',
        },
      ],
      name: 'transferFrom',
      outputs: [
        {
          name: '',
          type: 'bool',
        },
      ],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'decimals',
      outputs: [
        {
          name: '',
          type: 'uint8',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        {
          name: '_owner',
          type: 'address',
        },
      ],
      name: 'balanceOf',
      outputs: [
        {
          name: 'balance',
          type: 'uint256',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'symbol',
      outputs: [
        {
          name: '',
          type: 'string',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_to',
          type: 'address',
        },
        {
          name: '_value',
          type: 'uint256',
        },
      ],
      name: 'transfer',
      outputs: [
        {
          name: '',
          type: 'bool',
        },
      ],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        {
          name: '_owner',
          type: 'address',
        },
        {
          name: '_spender',
          type: 'address',
        },
      ],
      name: 'allowance',
      outputs: [
        {
          name: '',
          type: 'uint256',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      payable: true,
      stateMutability: 'payable',
      type: 'fallback',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: 'owner',
          type: 'address',
        },
        {
          indexed: true,
          name: 'spender',
          type: 'address',
        },
        {
          indexed: false,
          name: 'value',
          type: 'uint256',
        },
      ],
      name: 'Approval',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: 'from',
          type: 'address',
        },
        {
          indexed: true,
          name: 'to',
          type: 'address',
        },
        {
          indexed: false,
          name: 'value',
          type: 'uint256',
        },
      ],
      name: 'Transfer',
      type: 'event',
    },
  ]);

  const [wallet, setWallet] = useState({
    balances: [],
    address: '',
  });

  // Selected pay token and receive token
  const [selectedPay, setSelectedPay] = useState({
    imgURL: '/assets/images/bnb-logo.png',
    name: 'BNB',
    symbol: 'BNB',
    address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    value: '',
    priceUsd: 0,
    decimals: 18,
    priceUsd: 0,
  });
  const [selectedReceive, setSelectedReceive] = useState({
    ...data,
    value: '',
  });
  const [selectedPayInputTimer, setSelectedPayInputTimer] = useState(0);
  const [allTokens, setAllTokens] = useState([
    { ...data },
    {
      imgURL: '/assets/images/busd.png',
      name: 'BUSD',
      displayName: 'BUSD',
      symbol: 'BUSD',
      chainId: 0,
      address: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
      decimals: 18,
    },
    {
      imgURL: '/assets/images/bnb-logo.png',
      name: 'BNB',
      displayName: 'BNB',
      symbol: 'BNB',
      address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      decimals: 18,
    },
  ]);

  // Search dropdown open or close variables
  const [payDropdown, setPayDropdown] = useState(false);
  const [receiveDropdown, setReceiveDropdown] = useState(false);

  // Search variables
  const [search, setSearch] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchTimer, setSearchTimer] = useState(0);
  const [searchOptions, setSearchOptions] = useState([
    {
      ...data,
    },
    {
      imgURL: '/assets/images/busd.png',
      name: 'BUSD',
      displayName: 'BUSD',
      symbol: 'BUSD',
      chainId: 0,
      address: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
      decimals: 18,
    },
    {
      imgURL: '/assets/images/bnb-logo.png',
      name: 'BNB',
      displayName: 'BNB',
      symbol: 'BNB',
      address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      decimals: 18,
    },
  ]);

  const [err, seterr] = useState('');

  // Button states
  const [button, setbutton] = useState({
    loading: false,
    disabled: false,
    type: 'connect-wallet',
    title: 'Connect wallet',
  });

  const [enablebtn, setenablebtn] = useState({
    loading: false,
    disabled: false,
    title: 'Enable',
    active: false,
  });

  useEffect(() => {
    // Place price values for selected pay and receive when component active.
    if (componentActive && !componentOpened) {
      setTimeout(() => {
        update_prices(selectedPay, setSelectedPay, selectedReceive, setSelectedReceive);
      }, 300);

      setComponentOpened(true);

      if (Web3.givenProvider && Web3.givenProvider.selectedAddress) {
        ready_wallet(wallet, setWallet, Web3.givenProvider.selectedAddress, button, setbutton);
      }
    }
  }, [componentActive]);

  // rerender by setting update
  useEffect(() => {
    const id = setInterval(() => {
      if (update >= 10) {
        setUpdate(0);
      } else {
        setUpdate(update + 1);
      }
    }, 14000);

    return () => {
      clearInterval(id);
    };
  }, []);

  // update price usds of selected currencies with update state.
  useEffect(() => {
    update_prices(swapperconf, selectedPay, setSelectedPay, selectedReceive, setSelectedReceive);
  }, [update]);

  useEffect(() => {
    console.log(wallet);
  }, [wallet]);

  return data && data.priceUsd ? (
    <section className={cn(styles['container'], componentActive ? styles['container-active'] : null)}>
      <Modal data={modalinfo} setdata={setmodalinfo} swapperconf={swapperconf} setswapperconf={setswapperconf} />

      <div
        className={cn(styles['title-area'], 'flx-btw-ctr')}
        onClick={() => {
          setComponentActive(!componentActive);
        }}
      >
        <div className={cn(styles['title-area-left'])}>
          <h2>Trade {componentActive ? null : shortenText(data.displayName, 16)}</h2>
        </div>

        <div className={cn(styles['title-area-right'])}>
          <div className={cn(styles['title-area-right-icon'], 'flx-ctr-ctr')}>{componentActive ? <AngleDownIcon /> : <AngleUpIcon />}</div>
        </div>
      </div>

      <div className={cn(styles['input-area'])}>
        <div className={cn(styles['input-label'], 'flx-btw-ctr')}>
          <div className={cn(styles['input-label-left'])}>Pay</div>
        </div>

        <div className={cn(styles['input-value'], 'flx-btw-ctr')}>
          <div
            className={cn(styles['input-value-selector'], 'flx-str-ctr')}
            onClick={() => {
              if (!payDropdown === false) {
                setSearchOptions([...allTokens]);
                setSearch('');
              }

              setPayDropdown(!payDropdown);
              setReceiveDropdown(false);
            }}
          >
            <img className={cn(styles['input-value-selector-img'])} src={selectedPay.imgURL} alt={selectedPay.name.replace(/\s/g, '-')} title={selectedPay.displayName} />

            <div className={cn(styles['input-value-selector-name'])}>{selectedPay.symbol}</div>

            <div className={cn(styles['input-value-selector-arrow'], 'flx-ctr-ctr')}>
              <AngleDownIcon />
            </div>
          </div>

          <input
            className={cn(styles['input-value-input'], is_insufficient_balance(wallet, selectedPay) ? styles['input-value-input-insufficient-balance'] : null)}
            value={selectedPay.value}
            type="number"
            onChange={async (e) => {
              const value = e.target.value;

              if (!removeSpaces(value) || !Number(value)) {
                clearTimeout(selectedPayInputTimer);

                settxninfo({
                  ...txninfo,
                  viadex: '',
                  priceImpact: '-',
                  gas: '0',
                  fee: '0',
                  totalFeeUsd: '0.00',
                  expRecAmount: '0',
                });

                setSelectedPay({
                  ...selectedPay,
                  value: value,
                });

                setSelectedReceive({
                  ...selectedReceive,
                  value: value,
                });

                if (!enablebtn.active) {
                  if (!wallet.address) {
                    setbutton({
                      ...button,
                      title: 'Connect wallet',
                      disabled: false,
                      loading: false,
                    });
                  } else {
                    setbutton({
                      ...button,
                      title: 'Swap',
                      disabled: false,
                      loading: false,
                    });
                  }
                }

                return;
              }

              // Token from our wallet
              const walletToken = wallet.balances.find((current) => current.address.toLowerCase() === selectedPay.address.toLowerCase());

              if (!enablebtn.active && (!walletToken || walletToken.amount < Number(value))) {
                if (wallet.address) {
                  setbutton({
                    ...button,
                    disabled: true,
                    loading: false,
                    title: 'Insufficient balance',
                  });
                }

                if (!wallet.address) {
                  setbutton({
                    ...button,
                    disabled: false,
                    loading: false,
                  });
                }
              }

              if (!enablebtn.active && wallet.address && walletToken && walletToken.amount > Number(value)) {
                setbutton({
                  ...button,
                  disabled: false,
                  loading: false,
                  title: 'Swap',
                });
              }

              const payval = value;

              clearTimeout(selectedPayInputTimer);

              const timerid = setTimeout(async () => {
                let sellAmount = add_decimals(payval, selectedPay.decimals);

                if (!Number(sellAmount)) {
                  return;
                }

                const res = await axios.get(`https://bsc.api.0x.org/swap/v1/price?sellToken=${selectedPay.address}&buyToken=${selectedReceive.address}&slippagePercentage=${swapperconf.slippage}&feeRecipient=${swapperconf.feeRecipient}&buyTokenPercentageFee=${swapperconf.buyTokenPercentageFee}&sellAmount=${sellAmount}`);

                let receiveval = res.data.buyAmount;

                if (!selectedReceive.decimals) {
                  return;
                }

                for (let i = 0; i < selectedReceive.decimals; i++) {
                  receiveval = receiveval * 0.1;
                }

                setSelectedReceive({
                  ...selectedReceive,
                  value: receiveval,
                });

                update_txn_info(payval, receiveval, swapperconf, wallet, selectedPay, selectedReceive, txninfo, settxninfo, res.data);
              }, 300);

              setSelectedPayInputTimer(timerid);

              setSelectedPay({
                ...selectedPay,
                value: payval,
              });
            }}
            placeholder="0.00"
          />

          <div className={cn(styles['input-value-dropdown'], payDropdown ? styles['input-value-dropdown-active'] : null)}>
            <div className={cn(styles['input-value-dropdown-search'], 'flx-ctr-ctr')}>
              <input
                placeholder="Search Token..."
                value={search}
                onChange={(e) => {
                  search_token(e.target.value, setSearch, setSearchOptions, setSearchLoading, allTokens, setAllTokens, searchTimer, setSearchTimer);
                }}
              />

              {searchLoading ? <LoadingCircleIcon className={cn(styles['input-value-dropdown-search-loading-icon'])} /> : <SearchIcon />}
            </div>

            <div className={cn(styles['input-value-dropdown-results'])}>
              {searchOptions.map((current, index) => {
                return (
                  <div
                    key={index}
                    className={cn(styles['input-value-dropdown-item'])}
                    onClick={async () => {
                      seterr('');

                      let sellAmount = '1';
                      if (current.decimals) {
                        for (let i = 0; i < current.decimals; i++) {
                          sellAmount += '0';
                        }
                      } else {
                        sellAmount = '1000000000000000000';
                      }

                      let res = { data: {} };
                      let price = current.priceUsd;

                      if (current.symbol === 'BUSD') {
                        price = 1;
                      } else {
                        try {
                          res = await axios.get(`https://bsc.api.0x.org/swap/v1/price?sellToken=${current.symbol === 'BNB' ? 'BNB' : current.address}&buyToken=BUSD&sellAmount=${sellAmount}&buyTokenPercentageFee=${swapperconf.buyTokenPercentageFee}&feeRecipient=${swapperconf.feeRecipient}`);

                          price = Number(res.data.price);
                        } catch (err) {}
                      }

                      setPayDropdown(false);

                      if (wallet.address) {
                        setbutton({
                          ...button,
                          loading: true,
                          disabled: true,
                          title: '',
                        });

                        // Check if selected token has allowance on wallet
                        // we are replacing selectedPay with the current selected token from dropdown
                        // and check if current address is same with selected receive
                        const hasallow = await has_allowance(swapperconf, current, current.address === selectedReceive.address ? selectedPay : selectedReceive, wallet);

                        if (!hasallow) {
                          setenablebtn({
                            ...enablebtn,
                            active: true,
                          });

                          setbutton({
                            ...button,
                            disabled: true,
                            loading: false,
                            title: 'Swap',
                          });
                        } else {
                          setenablebtn({
                            ...enablebtn,
                            active: false,
                          });

                          setbutton({
                            ...button,
                            disabled: false,
                            loading: false,
                            title: 'Swap',
                          });
                        }
                      }

                      if (selectedReceive.address === current.address) {
                        setSelectedPay({
                          ...current,
                          value: '',
                          priceUsd: price,
                        });
                        setSelectedReceive({ ...selectedPay, value: '' });
                      } else {
                        setSelectedPay({
                          ...current,
                          value: '',
                          priceUsd: price,
                        });

                        setSelectedReceive({
                          ...selectedReceive,
                          value: '',
                        });
                      }
                    }}
                  >
                    <img className={cn(styles['input-value-dropdown-item-img'])} src={current.imgURL} alt={current.name.replace(/\s/g, '-')} title={current.displayName} />

                    <div className={cn(styles['input-value-dropdown-item-right'])}>
                      <div className={cn(styles['input-value-dropdown-item-name'])}>{current.displayName}</div>
                      <div className={cn(styles['input-value-dropdown-item-symbol-address'])}>
                        {current.symbol} {current.symbol === 'BNB' ? null : (shortenText(current.address, 4) || '') + getStrLast(current.address, 4)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className={cn(styles['input-info'], 'flx-btw-ctr')}>
          <div className={cn(styles['input-info-left'])}>
            Balance: {get_token_amount(wallet, selectedPay.address) || 0} {selectedPay.symbol}
          </div>

          <div className={cn(styles['input-info-right'])}>
            ~$
            {addCommas((selectedPay.priceUsd * Number(selectedPay.value)).toFixed(2))}
          </div>
        </div>
      </div>

      <div className={cn(styles['mid-swap-area'], 'flx-ctr-ctr')}>
        <div className={cn(styles['mid-swap-border'])}></div>

        <div
          onClick={async () => {
            setSelectedPay(selectedReceive);
            setSelectedReceive(selectedPay);

            if (!wallet.address) {
              return;
            }

            setbutton({
              ...button,
              loading: true,
              disabled: true,
              title: '',
            });

            // swap the selected pay and receive value parameters because we are swapping them in the above code.
            // swap the token address as well in the 2. parameter
            const hasallow = await has_allowance(swapperconf, selectedReceive, selectedPay, wallet);

            if (!hasallow) {
              setenablebtn({
                ...enablebtn,
                active: true,
              });

              setbutton({
                ...button,
                disabled: true,
                loading: false,
                title: 'Swap',
              });

              return;
            }

            // Token from our wallet balance
            const walletToken = wallet.balances.find((current) => current.address === selectedReceive.address);

            setenablebtn({
              ...enablebtn,
              active: false,
            });

            if (!enablebtn.active && (!walletToken || walletToken.amount < Number(selectedReceive.value))) {
              setbutton({
                ...button,
                disabled: true,
                loading: false,
                title: 'Insufficient balance',
              });
            } else {
              setbutton({
                ...button,
                disabled: false,
                loading: false,
                title: 'Swap',
              });
            }
          }}
          className={cn(styles['mid-swap-icon'], 'flx-ctr-ctr')}
        >
          <ExchangeIcon />
        </div>
        <div className={cn(styles['mid-swap-border'])}></div>
      </div>

      <div className={cn(styles['input-area'])}>
        <div className={cn(styles['input-label'], 'flx-btw-ctr')}>
          <div className={cn(styles['input-label-left'])}>Receive</div>
        </div>

        <div className={cn(styles['input-value'], 'flx-btw-ctr')}>
          <div
            onClick={() => {
              if (!receiveDropdown === false) {
                setSearchOptions([...allTokens]);
                setSearch('');
              }

              setReceiveDropdown(!receiveDropdown);
              setPayDropdown(false);
            }}
            className={cn(styles['input-value-selector'], 'flx-str-ctr')}
          >
            <img className={cn(styles['input-value-selector-img'])} src={selectedReceive.imgURL} alt={selectedReceive.name.replace(/\s/g, '-')} title={selectedReceive.displayName} />

            <div className={cn(styles['input-value-selector-name'])}>{selectedReceive.symbol}</div>

            <div className={cn(styles['input-value-selector-arrow'], 'flx-ctr-ctr')}>
              <AngleDownIcon />
            </div>
          </div>

          <input
            className={cn(styles['input-value-input'])}
            value={selectedReceive.value}
            type="number"
            onChange={(e) => {
              const value = e.target.value;

              if (!removeSpaces(value) || !Number(value)) {
                clearTimeout(selectedPayInputTimer);

                setSelectedPay({
                  ...selectedPay,
                  value: '',
                });

                setSelectedReceive({
                  ...selectedReceive,
                  value: value,
                });

                if (!enablebtn.active) {
                  if (!wallet.address) {
                    setbutton({
                      ...button,
                      disabled: false,
                      loading: false,
                      title: 'Connect wallet',
                    });
                  } else {
                    setbutton({
                      ...button,
                      disabled: false,
                      loading: false,
                      title: 'Swap',
                    });
                  }
                }

                return;
              }

              // Token from our wallet balance
              const walletToken = wallet.balances.find((current) => current.address.toLowerCase() === selectedPay.address.toLowerCase());

              clearTimeout(selectedPayInputTimer);

              const timerid = setTimeout(async () => {
                const buyAmount = add_decimals(value, selectedReceive.decimals);

                if (!Number(buyAmount)) {
                  return;
                }

                try {
                  const res = await axios.get(`https://bsc.api.0x.org/swap/v1/price?sellToken=${selectedPay.address}&buyToken=${selectedReceive.address}&slippagePercentage=${swapperconf.slippage}&feeRecipient=${swapperconf.feeRecipient}&buyTokenPercentageFee=${swapperconf.buyTokenPercentageFee}&buyAmount=${buyAmount}`);

                  let payval = res.data.sellAmount;

                  if (!selectedReceive.decimals) {
                    return;
                  }

                  for (let i = 0; i < selectedPay.decimals; i++) {
                    payval = payval * 0.1;
                  }

                  if (!enablebtn.active && (!walletToken || walletToken.amount < Number(payval))) {
                    if (wallet.address) {
                      setbutton({
                        ...button,
                        disabled: true,
                        loading: false,
                        title: 'Insufficient balance',
                      });
                    }

                    if (!wallet.address) {
                      setbutton({
                        ...button,
                        disabled: false,
                        loading: false,
                      });
                    }
                  }

                  setSelectedPay({
                    ...selectedPay,
                    value: payval,
                  });

                  update_txn_info(payval, value, swapperconf, wallet, selectedPay, selectedReceive, txninfo, settxninfo, res.data);
                } catch (err) {}
              }, 300);

              setSelectedPayInputTimer(timerid);

              setSelectedReceive({
                ...selectedReceive,
                value: value,
              });
            }}
            placeholder="0.00"
          />

          <div className={cn(styles['input-value-dropdown'], receiveDropdown ? styles['input-value-dropdown-active'] : null)}>
            <div className={cn(styles['input-value-dropdown-search'], 'flx-ctr-ctr')}>
              <input
                placeholder="Search Token..."
                value={search}
                onChange={(e) => {
                  search_token(e.target.value, setSearch, setSearchOptions, setSearchLoading, allTokens, setAllTokens, searchTimer, setSearchTimer);
                }}
              />

              {searchLoading ? <LoadingCircleIcon className={cn(styles['input-value-dropdown-search-loading-icon'])} /> : <SearchIcon />}
            </div>

            <div className={cn(styles['input-value-dropdown-results'])}>
              {searchOptions.map((current, index) => {
                return (
                  <div
                    key={index}
                    className={cn(styles['input-value-dropdown-item'])}
                    onClick={async () => {
                      seterr('');

                      let sellAmount = '1';
                      if (current.decimals) {
                        for (let i = 0; i < current.decimals; i++) {
                          sellAmount += '0';
                        }
                      } else {
                        sellAmount = '1000000000000000000';
                      }

                      let res = { data: {} };
                      let price = current.priceUsd;

                      if (current.symbol === 'BUSD') {
                        price = 1;
                      } else {
                        try {
                          res = await axios.get(`https://bsc.api.0x.org/swap/v1/price?sellToken=${current.symbol === 'BNB' ? 'BNB' : current.address}&buyToken=BUSD&sellAmount=${sellAmount}&buyTokenPercentageFee=${swapperconf.buyTokenPercentageFee}&feeRecipient=${swapperconf.feeRecipient}`);

                          price = Number(res.data.price);
                        } catch (err) {}
                      }

                      setReceiveDropdown(false);

                      // Check if seleted token has allowance, check only if selected receive address is same with selected pay
                      if (wallet.address && current.address === selectedPay.address) {
                        setbutton({
                          ...button,
                          loading: true,
                          disabled: true,
                          title: '',
                        });

                        // Check if selected token has allowance on wallet
                        // we are replacing selectedPay with the current selected token from dropdown
                        // and check if current address is same with selected receive

                        const hasallow = await has_allowance(swapperconf, selectedReceive, current, wallet);

                        if (!hasallow) {
                          setenablebtn({
                            ...enablebtn,
                            active: true,
                          });

                          setbutton({
                            ...button,
                            disabled: true,
                            loading: false,
                            title: 'Swap',
                          });
                        } else {
                          setenablebtn({
                            ...enablebtn,
                            active: false,
                          });

                          setbutton({
                            ...button,
                            disabled: false,
                            loading: false,
                            title: 'Swap',
                          });
                        }
                      }

                      if (selectedPay.address === current.address) {
                        setSelectedReceive({
                          ...current,
                          value: '',
                          priceUsd: price,
                        });
                        setSelectedPay({ ...selectedReceive, value: '' });
                      } else {
                        setSelectedReceive({
                          ...current,
                          value: '',
                          priceUsd: price,
                        });

                        setSelectedPay({
                          ...selectedPay,
                          value: '',
                        });
                      }
                    }}
                  >
                    <img className={cn(styles['input-value-dropdown-item-img'])} src={current.imgURL} alt={current.name.replace(/\s/g, '-')} title={current.displayName} />

                    <div className={cn(styles['input-value-dropdown-item-right'])}>
                      <div className={cn(styles['input-value-dropdown-item-name'])}>{current.displayName}</div>
                      <div className={cn(styles['input-value-dropdown-item-symbol-address'])}>
                        {current.symbol} {current.symbol === 'BNB' ? null : (shortenText(current.address, 4) || '') + getStrLast(current.address, 4)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className={cn(styles['input-info'], 'flx-btw-ctr')}>
          <div className={cn(styles['input-info-left'])}>
            Balance: {get_token_amount(wallet, selectedReceive.address) || 0} {selectedReceive.symbol}
          </div>
          <div className={cn(styles['input-info-right'])}>
            ~$
            {addCommas((selectedReceive.priceUsd * Number(selectedReceive.value)).toFixed(2))}
          </div>
        </div>
      </div>

      <div className={cn(styles['button-area'], 'flx-btw-ctr')}>
        {enablebtn.active ? (
          <>
            <Button
              primary
              disabled={enablebtn.disabled}
              title={enablebtn.title}
              icon={enablebtn.loading ? <LoadingCircleIcon className={cn(styles['spin'])} /> : null}
              onClick={async () => {
                setenablebtn({
                  ...enablebtn,
                  loading: true,
                  disabled: true,
                });

                if (!selectedPay.decimals) {
                  setbutton({
                    ...button,
                    disabled: false,
                    loading: false,
                    title: 'Something went wrong',
                  });

                  setenablebtn({
                    ...enablebtn,
                    active: false,
                    loading: false,
                    disabled: false,
                  });

                  return;
                }

                let sellAmount = add_decimals('1', selectedPay.decimals);

                try {
                  const res = await axios.get(`https://bsc.api.0x.org/swap/v1/quote?sellToken=${selectedPay.address}&buyToken=${selectedReceive.address}&sellAmount=${sellAmount}&feeRecipient=${swapperconf.feeRecipient}&buyTokenPercentageFee=${swapperconf.buyTokenPercentageFee}`);
                  const web3 = new Web3(Web3.givenProvider);
                  const ERC20TokenContract = new web3.eth.Contract(ERC20_ABI, selectedPay.address);

                  await ERC20TokenContract.methods.approve(res.data.allowanceTarget, '115792089237316200000000000000000000000000000000000000000000').send({ from: wallet.address });

                  setenablebtn({
                    ...enablebtn,
                    active: false,
                    loading: false,
                    disabled: false,
                  });

                  setbutton({
                    ...button,
                    disabled: false,
                  });
                } catch (err) {
                  setbutton({
                    ...button,
                    disabled: false,
                    loading: false,
                    title: 'Something went wrong',
                  });

                  setenablebtn({
                    ...enablebtn,
                    active: false,
                    loading: false,
                    disabled: false,
                  });
                }
              }}
            />

            <div className={cn(styles['button-area-seperator'])}></div>
          </>
        ) : null}

        {err ? (
          <div className={cn(styles['button-area-err'])}>{err}</div>
        ) : (
          <Button
            primary
            disabled={button.disabled}
            title={button.title}
            icon={button.loading ? <LoadingCircleIcon className={cn(styles['spin'])} /> : null}
            onClick={async (e) => {
              if (button.type === 'connect-wallet') {
                if (wallet.address) {
                  return;
                }

                setbutton({
                  ...button,
                  title: 'Connecting wallet',
                  loading: true,
                  disabled: true,
                });

                await configMetamask(store);

                const accounts = await ethereum.request({
                  method: 'eth_requestAccounts',
                });

                const chainId = await ethereum.request({
                  method: 'eth_chainId',
                });

                if (chainId !== '0x38') {
                  setbutton({
                    ...button,
                    title: 'Network switch required',
                    loading: false,
                    disabled: true,
                  });

                  return;
                }

                if (!accounts[0]) {
                  setbutton({
                    ...button,
                    title: 'No accounts detected',
                    loading: false,
                    disabled: true,
                  });

                  return;
                }

                ready_wallet(wallet, setWallet, accounts[0], button, setbutton);

                // Get signature first then save it to the local storage
                /**
               * 
                let signatures =
                  JSON.parse(localStorage.getItem('wallet-signatures')) || {};

                
                if (!signatures || !signatures[accounts[0]]) {
                  try {
                    const signres = await reqInstance.post(
                      'https://api.cryptoralia.com/v1/blockchain/request-message',
                      {
                        address: accounts[0],
                        chainId: parseInt(chainId),
                      }
                    );

                    const message = signres.data.message;
                    const signature = await web3.eth.personal.sign(
                      message,
                      accounts[0]
                    );

                    const verifyres = await reqInstance.post(
                      'https://api.cryptoralia.com/v1/blockchain/verify-sign',
                      {
                        message,
                        signature,
                      }
                    );

                    signatures = {};
                    signatures[accounts[0]] = {
                      message,
                      signature,
                    };

                    localStorage.setItem(
                      'wallet-signatures',
                      JSON.stringify(signatures)
                    );
                  } catch (err) {}
                } else {
                  const value = signatures[accounts[0]];

                  try {
                    const verifyres = await reqInstance.post(
                      'https://api.cryptoralia.com/v1/blockchain/verify-sign',
                      {
                        message: value.message,
                        signature: value.signature,
                      }
                    );
                  } catch (err) {}
                }
              */

                setbutton({
                  ...button,
                  loading: true,
                  disabled: true,
                  title: '',
                });

                const hasallow = await has_allowance(swapperconf, selectedPay, selectedReceive, { ...wallet, address: accounts[0] });

                if (!hasallow) {
                  setenablebtn({
                    ...enablebtn,
                    active: true,
                  });

                  setbutton({
                    ...button,
                    disabled: true,
                    loading: false,
                    title: 'Swap',
                  });
                } else {
                  setenablebtn({
                    ...enablebtn,
                    active: false,
                  });

                  setbutton({
                    ...button,
                    disabled: false,
                    loading: false,
                    type: 'swap',
                    title: 'Swap',
                  });
                }

                return;
              }

              if (button.type === 'swap') {
                if (!selectedPay.decimals || !selectedPay.value) {
                  return;
                }

                try {
                  const resolves = await Promise.all([axios.get('https://api.gopluslabs.io/api/v1/token_security/56?contract_addresses=' + selectedPay.address), axios.get('https://api.gopluslabs.io/api/v1/token_security/56?contract_addresses=' + selectedReceive.address)]);

                  let data = resolves[0].data;

                  if (data.result[selectedPay.address]) {
                    const marketinfo = data.result[selectedPay.address];
                    const total = Number(marketinfo.buy_tax) + Number(marketinfo.sell_tax);
                    if (total) {
                      seterr('You cannot swap these tokens due to some error');
                      return;
                    }
                  }

                  data = resolves[1].data;

                  if (data.result[selectedReceive.address]) {
                    const marketinfo = data.result[selectedReceive.address];
                    const total = Number(marketinfo.buy_tax) + Number(marketinfo.sell_tax);
                    if (total) {
                      seterr('You cannot swap these tokens due to some error');
                      return;
                    }
                  }
                } catch (err) {}

                setbutton({
                  ...button,
                  disabled: true,
                  loading: true,
                  title: 'Swapping',
                });

                const web3 = new Web3(Web3.givenProvider);
                const ERC20TokenContract = new web3.eth.Contract(ERC20_ABI, selectedPay.address);

                if (selectedPay.address === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
                  const amount = BigNumber(Number(selectedReceive.value * 10 ** selectedReceive.decimals)).toFixed();
                  const url = `https://bsc.api.0x.org/swap/v1/quote?sellToken=${selectedPay.address}&buyToken=${selectedReceive.address}&buyAmount=${amount}&takerAddress=${wallet.address}&feeRecipient=${swapperconf.feeRecipient}&buyTokenPercentageFee=${swapperconf.buyTokenPercentageFee}&slippagePercentage=${swapperconf.slippage}`;
                  const res = await axios.get(url);

                  setmodalinfo({
                    ...modalinfo,
                    state: 1,
                    active: true,
                    title: 'Waiting for confirmation',
                    desc: `Swapping <strong>${selectedPay.value} ${selectedPay.symbol}</strong> for <strong>${selectedReceive.value} ${selectedReceive.symbol}</strong>. Please, confirm this transaction in your wallet.`,
                  });

                  try {
                    const receipt = await web3.eth.sendTransaction(res.data);

                    setmodalinfo({
                      ...modalinfo,
                      active: true,
                      title: 'Transaction submitted',
                      desc: `Transaction has been placed in the block. You can also close this or wait here for completion`,
                      txnhash: receipt.transactionHash,
                      state: 2,
                    });

                    setbutton({
                      ...button,
                      disabled: false,
                      loading: false,
                      title: 'Swap',
                    });
                  } catch (err) {
                    setmodalinfo({
                      ...modalinfo,
                      active: true,
                      title: 'Something went wrong',
                      desc: desc,
                      err: 'Something went wrong',
                    });

                    console.log(err);
                  }
                } else {
                  const amount = BigNumber(Number(selectedPay.value * 10 ** selectedPay.decimals)).toFixed();
                  const url = `https://bsc.api.0x.org/swap/v1/quote?sellToken=${selectedPay.address}&buyToken=${selectedReceive.address}&takerAddress=${wallet.address}&sellAmount=${amount}&feeRecipient=${swapperconf.feeRecipient}&buyTokenPercentageFee=${swapperconf.buyTokenPercentageFee}&slippagePercentage=${swapperconf.slippage}`;

                  let res = null;
                  try {
                    res = await axios.get(url);
                  } catch (err) {
                    res = await axios.get(`https://bsc.api.0x.org/swap/v1/quote?sellToken=${selectedPay.address}&buyToken=${selectedReceive.address}&sellAmount=${amount}&feeRecipient=${swapperconf.feeRecipient}&buyTokenPercentageFee=${swapperconf.buyTokenPercentageFee}`);

                    await ERC20TokenContract.methods.approve(res.data.allowanceTarget, '115792089237316200000000000000000000000000000000000000000000').send({ from: wallet.address });
                  }

                  res = await axios.get(url);

                  const transactionParameters = {
                    gasPrice: web3.utils.toHex(res.data.gasPrice), // customizable by user during MetaMask confirmation.
                    gas: web3.utils.toHex(res.data.gas), // customizable by user during MetaMask confirmation.
                    to: res.data.to, // Required except during contract publications.
                    from: wallet.address, // must match user's active address.
                    value: res.data.value, // Only required to send ether to the recipient from the initiating external account.
                    data: res.data.data, // Optional, but used for defining smart contract creation and interaction.
                    chainId: '0x38', // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
                  };

                  setmodalinfo({
                    ...modalinfo,
                    state: 1,
                    active: true,
                    title: 'Waiting for confirmation',
                    desc: `Swapping <strong>${selectedPay.value} ${selectedPay.symbol}</strong> for ${selectedReceive.value} ${selectedReceive.symbol}. Please, confirm this transaction in your wallet.`,
                  });

                  try {
                    const receipt = await ethereum.request({
                      method: 'eth_sendTransaction',
                      params: [transactionParameters],
                    });

                    setmodalinfo({
                      ...modalinfo,
                      active: true,
                      state: 2,
                      title: 'Transaction submitted',
                      desc: `Transaction has been places in the block. You can also close this or wait here for completion`,
                      txnhash: receipt,
                    });
                  } catch (err) {
                    setmodalinfo({
                      ...modalinfo,
                      active: true,
                      title: 'Something went wrong',
                      desc: '',
                      err: 'Something went wrong',
                    });

                    console.log(err);
                  }

                  setbutton({
                    ...button,
                    disabled: false,
                    loading: false,
                    title: 'Swap',
                  });
                }
              }
            }}
          />
        )}
      </div>

      <div className={cn(styles['txninfo-area'])}>
        <div className={cn(styles['txninfo'])}>
          <div className={cn(styles['txninfo-fee'], 'flx-btw-ctr')}>
            <div className={cn(styles['txninfo-fee-title'])}>Transaction fee</div>
            <div className={cn(styles['txninfo-fee-value'])}>
              {txninfo.fee} {selectedReceive.symbol} + {txninfo.gas} BNB ($
              {txninfo.totalFeeUsd})
            </div>
          </div>

          <div className={cn(styles['txninfo-receivedamount'], 'flx-btw-ctr')}>
            <div>Expected receive amount</div>
            <div>{txninfo.expRecAmount}</div>
          </div>

          <div className={cn(styles['txninfo-slippage'], 'flx-btw-ctr')}>
            <div>Slippage</div>
            <div
              onClick={() => {
                setmodalinfo({
                  ...modalinfo,
                  active: true,
                  type: 'slippage',
                });
              }}
              className={cn(styles['txninfo-slippage-settings'], 'flx-btw-ctr')}
            >
              <SettingsIcon />
              {Number(swapperconf.slippage) * 100}%
            </div>
          </div>

          <div className={cn(styles['txninfo-priceimpact'], 'flx-btw-ctr')}>
            <div>Price impact</div>
            <div>{txninfo.priceImpact}</div>
          </div>

          <div className={cn(styles['txninfo-viadex'], 'flx-ctr-ctr')}>
            <div>{txninfo.viadex ? <strong>{txninfo.viadex}</strong> : 'Cryptoralia will find the best price for you'}</div>
          </div>
        </div>
      </div>
    </section>
  ) : null;
}

export default Swapper;
