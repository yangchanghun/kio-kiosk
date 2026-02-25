import axios from "axios";

const API_BASE_URL = "https://your-api-server.com/api"; // 실제 백엔드 주소

export const fetchCategories = async () => {
  const response = await axios.get(`${API_BASE_URL}/categories`);
  return response.data; // [{ id: "korean", label: "한식" }, ...]
};

export const fetchMenuItems = async (categoryId: string) => {
  const response = await axios.get(
    `${API_BASE_URL}/products?category=${categoryId}`,
  );
  return response.data; // [{ id: "k1", name: "삼겹살", price: 1000, img: "..." }, ...]
};
