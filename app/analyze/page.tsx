"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AnalyzePage() {
  const router = useRouter();
  const [phase, setPhase] = useState(0);

  // 🔥 형원님이 사용하던 문구 동일하게 사용
  const messages = [
    "AI 솔로몬이 사건을 읽고 핵심 요소를 파악하는 중입니다...",
    "관련 유사 판례와 논리를 탐색하고 있습니다...",
    "증거·사실관계를 구조화하고 있습니다...",
    "AI 패널들이 각각 의견을 정리하는 중입니다...",
    "최종 결론을 생성하고 있습니다..."
  ];

  // 🔥 20초 후 자동 이동
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/report");
    }, 20000);
    return () => clearTimeout(timer);
  }, [router]);

  // 🔥 4초마다 다음 문구로 전환
  useEffect(() => {
    const timers = messages.map((_, i) =>
      setTimeout(() => setPhase(i), i * 4000)
    );
    return () => timers.forEach((t) => clearTimeout(t));
  }, []);

  // 🔥 광고 로드 (CSR에서만 실행)
  useEffect(() => {
    try {
      const script = document.createElement("script");
      script.async = true;
      script.src =
        "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
      document.body.appendChild(script);

      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {}
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f7f7f7",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: 600,
          width: "100%",
          padding: "32px",
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
          textAlign: "center",
          position: "relative",
        }}
      >
        {/* 제목 */}
        <h2
          style={{
            fontSize: 22,
            fontWeight: 700,
            marginBottom: 16,
          }}
        >
          AI 솔로몬이 분석 중입니다...
        </h2>

        {/* 단계 문구 */}
        <p
          style={{
            height: 40,
            fontSize: 14,
            color: "#555",
            marginBottom: 24,
          }}
        >
          {messages[phase]}
        </p>

        {/* 로딩 스피너 */}
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              width: 48,
              height: 48,
              border: "5px solid #ddd",
              borderTopColor: "#000",
              borderRadius: "50%",
              margin: "0 auto",
              animation: "spin 1s linear infinite",
            }}
          />
        </div>

        {/* 광고 영역 */}
        <div
          style={{
            marginTop: 20,
            padding: 16,
            background: "#fafafa",
            borderRadius: 12,
            minHeight: 180,
            fontSize: 13,
            color: "#777",
            border: "1px solid #eee",
          }}
        >
          <strong>🔸 광고 영역</strong>

          <ins
            className="adsbygoogle"
            style={{ display: "block", marginTop: 10 }}
            data-ad-client="ca-pub-5086983825808143"
            data-ad-slot="1234567890"
            data-ad-format="auto"
            data-full-width-responsive="true"
          ></ins>
        </div>

        {/* 애니메이션 */}
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}
