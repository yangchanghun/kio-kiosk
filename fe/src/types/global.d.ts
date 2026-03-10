export {};

declare global {
  interface Window {
    AndroidBridge?: {
      openCardApp: (amount: string) => void;
      printReceipt?: (data: string) => void;
    };
    onCardPaymentComplete?: () => void;
  }
}
