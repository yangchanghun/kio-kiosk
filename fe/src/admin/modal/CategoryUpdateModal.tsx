import { useState } from "react";
import axios from "axios";

interface Props {
  category: {
    id: number;
    name: string;
  };
  onClose: () => void;
  onSuccess: () => void;
}

const API_URL = "https://smartkio.kioedu.co.kr/api/kioedu";

export default function CategoryUpdateModal({
  category,
  onClose,
  onSuccess,
}: Props) {
  const [name, setName] = useState(category.name);

  const handleUpdate = async () => {
    if (!name.trim()) return;

    try {
      await axios.put(`${API_URL}/manage/category/${category.id}/`, { name });

      onSuccess();
      onClose();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log(err.response?.data);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[350px] rounded-xl p-6 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">카테고리 수정</h2>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mb-4"
        />

        <div className="flex justify-end gap-4">
          <button onClick={onClose} className="text-gray-500">
            취소
          </button>

          <button
            onClick={handleUpdate}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            수정
          </button>
        </div>
      </div>
    </div>
  );
}
