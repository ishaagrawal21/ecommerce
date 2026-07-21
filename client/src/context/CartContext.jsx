import React, { createContext, useContext, useState, useEffect } from "react";
import { Snackbar, Alert } from "@mui/material";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("client_cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      return [];
    }
  });

  const [errorSnackbar, setErrorSnackbar] = useState({ open: false, message: "" });

  useEffect(() => {
    try {
      localStorage.setItem("client_cart", JSON.stringify(cartItems));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cartItems]);

  const addToCart = (product, qty = 1) => {
    const existingItem = cartItems.find((item) => item.product._id === product._id);
    const currentQty = existingItem ? existingItem.quantity : 0;
    const stockLimit = product.stock !== undefined ? product.stock : 10;

    if (currentQty + qty > stockLimit) {
      setErrorSnackbar({
        open: true,
        message: `Cannot add more "${product.name}". Available stock is ${stockLimit} units, and you already have ${currentQty} in your cart.`,
      });
      return false;
    }

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.product._id === product._id);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += qty;
        return updated;
      }
      return [...prevItems, { product, quantity: qty }];
    });
    return true;
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.product._id !== productId));
  };

  const updateQuantity = (productId, delta) => {
    const item = cartItems.find((item) => item.product._id === productId);
    if (!item) return false;

    const stockLimit = item.product.stock !== undefined ? item.product.stock : 10;
    const newQty = item.quantity + delta;

    if (newQty > stockLimit) {
      setErrorSnackbar({
        open: true,
        message: `Cannot exceed available stock of ${stockLimit} units for "${item.product.name}".`,
      });
      return false;
    }

    setCartItems((prevItems) =>
      prevItems
        .map((item) => {
          if (item.product._id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
    return true;
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (Number(item.product.price) || 0) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
      <Snackbar
        open={errorSnackbar.open}
        autoHideDuration={5000}
        onClose={() => setErrorSnackbar({ open: false, message: "" })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity="warning"
          variant="filled"
          onClose={() => setErrorSnackbar({ open: false, message: "" })}
          sx={{ fontWeight: 700, borderRadius: "12px", boxShadow: "0 8px 16px rgba(0,0,0,0.3)" }}
        >
          ⚠️ {errorSnackbar.message}
        </Alert>
      </Snackbar>
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
