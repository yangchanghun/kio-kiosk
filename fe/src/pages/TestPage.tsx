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

  return (
    <div>
      <h1>테스트 페이지입니다.</h1>
      <h1>오류확인 : {bridgeStatus}</h1>
    </div>
  );
}
