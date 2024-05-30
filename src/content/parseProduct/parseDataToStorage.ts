export function parseDataToStorage(parsedData: any) {
    console.log(
      "Parsed Data inside the storage function",
      parsedData
    );
    // eslint-disable-next-line no-lone-blocks
    {
      chrome.storage.local.get(
        "ParsedExtensionData",
        function (result) {
          let existingData = result.ParsedExtensionData || [];
          console.log('existing data :', existingData);
          // checking for uniqueness before storing product data: using asins
          const isUnique = !existingData.some(
            (existingData: { ASIN: any; }) => existingData.ASIN === parsedData.ASIN
          );
          if (isUnique) {
            console.log("The new asin is unique");
            // Append new data to the existing array
            existingData.push(parsedData);
            // console.log(collectedData);
          } else {
            console.log(
              "No existing data found, creating new array."
            );
            // Create a new array if it does not exist
            existingData = [parsedData];
          }
  
          // Update the local storage with the new array
          chrome.storage.local.set(
            { ParsedExtensionData: existingData },
            function () {
              if (chrome.runtime.lastError) {
                console.error(
                  "Error storing data:",
                  chrome.runtime.lastError
                );
              } else {
                console.log(
                  "Data successfully updated in chrome storage",
                  existingData
                );
              }
            }
          );
        }
      );
    }
  }
