import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  IconButton,
  Box,
  Chip,
  Stack,
  CircularProgress,
} from "@mui/material";
import { Close as CloseIcon, Add as AddIcon, Category as CategoryIcon } from "@mui/icons-material";

export default function CategoryDialog({
  open,
  onClose,
  categories = [],
  onAddCategory,
  onDeleteCategory,
}) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Category name is required");
      return;
    }
    setLoading(true);
    try {
      await onAddCategory({ name: name.trim() });
      setName("");
      setError("");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CategoryIcon sx={{ color: "#818cf8" }} />
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#f8fafc" }}>
            Product Categories
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: "#94a3b8" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* Existing Categories */}
        <Typography variant="subtitle2" sx={{ color: "#94a3b8", mb: 1.5, fontWeight: 700 }}>
          Existing Categories ({categories.length})
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            mb: 3,
            p: 1.5,
            bgcolor: "rgba(15, 23, 42, 0.5)",
            borderRadius: "12px",
            minHeight: 50,
            maxHeight: 140,
            overflowY: "auto",
          }}
        >
          {categories.length === 0 ? (
            <Typography variant="caption" sx={{ color: "#64748b", m: "auto" }}>
              No categories created yet
            </Typography>
          ) : (
            categories.map((cat) => (
              <Chip
                key={cat._id}
                label={cat.name}
                onDelete={onDeleteCategory ? () => onDeleteCategory(cat._id) : undefined}
                sx={{
                  bgcolor: "rgba(99, 102, 241, 0.2)",
                  color: "#a5b4fc",
                  fontWeight: 600,
                  border: "1px solid rgba(99, 102, 241, 0.3)",
                  "& .MuiChip-deleteIcon": {
                    color: "#94a3b8",
                    "&:hover": { color: "#ef4444" },
                  },
                }}
              />
            ))
          )}
        </Box>

        {/* Add New Category */}
        <Typography variant="subtitle2" sx={{ color: "#94a3b8", mb: 1.5, fontWeight: 700 }}>
          Add New Category
        </Typography>
        <form onSubmit={handleAdd}>
          <Stack direction="row" spacing={1}>
            <TextField
              size="small"
              placeholder="Category Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              error={Boolean(error)}
              helperText={error}
              fullWidth
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
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                color: "#fff",
                fontWeight: 700,
                textTransform: "none",
                borderRadius: "10px",
                minWidth: 90,
              }}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
            </Button>
          </Stack>
        </form>
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
        <Button onClick={onClose} sx={{ color: "#94a3b8", textTransform: "none", fontWeight: 600 }}>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}
