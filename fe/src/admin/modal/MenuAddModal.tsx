import { useState } from "react";
import axios from "axios";

interface Props {
  categoryId: number;
  onClose: () => void;
  onSuccess: () => void;
}

const API_URL = "https://smartkio.kioedu.co.kr/api/kioedu";

export default function MenuAddModal({
  categoryId,
  onClose,
  onSuccess,
}: Props) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [image, setImage] = useState<File | null>(null);

  const [barcode, setBarcode] = useState("");

  const handleCreate = async () => {
    if (!name || !price) return;

    const formData = new FormData();
    formData.append("category_id", String(categoryId));
    formData.append("name", name);
    formData.append("price", String(price));
    formData.append("barcode_number", String(barcode)); // 임시 바코드, 실제로는 입력받아야 함
    if (image) formData.append("image", image);

    try {
      await axios.post(`${API_URL}/register/menu/`, formData, {
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
        <h2 className="text-lg font-semibold mb-4">메뉴 추가</h2>

        <input
          type="text"
          placeholder="메뉴명"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mb-4"
        />

        <input
          type="number"
          placeholder="가격"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-full border rounded-lg px-3 py-2 mb-4"
        />
        <input
          type="text"
          placeholder="바코드"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
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
