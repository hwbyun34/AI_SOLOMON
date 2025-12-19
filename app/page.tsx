"use client";

import React from "react";
import { useRouter } from "next/navigation";

const panels = [
  { name: "🗂️ 팩트봇", desc: "사건 흐름·진술 정합성·모순 여부를 점검합니다." },
  { name: "🔍 증거봇", desc: "주장을 뒷받침하는 근거의 신뢰도와 충분성을 평가합니다." },
  { name: "🧠 논리봇", desc: "논리 비약·모순·인과 오류 등 논리 구조를 검토합니다." },
  { name: "🧩 원인봇", desc: "갈등이 발생하고 확대된 결정적인 원인을 파악합니다" },
  { name: "👀 시점봇", desc: "당사자 밖의 시선으로 사건을 재구성해 판단합니다." },
  { name: "❤️ 감정봇", desc: "갈등의 심리적 맥락과 감정 반응의 배경을 파악합니다." },
  { name: "🪞 도덕봇", desc: "책임·규범·도덕 관점에서 타당성을 검토합니다." },
  { name: "👥 상식봇", desc: "일반적인 상식과 대중 인식 기준의 설득력을 평가합니다." },
  { name: "🔁 재발봇", desc: "갈등 재발 가능성과 구조적 위험 요인을 점검합니다." },
  { name: "🏛️ 솔로몬봇", desc: "모든 관점을 종합해 설득력과 해결 방향을 정리합니다." },
];

export default function LandingPage() {
  const router = useRouter();

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px 20px",
        background: "#f5f6f8",
      }}
    >
      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          background: "#ffffff",
          padding: 36,
          borderRadius: 18,
          boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
        }}
      >
        {/* Header */}
        <h1 style={{ fontSize: 30, fontWeight: 800, marginBottom: 8, color: "#111" }}>
          AI 솔로몬
        </h1>
        <p
          style={{
            fontSize: 18,
            color: "#555",
            lineHeight: 1.6,
            marginBottom: 28,
          }}
        >
          하나의 판단이 아닌, <b>10개의 AI 관점</b>으로 분쟁을 분석합니다.
          <br />
          설득력 있는 입장을 정리하고, 화해 솔루션과
          재발방지·합의서 초안까지 제공합니다.
        </p>

        {/* Bots */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 14,
          }}
        >
          {panels.map((p) => (
            <div
              key={p.name}
              style={{
                background: "#fafafa",
                border: "1px solid #e5e7eb",
                borderRadius: 14,
                padding: 16,
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 14,
                  marginBottom: 6,
                  color: "#111",
                }}
              >
                {p.name}
              </div>
              <div
                style={{
                  fontSize: 13,
                  lineHeight: 1.6,
                  color: "#555",
                }}
              >
                {p.desc}
              </div>
            </div>
          ))}
        </div>

        {/* Flow */}
        <div
          style={{
            marginTop: 32,
            paddingTop: 24,
            borderTop: "1px solid #e5e7eb",
          }}
        >
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: "#111" }}>
            서비스 진행 흐름
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 12,
            }}
          >
            {[
              {
                title: "1) 사건 입력",
                desc: "분쟁 상황을 입력하면 A/B 주장과 사건 경과를 기반으로 분석이 시작됩니다.",
              },
              {
                title: "2) 솔루션 제공",
                desc: "10개 관점 분석을 종합해 설득력 있는 주장과 조정안을 제시합니다.",
              },
              {
                title: "3) 재발방지·합의서 작성",
                desc: "해결 방향을 문서로 정리합니다. 재발방지 각서·합의서 초안이 생성됩니다.",
              },
            ].map((s) => (
              <div
                key={s.title}
                style={{
                  background: "#fafafa",
                  border: "1px solid #e5e7eb",
                  borderRadius: 14,
                  padding: 16,
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: 6, color: "#111" }}>
                  {s.title}
                </div>
                <div style={{ fontSize: 13, color: "#555", lineHeight: 1.6 }}>
                  {s.desc}
                </div>
              </div>
            ))}
          </div>

          {/* Notice */}
          <div
            style={{
              marginTop: 16,
              fontSize: 12,
              color: "#666",
              background: "#fafafa",
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              padding: 14,
              lineHeight: 1.6,
            }}
          >
            ※ 본 서비스는 법률·의학·심리 상담을 대체하지 않는 AI 기반 판단 보조
            도구입니다. 결과물은 참고용 초안이며, 실제 적용 전 전문가 검토를
            권장합니다.
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => router.push("/input")}
          style={{
            marginTop: 26,
            width: "100%",
            padding: "14px 0",
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 700,
            border: "none",
            background: "#000",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          사건 입력하러 가기 →
        </button>

        {/* Footer */}
        <div
          style={{
            marginTop: 32,
            paddingTop: 16,
            borderTop: "1px solid #e5e7eb",
            fontSize: 12,
            color: "#777",
            display: "flex",
            justifyContent: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <span style={{ cursor: "pointer" }} onClick={() => router.push("/about")}>
            About
          </span>
          <span>|</span>
          <span style={{ cursor: "pointer" }} onClick={() => router.push("/terms")}>
            이용약관
          </span>
          <span>|</span>
          <span style={{ cursor: "pointer" }} onClick={() => router.push("/privacy")}>
            개인정보처리방침
          </span>
        </div>
      </div>
    </div>
  );
}
