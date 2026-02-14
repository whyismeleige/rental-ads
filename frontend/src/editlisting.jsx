import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import styles from './createlisting.module.css';

function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    bedrooms: '',
    bathrooms: '',
    sqft: '',
    imageUrl: '',
    tags: ''
  });

  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    alert('Logged out successfully');
    window.location.href = '/';
  };

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/listings/${id}`);
        const data = await response.json();
        
        setFormData({
          title: data.title,
          description: data.description,
          price: data.price,
          location: data.location,
          bedrooms: data.bedrooms,
          bathrooms: data.bathrooms,
          sqft: data.sqft,
          imageUrl: data.imageUrl,
          tags: data.tags ? data.tags.join(', ') : ''
        });
      } catch (err) {
        alert('Failed to load listing');
        navigate('/rentals');
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const token = localStorage.getItem('token');
      
      const listingData = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        location: formData.location,
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        sqft: Number(formData.sqft),
        imageUrl: formData.imageUrl,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(t => t !== '')
      };

      const response = await fetch(`http://localhost:5000/api/listings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(listingData)
      });

      const data = await response.json();

      if (response.ok) {
        alert('Listing updated!');
        navigate('/my-listings');
      } else {
        alert(data.message || 'Failed to update listing');
      }
    } catch (error) {
      alert('Error updating listing');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

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
          <h1>Edit Listing</h1>
          <p>Update your rental property details</p>
        </div>

        <div className={styles.formCard}>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label>Property Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Spacious 3BHK in Bandra"
                required
                minLength={5}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your property..."
                rows={5}
                required
                minLength={20}
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Monthly Rent (₹) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="25000"
                  required
                  min={0}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Bandra, Mumbai"
                  required
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Bedrooms *</label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  placeholder="3"
                  required
                  min={0}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Bathrooms *</label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  placeholder="2"
                  required
                  min={0}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Area (sqft) *</label>
                <input
                  type="number"
                  name="sqft"
                  value={formData.sqft}
                  onChange={handleChange}
                  placeholder="1200"
                  required
                  min={1}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Image URL *</label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Tags/Amenities (comma-separated)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="Furnished, Parking, Lift"
              />
            </div>

            <div className={styles.actions}>
              <button 
                type="button" 
                onClick={() => navigate(-1)}
                className={styles.cancelBtn}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className={styles.submitBtn}
                disabled={updating}
              >
                {updating ? 'Updating...' : 'Update Listing'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditListing;