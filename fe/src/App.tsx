import { useNavigate } from "react-router-dom";

export default function MainPage() {
  const navigate = useNavigate();

  const menus = [
    { title: "아하정육점", path: "/butcher", img: "/icon/butcher.png" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-500 to-gray-800 flex justify-center items-center px-6 py-10">
      <div className="w-full max-w-6xl grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
        {menus.map((menu, index) => (
          <div
            key={index}
            onClick={() => navigate(menu.path)}
            className="bg-gray-100 rounded-3xl p-6 flex flex-col items-center justify-center cursor-pointer 
                       shadow-lg hover:shadow-2xl transform hover:-translate-y-2 
                       transition duration-300 ease-in-out"
          >
            {/* 이미지 영역 */}
            <div className="w-full aspect-square flex items-center justify-center mb-3">
              <img
                src={menu.img}
                alt={menu.title}
                className="w-full h-full object-contain"
              />
            </div>

            {/* 제목 */}
            {/* <p className="text-center font-semibold text-sm md:text-base text-gray-800">
              {menu.title}
            </p> */}
          </div>
        ))}
      </div>
    </div>
  );
}
