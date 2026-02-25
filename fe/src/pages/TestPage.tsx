import { useEffect, useState } from "react";

export default function App() {
  const [bridgeReady, setBridgeReady] = useState(false);

  useEffect(() => {
    // Android가 호출할 함수
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).onAndroidReady = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((window as any).AndroidBridge) {
        setBridgeReady(true);
      }
    };
  }, []);

  const print = () => {
    if (!bridgeReady) {
      alert("Bridge not ready");
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).AndroidBridge.printReceipt("test");
  };

  return (
    <div>
      <h1>{bridgeReady ? "Bridge Ready ✅" : "Waiting..."}</h1>
      <button onClick={print}>출력</button>
    </div>
  );
}
