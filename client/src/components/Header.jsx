import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Menu,
  MenuItem,
  IconButton,
  Badge,
  Avatar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import StorefrontIcon from "@mui/icons-material/Storefront";
import LogoutIcon from "@mui/icons-material/Logout";
import { useCart } from "../context/CartContext";

export default function Header({ currentPage, onNavigate, onLogout, user, onOpenCart }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = React.useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { totalItems } = useCart();

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleMobileMenuOpen = (event) => setMobileMenuAnchor(event.currentTarget);
  const handleMobileMenuClose = () => setMobileMenuAnchor(null);

  const handleNavigation = (page) => {
    handleMobileMenuClose();
    if (onNavigate) onNavigate(page);
  };

  const handleLogout = () => {
    handleMenuClose();
    if (onLogout) onLogout();
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
        {/* Brand Logo & Title */}
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 1.5, cursor: "pointer" }}
          onClick={() => handleNavigation("products")}
        >
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
              NEXUS STORE
            </Typography>
            <Typography variant="caption" sx={{ color: "#94a3b8", display: "block" }}>
              Premium Products Catalog
            </Typography>
          </Box>
        </Box>

        {/* Navigation & Cart Actions */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", gap: 1 }}>

            <Button
              onClick={() => onNavigate("categories")}
              sx={{
                color: currentPage === "categories" ? "#818cf8" : "#e2e8f0",
                fontWeight: 700,
                textTransform: "none",
                borderRadius: "10px",
                px: 2,
                bgcolor: currentPage === "categories" ? "rgba(99, 102, 241, 0.15)" : "transparent",
                border: currentPage === "categories" ? "1px solid rgba(99, 102, 241, 0.3)" : "none",
                "&:hover": { bgcolor: "rgba(99, 102, 241, 0.1)" },
              }}
            >
              Categories
            </Button>

            <Button
              onClick={() => onNavigate("orders")}
              sx={{
                color: currentPage === "orders" ? "#818cf8" : "#e2e8f0",
                fontWeight: 700,
                textTransform: "none",
                borderRadius: "10px",
                px: 2,
                bgcolor: currentPage === "orders" ? "rgba(99, 102, 241, 0.15)" : "transparent",
                border: currentPage === "orders" ? "1px solid rgba(99, 102, 241, 0.3)" : "none",
                "&:hover": { bgcolor: "rgba(99, 102, 241, 0.1)" },
              }}
            >
              My Orders
            </Button>
          </Box>

          {/* Cart Icon Button */}
          <IconButton
            onClick={onOpenCart}
            sx={{
              bgcolor: "rgba(99, 102, 241, 0.15)",
              color: "#818cf8",
              border: "1px solid rgba(99, 102, 241, 0.3)",
              borderRadius: "10px",
              p: 1,
              "&:hover": { bgcolor: "rgba(99, 102, 241, 0.25)" },
            }}
          >
            <Badge badgeContent={totalItems} color="error">
              <ShoppingCartIcon fontSize="small" />
            </Badge>
          </IconButton>

          {/* Mobile Menu Button */}
          {isMobile && (
            <>
              <IconButton onClick={handleMobileMenuOpen} sx={{ color: "#e2e8f0" }}>
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={mobileMenuAnchor}
                open={Boolean(mobileMenuAnchor)}
                onClose={handleMobileMenuClose}
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

                <MenuItem
                  onClick={() => handleNavigation("categories")}
                  selected={currentPage === "categories"}
                  sx={{ fontWeight: 600 }}
                >
                  Categories
                </MenuItem>
                <MenuItem
                  onClick={() => handleNavigation("orders")}
                  selected={currentPage === "orders"}
                  sx={{ fontWeight: 600 }}
                >
                  My Orders
                </MenuItem>
              </Menu>
            </>
          )}

          {/* User Profile */}
          {user && (
            <>
              <IconButton onClick={handleMenuOpen} sx={{ p: 0.5 }}>
                <Avatar
                  sx={{
                    bgcolor: "#334155",
                    color: "#818cf8",
                    fontWeight: 700,
                    width: 38,
                    height: 38,
                    border: "2px solid rgba(99, 102, 241, 0.4)",
                  }}
                >
                  {user.name ? user.name.charAt(0).toUpperCase() : <AccountCircleIcon />}
                </Avatar>
              </IconButton>

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
                    {user.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                    {user.email}
                  </Typography>
                </Box>
                <MenuItem onClick={handleLogout} sx={{ color: "#ef4444", gap: 1, fontWeight: 600 }}>
                  <LogoutIcon fontSize="small" />
                  Sign Out
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
