import { useEffect, useState } from "react";
import axios from "axios";

export interface Section {
  id: number;
  name: string;
  image: string | null;
}

const API_URL = "https://smartkio.kioedu.co.kr/api/kioedu";

export function useSections() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSections = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/sections/`);
      setSections(res.data);
      setError(null);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    } catch (err: any) {
      setError("섹션을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  return {
    sections,
    loading,
    error,
    refetch: fetchSections,
  };
}
