import { useState, useEffect } from "react";
import Navbar from "@/components/shared/Navbar";
import { Link } from "react-router-dom";
import { MapPin, BedDouble, Bath, Square, ArrowRight } from "lucide-react";
import { listingApi } from "@/lib/api/listing.api";
import { formatINR, formatIndianNumber } from "@/lib/utils";

const FEATURED_COUNT = 6;

export default function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const { data } = await listingApi.getAll();
        setListings(data);
      } catch {
        setListings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  const featuredListings = listings.slice(0, FEATURED_COUNT);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans selection:bg-stone-200">
      <Navbar />

      <main>
        <section className="relative pt-20 pb-32 px-6 container mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2 space-y-8">
              <div className="inline-block px-3 py-1 border border-stone-300 rounded-full text-xs font-bold uppercase tracking-widest text-stone-500">
                Premium Listings
              </div>
              <h1 className="text-5xl md:text-7xl font-serif font-medium text-stone-900 leading-[1.1]">
                Find a space that <br/>
                <span className="italic text-emerald-800">inspires you.</span>
              </h1>
              <p className="text-xl text-stone-600 leading-relaxed max-w-md">
                Curated rental properties in the city's most vibrant neighborhoods. No clutter, just quality homes.
              </p>
              <Link
                to="/rentals"
                className="inline-flex items-center gap-2 rounded-full bg-stone-900 text-stone-50 px-6 py-3 font-medium hover:bg-stone-800 transition-colors"
              >
                Browse Rentals <ArrowRight size={18} />
              </Link>
            </div>

            <div className="lg:w-1/2 grid grid-cols-2 gap-4">
              <div className="space-y-4 mt-8">
                <img src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800" className="w-full h-64 object-cover rounded-2xl shadow-md" alt="Interior" />
                <img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800" className="w-full h-48 object-cover rounded-2xl shadow-md" alt="Interior" />
              </div>
              <div className="space-y-4">
                <img src="https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=800" className="w-full h-48 object-cover rounded-2xl shadow-md" alt="Interior" />
                <img src="https://plus.unsplash.com/premium_photo-1676968002767-1f6a09891350?w=500&auto=format&fit=crop&q=60" className="w-full h-64 object-cover rounded-2xl shadow-md" alt="Interior" />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-stone-100 py-24 px-6">
          <div className="container mx-auto">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl font-serif text-stone-900 mb-2">Featured Listings</h2>
                <p className="text-stone-500">Hand-picked selections for every lifestyle.</p>
              </div>
              <Link to="/rentals" className="text-stone-900 font-bold hover:underline flex items-center gap-2">
                View All <ArrowRight size={16}/>
              </Link>
            </div>

            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-96 bg-stone-200/60 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : featuredListings.length === 0 ? (
              <p className="text-stone-500 text-center py-12">No listings yet. Check back soon.</p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredListings.map((rental) => (
                  <Link
                    key={rental._id}
                    to={`/listing/${rental._id}`}
                    className="group bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={rental.imageUrl}
                        alt={rental.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute bottom-3 left-3 flex gap-2 flex-wrap">
                        {rental.tags?.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-stone-900/80 backdrop-blur-md text-white text-[10px] uppercase tracking-wide font-bold rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-serif text-lg font-medium text-stone-900 line-clamp-1">{rental.title}</h3>
                        <span className="font-bold text-emerald-800 shrink-0 ml-2">{formatINR(rental.price ?? 0)}</span>
                      </div>
                      <p className="text-stone-500 text-sm mb-3 flex items-center">
                        <MapPin size={14} className="mr-1 shrink-0" /> {rental.location}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-stone-500 font-medium">
                        <span className="flex items-center gap-1"><BedDouble size={14} /> {rental.bedrooms} Beds</span>
                        <span className="flex items-center gap-1"><Bath size={14} /> {rental.bathrooms} Bath</span>
                        <span className="flex items-center gap-1"><Square size={14} /> {formatIndianNumber(rental.sqft)} sqft</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="bg-stone-900 text-stone-400 py-12 px-6 text-center">
         <p className="font-serif italic text-2xl text-stone-200 mb-6">Ghar Dekho</p>
         <p className="mt-8 text-xs opacity-50">© 2026 Ghar Dekho. All rights reserved.</p>
      </footer>
    </div>
  );
}