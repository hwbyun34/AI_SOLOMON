"use client";

import { useEffect, useState } from "react";

export default function AboutPage() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
  }, []);

  const colors = {
    pageBg: isDark ? "#0f1115" : "#f5f6f8",
    cardBg: isDark ? "#171a1f" : "#ffffff",
    title: isDark ? "#ffffff" : "#111111",
    textMain: isDark ? "#eaeaf0" : "#111111",
    textSub: isDark ? "#b4b7c0" : "#555555",
    border: isDark ? "#2a2e36" : "#e5e7eb",
    shadow: isDark
      ? "0 8px 28px rgba(0,0,0,0.6)"
      : "0 8px 24px rgba(0,0,0,0.08)",
    highlightBg: isDark ? "#1e222a" : "#f3f4f6",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: colors.pageBg,
        padding: "64px 20px",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        {/* Hero */}
        <div style={{ marginBottom: 36 }}>
          <h1
            style={{
              fontSize: 30,
              fontWeight: 800,
              marginBottom: 10,
              color: colors.title,
              letterSpacing: "-0.02em",
            }}
          >
            About AI 솔로몬
          </h1>
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.6,
              color: colors.textSub,
            }}
          >
            하나의 결론이 아닌, 여러 관점으로 생각을 정리하는 AI 분쟁 분석 도구
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: colors.cardBg,
            borderRadius: 20,
            padding: "38px 40px",
            border: `1px solid ${colors.border}`,
            boxShadow: colors.shadow,
          }}
        >
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.8,
              color: colors.textMain,
            }}
          >
            AI 솔로몬은 분쟁을 해결하기 위해 누군가의 편을 들거나,
            하나의 결론을 강요하는 서비스를 지향하지 않습니다.
          </p>

          <p
            style={{
              marginTop: 18,
              fontSize: 15,
              lineHeight: 1.8,
              color: colors.textSub,
            }}
          >
            대신 사건을 여러 관점에서 차분하게 바라볼 수 있도록 돕는 것을
            목표로 합니다. 팩트, 논리, 감정, 인과관계, 도덕성 등
            서로 다른 시선을 가진 AI 분석을 통해
            각 주장에 어떤 설득력이 있는지,
            그리고 어떤 오해가 발생했는지를 정리합니다.
          </p>

          <p
            style={{
              marginTop: 18,
              fontSize: 15,
              lineHeight: 1.8,
              color: colors.textSub,
            }}
          >
            AI 솔로몬은 판단자가 아니라,
            생각을 정리하는 보조자에 가깝습니다.
            감정이 앞서기 쉬운 갈등 상황에서
            한 발 물러나 상황을 다시 바라볼 수 있도록
            분석 결과와 문서 초안을 제공합니다.
          </p>

          {/* Divider */}
          <div
            style={{
              margin: "30px 0",
              height: 1,
              background: colors.border,
            }}
          />

          {/* Philosophy Box */}
          <div
            style={{
              background: colors.highlightBg,
              borderRadius: 14,
              padding: 20,
            }}
          >
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.7,
                color: colors.textSub,
                margin: 0,
              }}
            >
              이 서비스는 사용자의 선택을 대신하지 않습니다.
              AI 솔로몬은 보다 합리적인 대화와 판단을 돕기 위한
              참고용 분석 도구로 존재합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
