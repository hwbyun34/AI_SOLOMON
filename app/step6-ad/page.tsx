"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Step6AdPage() {
  const router = useRouter();
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    // ✅ 7단계 문서 준비 단계 (총 20초)
    const messages = [
      "합의 내용을 문서 형식으로 정리하고 있습니다...",
      "책임 인정 및 사과 문구를 구성하는 중입니다...",
      "재발 방지 약속 항목을 정리하고 있습니다...",
      "분쟁 종결 문구와 확인 절차를 준비하는 중입니다...",
      "최종 합의 · 재발방지 문서를 생성하고 있습니다..."
    ];

    messages.forEach((_, index) => {
      setTimeout(() => setPhase(index), index * 4000); // 4초 × 5단계
    });

    const timer = setTimeout(() => {
      router.push("/step7"); // ✅ 7단계 이동
    }, 20000);

    return () => clearTimeout(timer);
  }, [router]);

  const messages = [
    "합의 내용을 문서 형식으로 정리하고 있습니다...",
    "책임 인정 및 사과 문구를 구성하는 중입니다...",
    "재발 방지 약속 항목을 정리하고 있습니다...",
    "분쟁 종결 문구와 확인 절차를 준비하는 중입니다...",
    "최종 합의 · 재발방지 문서를 생성하고 있습니다..."
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
            WebkitTextFillColor: "#000",
          }}
        >
          최종 문서를 준비하고 있습니다...
        </h2>

        {/* 동적 문구 */}
        <p
          style={{
            height: 40,
            fontSize: 14,
            color: "#555",
            marginBottom: 24,
            transition: "opacity 0.3s",
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
            }}
          />
        </div>

        {/* Google AdSense 광고 영역 */}
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
            lineHeight: 1.6,
          }}
        >
          <strong>🔸 광고 영역 (AdSense)</strong>
          <br />
          무료 서비스 제공을 위해 광고가 노출됩니다.

          <div style={{ marginTop: 10 }}>
            <ins
              className="adsbygoogle"
              style={{ display: "block" }}
              data-ad-client="ca-pub-5086983825808143"
              data-ad-slot="1234567890"
              data-ad-format="auto"
              data-full-width-responsive="true"
            ></ins>
          </div>
        </div>

        {/* 애니메이션 */}
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          (adsbygoogle = window.adsbygoogle || []).push({});
        `}</style>
      </div>
    </div>
  );
}
