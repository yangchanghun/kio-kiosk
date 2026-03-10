interface CardBridge {
  openCardApp: () => void;
}

interface Window {
  CardBridge?: CardBridge;
}
