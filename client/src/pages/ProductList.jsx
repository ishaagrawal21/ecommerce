import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts, fetchCategories } from "../utills/apiHelper";
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Stack,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
  Snackbar,
  Avatar,
  Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useCart } from "../context/CartContext";

export default function ProductList() {
  const { addToCart } = useCart();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [searchParams, setSearchParams] = useState({ q: "", category: "", minPrice: "", maxPrice: "", sortBy: "" });

  const [toast, setToast] = useState({ open: false, message: "" });

  // Fetch categories for dropdown
  const { data: categoriesData } = useQuery(["categories"], () => fetchCategories({}));

  const { data, isLoading, error, refetch } = useQuery(
    ["products", searchParams],
    () =>
      fetchProducts({
        q: searchParams.q,
        category: searchParams.category,
        minPrice: searchParams.minPrice || undefined,
        maxPrice: searchParams.maxPrice || undefined,
        sortBy: searchParams.sortBy || undefined,
      }),
    {
      refetchOnMount: true,
    }
  );

  React.useEffect(() => {
    refetch();
  }, []);

  const handleSearch = () => {
    setSearchParams({
      q: search,
      category: category,
      minPrice: minPrice,
      maxPrice: maxPrice,
      sortBy: sortBy,
    });
  };

  const handleReset = () => {
    setSearch("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("");
    setSearchParams({
      q: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "",
    });
  };

  const sortedProducts = React.useMemo(() => {
    if (!data?.result) return [];
    let list = [...data.result];
    if (sortBy === "price_asc") {
      list.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "price_desc") {
      list.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === "name_asc") {
      list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else if (sortBy === "name_desc") {
      list.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
    } else if (sortBy === "newest") {
      list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }
    return list;
  }, [data?.result, sortBy]);

  const handleAddToCart = (product) => {
    const success = addToCart(product);
    if (success) {
      setToast({ open: true, message: `Added "${product.name}" to cart!` });
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={8}>
        <CircularProgress sx={{ color: "#6366f1" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2, borderRadius: "12px" }}>
        Error loading products. Please try again.
      </Alert>
    );
  }

  return (
    <Box>
      {/* Search and Filters Toolbar */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          bgcolor: "#1e293b",
          color: "#f8fafc",
          borderRadius: "20px",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2.5 }}>
          <FilterListIcon sx={{ color: "#6366f1" }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#f8fafc" }}>
            Filter & Search Catalog
          </Typography>
        </Box>

        <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} alignItems="center" flexWrap="wrap">
          {/* Search Input */}
          <TextField
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by title or keywords..."
            size="small"
            sx={{
              flex: { md: 2, xs: 1 },
              minWidth: { xs: "100%", md: 200 },
              "& .MuiOutlinedInput-root": {
                color: "#f8fafc",
                bgcolor: "#0f172a",
                borderRadius: "10px",
                "& fieldset": { borderColor: "rgba(255, 255, 255, 0.15)" },
                "&:hover fieldset": { borderColor: "#6366f1" },
                "&.Mui-focused fieldset": { borderColor: "#6366f1" },
              },
            }}
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
          />

          {/* Category Select Dropdown */}
          <FormControl size="small" sx={{ flex: { md: 1.5, xs: 1 }, minWidth: { xs: "100%", md: 160 } }}>
            <InputLabel id="client-cat-label" sx={{ color: "#94a3b8" }}>Category</InputLabel>
            <Select
              labelId="client-cat-label"
              value={category}
              label="Category"
              onChange={(e) => {
                setCategory(e.target.value);
                setTimeout(() => {
                  setSearchParams({
                    q: search,
                    category: e.target.value,
                    minPrice: minPrice,
                    maxPrice: maxPrice,
                    sortBy: sortBy,
                  });
                }, 0);
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
              {categoriesData?.result?.map((cat) => (
                <MenuItem key={cat._id} value={cat._id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Sort By Dropdown */}
          <FormControl size="small" sx={{ flex: { md: 1.5, xs: 1 }, minWidth: { xs: "100%", md: 160 } }}>
            <InputLabel id="client-sort-label" sx={{ color: "#94a3b8" }}>Sort By</InputLabel>
            <Select
              labelId="client-sort-label"
              value={sortBy}
              label="Sort By"
              onChange={(e) => {
                const newSort = e.target.value;
                setSortBy(newSort);
                setTimeout(() => {
                  setSearchParams({
                    q: search,
                    category: category,
                    minPrice: minPrice,
                    maxPrice: maxPrice,
                    sortBy: newSort,
                  });
                }, 0);
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
              <MenuItem value="">Default</MenuItem>
              <MenuItem value="price_asc">Price: Low to High</MenuItem>
              <MenuItem value="price_desc">Price: High to Low</MenuItem>
              <MenuItem value="name_asc">Name: A to Z</MenuItem>
              <MenuItem value="name_desc">Name: Z to A</MenuItem>
              <MenuItem value="newest">Newest Arrivals</MenuItem>
            </Select>
          </FormControl>

          {/* Min Price */}
          <TextField
            placeholder="Min Price (Rs.)"
            type="number"
            size="small"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            inputProps={{ min: 0 }}
            sx={{
              width: { xs: "100%", md: 130 },
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

          <Typography sx={{ color: "#94a3b8", display: { xs: "none", md: "block" } }}>-</Typography>

          {/* Max Price */}
          <TextField
            placeholder="Max Price (Rs.)"
            type="number"
            size="small"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            inputProps={{ min: 0 }}
            sx={{
              width: { xs: "100%", md: 130 },
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

          {/* Action Buttons */}
          <Stack direction="row" spacing={1} sx={{ width: { xs: "100%", md: "auto" } }}>
            <Button
              variant="contained"
              onClick={handleSearch}
              sx={{
                background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                color: "#fff",
                fontWeight: 700,
                textTransform: "none",
                borderRadius: "10px",
                px: 2.5,
                whiteSpace: "nowrap",
                flex: { xs: 1, md: "none" },
              }}
            >
              Apply Filter
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
                px: 2,
                whiteSpace: "nowrap",
                flex: { xs: 1, md: "none" },
                "&:hover": { borderColor: "#ef4444", color: "#ef4444" },
              }}
            >
              Reset
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Product Cards Grid */}
      {!data?.result || data?.result?.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: "center",
            bgcolor: "#1e293b",
            borderRadius: "20px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <Typography variant="h6" sx={{ color: "#94a3b8", fontWeight: 700 }}>
            No products found matching criteria
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b", mt: 1 }}>
            Try resetting your search query or category filter.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {sortedProducts.map((product) => {
            const categoryName =
              typeof product.category === "object"
                ? product.category?.name
                : categoriesData?.result?.find((c) => c._id === product.category)?.name || "Uncategorized";

            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    bgcolor: "#1e293b",
                    color: "#f8fafc",
                    borderRadius: "16px",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    overflow: "hidden",
                    transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out, border-color 0.2s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0 16px 32px rgba(0, 0, 0, 0.4)",
                      borderColor: "rgba(99, 102, 241, 0.4)",
                    },
                  }}
                >
                  {/* Product Image */}
                  <Box sx={{ position: "relative", pt: "65%", bgcolor: "#0f172a" }}>
                    {product.imageURL ? (
                      <Box
                        component="img"
                        src={
                          product.imageURL.startsWith("http")
                            ? product.imageURL
                            : `${import.meta.env.VITE_API_URL || "http://localhost:5000"}${product.imageURL}`
                        }
                        alt={product.name}
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#64748b",
                        }}
                      >
                        <ImageNotSupportedIcon sx={{ fontSize: 40 }} />
                      </Box>
                    )}
                  </Box>

                  <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                    <Stack direction="row" spacing={1} sx={{ mb: 1.5 }} alignItems="center">
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
                      <Chip
                        label={product.stock > 0 ? `Stock: ${product.stock}` : "Out of Stock"}
                        size="small"
                        color={product.stock > 0 ? (product.stock < 5 ? "warning" : "success") : "error"}
                        variant="outlined"
                        sx={{
                          fontWeight: 600,
                          fontSize: "0.75rem",
                        }}
                      />
                    </Stack>

                    <Typography
                      variant="h6"
                      component="h2"
                      sx={{
                        fontWeight: 700,
                        color: "#f8fafc",
                        lineHeight: 1.3,
                        mb: 1,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {product.name}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: "#cbd5e1",
                        mb: 2,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        fontSize: "0.875rem",
                        lineHeight: 1.5,
                      }}
                    >
                      {product.description || "No description available."}
                    </Typography>

                    <Typography variant="h5" sx={{ fontWeight: 800, color: "#10b981" }}>
                      Rs. {Number(product.price).toFixed(2)}
                    </Typography>
                  </CardContent>

                  <CardActions sx={{ p: 2.5, pt: 0 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      disabled={product.stock <= 0}
                      startIcon={<AddShoppingCartIcon />}
                      onClick={() => handleAddToCart(product)}
                      sx={{
                        background: product.stock <= 0 ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                        color: product.stock <= 0 ? "#64748b" : "#fff",
                        fontWeight: 700,
                        textTransform: "none",
                        borderRadius: "10px",
                        py: 1.2,
                        boxShadow: product.stock <= 0 ? "none" : "0 4px 14px rgba(99, 102, 241, 0.4)",
                        "&:hover": {
                          background: product.stock <= 0 ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)",
                          boxShadow: product.stock <= 0 ? "none" : "0 6px 20px rgba(99, 102, 241, 0.6)",
                        },
                      }}
                    >
                      {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Cart Notification Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ open: false, message: "" })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setToast({ open: false, message: "" })}
          sx={{ fontWeight: 600, borderRadius: "12px", bgcolor: "#6366f1" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
