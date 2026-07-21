import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "../utills/apiHelper";
import {
  Box,
  TextField,
  Stack,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Typography,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";

export default function CategoryList() {
  const [search, setSearch] = useState("");
  const [searchParams, setSearchParams] = useState({ q: "" });

  const { data, isLoading, error } = useQuery(
    ["categories", searchParams],
    () => fetchCategories({ q: searchParams.q }),
    { refetchOnMount: true }
  );

  const handleSearch = () => {
    setSearchParams({ q: search });
  };

  const handleReset = () => {
    setSearch("");
    setSearchParams({ q: "" });
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={6}>
        <CircularProgress sx={{ color: "#6366f1" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2, borderRadius: "12px" }}>
        Error loading categories
      </Alert>
    );
  }

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          bgcolor: "#1e293b",
          color: "#f8fafc",
          borderRadius: "20px",
          border: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <Stack direction="row" spacing={1.5}>
          <TextField
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search category name..."
            size="small"
            fullWidth
            onKeyPress={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
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
          <Button
            variant="contained"
            onClick={handleSearch}
            sx={{
              background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
              color: "#fff",
              fontWeight: 700,
              textTransform: "none",
              borderRadius: "10px",
              minWidth: 100,
            }}
          >
            Search
          </Button>
          <Button
            variant="outlined"
            onClick={handleReset}
            startIcon={<RefreshIcon />}
            sx={{
              borderColor: "rgba(255, 255, 255, 0.2)",
              color: "#94a3b8",
              textTransform: "none",
              borderRadius: "10px",
              minWidth: 100,
              "&:hover": { borderColor: "#ef4444", color: "#ef4444" },
            }}
          >
            Reset
          </Button>
        </Stack>
      </Paper>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          bgcolor: "#1e293b",
          color: "#f8fafc",
          borderRadius: "20px",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          overflow: "hidden",
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#0f172a" }}>
              <TableCell sx={{ color: "#94a3b8", fontWeight: 700 }}>Category Name</TableCell>
              <TableCell sx={{ color: "#94a3b8", fontWeight: 700 }}>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!data?.result || data?.result?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} align="center" sx={{ py: 6, color: "#64748b" }}>
                  No categories found
                </TableCell>
              </TableRow>
            ) : (
              data?.result?.map((category) => (
                <TableRow
                  key={category._id}
                  hover
                  sx={{
                    "&:hover": { bgcolor: "rgba(99, 102, 241, 0.05)" },
                    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                  }}
                >
                  <TableCell sx={{ py: 2 }}>
                    <Chip
                      label={category.name}
                      size="small"
                      sx={{
                        bgcolor: "rgba(99, 102, 241, 0.15)",
                        color: "#a5b4fc",
                        fontWeight: 700,
                        border: "1px solid rgba(99, 102, 241, 0.3)",
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ py: 2, color: "#cbd5e1" }}>
                    {category.description || "No description provided."}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
