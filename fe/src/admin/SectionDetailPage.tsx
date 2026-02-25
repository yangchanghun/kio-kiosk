import { useEffect, useState } from "react";
import axios from "axios";
import CategoryAddModal from "./modal/CategoryAddModal";
import { useParams } from "react-router-dom";

interface Section {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
  section_id: number;
}

interface Menu {
  id: number;
  name: string;
  price: number;
  category_id: number;
}

const API_URL = "https://smartkio.kioedu.co.kr/api/kioedu";

export default function SectionDetailPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSection, setSelectedSection] = useState<number | null>(null);

  const sectionId = useParams().sectionId;
  console.log("섹션 아이디", sectionId);
  // 카테고리 모달 추가
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const [menus, setMenus] = useState<Menu[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchSections();
  }, []);

  useEffect(() => {
    if (selectedSection) {
      // eslint-disable-next-line react-hooks/immutability
      fetchCategories(selectedSection);
    }
  }, [selectedSection]);

  useEffect(() => {
    if (selectedCategory) {
      // eslint-disable-next-line react-hooks/immutability
      fetchMenus(selectedCategory);
    }
  }, [selectedCategory]);

  const fetchSections = async () => {
    const res = await axios.get(`${API_URL}/sections/`);
    setSections(res.data);
  };

  const fetchCategories = async (sectionId: number) => {
    const res = await axios.get(
      `${API_URL}/categories/?section_id=${sectionId}`,
    );
    setCategories(res.data);
  };

  const fetchMenus = async (catId: number) => {
    const res = await axios.get(`${API_URL}/menus/?cat_id=${catId}`);
    setMenus(res.data);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="bg-white rounded-xl shadow-md p-8">
        {/* 🔹 상단 */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">섹션 상세 관리</h1>

          <div className="flex gap-4 items-center">
            <select
              onChange={(e) => setSelectedSection(Number(e.target.value))}
              className="border px-3 py-2 rounded-lg"
            >
              <option value="">섹션 선택</option>
              {sections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => {
                setCategoryModalOpen(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              카테고리 추가
            </button>

            <button className="text-gray-600 hover:underline">
              섹션 정보 수정
            </button>
          </div>
        </div>

        {/* 🔹 카테고리 영역 */}
        <div className="mb-10">
          <h2 className="font-semibold mb-4">카테고리</h2>

          {categories.length === 0 ? (
            <p className="text-gray-400">카테고리를 추가해주세요.</p>
          ) : (
            <table className="w-full border  overflow-hidden">
              <thead className="bg-gray-50 text-sm">
                <tr>
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">카테고리명</th>
                  <th className="px-4 py-2 text-right">관리</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr
                    key={cat.id}
                    className="border-t hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    <td className="px-4 py-3">{cat.id}</td>
                    <td className="px-4 py-3">{cat.name}</td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-red-500">삭제</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* 🔹 메뉴 영역 */}
        <div>
          <h2 className="font-semibold mb-4">메뉴</h2>

          {selectedCategory ? (
            menus.length === 0 ? (
              <p className="text-gray-400">메뉴를 추가해주세요.</p>
            ) : (
              <table className="w-full border rounded-lg overflow-hidden">
                <thead className="bg-gray-50 text-sm">
                  <tr>
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">메뉴명</th>
                    <th className="px-4 py-2 text-left">가격</th>
                    <th className="px-4 py-2 text-right">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {menus.map((menu) => (
                    <tr key={menu.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3">{menu.id}</td>
                      <td className="px-4 py-3">{menu.name}</td>
                      <td className="px-4 py-3">{menu.price}원</td>
                      <td className="px-4 py-3 text-right">
                        <button className="text-red-500">삭제</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          ) : (
            <p className="text-gray-400">카테고리를 선택해주세요.</p>
          )}
        </div>
      </div>
      {categoryModalOpen && (
        <CategoryAddModal
          sectionId={Number(sectionId)}
          onClose={() => setCategoryModalOpen(false)}
        />
      )}
    </div>
  );
}
