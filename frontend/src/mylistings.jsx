import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './mylistings.module.css';

function MyListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchMyListings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/listings/my-listings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      console.log(data);
      setListings(data);
    } catch (error) {
      alert('Could not load your listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyListings();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this listing?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/listings/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setListings(listings.filter(l => l._id !== id));
        alert('Listing deleted');
      } else {
        alert('Failed to delete');
      }
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    alert('Logged out successfully');
    window.location.href = '/';
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  return (
    <div className={styles.page}>
      <nav className={styles.navbar}>
        <div className={styles.navContent}>
          <Link to="/" className={styles.brand}>
            <div className={styles.logo}>🔑</div>
            <span>Ghar Dekho</span>
          </Link>

          <div className={styles.navLinks}>
            <Link to="/rentals">Rentals</Link>
          </div>

          <div className={styles.navActions}>
            <Link to="/my-listings" className={styles.myListingsBtn}>My Listings</Link>
            <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
            <div className={styles.avatar}>{user?.name?.[0]?.toUpperCase() || 'U'}</div>
          </div>
        </div>
      </nav>

      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1>Your Properties</h1>
            <p>Manage your active rental advertisements</p>
          </div>
          <Link to="/create-listing" className={styles.createBtn}>
            + Post New
          </Link>
        </div>

        {loading ? (
          <div className={styles.loading}>Loading...</div>
        ) : listings.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🏠</div>
            <h2>No listings yet</h2>
            <p>Create your first rental listing to get started</p>
            <Link to="/create-listing" className={styles.emptyBtn}>
              Create Listing
            </Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {listings.map((listing) => (
              <div key={listing._id} className={styles.card}>
                <div className={styles.cardImage}>
                  <img src={listing.imageUrl} alt={listing.title} />
                </div>
                <div className={styles.cardContent}>
                  <h3>{listing.title}</h3>
                  <p className={styles.location}>📍 {listing.location}</p>
                  <div className={styles.specs}>
                    <span>🛏️ {listing.bedrooms} BHK</span>
                    <span>🚿 {listing.bathrooms} Bath</span>
                    <span>📐 {formatNumber(listing.sqft)} sqft</span>
                  </div>
                  <div className={styles.price}>{formatPrice(listing.price)}/month</div>
                  <div className={styles.actions}>
                    <Link to={`/listing/${listing._id}`} className={styles.viewBtn}>
                      👁️ View
                    </Link>
                    <Link to={`/edit-listing/${listing._id}`} className={styles.editBtn}>
                      ✏️ Edit
                    </Link>
                    <button 
                      onClick={() => handleDelete(listing._id)} 
                      className={styles.deleteBtn}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyListings;