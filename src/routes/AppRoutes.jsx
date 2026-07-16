import { Routes, Route } from "react-router-dom";

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
          <MainLayout>
            <Cart />
          </MainLayout>
        }
      />

      <Route
        path="/wishlist"
        element={
          <MainLayout>
            <Wishlist />
          </MainLayout>
        }
      />

      <Route
        path="/checkout"
        element={
          <MainLayout>
            <Checkout />
          </MainLayout>
        }
      />

      <Route
        path="/payment"
        element={
          <MainLayout>
            <Payment />
          </MainLayout>
        }
      />

      <Route
        path="/orders"
        element={
          <MainLayout>
            <Orders />
          </MainLayout>
        }
      />

      <Route
        path="/orders/:id"
        element={
          <MainLayout>
            <OrderDetails />
          </MainLayout>
        }
      />

      <Route
        path="/addresses"
        element={
          <MainLayout>
            <Addresses />
          </MainLayout>
        }
      />

      <Route
        path="/profile"
        element={
          <MainLayout>
            <Profile />
          </MainLayout>
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