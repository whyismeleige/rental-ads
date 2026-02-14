import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/shared/Navbar";
import { listingApi } from "@/lib/api/listing.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  SlidersHorizontal,
  BedDouble,
  Bath,
  Square,
  Heart,
  MapPin,
  Loader2,
  Search,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { formatINR, formatIndianNumber } from "@/lib/utils";

const PRICE_RANGES = [
  { value: "any", label: "Any" },
  { value: "under-25", label: "Under ₹25,000", min: 0, max: 24999 },
  { value: "25-50", label: "₹25,000 - ₹50,000", min: 25000, max: 49999 },
  { value: "50-100", label: "₹50,000 - ₹1,00,000", min: 50000, max: 99999 },
  { value: "above-100", label: "Above ₹1,00,000", min: 100000, max: null },
];

export default function Rentals() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    bedrooms: "any",
    priceRange: "any",
    location: "",
  });

  const fetchListings = async (query = "") => {
    try {
      setLoading(true);
      const { data } = await listingApi.getAll(query);
      setListings(data);
    } catch (error) {
      toast.error("Failed to load listings");
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

  const applyFilters = (list) => {
    return list.filter((item) => {
      if (filters.bedrooms !== "any") {
        const beds =
          filters.bedrooms === "4+" ? 4 : parseInt(filters.bedrooms, 10);
        if (filters.bedrooms === "4+") {
          if (item.bedrooms < 4) return false;
        } else if (item.bedrooms !== beds) return false;
      }
      if (filters.priceRange !== "any") {
        const range = PRICE_RANGES.find((r) => r.value === filters.priceRange);
        if (
          range &&
          range.max != null &&
          (item.price < range.min || item.price > range.max)
        )
          return false;
        if (range && range.max == null && item.price < range.min) return false;
      }
      if (filters.location.trim()) {
        const term = filters.location.trim().toLowerCase();
        if (!item.location?.toLowerCase().includes(term)) return false;
      }
      return true;
    });
  };

  const filteredListings = applyFilters(listings);

  const sortedListings = [...filteredListings].sort((a, b) => {
    if (sortBy === "low-to-high") return a.price - b.price;
    if (sortBy === "high-to-low") return b.price - a.price;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  // Helper to clear filters
  const clearFilters = () => {
    setFilters({ bedrooms: "any", priceRange: "any", location: "" });
  };

  return (
    // 1. Fixed: Added flex-col to wrapper to ensure main stretches properly
    <div className="min-h-screen bg-stone-50 font-sans text-stone-800 flex flex-col">
      <Navbar />

      {/* 2. Fixed: Added flex-1 to main so it takes up remaining space */}
      <main className="container mx-auto px-6 py-12 flex-1">
        {/* Header & Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-serif text-stone-900 mb-2">
              Available Properties
            </h1>
            <p className="text-stone-500">
              {loading
                ? "Loading..."
                : `Showing ${filteredListings.length} of ${listings.length} properties`}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <form onSubmit={handleSearch} className="relative group">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-emerald-800"
              />
              <Input
                placeholder="Search location..."
                className="pl-10 rounded-full border-stone-300 w-full sm:w-64"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </form>

            <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="border-stone-300 text-stone-600 hover:bg-stone-100 rounded-full px-6"
                >
                  <SlidersHorizontal size={16} className="mr-2" /> Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-sm">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  <div>
                    <label className="text-sm font-medium text-stone-700 mb-2 block">
                      Bedrooms
                    </label>
                    <select
                      className="w-full h-10 px-3 rounded-lg border border-stone-300 bg-white text-stone-800"
                      value={filters.bedrooms}
                      onChange={(e) =>
                        setFilters((f) => ({ ...f, bedrooms: e.target.value }))
                      }
                    >
                      <option value="any">Any</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4+">4+</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-stone-700 mb-2 block">
                      Price range
                    </label>
                    <select
                      className="w-full h-10 px-3 rounded-lg border border-stone-300 bg-white text-stone-800"
                      value={filters.priceRange}
                      onChange={(e) =>
                        setFilters((f) => ({
                          ...f,
                          priceRange: e.target.value,
                        }))
                      }
                    >
                      {PRICE_RANGES.map((r) => (
                        <option key={r.value} value={r.value}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-stone-700 mb-2 block">
                      Location
                    </label>
                    <Input
                      placeholder="City or area..."
                      value={filters.location}
                      onChange={(e) =>
                        setFilters((f) => ({ ...f, location: e.target.value }))
                      }
                      className="border-stone-300"
                    />
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={clearFilters}
                  >
                    Clear filters
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            <select
              className="h-10 px-4 rounded-full border border-stone-300 bg-white text-stone-600 outline-none cursor-pointer hover:border-stone-400"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Sort by: Newest</option>
              <option value="low-to-high">Price: Low to High</option>
              <option value="high-to-low">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* 3. Fixed: Conditional Logic - Clean separation of Loading vs Content vs Empty */}
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-800" />
          </div>
        ) : sortedListings.length > 0 ? (
          /* Listings Grid - Only renders if we have items */
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {sortedListings.map((rental) => (
              <div
                key={rental._id}
                className="group bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={rental.imageUrl}
                    alt={rental.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  <button className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white text-stone-400 hover:text-red-500 transition-colors backdrop-blur-sm">
                    <Heart size={18} />
                  </button>

                  <div className="absolute bottom-3 left-3 flex gap-2">
                    {rental.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-stone-900/80 backdrop-blur-md text-white text-[10px] uppercase tracking-wide font-bold rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-serif text-lg font-medium text-stone-900 line-clamp-1">
                      {rental.title}
                    </h3>
                    <span className="font-bold text-emerald-800">
                      {formatINR(rental.price ?? 0)}
                    </span>
                  </div>

                  <div className="flex items-center text-stone-500 text-sm mb-4">
                    <MapPin size={14} className="mr-1" /> {rental.location}
                  </div>

                  <div className="flex items-center gap-4 py-3 border-t border-stone-100 text-xs text-stone-500 font-medium">
                    <span className="flex items-center gap-1">
                      <BedDouble size={14} /> {rental.bedrooms} Bed
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath size={14} /> {rental.bathrooms} Bath
                    </span>
                    <span className="flex items-center gap-1">
                      <Square size={14} /> {formatIndianNumber(rental.sqft)}{" "}
                      sqft
                    </span>
                  </div>

                  <Button
                    asChild
                    className="w-full mt-2 bg-stone-100 hover:bg-stone-900 text-stone-900 hover:text-white border border-stone-200 hover:border-stone-900 transition-colors rounded-lg h-10 font-medium text-sm"
                  >
                    <Link to={`/listing/${rental._id}`}>View Details</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State - Only renders if not loading AND no items */
          <div className="text-center py-20">
            <p className="text-stone-400 text-lg font-serif">
              {listings.length === 0
                ? "No properties listed yet."
                : "No properties match your filters. Try adjusting or clearing filters."}
            </p>
            {listings.length > 0 && (
              <Button
                variant="link"
                className="mt-2 text-emerald-800"
                onClick={clearFilters}
              >
                Clear all filters
              </Button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}