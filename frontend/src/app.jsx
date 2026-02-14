import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './home.jsx';
import Login from './login.jsx';
import Register from './register.jsx';
import Rentals from './rentals.jsx';
import ListingDetail from './listingdetail.jsx';
import CreateListing from './createlisting.jsx';
import EditListing from './editlisting.jsx';
import MyListings from './mylistings.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/rentals" element={<Rentals />} />
      <Route path="/listing/:id" element={<ListingDetail />} />
      
      <Route 
        path="/login" 
        element={localStorage.getItem('token') ? <Navigate to="/rentals" /> : <Login />} 
      />
      <Route 
        path="/register" 
        element={localStorage.getItem('token') ? <Navigate to="/rentals" /> : <Register />} 
      />
      
      <Route 
        path="/my-listings" 
        element={localStorage.getItem('token') ? <MyListings /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/create-listing" 
        element={localStorage.getItem('token') ? <CreateListing /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/edit-listing/:id" 
        element={localStorage.getItem('token') ? <EditListing /> : <Navigate to="/login" />} 
      />
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;