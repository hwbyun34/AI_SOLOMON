"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoadingPage() {
  const router = useRouter();
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const messages = [
      "AI 솔로몬이 사건을 읽고 핵심 요소를 파악하는 중입니다...",
      "관련 유사 사례와 논리를 탐색하는 중입니다...",
      "AI 패널들이 각각 의견을 정리하고 있습니다...",
      "곧 분석 보고서를 생성합니다..."
    ];

    messages.forEach((_, index) => {
      setTimeout(() => setPhase(index), index * 900);
    });

    const timer = setTimeout(() => {
      router.push("/report");
    }, 3600);

    return () => clearTimeout(timer);
  }, [router]);

  // 변화하는 문장 리스트
  const messages = [
    "AI 솔로몬이 사건을 읽고 핵심 요소를 파악하는 중입니다...",
    "관련 유사 사례와 논리를 탐색하는 중입니다...",
    "AI 패널들이 각각 의견을 정리하고 있습니다...",
    "곧 분석 보고서를 생성합니다..."
  ];

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
        WebkitTextFillColor: "#000",
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
          WebkitTextFillColor: "#000",
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

        {/* 동적 문구 */}
        <p
          style={{
            height: 40,
            fontSize: 14,
            color: "#555",
            marginBottom: 24,
            transition: "opacity 0.3s",
            WebkitTextFillColor: "#000",
          }}
        >
          {messages[phase]}
        </p>

        {/* 로딩 아이콘 */}
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
              WebkitTextFillColor: "#000",
            }}
          />
        </div>

        {/* 광고 자리 */}
        <div
          style={{
            marginTop: 20,
            padding: 16,
            background: "#fafafa",
            borderRadius: 12,
            minHeight: 120,
            fontSize: 13,
            color: "#777",
            border: "1px solid #eee",
            lineHeight: 1.6,
            WebkitTextFillColor: "#000",
          }}
        >
          🔸 <strong>광고 영역(Ad)</strong>
          <br />
          여기에 Google AdSense, 배너 광고 또는 파트너 광고를 넣을 수 있습니다.
          <br />
          분석 대기 시간 동안 자연스럽게 노출되어 수익 창출이 가능합니다.
        </div>
      </div>

      {/* animation keyframes */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
