export function parseAmazonPage() {
    console.log("Inside parseAmazonPage function");
    // product-title
    const productTitle = document.getElementById("productTitle")
      ? document.getElementById("productTitle")?.innerText
      : "Title not found";
  
    // price
    const priceElement = document.getElementById("tp_price_block_total_price_ww");
    let price = "Price not found";
    if (priceElement) {
      const priceTextElement: HTMLElement = priceElement.querySelector("span.a-offscreen")!;
      if (priceTextElement) {
        price = priceTextElement.innerText.trim();
      } else {
        console.log("Price text element not found.");
      }
    } else {
      console.log("Price element not found.");
    }
  
    // ASIN
    const ASIN = document.querySelector('[name="ASIN"]')
      ? (document.querySelector('[name="ASIN"]') as HTMLInputElement).value
      : "ASIN not found";
  
    // Manufacturer
    const manufacturerElement = document.querySelector(
      "#detailBullets_feature_div li:nth-child(4) span:nth-child(2)"
    );
    let manufacturerName = manufacturerElement
      ? manufacturerElement.textContent?.trim()
      : "Manufacturer not found";
  
    // Brand
    const brandElement = document.querySelector(
      ".po-brand .a-size-base.po-break-word"
    );
    let brand = brandElement
      ? brandElement.textContent?.trim()
      : "Brand not found";
  
    // Unit Count
    const unitCountElement = document.querySelector(
      ".po-unit_count .a-size-base.po-break-word"
    );
    let unitCount = unitCountElement
      ? unitCountElement.textContent?.trim().split(" ")[0]
      : "Unit Count not found";
  
    // Color
    const colorElement = document.querySelector(".po-color .po-break-word");
    const color = colorElement
      ? colorElement.textContent?.trim()
      : "Color not found";
  
    // Rating
    const ratingElement = document.getElementById("acrPopover");
    const rating = ratingElement
      ? ratingElement.title.split("out of")[0]
      : "Rating not found";
  
    // Rating count
    const reviewCountElement = document.getElementById("acrCustomerReviewText");
    const reviewCount = reviewCountElement
      ? reviewCountElement.textContent?.trim().replace(",", "").split(" ")[0]
      : "Review count not found";
  
    return {
      productTitle,
      price,
      ASIN,
      manufacturerName,
      brand,
      unitCount,
      color,
      rating,
      reviewCount,
    };
  }