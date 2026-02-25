import { useState } from "react";
import axios from "axios";

interface Props {
  sectionId: number;
  onClose: () => void;
}

const API_URL = "https://smartkio.kioedu.co.kr/api/kioedu";

export default function CategoryAddModal({ sectionId, onClose }: Props) {
  const [name, setName] = useState("");
  console.log("열림");
  console.log(sectionId);
  const handleCreate = async () => {
    if (!name.trim()) return;

    await axios.post(`${API_URL}/register/category/`, {
      section: sectionId,
      name,
    });

    setName("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[400px] rounded-xl p-6 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">카테고리 추가</h2>

        <input
          type="text"
          placeholder="카테고리명 입력"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <div className="flex justify-end gap-4">
          <button onClick={onClose} className="text-gray-500">
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
  );
}
