interface MenuCardProps {
  name: string;
  price: number;
  image?: string;
  count?: number;
}

const MenuCard = ({ name, price, image, count }: MenuCardProps) => {
  return (
    <div
      className="
        bg-white
        rounded-2xl
        border border-gray-200
        shadow-md
        transition-all duration-200
        active:scale-[0.98]
        relative
      "
    >
      {count !== undefined && count > 0 && (
        <span className="absolute top-3 right-3 z-10 bg-black text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow">
          {count}
        </span>
      )}

      <div className="w-full h-40 bg-white flex items-center justify-center overflow-hidden rounded-t-2xl">
        {image ? (
          <img
            src={image}
            alt={name}
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <div className="w-full h-full bg-gray-100" />
        )}
      </div>

      <div className="p-4 text-center">
        <p className="text-xl font-semibold text-black">{name}</p>
        <p className="text-lg text-gray-500 mt-1">{price.toLocaleString()}원</p>
      </div>
    </div>
  );
};
export default MenuCard;
