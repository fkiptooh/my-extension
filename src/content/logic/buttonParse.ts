// content.js
import { runtime } from 'webextension-polyfill';
import { parseAmazonPage } from '../parseProduct';
import { AddProductButton } from '../../../src/popup/components/injections/AddProductButton';

console.log('[content] loaded ');

/**
 * func: parse data on page load;
 */
function handlePageLoad() {
    const productDetails = parseAmazonPage();
    sendProductDetails(productDetails);  
    console.log("Product Details:", productDetails);
}

/**
 * func: sends parsed product details to background script
 * @param productDetails 
 */
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

/**
 * func: handle button clicks
 */
function handleClick() {
    const productDetails = parseAmazonPage();
    sendProductDetails(productDetails);
}

function handleAfterClick() {
    console.log('Button clicked again');
    // handle the logic for after click
}

/**
 * func: insert a button into the amazon product page.
 */
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
