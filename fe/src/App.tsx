import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoryTabs from "./components/CategoryTabs";
import MenuCard from "./components/MenuCard";
import QuantityModal from "./components/QuantityModal";

const categories = [
  { id: "korean", label: "한식" },
  // { id: "chinese", label: "중식" },
  // { id: "snack", label: "분식" },
  // { id: "light", label: "스낵" },
];

const menuItems: Record<string, { id: string; name: string; price: number }[]> =
  {
    korean: [
      { id: "k1", name: "삼겹살", price: 1000 },
      { id: "k2", name: "오겹살", price: 1500 },
      { id: "k3", name: "항정살", price: 2000 },
      // { id: "k4", name: "상품명", price: 2500 },
    ],
    // chinese: [
    //   { id: "c1", name: "상품명", price: "가격" },
    //   { id: "c2", name: "상품명", price: "가격" },
    //   { id: "c3", name: "상품명", price: "가격" },
    // ],
    // snack: [
    //   { id: "s1", name: "상품명", price: "가격" },
    //   { id: "s2", name: "상품명", price: "가격" },
    // ],
    // light: [
    //   { id: "l1", name: "상품명", price: "가격" },
    //   { id: "l2", name: "상품명", price: "가격" },
    //   { id: "l3", name: "상품명", price: "가격" },
    // ],
  };

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface SelectedItem {
  id: string;
  name: string;
  price: number;
}

export default function App() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("korean");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
  const [modalQty, setModalQty] = useState(1);

  const items = menuItems[activeCategory] ?? [];
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

  const cancelOrder = () => {
    setCart([]);
  };

  const completeOrder = () => {
    navigate("/order-complete", { state: { cart } });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pb-28">
      {/* Header */}
      <header className="pt-10 pb-4 flex flex-col items-center gap-1">
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-black tracking-tight text-foreground">
            아하정육점
          </h1>
        </div>
      </header>

      {/* Category Tabs */}
      <div className="px-2 pb-4">
        <CategoryTabs
          categories={categories}
          activeId={activeCategory}
          onSelect={setActiveCategory}
        />
      </div>

      {/* Menu Grid */}
      <main className="flex-1 px-4 pb-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => openModal(item)}
              className="cursor-pointer"
            >
              <MenuCard
                name={item.name}
                price={item.price}
                count={cart.find((c) => c.id === item.id)?.quantity}
              />
            </div>
          ))}
        </div>
      </main>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-card shadow-[0_-4px_16px_rgba(0,0,0,0.12)] px-4 py-4 flex gap-3">
        <button
          onClick={cancelOrder}
          className="flex-1 py-4 rounded-full border-2 border-primary text-primary font-black text-lg"
        >
          주문취소
        </button>
        <button
          onClick={completeOrder}
          disabled={totalCount === 0}
          className="flex-1 py-4 rounded-full bg-primary text-primary-foreground font-black text-lg disabled:opacity-40 relative"
        >
          주문완료
          {totalCount > 0 && (
            <span className="absolute -top-2 -right-1 bg-accent text-accent-foreground text-xs font-black rounded-full w-6 h-6 flex items-center justify-center">
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
