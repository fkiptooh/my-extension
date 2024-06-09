// content.js
import { runtime } from 'webextension-polyfill';
import { parseAmazonPage } from '../parseProduct';
import { AddProductButton } from '../../../src/popup/components/injections/AddProductButton';

console.log('[content] loaded ');

function handlePageLoad() {
    // Parse data on page load
    const productDetails = parseAmazonPage();
  
    // Send parsed data to background script
    sendProductDetails(productDetails);
  
    console.log("Product Details:", productDetails);
}

// Function to send parsed product details to background script
function sendProductDetails(productDetails: any) {
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
}

// Execute parseAmazonPage when the page is fully loaded
window.addEventListener("load", handlePageLoad);

// Handle button click to parse data again
function handleClick() {
    const productDetails = parseAmazonPage();
    sendProductDetails(productDetails);
}

function handleAfterClick() {
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
