interface QuantityModalProps {
  name: string;
  price: string;
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onAdd: () => void;
  onCancel: () => void;
}

const QuantityModal = ({
  name,
  price,
  quantity,
  onIncrease,
  onDecrease,
  onAdd,
  onCancel,
}: QuantityModalProps) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onCancel}
    >
      <div
        className="bg-card rounded-2xl p-8 w-80 flex flex-col items-center gap-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 상품 정보 */}
        <div className="text-center">
          <p className="text-xl font-black text-card-foreground">{name}</p>
          <p className="text-base text-muted-foreground mt-1">{price}</p>
        </div>

        {/* 수량 조절 */}
        <div className="flex items-center gap-5">
          <button
            onClick={onDecrease}
            disabled={quantity <= 1}
            className="w-12 h-12 rounded-full bg-primary text-primary-foreground text-2xl font-bold flex items-center justify-center disabled:opacity-30 transition-opacity"
          >
            −
          </button>
          <span className="text-3xl font-black text-card-foreground w-10 text-center">
            {quantity}
          </span>
          <button
            onClick={onIncrease}
            className="w-12 h-12 rounded-full bg-primary text-primary-foreground text-2xl font-bold flex items-center justify-center transition-opacity"
          >
            +
          </button>
        </div>

        {/* 버튼 */}
        <div
          style={{
            display: "flex",
            width: "100%",
          }}
        >
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: "12px 0",
              borderRadius: "9999px",
              border: "none",
              background: "white",
              color: "#1d4ed8",
              fontWeight: "bold",
              fontSize: "16px",
              marginRight: "12px", // 👈 gap 대신 이거
            }}
          >
            취소
          </button>

          <button
            onClick={onAdd}
            style={{
              flex: 1,
              padding: "12px 0",
              borderRadius: "9999px",
              border: "none",
              color: "white",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            담기
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuantityModal;
