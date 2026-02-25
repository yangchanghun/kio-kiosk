import { useEffect, useState } from "react";
import axios from "axios";
import CategoryAddModal from "./modal/CategoryAddModal";
import { useNavigate, useParams } from "react-router-dom";
import SectionUpdateModal from "./modal/SectionUpdateModal";
import MenuAddModal from "./modal/MenuAddModal";
import { ChevronLeft } from "lucide-react";
import MenuUpdateModal from "./modal/MenuUpdateModal";
import CategoryUpdateModal from "./modal/CategoryUpdateModal";

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
  const [selectedSection, setSelectedSection] = useState<number | null>(null);
  const [sectionUpdateModalOpen, setSectionUpdateModalOpen] = useState(false);
  const [selectedSectionName, setSelectedSectionName] = useState<string | null>(
    null,
  );
  const navigate = useNavigate();
  const sectionId = useParams().sectionId;
  console.log("섹션 아이디", sectionId);
  // 카테고리 모달 추가
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const [menus, setMenus] = useState<Menu[]>([]);

  const [categoryName, setCategoryName] = useState("");

  const [menuModalOpen, setMenuModalOpen] = useState(false);

  const [menuUpdateModalOpen, setMenuUpdateModalOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);

  const [categoryUpdateModalOpen, setCategoryUpdateModalOpen] = useState(false);
  const [selectedCategoryObj, setSelectedCategoryObj] =
    useState<Category | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability

    // eslint-disable-next-line react-hooks/immutability
    fetchSection();
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

  const fetchCategories = async (sectionId: number) => {
    const res = await axios.get(
      `${API_URL}/categories/?section_id=${sectionId}`,
    );
    setCategories(res.data);
  };

  const fetchSection = async () => {
    const res = await axios.get(`${API_URL}/section/${sectionId}/`);
    console.log("섹션 상세", res.data);
    setSelectedSection(res.data.id);
    setSelectedSectionName(res.data.name);
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
          <div className="flex">
            <button onClick={() => navigate(-1)}>
              <ChevronLeft color="black" size={36} strokeWidth={3} />
            </button>
            <h1 className="text-2xl font-bold">섹션 상세 관리</h1>
          </div>

          <div className="flex gap-4 items-center">
            <div className="border px-3 py-2 rounded-lg">
              {selectedSectionName || "섹션명"}
            </div>

            <button
              onClick={() => {
                setCategoryModalOpen(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              카테고리 추가
            </button>

            <button
              onClick={() => {
                setSectionUpdateModalOpen(true);
              }}
              className="text-gray-600 hover:underline"
            >
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
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setCategoryName(cat.name);
                    }}
                  >
                    <td className="px-4 py-3">{cat.id}</td>
                    <td className="px-4 py-3">{cat.name}</td>
                    <td
                      className="px-4 py-3 text-right space-x-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCategoryObj(cat);
                          setCategoryUpdateModalOpen(true);
                        }}
                        className="text-blue-600 hover:underline"
                      >
                        수정
                      </button>

                      <button
                        onClick={async (e) => {
                          e.stopPropagation();

                          const ok =
                            window.confirm("카테고리를 삭제하시겠습니까?");
                          if (!ok) return;

                          await axios.delete(
                            `${API_URL}/manage/category/${cat.id}/`,
                          );

                          if (selectedSection) {
                            fetchCategories(selectedSection);
                          }

                          if (selectedCategory === cat.id) {
                            setSelectedCategory(null);
                            setMenus([]);
                            setCategoryName("");
                          }
                        }}
                        className="text-red-500 hover:underline"
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* 🔹 메뉴 영역 */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">메뉴 {categoryName}</h2>
            {selectedCategory && (
              <button
                onClick={() => {
                  setMenuModalOpen(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                메뉴추가
              </button>
            )}
          </div>

          {selectedCategory ? (
            menus.length === 0 ? (
              <p className="text-gray-400">메뉴를 추가해주세요.</p>
            ) : (
              <table className="w-full border  overflow-hidden">
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
                    <tr
                      onClick={() => {
                        setSelectedMenu(menu);
                        setMenuUpdateModalOpen(true);
                      }}
                      key={menu.id}
                      className="border-t hover:bg-gray-50"
                    >
                      <td className="px-4 py-3">{menu.id}</td>
                      <td className="px-4 py-3">{menu.name}</td>
                      <td className="px-4 py-3">{menu.price}원</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={async (e) => {
                            e.stopPropagation(); // 🔥 수정모달 뜨는거 막기

                            const ok =
                              window.confirm("메뉴를 삭제하시겠습니까?");
                            if (!ok) return;

                            await axios.delete(
                              `${API_URL}/manage/menu/${menu.id}/`,
                            );

                            if (selectedCategory) {
                              fetchMenus(selectedCategory); // 🔥 삭제 후 새로고침
                            }
                          }}
                          className="text-red-500"
                        >
                          삭제
                        </button>
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
      {categoryModalOpen && selectedSection && (
        <CategoryAddModal
          sectionId={selectedSection}
          onClose={() => setCategoryModalOpen(false)}
          onSuccess={() => fetchCategories(selectedSection)} // ✅ 여기 핵심
        />
      )}
      {sectionUpdateModalOpen && selectedSection && selectedSectionName && (
        <SectionUpdateModal
          sectionId={selectedSection}
          currentName={selectedSectionName}
          onClose={() => setSectionUpdateModalOpen(false)}
          onSuccess={(newName) => {
            setSelectedSectionName(newName);
          }}
        />
      )}
      {menuModalOpen && selectedCategory && (
        <MenuAddModal
          categoryId={selectedCategory}
          onClose={() => setMenuModalOpen(false)}
          onSuccess={() => fetchMenus(selectedCategory)} // 🔥 바로 반영
        />
      )}
      {menuUpdateModalOpen && selectedMenu && selectedCategory && (
        <MenuUpdateModal
          menu={selectedMenu}
          onClose={() => {
            setMenuUpdateModalOpen(false);
            setSelectedMenu(null);
          }}
          onSuccess={() => fetchMenus(selectedCategory)}
        />
      )}
      {categoryUpdateModalOpen && selectedCategoryObj && selectedSection && (
        <CategoryUpdateModal
          category={selectedCategoryObj}
          onClose={() => {
            setCategoryUpdateModalOpen(false);
            setSelectedCategoryObj(null);
          }}
          onSuccess={() => {
            fetchCategories(selectedSection);
          }}
        />
      )}
    </div>
  );
}
