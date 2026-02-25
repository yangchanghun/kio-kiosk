import { useNavigate } from "react-router-dom";
import { useSections } from "./api/useSections";
import { useRef } from "react";

export default function MainPage() {
  const navigate = useNavigate();
  const { sections, loading, error } = useSections();

  // 🔥 히든 어드민 진입용
  const clickCountRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTitleClick = () => {
    clickCountRef.current += 1;

    // 첫 클릭이면 타이머 시작
    if (!timerRef.current) {
      timerRef.current = setTimeout(() => {
        clickCountRef.current = 0;
        timerRef.current = null;
      }, 1500);
    }

    if (clickCountRef.current >= 5) {
      navigate("/admin");

      clickCountRef.current = 0;

      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
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
    <div className="min-h-screen bg-gray-200 flex flex-col items-center">
      {/* 🔺 상단 타이틀 */}
      <div className="pt-16 pb-10 text-center">
        <h1
          onClick={handleTitleClick}
          className="text-6xl font-bold text-red-600 tracking-wider cursor-pointer select-none"
        >
          온마을시장
        </h1>
      </div>

      {/* 🔹 가운데 버튼 영역 */}
      <div className="flex-1 flex flex-col justify-center items-center w-full">
        <div className="flex flex-col w-full max-w-[380px] px-6">
          {sections.map((s, index) => (
            <div
              key={s.id}
              onClick={() => navigate(`/section/${s.id}`)}
              className={`
                bg-white
                rounded-3xl
                shadow-md
                p-6
                flex
                justify-center
                items-center
                cursor-pointer
                transition
                duration-200
                ${index !== 0 ? "mt-12" : ""}
              `}
            >
              {s.image && (
                <img
                  src={`https://smartkio.kioedu.co.kr${s.image}`}
                  alt={s.name}
                  className="w-40 h-40 object-contain"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="pb-8 text-sm text-gray-500">© kioedu</div>
    </div>
  );
}
