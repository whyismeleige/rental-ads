import { apiClient } from "./api-client";

export const listingApi = {
  getAll: (search = "") => apiClient.get(`/listings?search=${search}`),
  getById: (id) => apiClient.get(`/listings/${id}`),
  getMyListings: () => apiClient.get("/listings/my-listings"),
  create: (data) => apiClient.post("/listings", data),
  update: (id, data) => apiClient.put(`/listings/${id}`, data),
  delete: (id) => apiClient.delete(`/listings/${id}`),
};
