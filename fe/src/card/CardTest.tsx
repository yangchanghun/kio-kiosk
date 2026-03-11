import { useEffect, useState } from "react";

export default function CardTest() {
  // 테스트용 주문 데이터
  const testCart = [
    { name: "아메리카노", price: 3000, quantity: 2 },
    { name: "카페라떼", price: 4000, quantity: 1 },
  ];

  const [debug, setDebug] = useState("");

  const startCard = () => {
    if (window.CardBridge?.openCardApp) {
      window.CardBridge.openCardApp("5000");
    } else {
      setDebug("없음");
      alert("AndroidBridge 없음 (웹에서 실행 중)");
    }
  };

  // 카드 결제 완료 이벤트
  useEffect(() => {
    window.onCardPaymentComplete = () => {
      console.log("카드 결제 완료");

      if (window.AndroidBridge?.printReceipt) {
        window.AndroidBridge.printReceipt(JSON.stringify(testCart));
      }
    };

    return () => {
      window.onCardPaymentComplete = undefined;
    };
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h2>카드 + 영수증 테스트</h2>
      <h1>디버그:{debug}</h1>
      <button
        onClick={startCard}
        style={{
          padding: "20px 40px",
          fontSize: "20px",
          background: "black",
          color: "white",
          borderRadius: "10px",
        }}
      >
        카드 결제 → 영수증 출력 테스트
      </button>
    </div>
  );
}
