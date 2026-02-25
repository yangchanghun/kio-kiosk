import { useEffect, useState } from "react";
import axios from "axios";

export interface Category {
  id: number;
  name: string;
  menus: Menu[]; // 🔥 이거 반드시 추가
}

interface Menu {
  id: number;
  name: string;
  price: number;
  image: string | null;
  category_id: number;
}

interface SectionDetail {
  id: number;
  name: string;
  categories: Category[];
  menus: Menu[];
}

const API_URL = "https://smartkio.kioedu.co.kr/api/kioedu";

export function useSectionDetail(sectionId: string | undefined) {
  const [data, setData] = useState<SectionDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sectionId) return;

    const fetchData = async () => {
      setLoading(true);
      const res = await axios.get(`${API_URL}/section/${sectionId}/`);
      setData(res.data);
      setLoading(false);
    };

    fetchData();
  }, [sectionId]);

  return { data, loading };
}
