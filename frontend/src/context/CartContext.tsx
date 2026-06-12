"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  productId: string;
  name: string;
  brand: string;
  image: string;
  size: string;
  color: string;
  packQuantity: number; // Number of packs/boxes
  packSize: number; // E.g., 10 items per pack
  wholesalePrice: number; // Price per piece
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  addBulkToCart: (items: CartItem[]) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, packQuantity: number) => void;
  clearCart: () => void;
  totalAmount: number;
  totalPacks: number;
  totalItems: number;
  minOrderValue: number;
  isMinOrderMet: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const minOrderValue = 5000; // Wholesale minimum order value in Rupees

  useEffect(() => {
    const storedCart = localStorage.getItem('riya_touch_cart');
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch (e) {
        console.error('Failed to parse cart');
      }
    }
  }, []);

  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('riya_touch_cart', JSON.stringify(newCart));
  };

  const addToCart = (newItem: CartItem) => {
    const existingIndex = cart.findIndex(
      (item) =>
        item.productId === newItem.productId &&
        item.size === newItem.size &&
        item.color === newItem.color
    );

    if (existingIndex > -1) {
      const updatedCart = [...cart];
      updatedCart[existingIndex].packQuantity += newItem.packQuantity;
      saveCart(updatedCart);
    } else {
      saveCart([...cart, newItem]);
    }
  };

  const addBulkToCart = (newItems: CartItem[]) => {
    let updatedCart = [...cart];

    newItems.forEach((newItem) => {
      const existingIndex = updatedCart.findIndex(
        (item) =>
          item.productId === newItem.productId &&
          item.size === newItem.size &&
          item.color === newItem.color
      );

      if (existingIndex > -1) {
        updatedCart[existingIndex].packQuantity += newItem.packQuantity;
      } else {
        updatedCart.push(newItem);
      }
    });

    saveCart(updatedCart);
  };

  const removeFromCart = (productId: string, size: string, color: string) => {
    const updatedCart = cart.filter(
      (item) =>
        !(item.productId === productId && item.size === size && item.color === color)
    );
    saveCart(updatedCart);
  };

  const updateQuantity = (productId: string, size: string, color: string, packQuantity: number) => {
    if (packQuantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }

    const updatedCart = cart.map((item) => {
      if (
        item.productId === productId &&
        item.size === size &&
        item.color === color
      ) {
        return { ...item, packQuantity };
      }
      return item;
    });

    saveCart(updatedCart);
  };

  const clearCart = () => {
    saveCart([]);
  };

  // Calculations
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.wholesalePrice * item.packSize * item.packQuantity,
    0
  );

  const totalPacks = cart.reduce((sum, item) => sum + item.packQuantity, 0);
  
  const totalItems = cart.reduce(
    (sum, item) => sum + item.packQuantity * item.packSize,
    0
  );

  const isMinOrderMet = totalAmount >= minOrderValue;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        addBulkToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalAmount,
        totalPacks,
        totalItems,
        minOrderValue,
        isMinOrderMet
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
