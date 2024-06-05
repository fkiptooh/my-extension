import { runtime } from 'webextension-polyfill';
import { AddProductButton } from '../../../src/popup/components/injections/AddProductButton';
import { parseAmazonPage } from '../parseProduct';
console.log('[content] loaded ');

function handleClick(btnContainer: HTMLDivElement) {
  const productDetails = parseAmazonPage();
  
  runtime.sendMessage({
      from: 'content',
      to: 'background',
      action: 'productDetails',
      data: productDetails
    }).then(response => {
        console.log('Response from background:', response.data);
    }).catch(error => {
        console.error('Error in message response:', error);
    });
    console.log("Product Details:", productDetails);
};

function handleAfterClick(btnContainer: HTMLDivElement) {
    console.log('Button clicked again');
    // handle the logic for after click
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
