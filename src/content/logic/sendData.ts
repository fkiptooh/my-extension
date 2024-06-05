const BACKEND_URL = "http://localhost:3000/sendData";

export async function sendDataToDb() {
  try {
    const data = await chrome.storage.local.get('ParsedExtensionData');
    const parsedData = data?.ParsedExtensionData || [];

    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(parsedData),
    });

    if (response.ok) {
      await chrome.storage.local.clear();
      console.log('Data sent to database successfully & Cleared local storage');
    } else {
      console.error('Error sending data to database:', response.statusText);
    }
  } catch (error) {
    console.error('Error clearing storage or sending data:', error);
  }
}
