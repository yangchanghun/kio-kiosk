// src/api/adminApi.ts
import axios from "axios";

const API = axios.create({
  baseURL: "https://smartkio.kioedu.co.kr/api", // 맞게 수정
});

export const adminApi = {
  // --- Main ---
  getMainCategories: () => API.get("/main-categories/"),
  createMain: (data: FormData) => API.post("/register/main-category/", data),
  updateMain: (id: number, data: FormData) =>
    API.put(`/manage/main-category/${id}/`, data),
  deleteMain: (id: number) => API.delete(`/manage/main-category/${id}/`),

  // --- Category ---
  getCategories: (mainId?: number) =>
    API.get("/categories/", { params: { main_id: mainId } }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createCategory: (data: any) => API.post("/register/category/", data),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateCategory: (id: number, data: any) =>
    API.put(`/manage/category/${id}/`, data),
  deleteCategory: (id: number) => API.delete(`/manage/category/${id}/`),

  // --- Menu ---
  getMenus: (catId?: number) =>
    API.get("/menus/", { params: { cat_id: catId } }),
  createMenu: (data: FormData) => API.post("/register/menu/", data),
  updateMenu: (id: number, data: FormData) =>
    API.put(`/manage/menu/${id}/`, data),
  deleteMenu: (id: number) => API.delete(`/manage/menu/${id}/`),
};
