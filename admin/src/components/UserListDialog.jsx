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
  Chip,
  Stack,
  Alert,
} from "@mui/material";
import {
  Close as CloseIcon,
  Search as SearchIcon,
  People as PeopleIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { fetchUsers } from "../utills/apiHelper";

export default function UserListDialog({ open, onClose }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (open) {
      loadUsers();
    }
  }, [open]);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUsers();
      setUsers(data.result || data.users || []);
    } catch (err) {
      console.error("Failed to load users:", err);
      setError("Failed to fetch user list.");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
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
            <PeopleIcon fontSize="small" />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#f8fafc" }}>
              Registered Users
            </Typography>
            <Typography variant="caption" sx={{ color: "#94a3b8" }}>
              Total Users: {users.length}
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
            placeholder="Search user by name or email..."
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
              maxHeight: 400,
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ bgcolor: "#0f172a", color: "#94a3b8", fontWeight: 700 }}>User</TableCell>
                  <TableCell sx={{ bgcolor: "#0f172a", color: "#94a3b8", fontWeight: 700 }}>Email</TableCell>
                  <TableCell sx={{ bgcolor: "#0f172a", color: "#94a3b8", fontWeight: 700 }}>Role / Status</TableCell>
                  <TableCell sx={{ bgcolor: "#0f172a", color: "#94a3b8", fontWeight: 700 }}>Registered Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4, color: "#64748b" }}>
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((u) => (
                    <TableRow
                      key={u._id}
                      hover
                      sx={{
                        "&:hover": { bgcolor: "rgba(99, 102, 241, 0.05)" },
                        borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                      }}
                    >
                      <TableCell sx={{ py: 1.5 }}>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar
                            sx={{
                              bgcolor: "#334155",
                              color: "#818cf8",
                              fontWeight: 700,
                              width: 36,
                              height: 36,
                            }}
                          >
                            {u.name ? u.name.charAt(0).toUpperCase() : <PersonIcon />}
                          </Avatar>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: "#f8fafc" }}>
                            {u.name || "N/A"}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell sx={{ py: 1.5, color: "#cbd5e1" }}>{u.email}</TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        {u.role === "admin" ? (
                          <Chip
                            label="Admin"
                            size="small"
                            sx={{
                              bgcolor: "rgba(99, 102, 241, 0.15)",
                              color: "#818cf8",
                              fontWeight: 700,
                              fontSize: "0.75rem",
                              border: "1px solid rgba(99, 102, 241, 0.3)",
                            }}
                          />
                        ) : (
                          <Chip
                            label="Customer"
                            size="small"
                            sx={{
                              bgcolor: "rgba(16, 185, 129, 0.15)",
                              color: "#34d399",
                              fontWeight: 700,
                              fontSize: "0.75rem",
                              border: "1px solid rgba(16, 185, 129, 0.3)",
                            }}
                          />
                        )}
                      </TableCell>
                      <TableCell sx={{ py: 1.5, color: "#94a3b8", fontSize: "0.85rem" }}>
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A"}
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
