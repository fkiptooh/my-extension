import { useState, useEffect } from 'react';
import { storage } from 'webextension-polyfill';

interface Product {
  ASIN: string; // always present
  brand?: string;
  color?: string;
  manufacturerName?: string;
  price?: string;
  productTitle: string; // always present
  rating: string;
  reviewCount?: string;
  unitCount?: string;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await storage.local.get('ParsedExtensionData');
        const storedProducts = result.ParsedExtensionData || [];
        setProducts(storedProducts);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return products;
}
