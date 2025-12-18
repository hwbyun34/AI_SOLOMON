"use client";

import { useEffect, useState } from "react";

export default function PrivacyPage() {
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
            개인정보처리방침
          </h1>
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.6,
              color: colors.textSub,
            }}
          >
            AI 솔로몬은 불필요한 개인정보를 수집하지 않습니다
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
          <Section
            title="1. 개인정보 수집 원칙"
            text="AI 솔로몬은 회원가입을 요구하지 않으며, 이름·연락처·계정 정보 등 개인을 식별할 수 있는 정보를 직접적으로 수집하지 않습니다."
            colors={colors}
          />

          <Section
            title="2. 입력 내용의 처리"
            text="사용자가 입력한 텍스트는 분석 결과 생성을 위해 일시적으로 처리되며, 개인을 식별하는 정보로 활용되거나 장기 저장되지 않습니다."
            colors={colors}
          />

          <Section
            title="3. 로그 및 기록"
            text="서비스는 이용자의 분쟁 내용이나 개인적인 사안을 별도의 이력이나 로그로 보관하지 않습니다. 분석이 완료되면 입력 내용은 지속적으로 저장되지 않습니다."
            colors={colors}
          />

          <Section
            title="4. 제3자 제공"
            text="법령에 따른 경우를 제외하고, 이용자의 입력 정보 및 분석 내용은 외부에 제공되지 않습니다."
            colors={colors}
          />

          <div
            style={{
              marginTop: 32,
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
              AI 솔로몬은 가능한 한 적은 정보를 다루는 것을 원칙으로 하며,
              사용자가 불필요한 부담 없이 서비스를 이용할 수 있도록 설계되었습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  text,
  colors,
}: {
  title: string;
  text: string;
  colors: any;
}) {
  return (
    <div style={{ marginBottom: 26 }}>
      <h3
        style={{
          fontSize: 16,
          fontWeight: 700,
          marginBottom: 8,
          color: colors.textMain,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: 15,
          lineHeight: 1.8,
          color: colors.textSub,
          margin: 0,
        }}
      >
        {text}
      </p>
    </div>
  );
}
