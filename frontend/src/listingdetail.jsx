import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styles from './listingdetail.module.css';

function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const isLoggedIn = localStorage.getItem('token');
  const user = isLoggedIn ? JSON.parse(localStorage.getItem('user')) : null;

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/listings/${id}`);
        const data = await response.json();
        setListing(data);
      } catch (error) {
        alert('Listing not found');
        navigate('/rentals');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/listings/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Listing deleted');
        navigate('/my-listings');
      } else {
        alert('Failed to delete');
      }
    } catch (error) {
      alert('Failed to delete');
    }
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

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  const isOwner = user && listing.owner && listing.owner._id === user._id;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <button onClick={() => navigate(-1)} className={styles.backBtn}>
          ← Back to results
        </button>

        <div className={styles.grid}>
          <div className={styles.mainContent}>
            <div className={styles.imageContainer}>
              <img src={listing.imageUrl} alt={listing.title} />
            </div>

            <div className={styles.content}>
              <h1>{listing.title}</h1>
              <p className={styles.location}>📍 {listing.location}</p>
              
              <div className={styles.specs}>
                <div className={styles.spec}>
                  <span className={styles.specIcon}>🛏️</span>
                  <div>
                    <div className={styles.specLabel}>Bedrooms</div>
                    <div className={styles.specValue}>{listing.bedrooms} BHK</div>
                  </div>
                </div>
                <div className={styles.spec}>
                  <span className={styles.specIcon}>🚿</span>
                  <div>
                    <div className={styles.specLabel}>Bathrooms</div>
                    <div className={styles.specValue}>{listing.bathrooms}</div>
                  </div>
                </div>
                <div className={styles.spec}>
                  <span className={styles.specIcon}>📐</span>
                  <div>
                    <div className={styles.specLabel}>Area</div>
                    <div className={styles.specValue}>{formatNumber(listing.sqft)} sqft</div>
                  </div>
                </div>
              </div>

              <div className={styles.description}>
                <h2>Description</h2>
                <p>{listing.description}</p>
              </div>

              {listing.tags && listing.tags.length > 0 && (
                <div className={styles.tagsSection}>
                  <h3>Amenities</h3>
                  <div className={styles.tags}>
                    {listing.tags.map((tag, idx) => (
                      <span key={idx} className={styles.tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className={styles.sidebar}>
            <div className={styles.priceCard}>
              <div className={styles.price}>{formatPrice(listing.price)}</div>
              <div className={styles.priceLabel}>per month</div>

              {isOwner ? (
                <div className={styles.ownerActions}>
                  <Link to={`/edit-listing/${listing._id}`} className={styles.editBtn}>
                    ✏️ Edit Listing
                  </Link>
                  <button onClick={handleDelete} className={styles.deleteBtn}>
                    🗑️ Delete Listing
                  </button>
                </div>
              ) : (
                <button className={styles.contactBtn}>Contact Owner</button>
              )}
            </div>

            {listing.owner && (
              <div className={styles.ownerCard}>
                <h3>Owner Details</h3>
                <div className={styles.ownerInfo}>
                  <div className={styles.ownerAvatar}>
                    {listing.owner.avatar ? (
                      <img src={listing.owner.avatar} alt={listing.owner.name} />
                    ) : (
                      <span>{listing.owner.name?.[0]?.toUpperCase() || 'U'}</span>
                    )}
                  </div>
                  <div>
                    <div className={styles.ownerName}>{listing.owner.name}</div>
                    <div className={styles.ownerEmail}>{listing.owner.email}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListingDetail;