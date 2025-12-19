"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoadingPage() {
  const router = useRouter();
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    // 20초 동안 자연스럽게 5단계 문구가 넘어가도록 설정
	  const messages = [
    "AI 솔로몬이 피드백 방향을 분석 중입니다...",
    "양측 의견의 충돌 지점을 정밀하게 분리하는 중...",
    "감정·논리·사실을 따로 구조화하는 중...",
    "중재에 필요한 핵심 포인트를 도출하는 중...",
    "최종 피드백 솔루션을 조합하는 중입니다...",
  ];

    messages.forEach((_, index) => {
      setTimeout(() => setPhase(index), index * 3000); // 3초 × 5단계 = 총 15초
    });

    const timer = setTimeout(() => {
      router.push("/feedback/result");
    }, 15000); // 15초 후 리포트 페이지 이동

    return () => clearTimeout(timer);
  }, [router]);

  const messages = [
    "AI 솔로몬이 피드백 방향을 분석 중입니다...",
    "양측 의견의 충돌 지점을 정밀하게 분리하는 중...",
    "감정·논리·사실을 따로 구조화하는 중...",
    "중재에 필요한 핵심 포인트를 도출하는 중...",
    "최종 피드백 솔루션을 조합하는 중입니다...",
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

        {/* Google AdSense 광고 자리 */}
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
          <strong>🔸 광고 영역 (AdSense Auto Ads / Display Ad)</strong>
          <br />
          광고 대기중

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

        {/* 스핀 애니메이션 */}
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
