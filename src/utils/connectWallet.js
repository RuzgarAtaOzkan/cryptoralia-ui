// MODULES
import Web3 from 'web3';

// CONTEXT
import gdt from '../context/global/types';

async function connectWallet(store) {
  if (!store) {
    throw new Error('Store is missing in connectWallet');
  }

  if (!window.ethereum) {
    store.dispatchGlobal({
      type: gdt.SET_ALERT,
      payload: {
        type: 'error',
        message: 'You have to install MetaMask Extension',
        link: 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
      },
    });

    return;
  }

  const accounts = await ethereum.request({
    method: 'eth_requestAccounts',
  });

  try {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: Web3.utils.toHex(56) }],
    });
  } catch (err) {
    await ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: Web3.utils.toHex(56),
          chainName: 'Smart Chain',
          nativeCurrency: {
            name: 'Binance Coin',
            symbol: 'BNB',
            decimals: 18,
          },
          rpcUrls: ['https://bsc-dataseed.binance.org/'],
          blockExplorerUrls: ['https://bscscan.com'],
        },
      ],
    });
  }
}

export default connectWallet;
