require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const db = require("../models");

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;

if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI in .env");
  process.exit(1);
}

const INDIAN_USERS = [
  ["Rahul Sharma", "rahul.sharma"],
  ["Priya Singh", "priya.singh"],
  ["Amit Patel", "amit.patel"],
  ["Sneha Reddy", "sneha.reddy"],
  ["Vikram Nair", "vikram.nair"],
  ["Ananya Iyer", "ananya.iyer"],
  ["Arjun Mehta", "arjun.mehta"],
  ["Kavya Joshi", "kavya.joshi"],
  ["Rohan Gupta", "rohan.gupta"],
  ["Diya Krishnan", "diya.krishnan"],
];

const INDIAN_LOCATIONS = [
  ["Mumbai", "Bandra West"],
  ["Mumbai", "Andheri East"],
  ["Mumbai", "Powai"],
  ["Mumbai", "Juhu"],
  ["Bangalore", "Koramangala"],
  ["Bangalore", "Indiranagar"],
  ["Bangalore", "Whitefield"],
  ["Bangalore", "HSR Layout"],
  ["Delhi", "Saket"],
  ["Delhi", "Hauz Khas"],
  ["Delhi", "Dwarka"],
  ["Pune", "Koregaon Park"],
  ["Pune", "Viman Nagar"],
  ["Pune", "Hinjewadi"],
  ["Chennai", "T Nagar"],
  ["Chennai", "Adyar"],
  ["Hyderabad", "Gachibowli"],
  ["Hyderabad", "Jubilee Hills"],
  ["Kolkata", "Salt Lake"],
  ["Ahmedabad", "Satellite"],
];

const LISTING_TITLES = [
  "Spacious 2BHK with Balcony",
  "Furnished 3BHK Apartment",
  "Modern 1BHK near Metro",
  "Luxury 4BHK Villa",
  "Cozy Studio in Prime Location",
  "2BHK with Parking",
  "3BHK Semi-Furnished",
  "1BHK for Working Professionals",
  "2BHK with Garden View",
  "Furnished 2BHK Ready to Move",
  "3BHK with Modular Kitchen",
  "1BHK near IT Park",
  "Spacious 2BHK with Amenities",
  "3BHK Corner Apartment",
  "1BHK Budget-Friendly",
  "2BHK with Power Backup",
  "3BHK with Club House",
  "1BHK Fully Furnished",
  "2BHK Near Highway",
  "3BHK with Servant Room",
];

const SAMPLE_IMAGES = [
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800",
];

const SEED_PASSWORD = "password123";

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI, { dbName: DB_NAME || undefined });
    console.log("Connected to MongoDB");

    const { user: User, listing: Listing } = db;

    await Listing.deleteMany({});
    await User.deleteMany({});
    console.log("Cleared existing users and listings");

    const hashedPassword = await bcrypt.hash(SEED_PASSWORD, 12);
    const users = await User.insertMany(
      INDIAN_USERS.map(([name, prefix]) => ({
        name,
        email: `${prefix}@example.com`,
        password: hashedPassword,
      }))
    );
    console.log(`Created ${users.length} users`);

    const listingDocs = [];
    for (let i = 0; i < 40; i++) {
      const [city, area] = pick(INDIAN_LOCATIONS);
      const location = `${area}, ${city}`;
      const title = pick(LISTING_TITLES);
      const bedrooms = pick([1, 2, 3, 4]);
      const bathrooms = Math.max(1, bedrooms - pick([0, 1]));
      const sqft = randomInt(450, 2200);
      const pricePerSqft = randomInt(45, 120);
      const price = Math.round((sqft * pricePerSqft * 1000) / 1000) * 1000; // round to nearest 1000
      const owner = pick(users)._id;

      listingDocs.push({
        title: `${title} in ${area}`,
        description: `Well-maintained ${bedrooms}BHK available in ${area}, ${city}. Close to markets, transport, and schools. ${bedrooms === 2 || bedrooms === 3 ? "Ideal for families or professionals." : "Perfect for individuals or couples."} Contact for site visit.`,
        price,
        location,
        bedrooms,
        bathrooms,
        sqft,
        imageUrl: pick(SAMPLE_IMAGES),
        tags: pick([
          ["Furnished", "Parking"],
          ["Semi-Furnished", "Power Backup"],
          ["Unfurnished", "Lift"],
          ["Furnished", "Security"],
          ["Ready to Move", "Parking", "Lift"],
        ]),
        available: true,
        owner,
      });
    }

    await Listing.insertMany(listingDocs);
    console.log(`Created ${listingDocs.length} listings`);

    console.log("\nSeed complete. You can login with any user e.g. rahul.sharma@example.com / " + SEED_PASSWORD);
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
    process.exit(0);
  }
}

seed();
