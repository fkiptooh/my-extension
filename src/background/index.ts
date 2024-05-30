import { runtime, tabs, storage } from 'webextension-polyfill';

type Message = {
    from: string
    to: string
    action: string
  }

async function getCurrentTab() {
    const list = await tabs.query({ active: true, currentWindow: true })
  
    return list[0]
  }

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
// send data to local storage
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.from === 'content' && message.action === 'productDetails') {
    // Process the data received from the content script
    console.log('Received product details in background:', message.data);

    // You can send a response back to the content script if needed
    sendResponse({ received: true });
  }
});
// to fetch items from storage;
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "clearStorage") {
    chrome.storage.local.get("DetailsData", async (result) => {
      const data = result.DetailsData || [];
      console.log('Data being cleared', data);
      // Send data to server-side script using fetch or axios
      // mongodb+srv://testDb:px#h7_F4G3BgJ$z@cluster0.k8dhinz.mongodb.net/testDb
      const response = await fetch("http://localhost:27017/testdb/products", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (response.ok) {
        chrome.storage.local.clear(() => {
          console.log("Local storage cleared successfully");
          sendResponse({ message: "Storage cleared and data sent." });
        });
      } else {
        console.error("Error sending data to server:", response.statusText);
        sendResponse({ message: "Error clearing storage." });
      }
    });
  }
});

// runtime.onInstalled.addListener(() => {
//   init().then(() => {
//     console.log('[background] loaded')
//   })
// })