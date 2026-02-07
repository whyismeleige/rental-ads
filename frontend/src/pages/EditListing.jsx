import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { listingApi } from '@/lib/api/listing.api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', price: '', location: '',
    bedrooms: '', bathrooms: '', sqft: '', imageUrl: '', tags: ''
  });

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const { data } = await listingApi.getById(id);
        setFormData({ ...data, tags: data.tags.join(', ') });
      } catch (err) {
        navigate('/rentals');
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const data = { 
        ...formData, 
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(t => t !== "") 
      };
      await listingApi.update(id, data);
      toast.success("Listing updated!");
      navigate(`/listing/${id}`);
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4">
      <Card className="max-w-2xl mx-auto border-stone-200">
        <CardHeader>
          <CardTitle className="text-2xl font-serif text-stone-900">Edit Listing</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
            <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required />
            <div className="grid grid-cols-2 gap-4">
              <Input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
              <Input value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} required />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Input type="number" value={formData.bedrooms} onChange={(e) => setFormData({...formData, bedrooms: e.target.value})} required />
              <Input type="number" value={formData.bathrooms} onChange={(e) => setFormData({...formData, bathrooms: e.target.value})} required />
              <Input type="number" value={formData.sqft} onChange={(e) => setFormData({...formData, sqft: e.target.value})} required />
            </div>
            <Input value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} required />
            <Input value={formData.tags} onChange={(e) => setFormData({...formData, tags: e.target.value})} placeholder="Tags (comma separated)" />
            <Button type="submit" disabled={updating} className="w-full bg-stone-900 text-white">
              {updating ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditListing;