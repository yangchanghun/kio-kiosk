interface MenuCardProps {
  name: string;
  price: number;
  image?: string;
  count?: number;
}

const MenuCard = ({ name, price, image, count }: MenuCardProps) => {
  return (
    <div className="bg-card rounded-xl overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform duration-200 shadow-sm relative">
      {count !== undefined && count > 0 && (
        <span className="absolute top-2 right-2 z-10 bg-accent text-accent-foreground text-xs font-black rounded-full w-6 h-6 flex items-center justify-center shadow">
          {count}
        </span>
      )}
      <div className="aspect-square bg-[hsl(var(--placeholder))] flex items-center justify-center overflow-hidden">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-[hsl(var(--placeholder))]" />
        )}
      </div>
      <div className="p-3 text-center">
        <p className="text-sm font-semibold text-card-foreground">{name}</p>
        <p className="text-sm text-muted-foreground mt-0.5">{price}</p>
      </div>
    </div>
  );
};

export default MenuCard;
