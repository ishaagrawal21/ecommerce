import React from "react";
import { Box, Typography, Button } from "@mui/material";
import StorefrontIcon from "@mui/icons-material/Storefront";
import CategoryList from "./CategoryList";

export default function CategoryPage({ onNavigate }) {
  return (
    <Box>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box>
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
            Product Categories
          </Typography>
          <Typography variant="body1" sx={{ color: "#94a3b8" }}>
            Explore products organized by category departments.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<StorefrontIcon />}
          onClick={() => onNavigate && onNavigate("products")}
          sx={{
            background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
            color: "#fff",
            fontWeight: 700,
            textTransform: "none",
            borderRadius: "12px",
            px: 2.5,
            py: 1.2,
            boxShadow: "0 4px 14px rgba(99, 102, 241, 0.4)",
            "&:hover": {
              background: "linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)",
              boxShadow: "0 6px 20px rgba(99, 102, 241, 0.6)",
            },
          }}
        >
          Go to Product List
        </Button>
      </Box>

      <CategoryList />
    </Box>
  );
}
