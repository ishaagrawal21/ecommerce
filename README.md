# Nexus Store - Mini E-Commerce System

A full-stack e-commerce solution featuring product inventory operations, categories, real-time stock quantity validation, order tracking, and an admin management portal.

Built with:
* **Backend**: Node.js, Express, MongoDB (Mongoose), JWT authentication.
* **Client Frontend (Customer)**: React, Vite, Material UI, TanStack React Query.
* **Admin Frontend (Manager)**: React, Vite, Material UI.

---

## Key Features

1. **Product & Category CRUD**: Full management of product lists and product categories on the admin dashboard.
2. **Stock Quantity Enforcement**:
   * Stock levels displayed in real-time on customer catalog cards and admin lists.
   * Client-side prevention of cart additions exceeding available stock (triggers top-centered warning notifications).
   * Server-side atomic checks and stock decrement during order placement to ensure consistency.
3. **Checkout & Order Creation**: Complete order placement from cart checkout.
4. **Order Status Tracking**: 
   * Customers can view their purchase history with status states (`Success`, `Pending`, `Failure`).
   * Admins can manage statuses, which automatically adjusts stock counts back and forth if an order is marked as `Failure`.
5. **Dashboard Statistics**: Cards displaying Total Products, Categories count, Total Inventory Value, and Total Orders.
6. **Form Validation**: Image field validations in admin forms requiring valid URL formats or choosing files.

---

## Prerequisites
* **Node.js** (v16+ recommended)
* **MongoDB** running locally on port `27017` (default database name: `Blogweb`)

---

## Quick Start Setup

### Step 1: Clone & Configure Backend
1. Open a terminal in `server/` directory:
   ```bash
   cd server
   npm install
   ```
2. Configure environmental variables. Create/edit `server/.env`:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/Blogweb
   JWT_SECRET=your-secret-key
   ```
3. Start the server:
   ```bash
   npm start
   ```
   *The server runs at: `http://localhost:5000`*

### Step 2: Configure & Start Customer Portal
1. Open a terminal in `client/` directory:
   ```bash
   cd client
   npm install
   ```
2. Check or create `client/.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   *The customer app opens at: `http://localhost:5173`*

### Step 3: Configure & Start Admin Operations Portal
1. Open a terminal in `admin/` directory:
   ```bash
   cd admin
   npm install
   ```
2. Check or create `admin/.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   *The admin app opens at: `http://localhost:5174` (or other free port shown in terminal)*

---

## API Documentation Summary

### Customer Orders
* `POST /api/orders` - Place a new order (Checks and decrements stock).
* `GET /api/orders` - Fetch currently logged-in customer's order history.

### Admin Orders
* `GET /api/orders/admin` - Fetch all customer orders.
* `PUT /api/orders/:id/status` - Modify status of an order (`Success`, `Pending`, `Failure`). Restores stock if marked `Failure`.

