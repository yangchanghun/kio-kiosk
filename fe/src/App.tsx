import { useNavigate } from "react-router-dom";
import { useSections } from "./api/useSections";

export default function MainPage() {
  const navigate = useNavigate();
  const { sections, loading, error } = useSections();

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
        <h1 className="text-6xl font-bold text-red-600 tracking-wider">
          온마을시장
        </h1>
      </div>

      {/* 🔹 가운데 버튼 영역 (중앙 정렬 핵심) */}
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

      {/* 🔹 하단 로고 */}
      <div className="pb-8 text-sm text-gray-500">© kioedu</div>
    </div>
  );
}
