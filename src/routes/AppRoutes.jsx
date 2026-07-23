import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import MainLayout from "../layouts/MainLayout";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Products from "../pages/Products";
import ProductDetails from "../pages/ProductDetails";
import Cart from "../pages/Cart";
import Wishlist from "../pages/Wishlist";
import Checkout from "../pages/Checkout";
import Orders from "../pages/Orders";
import OrderDetails from "../pages/OrderDetails";
import Addresses from "../pages/Addresses";
import Profile from "../pages/Profile";
import Payment from "../pages/Payment";
import NotFound from "../pages/NotFound";

export default function AppRoutes() {
  return (
    <Routes>

      {/* Login/Register without Navbar */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* All pages with Navbar + Footer */}
      <Route
        path="/"
        element={
          <MainLayout>
            <Home />
          </MainLayout>
        }
      />

      <Route
        path="/products"
        element={
          <MainLayout>
            <Products />
          </MainLayout>
        }
      />

      <Route
        path="/products/:id"
        element={
          <MainLayout>
            <ProductDetails />
          </MainLayout>
        }
      />

      <Route
  path="/cart"
  element={
    <ProtectedRoute>
      <MainLayout>
        <Cart />
      </MainLayout>
    </ProtectedRoute>
  }
/>

      <Route
        path="/wishlist"
        element={
          <ProtectedRoute> 
          <MainLayout>
            <Wishlist />
          </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/checkout"
        element={
          <ProtectedRoute> 
          <MainLayout>
            <Checkout />
          </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/payment"
        element={
          <ProtectedRoute> 
          <MainLayout>
            <Payment />
          </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/orders"
        element={
          <ProtectedRoute> 
          <MainLayout>
            <Orders />
          </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/orders/:id"
        element={
          <ProtectedRoute> 
          <MainLayout>
            <OrderDetails />
          </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/addresses"
        element={
          <ProtectedRoute>
          <MainLayout>
            <Addresses />
          </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
          <MainLayout>
            <Profile />
          </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={
          <MainLayout>
            <NotFound />
          </MainLayout>
        }
      />

    </Routes>
  );
}