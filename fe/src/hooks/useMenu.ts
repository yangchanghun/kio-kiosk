import { useState, useEffect } from "react";
import { fetchCategories, fetchMenuItems } from "../api/menuApi";

export function useMenu(activeCategory: string) {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 카테고리 목록 가져오기
    fetchCategories().then(setCategories);
  }, []);

  useEffect(() => {
    // 카테고리 변경 시 아이템 목록 가져오기
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    fetchMenuItems(activeCategory).then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, [activeCategory]);

  return { categories, items, loading };
}
