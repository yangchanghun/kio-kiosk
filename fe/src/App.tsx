import { useLocation, useNavigate } from "react-router-dom";
import { useSections } from "./api/useSections";
import { useRef, useState } from "react";
interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
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
      <div style={{ left: "60px" }} className="fixed  bottom-24 z-20">
        <div className="bg-white rounded-2xl border border-gray/50 shadow-2xl flex flex-col items-center py-6 px-4 w-[110px]">
          {/* 장바구니 */}
          <button
            onClick={completeOrder}
            disabled={totalCount === 0}
            style={{ WebkitTapHighlightColor: "transparent" }}
            className="flex flex-col items-center text-sm font-bold relative mb-6
             disabled:opacity-40
             bg-transparent border-0 p-0
             focus:outline-none active:bg-transparent"
          >
            <img src="/cart.svg" className="w-10 h-10 mb-2" />
            <span className="h-5 flex items-center">장바구니</span>

            {totalCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {totalCount}
              </span>
            )}
          </button>

          {/* 취소 */}
          <button
            onClick={cancelOrder}
            style={{ WebkitTapHighlightColor: "transparent" }}
            className="flex flex-col items-center text-sm font-bold text-red-600
             bg-transparent border-0 p-0
             focus:outline-none active:bg-transparent"
          >
            <img src="/canclecart.svg" className="w-10 h-10 mb-2" />
            <span className="h-5 flex items-center">취소</span>
          </button>
        </div>
      </div>

      {/* 🔻 오른쪽 하단 로고 */}
      <div className="pb-8 text-sm text-gray-500 relative z-10">© kioedu</div>
    </div>
    // </div>
  );
}
