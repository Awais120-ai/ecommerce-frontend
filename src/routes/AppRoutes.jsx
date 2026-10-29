import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Spin } from "antd";
import ProtectedRoute from "../components/ProtectedRoute";
import MainLayout from "../layouts/MainLayout";

const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const Products = lazy(() => import("../pages/Products"));
const ProductDetails = lazy(() => import("../pages/ProductDetails"));
const Cart = lazy(() => import("../pages/Cart"));
const Wishlist = lazy(() => import("../pages/Wishlist"));
const Checkout = lazy(() => import("../pages/Checkout"));
const Orders = lazy(() => import("../pages/Orders"));
const OrderDetails = lazy(() => import("../pages/OrderDetails"));
const Addresses = lazy(() => import("../pages/Addresses"));
const Profile = lazy(() => import("../pages/Profile"));
const Payment = lazy(() => import("../pages/Payment"));
const NotFound = lazy(() => import("../pages/NotFound"));

function PageLoader() {
  return (
    <div style={{ display: "grid", placeItems: "center", minHeight: "40vh" }}>
      <Spin size="large" />
    </div>
  );
}

function withLayout(Page, protectedRoute = false) {
  const content = (
    <MainLayout>
      <Suspense fallback={<PageLoader />}>
        <Page />
      </Suspense>
    </MainLayout>
  );

  return protectedRoute ? <ProtectedRoute>{content}</ProtectedRoute> : content;
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={withLayout(Home)} />
        <Route path="/products" element={withLayout(Products)} />
        <Route path="/products/:id" element={withLayout(ProductDetails)} />
        <Route path="/cart" element={withLayout(Cart, true)} />
        <Route path="/wishlist" element={withLayout(Wishlist, true)} />
        <Route path="/checkout" element={withLayout(Checkout, true)} />
        <Route path="/payment" element={withLayout(Payment, true)} />
        <Route path="/orders" element={withLayout(Orders, true)} />
        <Route path="/orders/:id" element={withLayout(OrderDetails, true)} />
        <Route path="/addresses" element={withLayout(Addresses, true)} />
        <Route path="/profile" element={withLayout(Profile, true)} />
        <Route path="*" element={withLayout(NotFound)} />
      </Routes>
    </Suspense>
  );
}
