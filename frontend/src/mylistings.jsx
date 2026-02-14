import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { listingApi } from '@/lib/api/listing.api';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Home, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { formatINR } from '@/lib/utils';

const MyListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyListings = async () => {
    try {
      const { data } = await listingApi.getMyListings();
      setListings(data);
    } catch (error) {
      toast.error("Could not load your listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMyListings(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this listing?")) return;
    try {
      await listingApi.delete(id);
      setListings(listings.filter(l => l._id !== id));
      toast.success("Removed");
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-emerald-800" /></div>;

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-serif text-stone-900">Your Properties</h1>
            <p className="text-stone-500">Manage your active rental advertisements</p>
          </div>
          <Button asChild className="bg-emerald-800 text-white">
            <Link to="/create-listing"><Plus className="h-4 w-4 mr-2" /> Post New</Link>
          </Button>
        </div>

        {listings.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-stone-200 rounded-3xl p-20 text-center">
            <Home className="h-12 w-12 text-stone-200 mx-auto mb-4" />
            <p className="text-stone-500 mb-6 text-lg">You haven't posted any listings yet.</p>
            <Button asChild variant="outline" className="border-stone-300">
              <Link to="/create-listing">Create your first post</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {listings.map(listing => (
              <div key={listing._id} className="bg-white rounded-2xl border border-stone-200 overflow-hidden flex shadow-sm group">
                <div className="w-1/3 overflow-hidden">
                  <img src={listing.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="w-2/3 p-5 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-lg text-stone-900 truncate">{listing.title}</h3>
                    <p className="text-emerald-800 font-bold">{formatINR(listing.price)}</p>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button asChild variant="secondary" size="sm" className="flex-1 bg-stone-100 hover:bg-stone-200">
                      <Link to={`/edit-listing/${listing._id}`}><Edit className="h-4 w-4 mr-2" /> Edit</Link>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(listing._id)} className="text-red-500 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyListings;