'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ProductVariant, CartItem, Coupon } from '@/types';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, variant: ProductVariant, quantity?: number) => { success: boolean; message?: string };
  removeFromCart: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => { success: boolean; message?: string };
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  subtotal: number;
  discount: number;
  coupon: Coupon | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  shippingOption: 'pickup' | 'pac' | 'sedex';
  setShippingOption: (option: 'pickup' | 'pac' | 'sedex') => void;
  shippingCost: number;
  total: number;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [shippingOption, setShippingOption] = useState<'pickup' | 'pac' | 'sedex'>('pickup');
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Load from local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('gm_cart');
      if (stored) setItems(JSON.parse(stored));
      const storedWish = localStorage.getItem('gm_wishlist');
      if (storedWish) setWishlist(JSON.parse(storedWish));
      const storedCoupon = localStorage.getItem('gm_coupon');
      if (storedCoupon) setCoupon(JSON.parse(storedCoupon));
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('gm_cart', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('gm_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (coupon) {
      localStorage.setItem('gm_coupon', JSON.stringify(coupon));
    } else {
      localStorage.removeItem('gm_coupon');
    }
  }, [coupon]);

  const addToCart = (product: Product, variant: ProductVariant, quantity = 1) => {
    if (variant.stock <= 0) {
      return { success: false, message: 'Produto esgotado nesta numeração/variação.' };
    }

    const existingIndex = items.findIndex(i => i.variantId === variant.id);
    if (existingIndex > -1) {
      const existing = items[existingIndex];
      const newQty = existing.quantity + quantity;
      if (newQty > variant.stock) {
        return {
          success: false,
          message: `Estoque insuficiente! Você já possui ${existing.quantity} no carrinho e o estoque máximo é ${variant.stock}.`
        };
      }
      const updated = [...items];
      updated[existingIndex].quantity = newQty;
      setItems(updated);
    } else {
      if (quantity > variant.stock) {
        return {
          success: false,
          message: `Estoque insuficiente! Disponível: ${variant.stock}.`
        };
      }
      setItems(prev => [...prev, { productId: product.id, variantId: variant.id, quantity, product, variant }]);
    }

    setIsCartOpen(true);
    return { success: true };
  };

  const removeFromCart = (variantId: string) => {
    setItems(prev => prev.filter(i => i.variantId !== variantId));
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(variantId);
      return { success: true };
    }

    const item = items.find(i => i.variantId === variantId);
    if (!item) return { success: false, message: 'Item não encontrado no carrinho.' };

    if (quantity > item.variant.stock) {
      return {
        success: false,
        message: `Estoque máximo disponível para esta numeração é de ${item.variant.stock} unidades.`
      };
    }

    setItems(prev => prev.map(i => (i.variantId === variantId ? { ...i, quantity } : i)));
    return { success: true };
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
    localStorage.removeItem('gm_cart');
    localStorage.removeItem('gm_coupon');
  };

  const applyCoupon = async (code: string) => {
    if (!code.trim()) return { success: false, message: 'Digite um código de cupom.' };
    try {
      const res = await fetch(`/api/coupons?code=${encodeURIComponent(code.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || 'Cupom inválido.' };
      }

      if (subtotal < data.minOrderValue) {
        return {
          success: false,
          message: `Este cupom exige pedido mínimo de R$ ${data.minOrderValue.toFixed(2)}.`
        };
      }

      setCoupon(data);
      return { success: true, message: `Cupom ${data.code} aplicado com sucesso!` };
    } catch {
      return { success: false, message: 'Erro ao validar cupom.' };
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
  };

  // Wishlist toggle
  const toggleWishlist = (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Calculations
  const subtotal = items.reduce((acc, item) => {
    const price = item.product.promoPrice ?? item.product.sellingPrice;
    return acc + price * item.quantity;
  }, 0);

  let discount = 0;
  if (coupon) {
    if (coupon.type === 'percentage') {
      discount = (subtotal * coupon.value) / 100;
    } else if (coupon.type === 'fixed') {
      discount = Math.min(coupon.value, subtotal);
    }
  }

  let shippingCost = 0;
  if (shippingOption === 'pickup') {
    shippingCost = 0;
  } else if (coupon?.type === 'free_shipping' || subtotal >= 299) {
    shippingCost = 0;
  } else if (shippingOption === 'pac') {
    shippingCost = 18.9;
  } else if (shippingOption === 'sedex') {
    shippingCost = 28.5;
  }

  const total = Math.max(0, subtotal - discount + shippingCost);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        subtotal,
        discount,
        coupon,
        applyCoupon,
        removeCoupon,
        shippingOption,
        setShippingOption,
        shippingCost,
        total,
        wishlist,
        toggleWishlist,
        isInWishlist
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
