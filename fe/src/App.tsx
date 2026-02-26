import { useNavigate } from "react-router-dom";
import { useSections } from "./api/useSections";
import { useRef } from "react";

export default function MainPage() {
  const navigate = useNavigate();
  const { sections, loading, error } = useSections();

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
          src="/titleicon.png"
          alt="title"
          className="w-full max-w-[320px] h-auto object-contain"
        />
      </div>

      {/* 🔹 버튼 영역 */}
      <div className="flex-1 flex flex-col justify-center items-center w-full relative z-10">
        <div className="flex flex-col w-full max-w-[360px] px-6">
          {sections.map((s, index) => (
            <div
              key={s.id}
              onClick={() => navigate(`/section/${s.id}`)}
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
      {/* 🔻 오른쪽 하단 로고 */}

      <div className="pb-8 text-sm text-gray-500 relative z-10">© kioedu</div>
    </div>
    // </div>
  );
}
