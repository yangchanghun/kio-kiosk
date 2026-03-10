import { useLocation, useNavigate } from "react-router-dom";
import { useSections } from "./api/useSections";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}
interface Product {
  id: number;
  name: string;
  price: number;
  barcode_number: string;
}
export default function MainPage() {
  const navigate = useNavigate();
  const { sections, loading, error } = useSections();

  const location = useLocation();

  const [cart, setCart] = useState<CartItem[]>(location.state?.cart ?? []);
  const totalCount = cart.reduce((s, i) => s + i.quantity, 0);

  const cancelOrder = () => setCart([]);

  const completeOrder = () => {
    navigate("/order-complete", {
      state: { cart },
    });
  };
  // 여기요
  const [products, setProducts] = useState<Product[]>([]);
  const [inputValue, setInputValue] = useState(""); // 스캔 데이터를 담을 state
  const lastScannedRef = useRef<{ barcode: string; time: number }>({
    barcode: "",
    time: 0,
  });
  const hiddenInputRef = useRef<HTMLInputElement>(null);
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
      } else {
        alert(`상품 정보가 없습니다. (${scannedBarcode})`);
      }

      setInputValue(""); // 입력창 초기화
    }
  };

  const clickCountRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTitleClick = () => {
    clickCountRef.current += 1;

    if (!timerRef.current) {
      timerRef.current = setTimeout(() => {
        clickCountRef.current = 0;
        timerRef.current = null;
      }, 1500);
    }

    if (clickCountRef.current >= 5) {
      navigate("/admin");
      clickCountRef.current = 0;
      if (timerRef.current) clearTimeout(timerRef.current);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">로딩중...</div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen">{error}</div>
    );

  return (
    <div className="relative min-h-screen flex flex-col items-center bg-gray-100 overflow-hidden">
      {/* 🔥 노란 테두리 SVG */}
      {/* <div className="relative w-full max-w-[1000px] min-h-screen flex flex-col items-center bg-gray-100 overflow-hidden shadow-xl"> */}
      {/* <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 300 700"
          preserveAspectRatio="none"
        >
          <path
            d="M40 680 L40 150 L150 10 L260 150 L260 680"
            fill="none"
            stroke="#F4B400"
            strokeWidth="18"
            strokeLinejoin="round"
          />
        </svg> */}
      <img
        src="/yelloframe.svg"
        alt="frame"
        className="absolute inset-0 w-full h-full object-contain pointer-events-none z-0"
      />
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
      {/* 🔺 타이틀 */}
      {/* <div
          style={{ marginTop: "200px" }}
          className=" pb-10 text-center relative z-10"
        >
          <h1
          onClick={handleTitleClick}
          className="text-6xl font-bold text-red-600 tracking-wider cursor-pointer select-none"
        >
          온마을시장
        </h1>
          <img style={{ width: "100%" }} src="/titleicon.png" />
        </div> */}

      <div className="mt-[180px] pb-10 text-center relative z-10 flex justify-center">
        <img
          onClick={handleTitleClick}
          src="/whitetitle.png"
          alt="title"
          className="w-full max-w-[200px] h-auto object-contain opacity-0"
        />
      </div>
      {/* 🔹 버튼 영역 */}
      <div className="flex-1 flex flex-col justify-center items-center w-full relative z-10">
        <div className="flex flex-col w-full max-w-[360px] px-6">
          {sections.map((s, index) => (
            <div
              key={s.id}
              onClick={() =>
                navigate(`/section/${s.id}`, {
                  state: { imgSrc: s.image, cart: cart },
                })
              }
              className={`
                bg-white
                rounded-3xl
                shadow-lg
                p-6
                flex
                justify-center
                items-center
                cursor-pointer
                transition
                duration-200
                hover:scale-105
                ${index !== 0 ? "mt-10" : ""}
              `}
            >
              {s.image && (
                <img
                  src={`https://smartkio.kioedu.co.kr${s.image}`}
                  alt={s.name}
                  className="w-36 h-36 object-contain"
                />
              )}
            </div>
          ))}
        </div>
      </div>
      {/* 🛒 오른쪽 고정 장바구니 패널 */}
      <div style={{ left: "60px" }} className="fixed  bottom-16 z-20">
        <div className="bg-white rounded-2xl border border-gray/50 shadow-2xl flex flex-col items-center py-6 px-4 w-[110px]">
          {/* 장바구니 */}
          {/* <div
            onClick={() => {
              navigate("/cart");
            }}
            style={{ WebkitTapHighlightColor: "transparent" }}
            className={`flex flex-col items-center text-sm font-bold relative mb-6
              bg-white border-0 p-0
             `}
          >
            <span className="h-5 flex items-center">셀프계산대</span>
            <span className="h-5 flex items-center">체험</span>
          </div> */}
          <div
            role="button"
            onClick={() => {
              if (totalCount === 0) return;
              completeOrder();
            }}
            style={{ WebkitTapHighlightColor: "transparent" }}
            className={`flex flex-col items-center text-sm font-bold relative mb-6
              bg-white border-0 p-0
              ${totalCount === 0 ? "opacity-40" : "cursor-pointer"}`}
          >
            <img src="/cart.svg" className="w-10 h-10 mb-2" />
            <span className="h-5 flex items-center">장바구니</span>

            {totalCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {totalCount}
              </span>
            )}
          </div>

          {/* 취소 */}
          <div
            role="button"
            onClick={cancelOrder}
            style={{ WebkitTapHighlightColor: "transparent" }}
            className="bg-white flex flex-col items-center text-sm font-bold text-red-600
             bg-transparent border-0 p-0
             focus:outline-none active:bg-transparent"
          >
            <img src="/canclecart.svg" className="w-10 h-10 mb-2" />
            <span className="h-5 flex items-center">취소</span>
          </div>
        </div>
      </div>

      {/* 🔻 오른쪽 하단 로고 */}
      <div className="pb-8 text-sm text-gray-500 relative z-10">© kioedu</div>
    </div>
    // </div>
  );
}
