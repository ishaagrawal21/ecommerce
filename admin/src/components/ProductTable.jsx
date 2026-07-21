import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Box,
  Typography,
  Avatar,
  TablePagination,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tooltip,
  Skeleton,
  Stack,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  Visibility as ViewIcon,
  Image as ImageIcon,
  Inventory as InventoryIcon,
} from "@mui/icons-material";

export default function ProductTable({
  products = [],
  categories = [],
  loading = false,
  onEdit,
  onDelete,
  onView,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Filter products based on search term and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const categoryId = typeof product.category === "object" ? product.category?._id : product.category;
    const matchesCategory = selectedCategory ? categoryId === selectedCategory : true;

    return matchesSearch && matchesCategory;
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setPage(0);
  };

  // Paginated dataset
  const paginatedProducts = filteredProducts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        bgcolor: "#1e293b",
        color: "#f8fafc",
        borderRadius: "16px",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        overflow: "hidden",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25)",
      }}
    >
      {/* Table Toolbar & Filters */}
      <Box
        sx={{
          p: 2.5,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          gap: 2,
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          bgcolor: "rgba(15, 23, 42, 0.4)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <InventoryIcon sx={{ color: "#6366f1" }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#f8fafc" }}>
            Products Inventory ({filteredProducts.length})
          </Typography>
        </Box>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems="center">
          {/* Search Field */}
          <TextField
            size="small"
            placeholder="Search by product name..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(0);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#94a3b8", fontSize: 20 }} />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchTerm("")}>
                    <ClearIcon sx={{ color: "#94a3b8", fontSize: 16 }} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              minWidth: { xs: "100%", sm: 260 },
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

          {/* Category Filter Dropdown */}
          <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 180 } }}>
            <InputLabel id="category-filter-label" sx={{ color: "#94a3b8" }}>
              Filter Category
            </InputLabel>
            <Select
              labelId="category-filter-label"
              value={selectedCategory}
              label="Filter Category"
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(0);
              }}
              sx={{
                color: "#f8fafc",
                bgcolor: "#0f172a",
                borderRadius: "10px",
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255, 255, 255, 0.15)" },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#6366f1" },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#6366f1" },
                "& .MuiSvgIcon-root": { color: "#94a3b8" },
              }}
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat._id} value={cat._id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {(searchTerm || selectedCategory) && (
            <Tooltip title="Reset filters">
              <IconButton
                onClick={handleClearFilters}
                sx={{
                  bgcolor: "rgba(239, 68, 68, 0.1)",
                  color: "#ef4444",
                  "&:hover": { bgcolor: "rgba(239, 68, 68, 0.2)" },
                  borderRadius: "10px",
                  p: 1,
                }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      </Box>

      {/* Table UI */}
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader aria-label="products table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ bgcolor: "#0f172a", color: "#94a3b8", fontWeight: 700, py: 1.8 }}>Image</TableCell>
              <TableCell sx={{ bgcolor: "#0f172a", color: "#94a3b8", fontWeight: 700, py: 1.8 }}>Product Name</TableCell>
              <TableCell sx={{ bgcolor: "#0f172a", color: "#94a3b8", fontWeight: 700, py: 1.8 }}>Category</TableCell>
              <TableCell sx={{ bgcolor: "#0f172a", color: "#94a3b8", fontWeight: 700, py: 1.8 }}>Price</TableCell>
              <TableCell sx={{ bgcolor: "#0f172a", color: "#94a3b8", fontWeight: 700, py: 1.8 }}>Stock</TableCell>
              <TableCell sx={{ bgcolor: "#0f172a", color: "#94a3b8", fontWeight: 700, py: 1.8 }}>Description</TableCell>
              <TableCell align="center" sx={{ bgcolor: "#0f172a", color: "#94a3b8", fontWeight: 700, py: 1.8 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              // Loading skeletons
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton variant="rectangular" width={48} height={48} sx={{ bgcolor: "#334155", borderRadius: 2 }} /></TableCell>
                  <TableCell><Skeleton width={140} sx={{ bgcolor: "#334155" }} /></TableCell>
                  <TableCell><Skeleton width={80} sx={{ bgcolor: "#334155" }} /></TableCell>
                  <TableCell><Skeleton width={60} sx={{ bgcolor: "#334155" }} /></TableCell>
                  <TableCell><Skeleton width={50} sx={{ bgcolor: "#334155" }} /></TableCell>
                  <TableCell><Skeleton width={200} sx={{ bgcolor: "#334155" }} /></TableCell>
                  <TableCell align="center"><Skeleton width={100} sx={{ bgcolor: "#334155", mx: "auto" }} /></TableCell>
                </TableRow>
              ))
            ) : paginatedProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                  <Box sx={{ color: "#64748b" }}>
                    <InventoryIcon sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />
                    <Typography variant="h6" sx={{ color: "#94a3b8", fontWeight: 600 }}>
                      No Products Found
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>
                      {searchTerm || selectedCategory
                        ? "Try adjusting your search or category filter criteria."
                        : "Click 'Add Product' button to create your first product entry."}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              paginatedProducts.map((product) => {
                const categoryName =
                  typeof product.category === "object"
                    ? product.category?.name
                    : categories.find((c) => c._id === product.category)?.name || "Uncategorized";

                return (
                  <TableRow
                    key={product._id}
                    hover
                    sx={{
                      "&:hover": { bgcolor: "rgba(99, 102, 241, 0.05)" },
                      transition: "background-color 0.15s ease",
                      borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                    }}
                  >
                    {/* Thumbnail Image */}
                    <TableCell sx={{ py: 1.5 }}>
                      <Avatar
                        variant="rounded"
                        src={product.imageURL}
                        alt={product.name}
                        sx={{
                          width: 48,
                          height: 48,
                          bgcolor: "#334155",
                          borderRadius: "10px",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          cursor: "pointer",
                        }}
                        onClick={() => onView && onView(product)}
                      >
                        <ImageIcon sx={{ color: "#94a3b8" }} />
                      </Avatar>
                    </TableCell>

                    {/* Product Name */}
                    <TableCell sx={{ py: 1.5 }}>
                      <Typography variant="body1" sx={{ fontWeight: 700, color: "#f8fafc" }}>
                        {product.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#64748b", fontFamily: "monospace" }}>
                        ID: {product._id?.substring(0, 10)}...
                      </Typography>
                    </TableCell>

                    {/* Category Chip */}
                    <TableCell sx={{ py: 1.5 }}>
                      <Chip
                        label={categoryName}
                        size="small"
                        sx={{
                          bgcolor: "rgba(99, 102, 241, 0.15)",
                          color: "#a5b4fc",
                          fontWeight: 600,
                          fontSize: "0.75rem",
                          border: "1px solid rgba(99, 102, 241, 0.3)",
                        }}
                      />
                    </TableCell>

                    {/* Price Badge */}
                    <TableCell sx={{ py: 1.5 }}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 800,
                          color: "#10b981",
                        }}
                      >
                        Rs. {Number(product.price).toFixed(2)}
                      </Typography>
                    </TableCell>
 
                    {/* Stock Quantity */}
                    <TableCell sx={{ py: 1.5 }}>
                      <Chip
                        label={product.stock !== undefined ? product.stock : 0}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          minWidth: 45,
                          border: "1px solid",
                          borderColor: (product.stock ?? 0) < 5 ? "rgba(248, 113, 113, 0.4)" : "rgba(52, 211, 153, 0.4)",
                          bgcolor: (product.stock ?? 0) < 5 ? "rgba(248, 113, 113, 0.15)" : "rgba(52, 211, 153, 0.15)",
                          color: (product.stock ?? 0) < 5 ? "#f87171" : "#34d399",
                        }}
                      />
                    </TableCell>

                    {/* Description Summary */}
                    <TableCell sx={{ py: 1.5, maxWidth: 280 }}>
                      <Tooltip title={product.description} placement="top" arrow>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#cbd5e1",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            lineHeight: 1.4,
                          }}
                        >
                          {product.description}
                        </Typography>
                      </Tooltip>
                    </TableCell>

                    {/* Actions Cell */}
                    <TableCell align="center" sx={{ py: 1.5 }}>
                      <Stack direction="row" spacing={0.5} justifyContent="center">
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => onView && onView(product)}
                            sx={{
                              color: "#38bdf8",
                              bgcolor: "rgba(56, 189, 248, 0.1)",
                              "&:hover": { bgcolor: "rgba(56, 189, 248, 0.2)" },
                              borderRadius: "8px",
                            }}
                          >
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Edit Product">
                          <IconButton
                            size="small"
                            onClick={() => onEdit && onEdit(product)}
                            sx={{
                              color: "#818cf8",
                              bgcolor: "rgba(129, 140, 248, 0.1)",
                              "&:hover": { bgcolor: "rgba(129, 140, 248, 0.2)" },
                              borderRadius: "8px",
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete Product">
                          <IconButton
                            size="small"
                            onClick={() => onDelete && onDelete(product)}
                            sx={{
                              color: "#f87171",
                              bgcolor: "rgba(248, 113, 113, 0.1)",
                              "&:hover": { bgcolor: "rgba(248, 113, 113, 0.2)" },
                              borderRadius: "8px",
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={filteredProducts.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          color: "#94a3b8",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          ".MuiTablePagination-selectIcon": { color: "#94a3b8" },
          ".MuiTablePagination-actions button": { color: "#e2e8f0" },
        }}
      />
    </Paper>
  );
}
