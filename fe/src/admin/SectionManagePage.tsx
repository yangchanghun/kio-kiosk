import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Section {
  id: number;
  name: string;
  image: string | null;
}

const API_URL = "https://smartkio.kioedu.co.kr/api/kioedu";

export default function SectionManagePage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchSections();
  }, []);

  const fetchSections = async () => {
    const res = await axios.get(`${API_URL}/sections/`);
    setSections(res.data);
  };

  const handleCreate = async () => {
    const formData = new FormData();
    formData.append("name", name);
    if (image) formData.append("image", image);

    await axios.post(`${API_URL}/register/section/`, formData);
    setModalOpen(false);
    setName("");
    setImage(null);
    fetchSections();
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
    if (!confirmDelete) return;

    await axios.delete(`${API_URL}/manage/section/${id}/`);
    fetchSections();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="bg-white rounded-xl shadow-md p-8">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">섹션 관리</h1>
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            + 섹션 추가
          </button>
        </div>

        {sections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-gray-400">
            <p className="text-lg mb-2">섹션을 추가해주세요.</p>
          </div>
        ) : (
          <div className="overflow-hidden border border-gray-200 ">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-600 text-sm">
                <tr>
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">섹션명</th>
                  <th className="px-6 py-3 text-right">관리</th>
                </tr>
              </thead>
              <tbody>
                {sections.map((section) => (
                  <tr
                    key={section.id}
                    onClick={() => navigate(`/admin/sections/${section.id}`)}
                    className="border-t hover:bg-gray-100 transition cursor-pointer"
                  >
                    <td className="px-6 py-4 text-gray-500">{section.id}</td>
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {section.name}
                    </td>
                    <td
                      className="px-6 py-4 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => handleDelete(section.id)}
                        className="text-red-500 hover:underline"
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 생성 모달 동일 */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-[400px] rounded-xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">섹션 추가</h2>

            <input
              type="text"
              placeholder="섹션명 입력"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <input
              type="file"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="mb-4"
            />

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-500"
              >
                취소
              </button>
              <button
                onClick={handleCreate}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                등록
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
