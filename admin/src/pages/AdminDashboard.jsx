import React, { useState, useEffect } from "react";
import { Container, Box, Snackbar, Alert } from "@mui/material";
import AdminHeader from "../components/AdminHeader";
import DashboardStats from "../components/DashboardStats";
import ProductTable from "../components/ProductTable";
import ProductDialog from "../components/ProductDialog";
import DeleteConfirmDialog from "../components/DeleteConfirmDialog";
import CategoryDialog from "../components/CategoryDialog";
import ProductViewDialog from "../components/ProductViewDialog";
import UserListDialog from "../components/UserListDialog";
import OrderListDialog from "../components/OrderListDialog";
import {
  fetchProducts,
  fetchCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  createCategory,
  deleteCategory,
  fetchAdminOrders,
} from "../utills/apiHelper";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal Dialog States
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [usersModalOpen, setUsersModalOpen] = useState(false);
  const [ordersModalOpen, setOrdersModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [productToView, setProductToView] = useState(null);

  // Snackbar Toast notification
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const showToast = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseToast = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Load Data
  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes, orderRes] = await Promise.allSettled([
        fetchProducts(),
        fetchCategories(),
        fetchAdminOrders(),
      ]);

      if (prodRes.status === "fulfilled" && prodRes.value) {
        setProducts(prodRes.value.result || prodRes.value.products || prodRes.value || []);
      }
      if (catRes.status === "fulfilled" && catRes.value) {
        setCategories(catRes.value.result || catRes.value.categories || catRes.value || []);
      }
      if (orderRes.status === "fulfilled" && orderRes.value) {
        setOrders(orderRes.value.result || orderRes.value.orders || orderRes.value || []);
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
      showToast("Failed to load products, categories or orders", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // CRUD Handlers
  const handleOpenCreateProduct = () => {
    setSelectedProduct(null);
    setProductModalOpen(true);
  };

  const handleOpenEditProduct = (product) => {
    setSelectedProduct(product);
    setProductModalOpen(true);
  };

  const handleOpenDeleteProduct = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const handleOpenViewProduct = (product) => {
    setProductToView(product);
    setViewModalOpen(true);
  };

  // Save Product (Create or Update)
  const handleSaveProduct = async ({ id, payload, isFormData }) => {
    setSaveLoading(true);
    try {
      if (id) {
        await updateProduct({ id, payload, isFormData });
        showToast("Product updated successfully!");
      } else {
        await createProduct(isFormData ? payload : { payload });
        showToast("Product created successfully!");
      }
      setProductModalOpen(false);
      loadData();
    } catch (err) {
      console.error("Save product error:", err);
      showToast(err?.response?.data?.message || "Failed to save product", "error");
    } finally {
      setSaveLoading(false);
    }
  };

  // Confirm Delete Product
  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setDeleteLoading(true);
    try {
      await deleteProduct(productToDelete._id);
      showToast(`Deleted "${productToDelete.name}" successfully!`);
      setDeleteModalOpen(false);
      setProductToDelete(null);
      loadData();
    } catch (err) {
      console.error("Delete error:", err);
      showToast(err?.response?.data?.message || "Failed to delete product", "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Add Category Handler
  const handleAddCategory = async (payload) => {
    await createCategory(payload);
    showToast("Category added successfully!");
    const catRes = await fetchCategories();
    setCategories(catRes.result || catRes.categories || catRes || []);
  };

  // Delete Category Handler
  const handleDeleteCategory = async (id) => {
    try {
      await deleteCategory(id);
      showToast("Category removed successfully!");
      const catRes = await fetchCategories();
      setCategories(catRes.result || catRes.categories || catRes || []);
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to delete category", "error");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#090d16",
        backgroundImage: "radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.08) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(16, 185, 129, 0.05) 0px, transparent 50%)",
        color: "#f8fafc",
        pb: 6,
      }}
    >
      {/* Admin Header */}
      <AdminHeader
        onOpenProductModal={handleOpenCreateProduct}
        onOpenCategoryModal={() => setCategoryModalOpen(true)}
        onOpenUsersModal={() => setUsersModalOpen(true)}
        onOpenOrdersModal={() => setOrdersModalOpen(true)}
      />

      <Container maxWidth="xl" sx={{ mt: 4, px: { xs: 2, sm: 4 } }}>
        {/* Top Summary Metrics Cards */}
        <DashboardStats products={products} categories={categories} orders={orders} />

        {/* Core Product Management Table UI */}
        <ProductTable
          products={products}
          categories={categories}
          loading={loading}
          onEdit={handleOpenEditProduct}
          onDelete={handleOpenDeleteProduct}
          onView={handleOpenViewProduct}
        />
      </Container>

      {/* Modal Dialogs */}
      <ProductDialog
        open={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        onSubmit={handleSaveProduct}
        product={selectedProduct}
        categories={categories}
        loading={saveLoading}
      />

      <DeleteConfirmDialog
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        product={productToDelete}
        loading={deleteLoading}
      />

      <CategoryDialog
        open={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        categories={categories}
        onAddCategory={handleAddCategory}
        onDeleteCategory={handleDeleteCategory}
      />

      <UserListDialog
        open={usersModalOpen}
        onClose={() => setUsersModalOpen(false)}
      />

      <OrderListDialog
        open={ordersModalOpen}
        onClose={() => {
          setOrdersModalOpen(false);
          loadData();
        }}
      />

      <ProductViewDialog
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        product={productToView}
        onEdit={handleOpenEditProduct}
        categories={categories}
      />

      {/* Toast Alert */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%", fontWeight: 600, borderRadius: "12px" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
