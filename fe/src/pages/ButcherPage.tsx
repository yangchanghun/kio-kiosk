import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import CategoryTabs from "../components/CategoryTabs";
import MenuCard from "../components/MenuCard";
import QuantityModal from "../components/QuantityModal";
import { ChevronLeft } from "lucide-react";
import { useSectionDetail } from "@/api/useSectionDetail";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface SelectedItem {
  id: number;
  name: string;
  price: number;
}

export default function ButcherPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const { data, loading } = useSectionDetail(id);

  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [cart, setCart] = useState<CartItem[]>(location.state?.cart ?? []);
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
  const [modalQty, setModalQty] = useState(1);

  // 🔥 첫 카테고리 자동 선택 (Hook은 항상 return 위에!)
  useEffect(() => {
    if (data?.categories.length && activeCategory === null) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveCategory(data.categories[0].id);
    }
  }, [data]);

  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        로딩중...
      </div>
    );
  }

  // 🔥 현재 선택된 카테고리 찾기
  const activeCategoryData = data.categories.find(
    (c) => c.id === activeCategory,
  );

  // 🔥 해당 카테고리 메뉴
  const menus = activeCategoryData?.menus ?? [];

  const totalCount = cart.reduce((s, i) => s + i.quantity, 0);

  const openModal = (item: SelectedItem) => {
    setSelectedItem(item);
    setModalQty(1);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setModalQty(1);
  };

  const addToCart = () => {
    if (!selectedItem) return;

    setCart((prev) => {
      const existing = prev.find((c) => c.id === selectedItem.id);

      if (existing) {
        return prev.map((c) =>
          c.id === selectedItem.id
            ? { ...c, quantity: c.quantity + modalQty }
            : c,
        );
      }

      return [...prev, { ...selectedItem, quantity: modalQty }];
    });

    closeModal();
  };

  const cancelOrder = () => setCart([]);

  const completeOrder = () => {
    navigate("/order-complete", { state: { cart, sectionId: id } });
  };
  const bgColor = id === "6" ? "#D71920" : "#FFCC00";
  console.log(bgColor);
  return (
    <div
      className={`min-h-screen flex flex-col pb-28`}
      style={{ backgroundColor: bgColor }}
    >
      {/* Header */}
      <button className="fixed top-4 left-4 z-50" onClick={() => navigate("/")}>
        <ChevronLeft color="white" size={36} strokeWidth={3} />
      </button>

      <header className="pt-10 pb-4 flex justify-center">
        <h1 className="text-4xl text-white">{data.name}</h1>
      </header>

      {/* Category Tabs */}
      <div className="px-2 pb-4">
        <CategoryTabs
          categories={data.categories}
          activeId={activeCategory}
          onSelect={setActiveCategory}
        />
      </div>

      {/* Menu Grid */}
      {/* Menu Grid */}
      <main className="flex-1 px-4 pb-4">
        <div className="grid grid-cols-2">
          {menus.map((item) => (
            <div
              key={item.id}
              className="cursor-pointer mb-3 pr-3"
              onClick={() =>
                openModal({
                  id: item.id,
                  name: item.name,
                  price: item.price,
                })
              }
            >
              <MenuCard
                name={item.name}
                price={item.price}
                image={
                  item.image
                    ? `https://smartkio.kioedu.co.kr${item.image}`
                    : undefined
                }
                count={cart.find((c) => c.id === item.id)?.quantity}
              />
            </div>
          ))}
        </div>
      </main>
      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg px-4 py-4 flex">
        <button
          onClick={cancelOrder}
          className="flex-1 py-4 rounded-full border-2 border-red-500 text-red-500 font-bold mr-3"
        >
          주문취소
        </button>

        <button
          onClick={completeOrder}
          disabled={totalCount === 0}
          className="flex-1 py-4 rounded-full bg-black text-white font-bold disabled:opacity-40 relative"
        >
          장바구니 보기
          {totalCount > 0 && (
            <span className="absolute -top-2 -right-1 bg-yellow-400 text-black text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
              {totalCount}
            </span>
          )}
        </button>
      </div>

      {/* Quantity Modal */}
      {selectedItem && (
        <QuantityModal
          name={selectedItem.name}
          price={`${selectedItem.price.toLocaleString()}원`}
          quantity={modalQty}
          onIncrease={() => setModalQty((q) => q + 1)}
          onDecrease={() => setModalQty((q) => Math.max(1, q - 1))}
          onAdd={addToCart}
          onCancel={closeModal}
        />
      )}
    </div>
  );
}
