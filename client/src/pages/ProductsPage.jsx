import React from "react";
import { Box, Typography } from "@mui/material";
import ProductList from "./ProductList";

export default function ProductsPage() {
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
          Explore Catalog
        </Typography>
        <Typography variant="body1" sx={{ color: "#94a3b8" }}>
          Browse premium items, filter by category or price, and add directly to your cart.
        </Typography>
      </Box>

      <ProductList />
    </Box>
  );
}
