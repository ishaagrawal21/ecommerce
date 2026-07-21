import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMyOrders } from "../utills/apiHelper";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Card,
  CardContent,
  Chip,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Stack,
} from "@mui/material";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

export default function OrdersPage() {
  const { data, isLoading, error, refetch } = useQuery(["myOrders"], fetchMyOrders, {
    refetchOnMount: true,
  });

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={8}>
        <CircularProgress sx={{ color: "#6366f1" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2, borderRadius: "12px" }}>
        Error loading your orders. Please try again.
      </Alert>
    );
  }

  const orders = data?.result || data?.orders || [];

  const getStatusColor = (status) => {
    switch (status) {
      case "Success":
        return "success";
      case "Failure":
        return "error";
      case "Pending":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            letterSpacing: "-0.5px",
            background: "linear-gradient(90deg, #ffffff, #cbd5e1)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 0.5,
          }}
        >
          My Orders
        </Typography>
        <Typography variant="body1" sx={{ color: "#94a3b8" }}>
          View and track the status of all your store transactions.
        </Typography>
      </Box>

      {orders.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: "center",
            bgcolor: "#1e293b",
            borderRadius: "20px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <ShoppingBagIcon sx={{ fontSize: 60, color: "#64748b", mb: 2, opacity: 0.5 }} />
          <Typography variant="h6" sx={{ color: "#94a3b8", fontWeight: 700 }}>
            No Orders Placed Yet
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b", mt: 1 }}>
            Browse our catalog, add items to your cart and make a purchase!
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {orders.map((order) => (
            <Grid item xs={12} key={order._id}>
              <Card
                elevation={0}
                sx={{
                  bgcolor: "#1e293b",
                  color: "#f8fafc",
                  borderRadius: "18px",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  transition: "border-color 0.2s ease",
                  "&:hover": {
                    borderColor: "rgba(99, 102, 241, 0.3)",
                  },
                }}
              >
                <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                  {/* Order Top Info */}
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    spacing={2}
                    sx={{ mb: 2.5 }}
                  >
                    <Box>
                      <Typography variant="caption" sx={{ color: "#64748b", display: "block", mb: 0.5 }}>
                        ORDER ID
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 700, fontFamily: "monospace", color: "#818cf8" }}>
                        #{order._id}
                      </Typography>
                    </Box>

                    <Stack direction="row" spacing={2} flexWrap="wrap">
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <CalendarTodayIcon sx={{ color: "#64748b", fontSize: 16 }} />
                        <Typography variant="body2" sx={{ color: "#cbd5e1" }}>
                          {new Date(order.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Typography>
                      </Box>
                      <Chip
                        label={order.status || "Success"}
                        color={getStatusColor(order.status)}
                        variant="filled"
                        sx={{
                          fontWeight: 800,
                          px: 1.5,
                          borderRadius: "8px",
                          textTransform: "uppercase",
                          fontSize: "0.75rem",
                        }}
                      />
                    </Stack>
                  </Stack>

                  <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.08)", my: 2 }} />

                  {/* Order Items List */}
                  <Typography variant="subtitle2" sx={{ color: "#94a3b8", mb: 1.5, fontWeight: 700 }}>
                    Purchased Items
                  </Typography>

                  <List disablePadding>
                    {order.items.map((item, idx) => (
                      <ListItem key={idx} disableGutters sx={{ py: 1, display: "flex", justifyContent: "space-between" }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar
                            variant="rounded"
                            src={item.product?.imageURL || ""}
                            sx={{ width: 44, height: 44, bgcolor: "#0f172a", borderRadius: "8px" }}
                          >
                            <ShoppingBagIcon fontSize="small" sx={{ color: "#64748b" }} />
                          </Avatar>
                          <ListItemText
                            primary={
                              <Typography variant="body2" sx={{ fontWeight: 700, color: "#f8fafc" }}>
                                {item.name}
                              </Typography>
                            }
                            secondary={
                              <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                                Qty: {item.quantity} × Rs. {Number(item.price).toFixed(2)}
                              </Typography>
                            }
                          />
                        </Stack>
                        <Typography variant="body2" sx={{ fontWeight: 800, color: "#cbd5e1" }}>
                          Rs. {(Number(item.price) * item.quantity).toFixed(2)}
                        </Typography>
                      </ListItem>
                    ))}
                  </List>

                  <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.08)", my: 2 }} />

                  {/* Delivery & Total Info */}
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    spacing={1.5}
                    sx={{ mt: 2 }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <LocalShippingIcon sx={{ color: "#64748b", fontSize: 18 }} />
                      <Typography variant="body2" sx={{ color: "#cbd5e1" }}>
                        Shipping Address: <strong style={{ color: "#f8fafc" }}>{order.shippingAddress || "Standard Shipping"}</strong>
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="subtitle1" sx={{ color: "#94a3b8" }}>
                        Total Amount Paid:
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: "#10b981" }}>
                        Rs. {Number(order.totalAmount).toFixed(2)}
                      </Typography>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
