import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CategoryTabs from "../components/CategoryTabs";
import MenuCard from "../components/MenuCard";
import QuantityModal from "../components/QuantityModal";
// import { ChevronLeft } from "lucide-react";
import { useSectionDetail } from "@/api/useSectionDetail";
import axios from "axios";
// import { ChevronLeft } from "lucide-react";

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
interface Product {
  id: number;
  name: string;
  price: number;
  barcode_number: string;
}
export default function TestButcherPage() {
  const navigate = useNavigate();
  const id = "6";
  const location = useLocation();
  const imgSrc = location.state?.imgSrc || "";
  const { data, loading } = useSectionDetail(id);
  // const [debugScan, setDebugScan] = useState("");
  // 여기@@@
  const [products, setProducts] = useState<Product[]>([]);
  const [inputValue, setInputValue] = useState(""); // 스캔 데이터를 담을 state
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [cart, setCart] = useState<CartItem[]>(location.state?.cart ?? []);
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
  const [modalQty, setModalQty] = useState(1);
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const lastScannedRef = useRef<{ barcode: string; time: number }>({
    barcode: "",
    time: 0,
  });

  // const [debugScan, setDebugScan] = useState("");

  // 여기@@@
  useEffect(() => {
    axios.get(`https://smartkio.kioedu.co.kr/api/kioedu/menus`).then((res) => {
      // API 구조에 맞춰 product 배열 설정
      console.log(res.data);
      setProducts(res.data || []);
    });
  }, []);

  const onDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const raw = inputValue.trim();
      // console.log(products);
      // console.log(raw);
      if (!raw) return;

      const now = Date.now();
      // 동일한 바코드가 500ms(0.5초) 이내에 다시 들어오면 무시
      if (
        raw === lastScannedRef.current.barcode &&
        now - lastScannedRef.current.time < 500
      ) {
        console.log("중복 스캔 차단됨:", raw);
        setInputValue(""); // 입력창만 비우고 리턴
        return;
      }

      lastScannedRef.current = { barcode: raw, time: now };

      // 한글 입력 방지 체크
      if (/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(raw)) {
        setInputValue("");
        alert("키보드 상태를 영문으로 변경해주세요.");
        return;
      }

      let scannedBarcode = "";

      // [파싱 로직] JSON 인지 일반 숫자인지 확인
      try {
        const parsed = JSON.parse(raw);
        scannedBarcode = parsed.barcode_number
          ? parsed.barcode_number.toString()
          : raw;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        // JSON이 아니면 정규식으로 숫자만 추출 시도하거나 전체를 바코드로 인식
        const match = raw.match(/barcode_number[:"]*([0-9]+)/);
        scannedBarcode = match ? match[1] : raw;
      }
      // [장바구니 추가 로직]
      const matched = products.find((p) => {
        // console.log("매칭 시도:", p.barcode_number, scannedBarcode);
        // 결과값을 명시적으로 return 해줘야 합니다.
        return String(p.barcode_number) === String(scannedBarcode);
      });

      if (matched) {
        setCart((prevCart) => {
          const exist = prevCart.find((item) => item.id === matched.id);
          if (exist) {
            return prevCart.map((item) =>
              item.id === matched.id
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            );
          }
          return [
            ...prevCart,
            {
              id: matched.id,
              name: matched.name,
              price: matched.price,
              quantity: 1,
            },
          ];
        });
        // setDebugScan(`성공: ${matched.name}`);
      } else {
        // setDebugScan(`실패: ${scannedBarcode}`);
        alert(`상품 정보가 없습니다. (${scannedBarcode})`);
      }

      setInputValue(""); // 입력창 초기화
    }
  };

  // 여기

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
    navigate("/test/order-complete", {
      state: { cart, sectionId: id, sectionName: data.name, imgSrc: imgSrc },
    });
  };
  // const sectionColors: Record<string, string> = {
  //   아하정육점: "#D71920",
  //   경기상회: "#396556",
  //   경기바다수산: "#3DB8CD",
  // };
  // const bgColor = sectionColors[data.name] ?? "#FFCC00";
  const bgColor = "white";
  // 아하정육점이면 #D71920
  // 경기상회이면 #39656
  // 경기수산이면 #3DB8CD

  console.log(data);

  return (
    <div
      className={`min-h-screen flex flex-col pb-28`}
      style={{ backgroundColor: bgColor }}
    >
      <input
        ref={hiddenInputRef}
        type="text"
        value={inputValue}
        onChange={onDataChange}
        onKeyDown={onKeyDown}
        inputMode="none" // 소프트 키보드 방지
        autoFocus
        className="absolute opacity-0 pointer-events-none"
        onBlur={() => setTimeout(() => hiddenInputRef.current?.focus(), 100)}
      />
      {/* Header */}
      {/* <div
        onClick={() => navigate("/", { state: { cart } })}
        style={{ WebkitTapHighlightColor: "transparent" }}
        className="absolute top-4 left-4 z-50 
             bg-transparent border-0 p-0 
             focus:outline-none active:bg-transparent"
      >
        <img src="/back.svg" className="w-16 h-16" />
      </div> */}

      <header className="flex justify-center">
        {/* <h1 className="text-4xl text-white">{data.name}</h1> */}
        <div
          style={{ margin: "3px" }}
          className="
          w-[250px]
           bg-white
                rounded-3xl
                flex
                justify-center
                items-center
                cursor-pointer
                transition
                duration-200
                hover:scale-105"
        >
          {imgSrc && (
            <img
              src={`https://smartkio.kioedu.co.kr${imgSrc}`}
              alt="Section"
              className="w-46 h-46 object-contain"
            />
          )}
        </div>
      </header>

      {/* Category Tabs */}
      <div className="px-2 pb-4">
        <CategoryTabs
          categories={data.categories}
          activeId={activeCategory}
          onSelect={setActiveCategory}
        />
      </div>
      {/* <div className="text-red-500 font-mono text-center mb-4">
        스캔 상태: {debugScan || "대기 중..."}
      </div> */}
      {/* Menu Grid */}
      {/* Menu Grid */}
      <main className="flex-1 px-4 pb-4">
        <div className="flex flex-wrap -mx-2">
          {menus.map((item) => (
            <div
              key={item.id}
              className="w-1/2 px-2 mb-4 cursor-pointer"
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
      {/* <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg px-4 py-4 flex">
        <button
          onClick={cancelOrder}
          className="flex flex-1 text-xl items-center justify-center py-4 rounded-full border-2 border-red-500 text-red-500 font-bold mr-3"
        >
          <img src="/canclecart.svg" className="w-16 h-16 mr-2" />
          주문취소
        </button>

        <button
          onClick={completeOrder}
          disabled={totalCount === 0}
          className="flex flex-1 items-center justify-center py-4 rounded-full border-2 border-black text-xl
             bg-white text-black font-bold 
             relative"
        >
          <img src="/cart.svg" className="w-16 h-16 mr-2" />
          <span>장바구니 보기</span>

          {totalCount > 0 && (
            <span
              className="absolute -top-2 -right-1 
                     bg-yellow-400 text-black text-xs font-bold 
                     rounded-full w-6 h-6 
                     flex items-center justify-center"
            >
              {totalCount}
            </span>
          )}
        </button>
      </div> */}

      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg px-4 py-4 flex items-center">
        {/* 🔙 뒤로가기 박스 */}
        <div
          onClick={() => navigate("/", { state: { cart } })}
          className="
          
      bg-white
      rounded-lg

      shadow-sm
      flex items-center justify-center
      mr-8
      cursor-pointer
      active:scale-95
    "
          style={{ WebkitTapHighlightColor: "transparent" }}
        >
          <img src="/back.svg" className="w-24 h-24" />
        </div>

        {/* 주문취소 */}
        <button
          onClick={cancelOrder}
          className="flex flex-1 text-xl items-center justify-center py-4 rounded-full border-2 border-red-500 text-red-500 font-bold mr-3"
        >
          <img src="/canclecart.svg" className="w-16 h-16 mr-2" />
          장바구니 비우기
        </button>

        {/* 장바구니 */}
        <button
          onClick={completeOrder}
          disabled={totalCount === 0}
          className="flex flex-1 items-center justify-center py-4 rounded-full border-2 border-black text-xl bg-white text-black font-bold relative"
        >
          <img src="/cart.svg" className="w-16 h-16 mr-2" />
          <span>장바구니 보기</span>

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
