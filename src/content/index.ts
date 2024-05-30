import { runtime } from 'webextension-polyfill'
import { AddProductButton } from '../popup/components/injections/AddProductButton';
// import { getCurrentTab } from '../helpers/tabs';
import { parseAmazonPage, parseDataToStorage } from './parseProduct';
console.log('[content] loaded ');
function handleClick(btnContainer: HTMLDivElement) {
  const productDetails = parseAmazonPage();
  console.log("Product Details:", productDetails);
  
  runtime.sendMessage({
    from: 'content',
    to: 'background',
    action: 'getCurrentTab'
  }).then((currentTab) => {
    console.log("Current tab:", currentTab);
    if (currentTab && currentTab.id) {
      console.log("Active tab queried");
      console.log("Parsing has begun");
      chrome.scripting.executeScript(
        {
          target: { tabId: currentTab.id },
          func: parseAmazonPage,
        },
        (result) => {
          console.log("Script execution callback");
          if (chrome.runtime.lastError) {
            console.log("Script execution failed:", chrome.runtime.lastError.message);
          } else {
            console.log("Script executed successfully:", result);
            const parsedData = result[0].result;
            console.log("Parsed data:", parsedData);
            parseDataToStorage(parsedData);
          }
        }
      );
    }
  });

  runtime.sendMessage({
    from: 'content',
    to: 'background',
    action: 'productDetails',
    data: productDetails
  }).then(response => {
    console.log('Response from background:', response);
  }).catch(error => {
    console.error('Error in message response:', error);
  });
};

function handleAfterClick(btnContainer: HTMLDivElement) {
    console.log('Button clicked again');
  }
(function injectBtn(){
  const addProductBtn = AddProductButton('Parse Product', 'block', handleClick, handleAfterClick);
  const targetElement = document.getElementById('productTitle');
  if (targetElement) {
      targetElement.appendChild(addProductBtn);
      console.log('Added the button')
  } else {
      console.error('Target element not found');
  }
})();