export default function CardTest() {
  const startCard = () => {
    if (window.CardBridge) {
      window.CardBridge.openCardApp();
    } else {
      alert("Android Bridge 없음");
    }
  };

  return (
    <div>
      <button onClick={startCard}>카드 테스트</button>
    </div>
  );
}
