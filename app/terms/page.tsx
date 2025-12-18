"use client";

import { useEffect, useState } from "react";

export default function TermsPage() {
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
            이용약관
          </h1>
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.6,
              color: colors.textSub,
            }}
          >
            AI 솔로몬 서비스 이용과 관련된 기본적인 기준을 안내합니다
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
            title="1. 서비스의 성격"
            text="AI 솔로몬은 분쟁 상황을 다양한 관점에서 분석하여 생각을 정리할 수 있도록 돕는 정보 제공 및 분석 보조 서비스입니다. 본 서비스는 법률·의학·심리 상담을 대체하지 않습니다."
            colors={colors}
          />

          <Section
            title="2. 분석 결과의 활용"
            text="서비스에서 제공되는 분석 결과 및 문서 초안은 참고용으로 제공됩니다. 실제 판단과 의사결정에 대한 책임은 이용자 본인에게 있습니다."
            colors={colors}
          />

          <Section
            title="3. 입력 내용에 대한 책임"
            text="이용자는 타인의 개인정보, 민감한 정보 또는 부적절한 내용을 무단으로 입력해서는 안 되며, 입력 내용으로 인해 발생하는 문제에 대한 책임은 이용자에게 있습니다."
            colors={colors}
          />

          <Section
            title="4. 서비스 운영"
            text="AI 솔로몬은 서비스 품질 향상을 위해 사전 안내 없이 일부 기능을 변경하거나 일시적으로 중단할 수 있습니다."
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
              본 약관은 서비스 이용에 대한 기본적인 이해를 돕기 위한 안내 문서이며,
              이용자의 권리를 제한하거나 과도한 책임을 부과하기 위한 목적을 갖지 않습니다.
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
