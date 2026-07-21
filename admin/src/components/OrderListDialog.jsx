import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Box,
  TextField,
  InputAdornment,
  CircularProgress,
  Select,
  MenuItem,
  Stack,
  Alert,
  Tooltip,
} from "@mui/material";
import {
  Close as CloseIcon,
  Search as SearchIcon,
  ShoppingBag as OrderIcon,
  Person as PersonIcon,
  SwapVert as SwapVertIcon,
} from "@mui/icons-material";
import { fetchAdminOrders, updateOrderStatus } from "../utills/apiHelper";

export default function OrderListDialog({ open, onClose }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (open) {
      loadOrders();
    }
  }, [open]);

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminOrders();
      setOrders(data.result || data.orders || []);
    } catch (err) {
      console.error("Failed to load orders:", err);
      setError("Failed to fetch order history.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      alert(err.response?.data?.message || "Failed to update order status");
    }
  };

  const filteredOrders = orders.filter((order) => {
    const buyerName = order.user?.name || "";
    const buyerEmail = order.user?.email || "";
    const orderId = order._id || "";
    const searchTerm = search.toLowerCase();

    return (
      buyerName.toLowerCase().includes(searchTerm) ||
      buyerEmail.toLowerCase().includes(searchTerm) ||
      orderId.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "#1e293b",
          color: "#f8fafc",
          borderRadius: "20px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
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
            <OrderIcon fontSize="small" />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#f8fafc" }}>
              Customer Orders Manager
            </Typography>
            <Typography variant="caption" sx={{ color: "#94a3b8" }}>
              Total Orders: {orders.length}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: "#94a3b8" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* Search Bar */}
        <Box sx={{ mb: 3 }}>
          <TextField
            size="small"
            fullWidth
            placeholder="Search orders by Order ID, Buyer name, or Buyer email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#94a3b8", fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "#f8fafc",
                bgcolor: "#0f172a",
                borderRadius: "10px",
                "& fieldset": { borderColor: "rgba(255, 255, 255, 0.15)" },
                "&:hover fieldset": { borderColor: "#6366f1" },
                "&.Mui-focused fieldset": { borderColor: "#6366f1" },
              },
            }}
          />
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: "12px" }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box display="flex" justifyContent="center" py={6}>
            <CircularProgress sx={{ color: "#6366f1" }} />
          </Box>
        ) : (
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              bgcolor: "#0f172a",
              color: "#f8fafc",
              borderRadius: "14px",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              maxHeight: 500,
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ bgcolor: "#0f172a", color: "#94a3b8", fontWeight: 700 }}>Order ID</TableCell>
                  <TableCell sx={{ bgcolor: "#0f172a", color: "#94a3b8", fontWeight: 700 }}>Buyer Details</TableCell>
                  <TableCell sx={{ bgcolor: "#0f172a", color: "#94a3b8", fontWeight: 700 }}>Purchased Items</TableCell>
                  <TableCell sx={{ bgcolor: "#0f172a", color: "#94a3b8", fontWeight: 700 }}>Total Paid</TableCell>
                  <TableCell sx={{ bgcolor: "#0f172a", color: "#94a3b8", fontWeight: 700 }}>Order Status</TableCell>
                  <TableCell sx={{ bgcolor: "#0f172a", color: "#94a3b8", fontWeight: 700 }}>Order Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6, color: "#64748b" }}>
                      No orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow
                      key={order._id}
                      hover
                      sx={{
                        "&:hover": { bgcolor: "rgba(99, 102, 241, 0.05)" },
                        borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                      }}
                    >
                      {/* Order ID */}
                      <TableCell sx={{ py: 2, fontFamily: "monospace", color: "#818cf8", fontWeight: 700 }}>
                        #{order._id?.substring(0, 12)}...
                      </TableCell>

                      {/* Buyer Details */}
                      <TableCell sx={{ py: 2 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Avatar
                            sx={{
                              bgcolor: "#334155",
                              color: "#818cf8",
                              fontWeight: 700,
                              width: 32,
                              height: 32,
                            }}
                          >
                            {order.user?.name ? order.user.name.charAt(0).toUpperCase() : <PersonIcon fontSize="small" />}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: "#f8fafc" }}>
                              {order.user?.name || "Deleted User"}
                            </Typography>
                            <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                              {order.user?.email || "N/A"}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>

                      {/* Items */}
                      <TableCell sx={{ py: 2, maxWidth: 280 }}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                          {order.items?.map((item, idx) => (
                            <Typography key={idx} variant="caption" sx={{ color: "#cbd5e1", display: "block" }}>
                              • {item.name} <strong style={{ color: "#94a3b8" }}>({item.quantity}x)</strong>
                            </Typography>
                          ))}
                        </Box>
                      </TableCell>

                      {/* Total */}
                      <TableCell sx={{ py: 2, fontWeight: 800, color: "#10b981" }}>
                        Rs. {Number(order.totalAmount || 0).toFixed(2)}
                      </TableCell>

                      {/* Status Selector */}
                      <TableCell sx={{ py: 2 }}>
                        <Select
                          value={order.status || "Success"}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          size="small"
                          sx={{
                            color: order.status === "Success" ? "#34d399" : order.status === "Failure" ? "#f87171" : "#fbbf24",
                            bgcolor: "#0f172a",
                            fontWeight: 700,
                            fontSize: "0.8rem",
                            borderRadius: "8px",
                            "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255, 255, 255, 0.15)" },
                            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#6366f1" },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#6366f1" },
                            "& .MuiSvgIcon-root": { color: "#94a3b8" },
                          }}
                        >
                          <MenuItem value="Success" sx={{ color: "#10b981", fontWeight: 700 }}>SUCCESS</MenuItem>
                          <MenuItem value="Pending" sx={{ color: "#f59e0b", fontWeight: 700 }}>PENDING</MenuItem>
                          <MenuItem value="Failure" sx={{ color: "#ef4444", fontWeight: 700 }}>FAILURE</MenuItem>
                        </Select>
                      </TableCell>

                      {/* Date */}
                      <TableCell sx={{ py: 2, color: "#94a3b8", fontSize: "0.85rem" }}>
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
    </Dialog>
  );
}
