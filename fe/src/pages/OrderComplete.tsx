import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

type PaymentStep = "summary" | "card" | "done";

const OrderComplete = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cart: CartItem[] = location.state?.cart ?? [];
  const totalPrice = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const totalCount = cart.reduce((s, i) => s + i.quantity, 0);

  const [step, setStep] = useState<PaymentStep>("summary");
  const [countdown, setCountdown] = useState(10);
  const [returnCountdown, setReturnCountdown] = useState(5);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const returnRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 카드 꽂기 → 10초 카운트다운 후 결제 완료
  useEffect(() => {
    if (step !== "card") return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCountdown(10);
    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setStep("done");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current!);
  }, [step]);

  // 결제 완료 → 5초 후 처음으로
  // useEffect(() => {
  //   if (step !== "done") return;
  //   // eslint-disable-next-line react-hooks/set-state-in-effect
  //   setReturnCountdown(5);
  //   returnRef.current = setInterval(() => {
  //     setReturnCountdown((prev) => {
  //       if (prev <= 1) {
  //         clearInterval(returnRef.current!);
  //         navigate("/");
  //         return 0;
  //       }
  //       return prev - 1;
  //     });
  //   }, 1000);
  //   return () => clearInterval(returnRef.current!);
  // }, [step, navigate]);

  useEffect(() => {
    if (step !== "done") return;

    // ✅ 영수증 출력
    if (window.AndroidBridge?.printReceipt) {
      try {
        window.AndroidBridge.printReceipt(JSON.stringify(cart));
      } catch (e) {
        console.log("프린트 실패:", e);
      }
    } else {
      console.log("AndroidBridge 없음 (웹 테스트 중)");
    }

    // 🔽 기존 코드 유지
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReturnCountdown(5);

    returnRef.current = setInterval(() => {
      setReturnCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(returnRef.current!);
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(returnRef.current!);
  }, [step, navigate, cart]);

  const handleCancelCard = () => {
    clearInterval(intervalRef.current!);
    setStep("summary");
  };

  // ── 주문 요약 화면 ──────────────────────────────────────
  if (step === "summary") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-8 px-6">
        <div className="text-center">
          <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <path
                d="M10 25l10 10L38 14"
                stroke="white"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-black text-foreground">주문 완료!</h1>
          <p className="text-muted-foreground mt-2 font-semibold">
            주문이 정상적으로 접수되었습니다.
          </p>
        </div>

        {/* 주문 내역 */}
        {cart.length > 0 && (
          <div className="bg-card rounded-2xl p-5 w-full max-w-sm shadow-md">
            <p className="font-black text-card-foreground mb-3">주문 내역</p>
            <div className="flex flex-col gap-2">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between text-sm text-card-foreground"
                >
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-bold">
                    {(item.price * item.quantity).toLocaleString()}원
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-border mt-3 pt-3 flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                총 {totalCount}개
              </span>
              <span className="font-black text-lg text-foreground">
                {totalPrice.toLocaleString()}원
              </span>
            </div>
          </div>
        )}

        <button
          onClick={() => setStep("card")}
          className="w-full max-w-sm py-5 rounded-full bg-primary text-primary-foreground font-black text-xl shadow-md"
        >
          구매하기
        </button>
      </div>
    );
  }

  // ── 카드 꽂기 화면 ──────────────────────────────────────
  if (step === "card") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-8 px-6">
        <div className="bg-card rounded-3xl p-10 w-full max-w-sm shadow-2xl flex flex-col items-center gap-6">
          {/* 카드 아이콘 애니메이션 */}
          <div className="relative flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-accent/20 flex items-center justify-center animate-pulse">
              <div className="w-24 h-24 rounded-full bg-accent/40 flex items-center justify-center">
                <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                  <rect
                    x="4"
                    y="14"
                    width="48"
                    height="32"
                    rx="5"
                    stroke="hsl(var(--accent))"
                    strokeWidth="3"
                  />
                  <rect
                    x="4"
                    y="22"
                    width="48"
                    height="8"
                    fill="hsl(var(--accent))"
                    opacity="0.4"
                  />
                  <rect
                    x="10"
                    y="36"
                    width="14"
                    height="4"
                    rx="2"
                    fill="hsl(var(--accent))"
                  />
                  {/* 삽입 화살표 */}
                  <path
                    d="M42 36v8M38 40l4 4 4-4"
                    stroke="hsl(var(--primary))"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-2xl font-black text-card-foreground">
              카드를 꽂아주세요
            </p>
            <p className="text-muted-foreground mt-1 font-semibold">
              결제를 진행합니다
            </p>
          </div>

          {/* 결제 금액 */}
          <div className="bg-background rounded-2xl px-8 py-4 w-full text-center">
            <p className="text-sm text-muted-foreground mb-1">결제 금액</p>
            <p className="text-3xl font-black text-foreground">
              {totalPrice.toLocaleString()}원
            </p>
          </div>

          {/* 카운트다운 바 */}
          <div className="w-full">
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>결제 처리 중...</span>
              <span>{countdown}초</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-1000"
                style={{ width: `${((10 - countdown) / 10) * 100}%` }}
              />
            </div>
          </div>

          <button
            onClick={handleCancelCard}
            className="w-full py-4 rounded-full border-2 border-primary text-primary font-black text-lg"
          >
            취소
          </button>
        </div>
      </div>
    );
  }

  // ── 결제 완료 화면 ──────────────────────────────────────
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 px-6">
      <div className="text-center">
        <div className="w-28 h-28 rounded-full bg-accent flex items-center justify-center mx-auto mb-6 shadow-lg">
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
            <path
              d="M14 29l11 11L42 18"
              stroke="white"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1 className="text-4xl font-black text-foreground">결제 완료!</h1>
        <p className="text-muted-foreground mt-2 font-semibold">
          이용해 주셔서 감사합니다 😊
        </p>
      </div>

      <div className="bg-card rounded-2xl px-8 py-5 text-center shadow-md">
        <p className="text-sm text-muted-foreground mb-1">결제 금액</p>
        <p className="text-3xl font-black text-foreground">
          {totalPrice.toLocaleString()}원
        </p>
      </div>

      <div className="text-center">
        <p className="text-muted-foreground font-semibold">
          <span className="text-foreground font-black text-xl">
            {returnCountdown}초
          </span>{" "}
          후 처음으로 돌아갑니다
        </p>
        <div className="w-48 h-2 bg-muted rounded-full overflow-hidden mx-auto mt-3">
          <div
            className="h-full bg-accent rounded-full transition-all duration-1000"
            style={{ width: `${((5 - returnCountdown) / 5) * 100}%` }}
          />
        </div>
      </div>

      <button
        onClick={() => navigate("/")}
        className="px-10 py-4 rounded-full border-2 border-primary text-primary font-black text-lg"
      >
        지금 돌아가기
      </button>
    </div>
  );
};

export default OrderComplete;
