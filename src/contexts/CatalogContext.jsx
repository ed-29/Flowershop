import React, { createContext, useContext, useEffect, useState } from 'react';
import productData from '../images.json';
import packageData from '../packages.json';

const CatalogContext = createContext(null);
const STORAGE_KEY = 'shop_catalog';
const DELETED_KEY = 'shop_catalog_deleted';

export const productKey = (product) => `${product.section}:${product.id}`;

const readDeletedKeys = () => {
  try {
    const deleted = JSON.parse(localStorage.getItem(DELETED_KEY) || '[]');
    return Array.isArray(deleted) ? deleted : [];
  } catch (e) {
    return [];
  }
};

const rememberDeleted = (key) => {
  const deleted = readDeletedKeys();
  if (!deleted.includes(key)) {
    localStorage.setItem(DELETED_KEY, JSON.stringify([...deleted, key]));
  }
};

const seedProducts = () => [
  ...productData.products.map((product) => ({
    ...product,
    available: true,
    section: 'bestsellers',
    description: product.description || product.name
  })),
  ...packageData.products.map((product) => ({
    ...product,
    available: true,
    section: 'specialOffers',
    description: product.description || product.name
  }))
];

const mergeCatalog = (saved) => {
  const seed = seedProducts();
  const deleted = new Set(readDeletedKeys());
  if (!Array.isArray(saved) || saved.length === 0) {
    return seed.filter((product) => !deleted.has(productKey(product)));
  }

  const savedMap = new Map(saved.map((product) => [productKey(product), product]));
  const merged = seed
    .filter((product) => !deleted.has(productKey(product)))
    .map((product) => {
      const existing = savedMap.get(productKey(product));
      return existing ? { ...product, ...existing } : product;
    });

  saved.forEach((product) => {
    const key = productKey(product);
    if (deleted.has(key)) return;
    if (!merged.some((item) => productKey(item) === key)) {
      merged.push({
        ...product,
        available: product.available !== false,
        section: product.section || 'bestsellers',
        images: product.images || (product.image ? [product.image] : [])
      });
    }
  });

  return merged;
};

const readCatalog = () => {
  try {
    return mergeCatalog(JSON.parse(localStorage.getItem(STORAGE_KEY)));
  } catch (e) {
    return seedProducts();
  }
};

export const CatalogProvider = ({ children }) => {
  const [products, setProducts] = useState(() => readCatalog());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save catalog', e);
    }
  }, [products]);

  const bestsellers = products.filter((product) => product.section === 'bestsellers');
  const specialOffers = products.filter((product) => product.section === 'specialOffers');

  const setAvailability = (product, available) => {
    const name = product.name || 'this item';
    const confirmed = window.confirm(
      available
        ? `Put "${name}" back on sale?`
        : `Mark "${name}" unavailable? Customers will not be able to buy it.`
    );
    if (!confirmed) return false;

    setProducts((current) =>
      current.map((item) =>
        productKey(item) === productKey(product) ? { ...item, available } : item
      )
    );
    return true;
  };

  const addProduct = ({ name, price, image, section, description }) => {
    const trimmedName = String(name || '').trim();
    const parsedPrice = Number(price);
    const imageUrl = String(image || '').trim();
    const chosenSection = section === 'specialOffers' ? 'specialOffers' : 'bestsellers';

    if (!trimmedName || !Number.isFinite(parsedPrice) || parsedPrice < 0 || !imageUrl) {
      return { success: false, message: 'Name, price, and image are required' };
    }

    const newProduct = {
      id: Date.now(),
      name: trimmedName,
      price: parsedPrice,
      images: [imageUrl],
      available: true,
      section: chosenSection,
      description: String(description || trimmedName).trim()
    };

    setProducts((current) => [...current, newProduct]);
    return { success: true, product: newProduct };
  };

  const updateProduct = (product, { name, price, image }) => {
    const trimmedName = String(name ?? product.name).trim();
    const parsedPrice = Number(price);
    const imageUrl = String(image ?? product.images?.[0] ?? '').trim();

    if (!trimmedName || !Number.isFinite(parsedPrice) || parsedPrice < 0 || !imageUrl) {
      return { success: false, message: 'Name, price, and image are required' };
    }

    setProducts((current) =>
      current.map((item) =>
        productKey(item) === productKey(product)
          ? {
              ...item,
              name: trimmedName,
              price: parsedPrice,
              images: [imageUrl, ...(item.images || []).slice(1)]
            }
          : item
      )
    );
    return { success: true };
  };

  const removeProduct = (product) => {
    const name = product.name || 'this item';
    const confirmed = window.confirm(
      `Remove "${name}" from the shop? This cannot be undone.`
    );
    if (!confirmed) return false;

    const key = productKey(product);
    rememberDeleted(key);
    setProducts((current) => current.filter((item) => productKey(item) !== key));
    return true;
  };

  return (
    <CatalogContext.Provider
      value={{
        products,
        bestsellers,
        specialOffers,
        setAvailability,
        addProduct,
        updateProduct,
        removeProduct
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
};

export const useCatalog = () => {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error('useCatalog must be used within a CatalogProvider');
  }
  return context;
};
