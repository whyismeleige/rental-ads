import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './rentals.module.css';

function Rentals() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const isLoggedIn = localStorage.getItem('token');
  const user = isLoggedIn ? JSON.parse(localStorage.getItem('user')) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    alert('Logged out successfully');
    window.location.href = '/';
  };

  const fetchListings = async (query = '') => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/listings?search=${query}`);
      const data = await response.json();
      setListings(data);
    } catch (error) {
      alert('Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchListings(search);
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
            {isLoggedIn ? (
              <>
                <Link to="/my-listings" className={styles.myListingsBtn}>My Listings</Link>
                <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
                <div className={styles.avatar}>{user?.name?.[0]?.toUpperCase() || 'U'}</div>
              </>
            ) : (
              <>
                <Link to="/login" className={styles.loginBtn}>Sign in</Link>
                <Link to="/register" className={styles.registerBtn}>Get started</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Rental Properties</h1>
          <p>Find your perfect home from our curated listings</p>
        </div>

        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            type="text"
            placeholder="Search by location (e.g., Mumbai, Pune)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchBtn}>Search</button>
        </form>

        {loading ? (
          <div className={styles.loading}>Loading...</div>
        ) : (
          <div className={styles.grid}>
            {listings.length === 0 ? (
              <div className={styles.empty}>No listings found</div>
            ) : (
              listings.map((listing) => (
                <Link to={`/listing/${listing._id}`} key={listing._id} className={styles.card}>
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
                    {listing.tags && listing.tags.length > 0 && (
                      <div className={styles.tags}>
                        {listing.tags.map((tag, idx) => (
                          <span key={idx} className={styles.tag}>{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Rentals;