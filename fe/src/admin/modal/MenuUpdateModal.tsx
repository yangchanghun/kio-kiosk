import { useState } from "react";
import axios from "axios";

interface Props {
  menu: {
    id: number;
    name: string;
    price: number;
  };
  onClose: () => void;
  onSuccess: () => void;
}

const API_URL = "https://smartkio.kioedu.co.kr/api/kioedu";

export default function MenuUpdateModal({ menu, onClose, onSuccess }: Props) {
  const [name, setName] = useState(menu.name);
  const [price, setPrice] = useState<number>(menu.price);
  const [image, setImage] = useState<File | null>(null);

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", String(price));
    if (image) formData.append("image", image);

    try {
      await axios.put(`${API_URL}/manage/menu/${menu.id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onSuccess();
      onClose();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log(err.response?.data);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[400px] rounded-xl p-6 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">메뉴 수정</h2>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mb-4"
        />

        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-full border rounded-lg px-3 py-2 mb-4"
        />

        <input
          type="file"
          onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
          className="mb-4"
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
