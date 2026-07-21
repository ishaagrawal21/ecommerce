import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Interceptor to attach Authorization header if token exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token") || localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Products API
export const fetchAdminStats = async () => {
  const res = await API.get("/admin/stats");
  return res.data;
};

export const fetchProducts = async (params) => {
  const res = await API.get("/products", { params });
  return res.data;
};

export const fetchProduct = async (id) => {
  const res = await API.get(`/products/${id}`);
  return res.data;
};

export const createProduct = async (data) => {
  let res;
  if (data instanceof FormData) {
    res = await API.post("/products", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } else if (data?.isFormData && data?.payload instanceof FormData) {
    res = await API.post("/products", data.payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } else {
    res = await API.post("/products", data.payload || data);
  }
  return res.data;
};

export const updateProduct = async ({ id, payload, isFormData }) => {
  let res;
  if (payload instanceof FormData || isFormData) {
    res = await API.put(`/products/${id}`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } else {
    res = await API.put(`/products/${id}`, payload);
  }
  return res.data;
};

export const deleteProduct = async (id) => {
  const res = await API.delete(`/products/${id}`);
  return res.data;
};

// Categories API
export const fetchCategories = async (params) => {
  const res = await API.get("/categories", { params });
  return res.data;
};

export const createCategory = async (payload) => {
  const res = await API.post("/categories", payload);
  return res.data;
};

export const updateCategory = async ({ id, payload }) => {
  const res = await API.put(`/categories/${id}`, payload);
  return res.data;
};

export const deleteCategory = async (id) => {
  const res = await API.delete(`/categories/${id}`);
  return res.data;
};

// Auth API
export const adminSignIn = async (payload) => {
  const res = await API.post("/auth/signin", payload);
  return res.data;
};

export const getCurrentAdmin = async () => {
  const token = localStorage.getItem("admin_token") || localStorage.getItem("token");
  if (!token) return null;
  const res = await API.get("/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const fetchUsers = async () => {
  const res = await API.get("/admin/users");
  return res.data;
};

// Orders API
export const fetchAdminOrders = async () => {
  const res = await API.get("/orders/admin");
  return res.data;
};

export const updateOrderStatus = async (id, status) => {
  const res = await API.put(`/orders/${id}/status`, { status });
  return res.data;
};
