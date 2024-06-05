import { storage } from 'webextension-polyfill';
// import { getCurrentTab } from '../helpers/tabs';
import { sendDataToDb } from '../content';

type Message = {
  from: string;
  to: string;
  action: string;
  data?: any;
};

async function storeParsedData(parsedData: any, p0: (error: any, response: any) => void) {
  try {
    const result = await storage.local.get('ParsedExtensionData');
    let existingData = result.ParsedExtensionData || [];
    console.log('Existing data:', existingData);

    const isUnique = !existingData.some((item: { ASIN: any; }) => item.ASIN === parsedData.ASIN);

    if (isUnique) {
      console.log("The new ASIN is unique");
      existingData.push(parsedData);
    } else {
      console.log("The ASIN already exists. Updating the existing entry.");
      existingData = existingData.map((item: any) =>
        item.ASIN === parsedData.ASIN ? parsedData : item
      );
    }

    await storage.local.set({ ParsedExtensionData: existingData });
    console.log("Data successfully updated in chrome storage", existingData);
  } catch (error) {
    console.error("Error storing data:", error);
    throw error;
  }
}
// Message listener to handle messages from the content script
chrome.runtime.onMessage.addListener(async (message: Message, sender, sendResponse) => {
  console.log('Message received in background:', message);

  if (message.from === 'content') {
    switch (message.action) {
      case 'clearAndSendData':
        try {
          await sendDataToDb();
          console.log('Data sent to db and storage cleared');
          sendResponse({ message: 'Storage cleared and data sent successfully.' });
        } catch (error) {
          console.error('Error clearing storage or sending data:', error);
          sendResponse({ message: 'Error clearing storage or sending data.', error });
        }
        break;

      case 'productDetails':
        console.log('Received product details in background:', message.data);
        storeParsedData(message.data, (error, response) => {
          if (error) {
            console.error('Error storing parsed data:', error);
            sendResponse({ received: false, error: error });
          } else {
            console.log('Parsed data to storage');
            sendResponse(response); // Send parsed data or success message
          }
        });

        break;
        // try {
        //   const response = await storeParsedData(message.data);
        //   console.log('Parsed data to storage');
        //   sendResponse(response);
        // } catch (error) {
        //   console.error('Error storing parsed data:', error);
        //   sendResponse({ received: false, error: error });
        // }
        // break;
      default:
        console.log('Unknown action:', message.action);
        sendResponse({ received: false, error: 'Unknown action' });
    }
    // return true; // Required to indicate async response
  }
});



// chrome.runtime.onMessage.addListener(async (message: Message, sender, sendResponse) => {
//   if (message.from === 'content') {
//     if (message.action === 'productDetails') {
//       console.log('Received product details in background:', message.data);

//       try {
//         await storeParsedData(message.data);
//         console.log('Parsed data to storage');
//         sendResponse({ received: true });
//       } catch (error: unknown) {
//         console.error('Error storing parsed data:', error);
//         sendResponse({ received: false, error: error});
//       }
//       return true; // Required to indicate async response
//     }
//     else 
//     if (message.action === 'clearAndSendData') {
//       try {
//         const res = await sendDataToDb();
//         console.log('Response sent to storage', res);
//         sendResponse({ message: 'Storage cleared and data sent successfully.' });
//         console.log('Data sent to db');
//       } catch (error) {
//         console.error('Error clearing storage or sending data:', error);
//         sendResponse({ message: 'Error clearing storage or sending data.', error });
//       }
//       return true; // Required to indicate async response
//     }
//   }
// });

  // async function incrementStoredValue(tabId: string) {
  //   const data = await storage.local.get(tabId);
  //   const currentValue = data?.[tabId] ?? 0;
  //   console.log('[current storage value', currentValue);
  
  //   return storage.local.set({ [tabId]: currentValue + 1 });
  // }
  
  // export async function init() {
  //   await storage.local.clear();
  
  //   runtime.onMessage.addListener(async (message: Message) => {
  //     if (message.to === 'background') {
  //       console.log('background handled: ', message.action);
  
  //       const tab = await getCurrentTab();
  //       const tabId = tab.id;
  
  //       if (tabId) {
  //         return incrementStoredValue(tabId.toString());
  //       }
  //     }
  //   });
  
  //   console.log('[background] loaded ');
  // };