import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Chip,
  Tooltip,
} from "@mui/material";
import {
  Add as AddIcon,
  Category as CategoryIcon,
  People as PeopleIcon,
  AdminPanelSettings as AdminIcon,
  Logout as LogoutIcon,
  Storefront as StorefrontIcon,
  ReceiptLong as OrderIcon,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";

export default function AdminHeader({ onOpenProductModal, onOpenCategoryModal, onOpenUsersModal, onOpenOrdersModal }) {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        color: "#f8fafc",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", py: 0.5, px: { xs: 2, sm: 4 } }}>
        {/* Brand / Logo */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar
            sx={{
              bgcolor: "primary.main",
              background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
              boxShadow: "0 4px 14px rgba(99, 102, 241, 0.4)",
              width: 42,
              height: 42,
            }}
          >
            <StorefrontIcon />
          </Avatar>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  letterSpacing: "-0.5px",
                  background: "linear-gradient(90deg, #ffffff, #cbd5e1)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                ADMIN PORTAL
              </Typography>
              <Chip
                label="Pro"
                size="small"
                sx={{
                  height: 20,
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  bgcolor: "rgba(99, 102, 241, 0.2)",
                  color: "#818cf8",
                  border: "1px solid rgba(99, 102, 241, 0.3)",
                }}
              />
            </Box>
            <Typography variant="caption" sx={{ color: "#94a3b8", display: "block" }}>
              Product Inventory & Operations Management
            </Typography>
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Button
            variant="outlined"
            size="medium"
            startIcon={<PeopleIcon />}
            onClick={onOpenUsersModal}
            sx={{
              borderColor: "rgba(255, 255, 255, 0.2)",
              color: "#e2e8f0",
              fontWeight: 600,
              textTransform: "none",
              borderRadius: "10px",
              px: 2,
              "&:hover": {
                borderColor: "#818cf8",
                backgroundColor: "rgba(99, 102, 241, 0.1)",
              },
            }}
          >
            Users
          </Button>

          <Button
            variant="outlined"
            size="medium"
            startIcon={<CategoryIcon />}
            onClick={onOpenCategoryModal}
            sx={{
              borderColor: "rgba(255, 255, 255, 0.2)",
              color: "#e2e8f0",
              fontWeight: 600,
              textTransform: "none",
              borderRadius: "10px",
              px: 2,
              "&:hover": {
                borderColor: "#818cf8",
                backgroundColor: "rgba(99, 102, 241, 0.1)",
              },
            }}
          >
            Categories
          </Button>

          <Button
            variant="outlined"
            size="medium"
            startIcon={<OrderIcon />}
            onClick={onOpenOrdersModal}
            sx={{
              borderColor: "rgba(255, 255, 255, 0.2)",
              color: "#e2e8f0",
              fontWeight: 600,
              textTransform: "none",
              borderRadius: "10px",
              px: 2,
              "&:hover": {
                borderColor: "#818cf8",
                backgroundColor: "rgba(99, 102, 241, 0.1)",
              },
            }}
          >
            Orders
          </Button>

          <Button
            variant="contained"
            size="medium"
            startIcon={<AddIcon />}
            onClick={onOpenProductModal}
            sx={{
              background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
              color: "#fff",
              fontWeight: 700,
              textTransform: "none",
              borderRadius: "10px",
              px: 2.5,
              py: 1,
              boxShadow: "0 4px 14px rgba(99, 102, 241, 0.4)",
              "&:hover": {
                background: "linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)",
                boxShadow: "0 6px 20px rgba(99, 102, 241, 0.6)",
              },
            }}
          >
            Add Product
          </Button>

          {/* User Profile Menu */}
          <Tooltip title="Admin Settings">
            <IconButton onClick={handleMenuOpen} sx={{ p: 0.5, ml: 1 }}>
              <Avatar
                sx={{
                  bgcolor: "#334155",
                  color: "#818cf8",
                  fontWeight: 700,
                  width: 40,
                  height: 40,
                  border: "2px solid rgba(99, 102, 241, 0.5)",
                }}
              >
                {user?.username ? user.username.charAt(0).toUpperCase() : <AdminIcon />}
              </Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                bgcolor: "#1e293b",
                color: "#f8fafc",
                borderRadius: 2,
                mt: 1.5,
                minWidth: 180,
                boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#f1f5f9" }}>
                {user?.username || "Admin User"}
              </Typography>
              <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                {user?.email || "admin@store.com"}
              </Typography>
            </Box>
            <MenuItem onClick={handleLogout} sx={{ color: "#ef4444", gap: 1, fontWeight: 600 }}>
              <LogoutIcon fontSize="small" />
              Sign Out
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
