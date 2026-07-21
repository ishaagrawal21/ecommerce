import React, { useState } from "react";
import { Container, Box, CircularProgress, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import ProductsPage from "./pages/ProductsPage";
import CategoryPage from "./pages/CategoryPage";
import OrdersPage from "./pages/OrdersPage";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#6366f1",
      light: "#818cf8",
      dark: "#4f46e5",
    },
    background: {
      default: "#090d16",
      paper: "#1e293b",
    },
    text: {
      primary: "#f8fafc",
      secondary: "#94a3b8",
    },
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
});

function AppContent() {
  const [currentPage, setCurrentPage] = useState("products");
  const [cartOpen, setCartOpen] = useState(false);
  const { user, logout, loading } = useAuth();

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const handleLogout = () => {
    logout();
    setCurrentPage("signin");
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "#090d16",
        }}
      >
        <CircularProgress sx={{ color: "#6366f1" }} />
      </Box>
    );
  }

  // Show auth pages if not logged in
  if (!user) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          bgcolor: "#090d16",
        }}
      >
        {currentPage === "signup" ? (
          <SignUp onNavigate={handleNavigate} />
        ) : (
          <SignIn onNavigate={handleNavigate} />
        )}
      </Box>
    );
  }

  // Show main app if logged in
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "#090d16",
        backgroundImage: "radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.08) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(16, 185, 129, 0.05) 0px, transparent 50%)",
        color: "#f8fafc",
      }}
    >
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        user={user}
        onOpenCart={() => setCartOpen(true)}
      />
      <Container
        maxWidth="xl"
        sx={{
          py: { xs: 3, sm: 5 },
          px: { xs: 2, sm: 4 },
          flex: 1,
        }}
      >
        {currentPage === "products" && <ProductsPage />}
        {currentPage === "categories" && <CategoryPage onNavigate={handleNavigate} />}
        {currentPage === "orders" && <OrdersPage />}
      </Container>
      <Footer />

      {/* Shopping Cart Drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </Box>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
