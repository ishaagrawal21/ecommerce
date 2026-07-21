import React, { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
  List,
  ListItem,
  Avatar,
  Stack,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import {
  Close as CloseIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  DeleteOutline as DeleteIcon,
  ShoppingCart as CartIcon,
  ShoppingBag as CheckoutIcon,
} from "@mui/icons-material";
import { useCart } from "../context/CartContext";
import { createOrder } from "../utills/apiHelper";

export default function CartDrawer({ open, onClose }) {
  const { cartItems, updateQuantity, removeFromCart, clearCart, subtotal, totalItems } = useCart();
  const [checkedOut, setCheckedOut] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    setCheckoutLoading(true);
    setErrorMsg("");
    try {
      const items = cartItems.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
      }));
      await createOrder({
        items,
        totalAmount: subtotal,
      });
      setCheckedOut(true);
      clearCart();
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 420 },
            bgcolor: "#1e293b",
            color: "#f8fafc",
            p: 0,
            display: "flex",
            flexDirection: "column",
            borderLeft: "1px solid rgba(255, 255, 255, 0.1)",
          },
        }}
      >
        {/* Cart Drawer Header */}
        <Box
          sx={{
            p: 2.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar
              sx={{
                bgcolor: "rgba(99, 102, 241, 0.2)",
                color: "#818cf8",
                width: 38,
                height: 38,
              }}
            >
              <CartIcon fontSize="small" />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#f8fafc" }}>
              Shopping Cart ({totalItems})
            </Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ color: "#94a3b8" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Cart Items List */}
        <Box sx={{ flex: 1, overflowY: "auto", p: 2.5 }}>
          {cartItems.length === 0 ? (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "#64748b",
                py: 8,
              }}
            >
              <CartIcon sx={{ fontSize: 64, mb: 2, opacity: 0.3, color: "#94a3b8" }} />
              <Typography variant="h6" align="center" sx={{ color: "#94a3b8", fontWeight: 700 }}>
                Your cart is empty
              </Typography>
              <Typography variant="body2" align="center" sx={{ color: "#64748b", mt: 0.5 }}>
                Browse our collection and add items to your cart.
              </Typography>
            </Box>
          ) : (
            <List disablePadding>
              {cartItems.map(({ product, quantity }) => {
                const itemTotal = (Number(product.price) || 0) * quantity;
                return (
                  <React.Fragment key={product._id}>
                    <ListItem
                      sx={{
                        py: 2,
                        px: 0,
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 2,
                      }}
                    >
                      <Avatar
                        variant="rounded"
                        src={product.imageURL}
                        alt={product.name}
                        sx={{
                          width: 64,
                          height: 64,
                          bgcolor: "#0f172a",
                          borderRadius: "10px",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                        }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#f8fafc" }}>
                          {product.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#10b981", fontWeight: 800, mt: 0.5 }}>
                          Rs. {Number(product.price).toFixed(2)}
                        </Typography>

                        {/* Quantity Controls */}
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1.5 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              border: "1px solid rgba(255, 255, 255, 0.15)",
                              borderRadius: "8px",
                              bgcolor: "#0f172a",
                            }}
                          >
                            <IconButton
                              size="small"
                              onClick={() => updateQuantity(product._id, -1)}
                              sx={{ color: "#94a3b8", p: 0.5 }}
                            >
                              <RemoveIcon fontSize="small" />
                            </IconButton>
                            <Typography variant="body2" sx={{ px: 1.5, fontWeight: 700, color: "#f8fafc" }}>
                              {quantity}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => updateQuantity(product._id, 1)}
                              sx={{ color: "#94a3b8", p: 0.5 }}
                            >
                              <AddIcon fontSize="small" />
                            </IconButton>
                          </Box>

                          <IconButton
                            size="small"
                            onClick={() => removeFromCart(product._id)}
                            sx={{
                              color: "#ef4444",
                              bgcolor: "rgba(239, 68, 68, 0.1)",
                              "&:hover": { bgcolor: "rgba(239, 68, 68, 0.2)" },
                              borderRadius: "8px",
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </Box>

                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#f8fafc" }}>
                        Rs. {itemTotal.toFixed(2)}
                      </Typography>
                    </ListItem>
                    <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.08)" }} />
                  </React.Fragment>
                );
              })}
            </List>
          )}
        </Box>

        {/* Cart Drawer Footer */}
        {cartItems.length > 0 && (
          <Box
            sx={{
              p: 2.5,
              bgcolor: "#0f172a",
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                Subtotal
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#f8fafc" }}>
                Rs. {subtotal.toFixed(2)}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#f8fafc" }}>
                Total
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#10b981" }}>
                Rs. {subtotal.toFixed(2)}
              </Typography>
            </Box>

            {errorMsg && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: "10px" }} onClose={() => setErrorMsg("")}>
                {errorMsg}
              </Alert>
            )}

            <Button
              variant="contained"
              fullWidth
              size="large"
              disabled={checkoutLoading}
              startIcon={checkoutLoading ? <CircularProgress size={20} color="inherit" /> : <CheckoutIcon />}
              onClick={handleCheckout}
              sx={{
                py: 1.5,
                background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                color: "#fff",
                fontWeight: 800,
                textTransform: "none",
                borderRadius: "12px",
                boxShadow: "0 4px 14px rgba(99, 102, 241, 0.4)",
                "&:hover": {
                  background: "linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)",
                },
              }}
            >
              {checkoutLoading ? "Placing Order..." : "Checkout Now"}
            </Button>
          </Box>
        )}
      </Drawer>

      <Snackbar
        open={checkedOut}
        autoHideDuration={4000}
        onClose={() => setCheckedOut(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setCheckedOut(false)}
          sx={{ fontWeight: 700, borderRadius: "12px" }}
        >
          🎉 Order placed successfully! Thank you for shopping with us.
        </Alert>
      </Snackbar>
    </>
  );
}
