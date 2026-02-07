import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { listingApi } from '@/lib/api/listing.api';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, BedDouble, Bath, Square, Calendar, Edit, Trash2, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { formatINR, formatIndianNumber } from '@/lib/utils';

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const { data } = await listingApi.getById(id);
        setListing(data);
      } catch (error) {
        toast.error("Listing not found");
        navigate('/rentals');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
    try {
      await listingApi.delete(id);
      toast.success("Listing deleted");
      navigate('/my-listings');
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-emerald-800" /></div>;

  const isOwner = user && listing.owner?._id === user._id;

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 text-stone-600">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to results
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl overflow-hidden shadow-sm border border-stone-200">
              <img src={listing.imageUrl} alt={listing.title} className="w-full aspect-video object-cover" />
            </div>
            
            <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-serif text-stone-900">{listing.title}</h1>
                <p className="text-2xl font-bold text-emerald-800">{formatINR(listing.price)}</p>
              </div>
              
              <div className="flex items-center text-stone-500 mb-6">
                <MapPin className="h-4 w-4 mr-1 text-emerald-700" /> {listing.location}
              </div>

              <div className="grid grid-cols-3 gap-4 py-6 border-y border-stone-100 mb-6">
                <div className="text-center">
                  <BedDouble className="h-5 w-5 mx-auto mb-1 text-stone-400" />
                  <p className="font-semibold text-stone-900">{listing.bedrooms} Beds</p>
                </div>
                <div className="text-center">
                  <Bath className="h-5 w-5 mx-auto mb-1 text-stone-400" />
                  <p className="font-semibold text-stone-900">{listing.bathrooms} Baths</p>
                </div>
                <div className="text-center">
                  <Square className="h-5 w-5 mx-auto mb-1 text-stone-400" />
                  <p className="font-semibold text-stone-900">{formatIndianNumber(listing.sqft)} sqft</p>
                </div>
              </div>

              <h2 className="text-xl font-serif text-stone-900 mb-3">About this property</h2>
              <p className="text-stone-600 leading-relaxed whitespace-pre-line mb-6">
                {listing.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {listing.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="bg-stone-100 text-stone-700 px-3 py-1">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Actions */}
          <div className="space-y-4">
            {isOwner ? (
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3">
                <h3 className="font-serif text-lg mb-4">Owner Actions</h3>
                <Button asChild className="w-full bg-emerald-800 hover:bg-emerald-900 text-white">
                  <Link to={`/edit-listing/${listing._id}`}><Edit className="mr-2 h-4 w-4" /> Edit Details</Link>
                </Button>
                <Button variant="outline" onClick={handleDelete} className="w-full border-red-200 text-red-600 hover:bg-red-50">
                  <Trash2 className="mr-2 h-4 w-4" /> Delete Listing
                </Button>
              </div>
            ) : (
              <div className="bg-stone-900 text-white p-6 rounded-2xl shadow-lg">
                <h3 className="font-serif text-xl mb-4">Interested?</h3>
                <p className="text-stone-400 text-sm mb-6">Listed by {listing.owner?.name}</p>
                <Button className="w-full bg-emerald-800 hover:bg-emerald-700 text-white py-6">
                  Contact Property Owner
                </Button>
              </div>
            )}
            
            <div className="flex items-center justify-center gap-2 text-stone-400 text-xs py-2">
              <Calendar className="h-3 w-3" /> Posted {new Date(listing.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;