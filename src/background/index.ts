import { storage } from "webextension-polyfill";
// import { config } from 'dotenv';
// config();

// type Message = {
//   from: string;
//   to: string;
//   action: string;
//   data?: any;
// };

/**
 * 
 * @param parsedData 
 * @returns an array of product attributes parsed to storage;
 */
async function storeParsedData(parsedData: any) {
  if (!parsedData.asin || parsedData.asin === "ASIN not found") {
    console.log("No valid ASIN found. Data will not be stored.");
    return;
  }
  try {
    const result = await storage.local.get("ParsedExtensionData");
    let existingData = result.ParsedExtensionData || [];
    console.log("Existing data:", existingData);

    const isUnique = !existingData.some(
      (item: { asin: any }) => item.asin === parsedData.asin
    );

    if (isUnique) {
      console.log("The new ASIN is unique");
      existingData.push(parsedData);
      await storage.local.set({ ParsedExtensionData: existingData });
      console.log("Data successfully updated in chrome storage", existingData);
      updateProductTable(parsedData);
    } else {
      console.log("The ASIN already exists. Updating the existing entry.");
      existingData = existingData.map((item: any) =>
        item.asin === parsedData.asin ? parsedData : item
      );
    }

  } catch (error) {
    console.error("Error storing data:", error);
    throw error;
  }
}
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (
    message.from === "content" &&
    message.to === "background" &&
    message.action === "productDetails"
  ) {
    const productDetails = message.data;
      // Check for valid asin before proceeding
      if (!productDetails.asin || productDetails.asin === "Asin not found") {
        console.log("No valid ASIN found. Data will not be stored or sent to the backend.");
        sendResponse({ data: "failure", error: "No valid ASIN found" });
        return;
      }
    // Store product details in local storage
    await storeParsedData(productDetails)
      .then(() => {
        console.log("Product details saved to local storage");
        sendResponse({ data: productDetails });
      })
      .catch((error) => {
        console.error("Error saving to local storage:", error);
        sendResponse({ data: "failure", error });
      });

    // Required to keep the message channel open for async responses
    return true;
  } 
  // To consider if needed with separate implementation of the sendDataToDb logic;
  // else if (
  //   message.from === "content" &&
  //   message.to === "background" &&
  //   message.action === "productDetails"
  // ) {
  //   console.log('data to send to db', message.data);
  //   updateProductTable(message.data);
  // }
  // else if (
  //   message.from === "content" &&
  //   message.to === "background" &&
  //   message.action === "productDetails"
  // ) {
  //   try {
  //     await sendDataToDb();
  //     console.log("Data sent to db and storage cleared");
  //     sendResponse({ message: "Storage cleared and data sent successfully." });
  //   } catch (error) {
  //     console.error("Error clearing storage or sending data:", error);
  //     sendResponse({
  //       message: "Error clearing storage or sending data.",
  //       error,
  //     });
  //   }
  // }
});
/**
 * sends data to the database in the background.
 * @param productInfo 
 */
function updateProductTable(productInfo: any) {
  // Example endpoint URL for updating the product table
  // const apiEndpoint: string = process.env.API_ENDPOINT ?? 'http://default.endpoint';
  const apiEndpoint = process.env.API_ENDPOINT!;
  fetch(apiEndpoint, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify([productInfo]),
  })
  .then(response => {
    if (response.headers.get('Content-Type')?.includes('application/json')) {
      return response.json();
    } else {
      return response.text();
    }
  })
  .then(data => {
    if (typeof data === 'string') {
      console.log('Response from server:', data);
    } else {
      console.log('Product table updated:', data);
    }
  })
  .catch((error) => {
    console.error('Error updating product table:', error);
  });
}
