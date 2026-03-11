import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

// Helper to fix image URLs
export const fixImageUrl = (imageUrl) => {
  if (!imageUrl) return "https://via.placeholder.com/400?text=No+Image";
  if (imageUrl.startsWith("http")) return imageUrl;
  if (imageUrl.startsWith("/uploads")) {
    return `http://localhost:5000${imageUrl}`;
  }
  return `http://localhost:5000/uploads/${imageUrl}`;
};

// Add interceptor to fix image URLs in responses
API.interceptors.response.use((response) => {
  // Only process if data.data is an array
  if (response.data?.data && Array.isArray(response.data.data)) {
    response.data.data = response.data.data.map((item) => ({
      ...item,
      image: fixImageUrl(item.image),
    }));
  }
  return response;
});

export default API;
