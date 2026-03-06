import { useEffect, useState } from "react";

export default function DebugPage() {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev, msg]);
  };

  useEffect(() => {
    // Android에서 로그 보내는 함수
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).receiveAndroidLog = (msg: string) => {
      addLog("[ANDROID] " + msg);
    };
  }, []);

  const checkBridge = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).AndroidBridge) {
      addLog("AndroidBridge 존재");
    } else {
      addLog("AndroidBridge 없음");
    }
  };

  const testPrint = () => {
    addLog("TEST PRINT 요청");

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = (window as any).AndroidBridge.printTest();

      addLog("결과: " + result);
    } catch (e) {
      addLog("에러: " + e);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-6">디버그 페이지</h1>

      <div className="space-x-4 mb-6">
        <button
          onClick={checkBridge}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          AndroidBridge 확인
        </button>

        <button
          onClick={testPrint}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          프린트 테스트
        </button>
      </div>

      <div className="bg-black text-green-400 p-4 rounded h-80 overflow-auto text-sm">
        {logs.map((log, i) => (
          <div key={i}>{log}</div>
        ))}
      </div>
    </div>
  );
}
