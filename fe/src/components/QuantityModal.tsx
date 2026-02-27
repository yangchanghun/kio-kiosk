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
        style={{
          background: "#ffffff", // bg-card (보통 흰색이라 가정)
          borderRadius: "16px", // rounded-2xl
          padding: "32px", // p-8
          width: "320px", // w-80 (80 * 4px = 320px)
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "24px", // gap-6
          boxShadow: "0 25px 50px rgba(0,0,0,0.25)", // shadow-2xl 느낌
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 상품 정보 */}
        <div className="text-center">
          <p className="text-xl font-black text-card-foreground">{name}</p>
          <p className="text-base text-muted-foreground mt-1">{price}</p>
        </div>

        {/* 수량 조절 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <button
            onClick={onDecrease}
            disabled={quantity <= 1}
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "#1d4ed8",
              color: "white",
              fontSize: "24px",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              cursor: quantity <= 1 ? "not-allowed" : "pointer",
              opacity: quantity <= 1 ? 0.3 : 1,
              transition: "opacity 0.2s ease",
            }}
          >
            −
          </button>

          <span
            style={{
              width: "40px",
              textAlign: "center",
              fontSize: "28px",
              fontWeight: 900,
              color: "#111",
            }}
          >
            {quantity}
          </span>

          <button
            onClick={onIncrease}
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "#1d4ed8",
              color: "white",
              fontSize: "24px",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              cursor: "pointer",
              transition: "opacity 0.2s ease",
            }}
          >
            +
          </button>
        </div>
        {/* 버튼 */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            width: "100%",
          }}
        >
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: "12px 0",
              borderRadius: "9999px",
              border: "2px solid #1d4ed8",
              background: "white",
              color: "#1d4ed8",
              fontWeight: "bold",
              fontSize: "16px",
              cursor: "pointer",
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
              background: "#1d4ed8",
              color: "white",
              fontWeight: "bold",
              fontSize: "16px",
              cursor: "pointer",
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
