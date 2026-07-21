import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Box,
  Typography,
  IconButton,
  CircularProgress,
  FormHelperText,
  Avatar,
  Tab,
  Tabs,
} from "@mui/material";
import {
  Close as CloseIcon,
  CloudUpload as UploadIcon,
  Link as LinkIcon,
  Image as ImageIcon,
} from "@mui/icons-material";

export default function ProductDialog({
  open,
  onClose,
  onSubmit,
  product = null,
  categories = [],
  loading = false,
}) {
  const isEdit = Boolean(product && product._id);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "10",
    category: "",
    imageURL: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageSourceTab, setImageSourceTab] = useState(0); // 0 = File Upload, 1 = Image URL
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      const categoryId =
        typeof product.category === "object" ? product.category?._id : product.category || "";

      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price !== undefined ? String(product.price) : "",
        stock: product.stock !== undefined ? String(product.stock) : "10",
        category: categoryId,
        imageURL: product.imageURL || "",
      });
      setImagePreview(product.imageURL || "");
      setImageFile(null);
      if (product.imageURL && !product.imageURL.startsWith("data:")) {
        setImageSourceTab(1);
      } else {
        setImageSourceTab(0);
      }
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "10",
        category: categories.length > 0 ? categories[0]._id : "",
        imageURL: "",
      });
      setImagePreview("");
      setImageFile(null);
      setImageSourceTab(0);
    }
    setErrors({});
  }, [product, open, categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }

    if (name === "imageURL" && imageSourceTab === 1) {
      setImagePreview(value);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setErrors((prev) => ({ ...prev, image: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) < 0) {
      newErrors.price = "Enter a valid non-negative price";
    }
    if (formData.stock === "" || isNaN(Number(formData.stock)) || Number(formData.stock) < 0) {
      newErrors.stock = "Enter a valid non-negative stock quantity";
    }
    if (!formData.category) newErrors.category = "Please select a category";

    // Image validations
    if (imageSourceTab === 0) {
      if (!isEdit && !imageFile) {
        newErrors.image = "Product image file is required";
      }
    } else {
      if (!formData.imageURL.trim()) {
        newErrors.imageURL = "Product image URL is required";
      } else if (
        !formData.imageURL.startsWith("http://") &&
        !formData.imageURL.startsWith("https://") &&
        !formData.imageURL.startsWith("/")
      ) {
        newErrors.imageURL = "Enter a valid URL (starting with http://, https://, or /)";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Build payload: use FormData if imageFile is selected or for multipart API support
    let payload;
    let isFormData = false;

    if (imageFile) {
      isFormData = true;
      payload = new FormData();
      payload.append("name", formData.name.trim());
      payload.append("description", formData.description.trim());
      payload.append("price", String(formData.price));
      payload.append("stock", String(formData.stock));
      payload.append("category", formData.category);
      payload.append("image", imageFile);
    } else {
      payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        stock: Number(formData.stock),
        category: formData.category,
        imageURL: formData.imageURL || "",
      };
    }

    onSubmit({
      id: product?._id,
      payload,
      isFormData,
    });
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
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
          {isEdit ? "Edit Product Details" : "Create New Product"}
        </Typography>
        <IconButton onClick={onClose} disabled={loading} sx={{ color: "#94a3b8" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2.5 }}>
          {/* Product Name */}
          <TextField
            label="Product Name *"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={Boolean(errors.name)}
            helperText={errors.name}
            fullWidth
            size="medium"
            sx={{
              "& .MuiInputLabel-root": { color: "#94a3b8" },
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

          <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
            {/* Price */}
            <TextField
              label="Price (Rs.) *"
              name="price"
              type="number"
              inputProps={{ step: "0.01", min: "0" }}
              value={formData.price}
              onChange={handleChange}
              error={Boolean(errors.price)}
              helperText={errors.price}
              fullWidth
              sx={{
                "& .MuiInputLabel-root": { color: "#94a3b8" },
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

            {/* Stock Quantity */}
            <TextField
              label="Stock Quantity *"
              name="stock"
              type="number"
              inputProps={{ min: "0" }}
              value={formData.stock}
              onChange={handleChange}
              error={Boolean(errors.stock)}
              helperText={errors.stock}
              fullWidth
              sx={{
                "& .MuiInputLabel-root": { color: "#94a3b8" },
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

            {/* Category Dropdown */}
            <FormControl fullWidth error={Boolean(errors.category)}>
              <InputLabel id="product-category-label" sx={{ color: "#94a3b8" }}>
                Category *
              </InputLabel>
              <Select
                labelId="product-category-label"
                name="category"
                value={formData.category}
                label="Category *"
                onChange={handleChange}
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
                {categories.length === 0 ? (
                  <MenuItem disabled value="">
                    No categories available. Add one first!
                  </MenuItem>
                ) : (
                  categories.map((cat) => (
                    <MenuItem key={cat._id} value={cat._id}>
                      {cat.name}
                    </MenuItem>
                  ))
                )}
              </Select>
              {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
            </FormControl>
          </Box>

          {/* Description */}
          <TextField
            label="Product Description *"
            name="description"
            multiline
            rows={3}
            value={formData.description}
            onChange={handleChange}
            error={Boolean(errors.description)}
            helperText={errors.description}
            fullWidth
            sx={{
              "& .MuiInputLabel-root": { color: "#94a3b8" },
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

          {/* Product Image Section */}
          <Box
            sx={{
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "12px",
              p: 2,
              bgcolor: "rgba(15, 23, 42, 0.5)",
            }}
          >
            <Typography variant="subtitle2" sx={{ color: "#e2e8f0", fontWeight: 700, mb: 1 }}>
              Product Image
            </Typography>

            <Tabs
              value={imageSourceTab}
              onChange={(e, val) => setImageSourceTab(val)}
              sx={{
                minHeight: 36,
                mb: 2,
                "& .MuiTab-root": { textTransform: "none", color: "#94a3b8", minHeight: 36, py: 0 },
                "& .Mui-selected": { color: "#818cf8", fontWeight: 700 },
                "& .MuiTabs-indicator": { bgcolor: "#6366f1" },
              }}
            >
              <Tab icon={<UploadIcon fontSize="small" />} iconPosition="start" label="Upload File" />
              <Tab icon={<LinkIcon fontSize="small" />} iconPosition="start" label="Image URL" />
            </Tabs>

            {imageSourceTab === 0 ? (
               <Box sx={{ textAlign: "center" }}>
                 <Button
                   variant="outlined"
                   component="label"
                   startIcon={<UploadIcon />}
                   sx={{
                     borderColor: errors.image ? "#ef4444" : "rgba(99, 102, 241, 0.4)",
                     color: errors.image ? "#ef4444" : "#818cf8",
                     textTransform: "none",
                     borderRadius: "10px",
                     px: 3,
                     py: 1,
                     "&:hover": { borderColor: "#6366f1", bgcolor: "rgba(99, 102, 241, 0.1)" },
                   }}
                 >
                   Choose Image File
                   <input type="file" accept="image/*" hidden onChange={handleFileChange} />
                 </Button>
                 {imageFile && (
                   <Typography variant="caption" display="block" sx={{ color: "#10b981", mt: 1 }}>
                     Selected: {imageFile.name}
                   </Typography>
                 )}
                 {errors.image && (
                   <FormHelperText error sx={{ mt: 1, textAlign: "center", fontWeight: 600 }}>
                     {errors.image}
                   </FormHelperText>
                 )}
               </Box>
             ) : (
               <TextField
                 label="Image URL"
                 name="imageURL"
                 value={formData.imageURL}
                 onChange={handleChange}
                 placeholder="https://example.com/image.jpg"
                 error={Boolean(errors.imageURL)}
                 helperText={errors.imageURL}
                 fullWidth
                 size="small"
                 sx={{
                   "& .MuiInputLabel-root": { color: "#94a3b8" },
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
             )}

            {/* Live Image Preview */}
            {imagePreview && (
              <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  variant="rounded"
                  src={imagePreview}
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: "10px",
                    border: "2px solid #6366f1",
                  }}
                >
                  <ImageIcon />
                </Avatar>
                <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                  Image Preview
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2.5, borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
          <Button
            onClick={onClose}
            disabled={loading}
            sx={{ color: "#94a3b8", textTransform: "none", fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
            sx={{
              background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
              color: "#fff",
              fontWeight: 700,
              textTransform: "none",
              borderRadius: "10px",
              px: 3,
              py: 1,
              boxShadow: "0 4px 14px rgba(99, 102, 241, 0.4)",
              "&:hover": {
                background: "linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)",
              },
            }}
          >
            {loading ? (isEdit ? "Saving..." : "Creating...") : isEdit ? "Update Product" : "Save Product"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
