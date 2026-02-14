require("dotenv").config();
const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let db;
let usersCollection;
let listingsCollection;

async function connectDB() {
  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    db = client.db(process.env.DB_NAME || "rental-app");
    usersCollection = db.collection("users");
    listingsCollection = db.collection("listings");
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
}

connectDB();

// REGISTER
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.json({ message: "all fields required" });
    }

    const userExists = await usersCollection.findOne({ email: email });
    
    if (userExists) {
      return res.json({ message: "user already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    
    const result = await usersCollection.insertOne({
      name: name,
      email: email,
      password: hashedPassword,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=" + email,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const token = jwt.sign(
      { id: result.insertedId.toString() },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const newUser = await usersCollection.findOne({ _id: result.insertedId });
    delete newUser.password;

    res.json({
      message: "registered successfully",
      user: newUser,
      token: token
    });
  } catch (error) {
    console.log(error);
    res.json({ message: "error registering" });
  }
});

// LOGIN
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.json({ message: "enter email and password" });
    }

    const user = await usersCollection.findOne({ email: email });
    
    if (!user) {
      return res.json({ message: "user not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      return res.json({ message: "wrong password" });
    }

    const token = jwt.sign(
      { id: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    delete user.password;

    res.json({
      message: "logged in",
      user: user,
      token: token
    });
  } catch (error) {
    console.log(error);
    res.json({ message: "error logging in" });
  }
});

// GET PROFILE
app.get("/api/auth/profile", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ message: "no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { ObjectId } = require("mongodb");
    const user = await usersCollection.findOne({ _id: new ObjectId(decoded.id) });
    
    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }

    delete user.password;

    res.json({
      message: "profile fetched",
      user: user
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "invalid token" });
  }
});

// LOGOUT
app.post("/api/auth/logout", async (req, res) => {
  try {
    res.json({ message: "logged out" });
  } catch (error) {
    res.json({ message: "error" });
  }
});

// GET ALL LISTINGS
app.get("/api/listings", async (req, res) => {
  try {
    const search = req.query.search || "";
    let query = {};
    
    if (search) {
      query.location = { $regex: search, $options: "i" };
    }

    const listings = await listingsCollection.find(query).sort({ createdAt: -1 }).toArray();
    
    res.json(listings);
  } catch (error) {
    console.log(error);
    res.json({ message: "error fetching listings" });
  }
});

// GET LISTING BY ID
app.get("/api/listings/:id", async (req, res) => {
  try {
    const { ObjectId } = require("mongodb");
    const listing = await listingsCollection.findOne({ _id: new ObjectId(req.params.id) });
    
    if (!listing) {
      return res.json({ message: "listing not found" });
    }

    const owner = await usersCollection.findOne({ _id: new ObjectId(listing.owner) });
    delete owner.password;
    listing.owner = owner;

    res.json(listing);
  } catch (error) {
    console.log(error);
    res.json({ message: "error" });
  }
});

// GET MY LISTINGS
app.get("/api/listings/my-listings", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    console.log("The token is ", token);
    
    if (!token) {
      return res.status(401).json({ message: "unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { ObjectId } = require("mongodb");
    
    const listings = await listingsCollection.find({ owner: new ObjectId(decoded.id) }).sort({ createdAt: -1 }).toArray();
    
    res.json(listings);
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "error" });
  }
});

// CREATE LISTING
app.post("/api/listings", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ message: "unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { ObjectId } = require("mongodb");

    const listingData = {
      ...req.body,
      owner: new ObjectId(decoded.id),
      createdAt: new Date(),
      updatedAt: new Date(),
      available: true
    };

    const result = await listingsCollection.insertOne(listingData);
    const newListing = await listingsCollection.findOne({ _id: result.insertedId });

    res.json(newListing);
  } catch (error) {
    console.log(error);
    res.json({ message: "error creating listing" });
  }
});

// UPDATE LISTING
app.put("/api/listings/:id", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ message: "unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { ObjectId } = require("mongodb");
    
    const listing = await listingsCollection.findOne({ _id: new ObjectId(req.params.id) });
    
    if (!listing) {
      return res.json({ message: "listing not found" });
    }

    if (listing.owner.toString() !== decoded.id) {
      return res.status(403).json({ message: "not authorized" });
    }

    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };

    await listingsCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData }
    );

    const updated = await listingsCollection.findOne({ _id: new ObjectId(req.params.id) });

    res.json(updated);
  } catch (error) {
    console.log(error);
    res.json({ message: "error updating" });
  }
});

// DELETE LISTING
app.delete("/api/listings/:id", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ message: "unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { ObjectId } = require("mongodb");
    
    const listing = await listingsCollection.findOne({ _id: new ObjectId(req.params.id) });
    
    if (!listing) {
      return res.json({ message: "listing not found" });
    }

    if (listing.owner.toString() !== decoded.id) {
      return res.status(403).json({ message: "not authorized" });
    }

    await listingsCollection.deleteOne({ _id: new ObjectId(req.params.id) });

    res.json({ message: "deleted" });
  } catch (error) {
    console.log(error);
    res.json({ message: "error deleting" });
  }
});

app.listen(PORT, () => console.log("Server running on PORT:", PORT));