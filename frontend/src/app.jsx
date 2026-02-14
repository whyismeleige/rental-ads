import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@/components/routes/ProtectedRoute";
import PublicRoute from "@/components/routes/PublicRoute";

// Pages
import AuthPage from "@/pages/Auth";
import Home from "@/pages/Home";
import Rentals from "@/pages/Rentals";
import ListingDetail from "@/pages/ListingDetail";
import CreateListing from "@/pages/CreateListing";
import EditListing from "@/pages/EditListing";
import MyListings from "@/pages/MyListings";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/rentals" element={<Rentals />} />
      <Route path="/listing/:id" element={<ListingDetail />} />

      <Route element={<PublicRoute />}>
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/my-listings" element={<MyListings />} />
        <Route path="/create-listing" element={<CreateListing />} />
        <Route path="/edit-listing/:id" element={<EditListing />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}