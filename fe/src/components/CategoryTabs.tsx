import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";

interface Category {
  id: string;
  label: string;
}

interface CategoryTabsProps {
  categories: Category[];
  activeId: string;
  onSelect: (id: string) => void;
}

const CategoryTabs = ({
  categories,
  activeId,
  onSelect,
}: CategoryTabsProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(categories.length > 4);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -160 : 160, behavior: "smooth" });
    setTimeout(checkScroll, 300);
  };

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  return (
    <div className="flex items-center gap-2 px-4">
      <button
        onClick={() => scroll("left")}
        disabled={!canScrollLeft}
        className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-foreground disabled:opacity-30"
      >
        <ChevronLeft size={24} strokeWidth={3} />
      </button>

      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-2 overflow-x-auto scrollbar-hide flex-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-bold border-2 transition-all duration-200 ${
              activeId === cat.id
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-transparent text-foreground border-foreground hover:bg-foreground/10"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <button
        onClick={() => scroll("right")}
        disabled={!canScrollRight}
        className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-foreground disabled:opacity-30"
      >
        <ChevronRight size={24} strokeWidth={3} />
      </button>
    </div>
  );
};

export default CategoryTabs;
