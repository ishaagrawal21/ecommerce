import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { Warning as WarningIcon } from "@mui/icons-material";

export default function DeleteConfirmDialog({
  open,
  onClose,
  onConfirm,
  product = null,
  loading = false,
}) {
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "#1e293b",
          color: "#f8fafc",
          borderRadius: "20px",
          border: "1px solid rgba(239, 68, 68, 0.3)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6)",
        },
      }}
    >
      <DialogTitle sx={{ p: 3, pb: 1, textAlign: "center" }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            bgcolor: "rgba(239, 68, 68, 0.15)",
            color: "#ef4444",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 2,
          }}
        >
          <WarningIcon fontSize="large" />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 800, color: "#f8fafc" }}>
          Delete Product?
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 3, pt: 1, textAlign: "center" }}>
        <Typography variant="body2" sx={{ color: "#94a3b8" }}>
          Are you sure you want to delete{" "}
          <strong style={{ color: "#f8fafc" }}>"{product?.name}"</strong>?
        </Typography>
        <Typography variant="caption" display="block" sx={{ color: "#ef4444", mt: 1.5 }}>
          This action is permanent and cannot be undone.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 2.5, justifyContent: "center", gap: 1.5 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            color: "#94a3b8",
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "10px",
            px: 2.5,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          disabled={loading}
          variant="contained"
          color="error"
          startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
          sx={{
            bgcolor: "#ef4444",
            fontWeight: 700,
            textTransform: "none",
            borderRadius: "10px",
            px: 3,
            py: 1,
            boxShadow: "0 4px 14px rgba(239, 68, 68, 0.4)",
            "&:hover": { bgcolor: "#dc2626" },
          }}
        >
          {loading ? "Deleting..." : "Delete Product"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
