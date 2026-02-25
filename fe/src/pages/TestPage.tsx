import { useEffect, useState } from "react";

export default function TestPage() {
  const [bridgeStatus, setBridgeStatus] = useState("checking...");

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).AndroidBridge) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBridgeStatus("Bridge exists ✅");
    } else {
      setBridgeStatus("Bridge NOT found ❌");
    }
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((window as any).AndroidBridge) {
        setBridgeStatus("Bridge Ready ✅");
        clearInterval(interval);
      }
    }, 300); // 0.3초마다 체크

    return () => clearInterval(interval);
  }, []);
  return (
    <div>
      <h1>테스트 페이지입니다.</h1>
      <h1>오류확인 : {bridgeStatus}</h1>
    </div>
  );
}
