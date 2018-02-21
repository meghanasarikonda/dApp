import store from '../../store';
import Web3 from 'web3';

// showMessage if MetaMask is locked
import showMessage from '../../components/message';

export const WEB3_INITIALIZED = 'WEB3_INITIALIZED';

function web3Initialized(results) {
  return {
    type: WEB3_INITIALIZED,
    payload: results
  };
}

let getWeb3 = (
  window,
  showErrorMessage = showMessage.bind(showMessage, 'error'),
  dispatch = store.dispatch.bind(store)) => (new Promise(function(resolve, reject) {
  // Wait for loading completion to avoid race conditions with web3 injection timing.
  window.addEventListener('load', function() {
    var results;
    var web3 = window.web3;

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined' && web3.currentProvider && web3.currentProvider.isMetaMask) {
      console.log("Mist/MetaMask's detected!");

      if (web3.eth.accounts.length === 0) {
        results = {
          web3Instance: null
        };

        console.log("Please unlock MetaMask!");

        showErrorMessage('MetaMask is locked! Please unlock and refresh this page', 8);
        resolve(dispatch(web3Initialized(results)));
      }

      web3 = new Web3(web3.currentProvider);

      results = {
        web3Instance: web3
      };

      console.log('Injected web3 detected.');

      resolve(dispatch(web3Initialized(results)));
    } else {
      // Fallback to localhost if no web3 injection. We've configured this to
      // use the development console's port by default.
      var provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545');

      web3 = new Web3(provider);

      results = {
        web3Instance: web3
      };

      console.log('No web3 instance injected, using Local web3.');

      resolve(dispatch(web3Initialized(results)));
    }
  });
}));

export default getWeb3;
