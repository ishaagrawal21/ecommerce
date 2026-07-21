import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Chip,
  Avatar,
  Divider,
  Stack,
} from "@mui/material";
import { Close as CloseIcon, Edit as EditIcon, Image as ImageIcon } from "@mui/icons-material";

export default function ProductViewDialog({ open, onClose, product = null, onEdit, categories = [] }) {
  if (!product) return null;

  const categoryName =
    typeof product.category === "object"
      ? product.category?.name
      : categories.find((c) => c._id === product.category)?.name || "Uncategorized";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
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
        <Typography variant="h6" sx={{ fontWeight: 800, color: "#f8fafc" }}>
          Product Details
        </Typography>
        <IconButton onClick={onClose} sx={{ color: "#94a3b8" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", gap: 3, flexDirection: { xs: "column", sm: "row" }, mb: 3 }}>
          <Avatar
            variant="rounded"
            src={product.imageURL}
            alt={product.name}
            sx={{
              width: 140,
              height: 140,
              bgcolor: "#0f172a",
              borderRadius: "16px",
              border: "2px solid rgba(99, 102, 241, 0.3)",
              mx: { xs: "auto", sm: 0 },
            }}
          >
            <ImageIcon sx={{ fontSize: 50, color: "#64748b" }} />
          </Avatar>

          <Box sx={{ flex: 1 }}>
            <Stack direction="row" spacing={1} sx={{ mb: 1 }} alignItems="center">
              <Chip
                label={categoryName}
                size="small"
                sx={{
                  bgcolor: "rgba(99, 102, 241, 0.15)",
                  color: "#a5b4fc",
                  fontWeight: 600,
                }}
              />
              <Chip
                label={product.stock !== undefined && product.stock > 0 ? `Stock: ${product.stock}` : "Out of Stock"}
                size="small"
                color={product.stock !== undefined && product.stock > 0 ? (product.stock < 5 ? "warning" : "success") : "error"}
                sx={{ fontWeight: 700 }}
              />
            </Stack>
            <Typography variant="h5" sx={{ fontWeight: 800, color: "#f8fafc", mb: 1 }}>
              {product.name}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: "#10b981", mb: 1 }}>
              Rs. {Number(product.price).toFixed(2)}
            </Typography>
            <Typography variant="caption" sx={{ color: "#64748b", fontFamily: "monospace" }}>
              ID: {product._id}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.08)", my: 2 }} />

        <Typography variant="subtitle2" sx={{ color: "#94a3b8", fontWeight: 700, mb: 1 }}>
          Description
        </Typography>
        <Typography variant="body1" sx={{ color: "#cbd5e1", lineHeight: 1.6, whiteSpace: "pre-line" }}>
          {product.description}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 2.5, borderTop: "1px solid rgba(255, 255, 255, 0.08)", justifyContent: "space-between" }}>
        <Button onClick={onClose} sx={{ color: "#94a3b8", textTransform: "none" }}>
          Close
        </Button>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => {
            onClose();
            onEdit(product);
          }}
          sx={{
            background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
            color: "#fff",
            fontWeight: 700,
            textTransform: "none",
            borderRadius: "10px",
            px: 3,
          }}
        >
          Edit Product
        </Button>
      </DialogActions>
    </Dialog>
  );
}
