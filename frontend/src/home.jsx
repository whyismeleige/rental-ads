import { Link, useNavigate } from 'react-router-dom';
import styles from './home.module.css';

function Home() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    alert('Logged out successfully');
    window.location.reload();
  };

  const user = isLoggedIn ? JSON.parse(localStorage.getItem('user')) : null;

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

      <main className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Find your perfect rental home in India</h1>
          <p>Discover thousands of verified rental properties across major Indian cities. Your dream home is just a search away.</p>
          <div className={styles.ctaButtons}>
            <Link to="/rentals" className={styles.primaryBtn}>Browse Rentals</Link>
            {isLoggedIn && (
              <Link to="/create-listing" className={styles.secondaryBtn}>Post Your Property</Link>
            )}
          </div>
        </div>

        <div className={styles.heroImage}>
          <img 
            src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=1600" 
            alt="Modern apartment"
          />
        </div>
      </main>

      <section className={styles.features}>
        <div className={styles.feature}>
          <div className={styles.featureIcon}>🏠</div>
          <h3>Wide Selection</h3>
          <p>Browse through thousands of verified rental properties across India</p>
        </div>
        <div className={styles.feature}>
          <div className={styles.featureIcon}>✓</div>
          <h3>Verified Listings</h3>
          <p>All properties are verified and regularly updated</p>
        </div>
        <div className={styles.feature}>
          <div className={styles.featureIcon}>💰</div>
          <h3>Best Prices</h3>
          <p>Find rentals that fit your budget in your preferred location</p>
        </div>
      </section>
    </div>
  );
}

export default Home;