"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function FeedbackLoadingPage() {
  const router = useRouter();

  useEffect(() => {
    // ⏳ 20초 후 결과 페이지로 이동
    const timer = setTimeout(() => {
      router.push("/feedback-result");
    }, 20000);

    return () => clearTimeout(timer);
  }, [router]);

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
        }}
      >
        <h2
          style={{
            fontSize: 22,
            fontWeight: 700,
            marginBottom: 16,
          }}
        >
          AI 솔로몬이 합의 솔루션을 정리하고 있습니다...
        </h2>

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

        <p style={{ fontSize: 14, color: "#555" }}>
          두 사람 모두 상처 없이 해결할 수 있는 방향을 찾고 있어요.
          <br />
          잠시만 기다려주세요!
        </p>

        {/* Keyframes */}
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
