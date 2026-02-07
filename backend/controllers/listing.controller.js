const Listing = require("../models/Listing.model");
const asyncHandler = require("../middleware/asyncHandler");
const { ValidationError, NotFoundError, AuthorizationError } = require("../utils/error.utils");

const createListing = asyncHandler(async (req, res) => {
  const listingData = { ...req.body, owner: req.user._id };
  const listing = await Listing.create(listingData);
  res.status(201).json(listing);
});

const getAllListings = asyncHandler(async (req, res) => {
  const { search } = req.query;
  let query = {};

  if (search) {
    query.location = { $regex: search, $options: "i" };
  }

  const listings = await Listing.find(query).sort({ createdAt: -1 });
  res.status(200).json(listings);
});

const getListingById = asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.id).populate("owner", "name email");
  if (!listing) throw new NotFoundError("Listing not found");
  res.status(200).json(listing);
});

const getMyListings = asyncHandler(async (req, res) => {
  const listings = await Listing.find({ owner: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json(listings);
});

const updateListing = asyncHandler(async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  
  if (!listing) throw new NotFoundError("Listing not found");
  
  if (listing.owner.toString() !== req.user._id.toString()) {
    throw new AuthorizationError("Not authorized to update this listing");
  }

  listing = await Listing.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json(listing);
});

const deleteListing = asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) throw new NotFoundError("Listing not found");

  if (listing.owner.toString() !== req.user._id.toString()) {
    throw new AuthorizationError("Not authorized to delete this listing");
  }

  await listing.deleteOne();
  res.status(200).json({ message: "Listing removed" });
});

module.exports = {
  createListing,
  getAllListings,
  getListingById,
  getMyListings,
  updateListing,
  deleteListing,
};