"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoadingPage() {
  const router = useRouter();
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    // ① 전면 광고 호출 (승인 후 실제 코드 삽입)
    const loadAd = () => {
      try {
        // 전면광고 선언 자리
        // (adsbygoogle = window.adsbygoogle || []).push({
        //   google_ad_client: "ca-pub-xxxx",
        //   enable_page_level_ads: true,
        //   overlays: {bottom: true}
        // });
      } catch (e) {
        console.log("Ad load error", e);
      }
    };

    loadAd();

    // ② 단계별 메시지 (최대 15초 가정)
    const messages = [
      "AI 솔로몬이 사건 내용을 분석하고 있습니다...",
      "핵심 쟁점을 추출하는 중입니다...",
      "유사 사례 및 논리를 검토하는 중...",
      "AI 패널 의견을 종합하고 있습니다...",
      "최종 분석 보고서를 정리하고 있습니다..."
    ];

    messages.forEach((_, index) => {
      setTimeout(() => setPhase(index), index * 3500); // 약 3.5초 × 5단계 ≈ 17~18초
    });

    // ③ 총 20초 후 결과 페이지 이동
    const timer = setTimeout(() => {
      router.push("/report");
    }, 20000);

    return () => clearTimeout(timer);
  }, [router]);

  const messages = [
    "AI 솔로몬이 사건 내용을 분석하고 있습니다...",
    "핵심 쟁점을 추출하는 중입니다...",
    "유사 사례 및 논리를 검토하는 중...",
    "AI 패널 의견을 종합하고 있습니다...",
    "최종 분석 보고서를 정리하고 있습니다..."
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
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>
          AI 솔로몬이 분석 중입니다...
        </h2>

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
          }}
        >
          🔸 <strong>전면 광고(Interstitial Ad)</strong>
          <br />
          광고가 먼저 표시되고, 광고 종료 후 AI 분석 마무리가 진행됩니다.
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
