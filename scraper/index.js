
// works only with nvm version 18
import axios from 'axios';
const url = "http://localhost:3000/fetchData";
async function getStoredASINs() {
  try {
    const result = await axios.get(`${url}`);
    return result.data;
  } catch (error) {
    console.error("Error fetching stored ASINs:", error);
    throw error;
  }
}
const data = await getStoredASINs();
const result = data.map((item) => item.ASIN);

let asins = new Set(result);
let country = "us";

async function fetchProductData(asin, country) {
  try {
    const response = await axios(
      `https://api.scraperapi.com/structured/amazon/product?api_key=9e4922a2940a07e32960b3554be622fc&asin=${asin}&country=${country}`
    );
    return { asin, data: response.data };
  } catch (error) {
    console.error(`Error fetching data for ASIN ${asin}:`, error);
    return { asin, data: null };
  }
}
const productDataPromises = Array.from(asins).slice(1,7).map(asin => fetchProductData(asin, country));
console.log('asins: ', asins);

Promise.all(productDataPromises)
  .then(productDataArray => {
    productDataArray.forEach(({asin, data:productData}) => {
      if (productData) {
        const dataForDatabase = {
          asin: asin,
          title: productData.name,
          rating: productData.average_rating,
          price: productData.pricing || 0, // Assuming price is in the first pricing object
          brandName: productData.brand || null,
          model: productData.model || null,
          manufacturer: productData.product_information?.manufacturer || null,
          releaseDate: productData.product_information?.date_first_available || null,
          color: productData.product_information?.color || null,
        };
        console.log(JSON.stringify(dataForDatabase, null, 2));
      } else {
        console.log('Product data is null or undefined.');
      }
    });
  })
  .catch(errors => {
    console.error("Errors encountered during scraping:", errors);
    // Handle any errors that might have occurred during parallel execution
  });

// Implementation for a single asin:::documentation.
// await axios(`https://api.scraperapi.com/structured/amazon/product?api_key=9e4922a2940a07e32960b3554be622fc&asin=B07MH1KHJ2&country=us`)
// .then(response => {
//   // console.log(response.data);
// console.log(JSON.stringify(response.data))
// })
// .catch(error => {
// console.log(error)
// }
// );