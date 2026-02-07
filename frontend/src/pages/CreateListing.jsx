import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listingApi } from '@/lib/api/listing.api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { toast } from 'react-hot-toast';

const CreateListing = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', price: '', location: '',
    bedrooms: '', bathrooms: '', sqft: '', imageUrl: '', tags: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = { 
        ...formData, 
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(t => t !== "") 
      };
      await listingApi.create(data);
      toast.success("Listing created successfully!");
      navigate('/my-listings');
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4">
      <Card className="max-w-2xl mx-auto border-stone-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-serif text-stone-900">Post a New Rental</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input placeholder="Property Title" required minLength={5}
              value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
            
            <Textarea placeholder="Detailed Description (min 20 chars)" required minLength={20}
              value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
            
            <div className="grid grid-cols-2 gap-4">
              <Input type="number" placeholder="Price (₹)" required
                value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
              <Input placeholder="Location (e.g. Brooklyn, NY)" required
                value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Input type="number" placeholder="Beds" required
                value={formData.bedrooms} onChange={(e) => setFormData({...formData, bedrooms: e.target.value})} />
              <Input type="number" placeholder="Baths" required
                value={formData.bathrooms} onChange={(e) => setFormData({...formData, bathrooms: e.target.value})} />
              <Input type="number" placeholder="Sqft" required
                value={formData.sqft} onChange={(e) => setFormData({...formData, sqft: e.target.value})} />
            </div>

            <Input placeholder="Image URL (direct link to photo)" required
              value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} />
            
            <Input placeholder="Tags (comma separated: Gym, Pet Friendly, Parking)"
              value={formData.tags} onChange={(e) => setFormData({...formData, tags: e.target.value})} />

            <Button type="submit" disabled={loading} className="w-full bg-emerald-800 hover:bg-emerald-900 text-white py-6">
              {loading ? "Posting..." : "Create Listing"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateListing;