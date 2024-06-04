import { runtime, storage } from 'webextension-polyfill';
import { getCurrentTab } from '../helpers/tabs';
import { sendDataToDb } from '../content';

type Message = {
  from: string;
  to: string;
  action: string;
  data?: any;
};

async function incrementStoredValue(tabId: string) {
    const data = await storage.local.get(tabId)
    const currentValue = data?.[tabId] ?? 0
    console.log('[current storage value', currentValue);
  
    return storage.local.set({ [tabId]: currentValue + 1 })
}

export async function init() {

    await storage.local.clear();
	// the message receiver
    runtime.onMessage.addListener(async (message: Message) => {
        if (message.to === 'background') {
        console.log('background handled: ', message.action)

        const tab = await getCurrentTab()
        const tabId = tab.id

        if (tabId) {
            return incrementStoredValue(tabId.toString());
        }
        }
    });

    console.log('[background] loaded ');
};

// Function to store parsed data in local storage new implementation
async function storeParsedData(parsedData: any) {
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
}
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.from === 'content') {
    if (message.action === 'productDetails') {
      console.log('Received product details in background:', message.data);

      storeParsedData(message.data)
        .then(() => {
          console.log('Parsed data to storage');
          sendResponse({ received: true });
        })
        .catch((error) => {
          console.error('Error storing parsed data:', error);
          sendResponse({ received: false, error: error.message });
        });

      return true;
    } 
    else if (message.action === 'clearAndSendData') {
      sendDataToDb()
        .then((res) => {
          console.log('Response sent to storage', res);
          sendResponse({ message: 'Storage cleared and data sent successfully.' });
          console.log('Data sent to db');
        })
        .catch((error) => {
          console.error('Error clearing storage or sending data:', error);
          sendResponse({ message: 'Error clearing storage or sending data.', error });
        });

      return true;
    }
  }
});


// runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
//   if (message.from === 'content' && message.action === 'productDetails') {
//     console.log('Received product details in background:', message.data);
//     storeParsedData(message.data).then(() => {
//       console.log('Parsed data to storage');
//     }).catch((error) => {
//       console.error('Error storing parsed data:', error);
//       // sendResponse({ received: false, error: error.message });
//     });
    
//     // Return true to indicate that the response will be sent asynchronously
//     return true;
//   }
//   else if (message.from === 'content' && message.action === 'clearAndSendData') {
//     // Handle clear storage and send data request from content script
//     sendDataToDb().then((res) => {
//       console.log('response sent to storage', res);
//       // sendResponse({ message: 'Storage cleared and data sent successfully.' });
//       console.log('data send to db');
//     }).catch((error) => {
//       // sendResponse({ message: 'Error clearing storage or sending data.', error });
//       console.error(error);
//     });
//     return true;
//   }
// });

// runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
//   if (message.from === 'content' && message.action === 'clearAndSendData') {
//     // Handle clear storage and send data request from content script
//     sendDataToDb().then((res) => {
//       console.log('response sent to storage', res);
//       // sendResponse({ message: 'Storage cleared and data sent successfully.' });
//       console.log('data send to db');
//     }).catch((error) => {
//       // sendResponse({ message: 'Error clearing storage or sending data.', error });
//       console.error(error);
//     });
//     return true;
//   }
// });

// to fetch items from storage; to invoke latter asynchronously
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.action === "clearStorage") {
//     chrome.storage.local.get("DetailsData", async (result) => {
//       const data = result.DetailsData || [];
//       console.log('Data being cleared', data);
//       // Send data to server-side script using fetch or axios
//       // mongodb+srv://testDb:px#h7_F4G3BgJ$z@cluster0.k8dhinz.mongodb.net/testDb
//       const response = await fetch("http://localhost:27017/testdb/products", {
//         method: "POST",
//         body: JSON.stringify(data),
//       });

//       if (response.ok) {
//         chrome.storage.local.clear(() => {
//           console.log("Local storage cleared successfully");
//           sendResponse({ message: "Storage cleared and data sent." });
//         });
//       } else {
//         console.error("Error sending data to server:", response.statusText);
//         sendResponse({ message: "Error clearing storage." });
//       }
//     });
//   }
// });
// runtime.onInstalled.addListener(() => {
//   init().then(() => {
//     console.log('[background] loaded')
//   })
// })