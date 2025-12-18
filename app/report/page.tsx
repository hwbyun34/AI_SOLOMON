"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Panel = {
  panel: string;
  style: string;
  side: string;
  reason: string;
};

const panelNameMap: Record<string, string> = {
  "사실관계 정합성 분석 패널": "🔍 팩트봇",
  "증거 신뢰도 및 근거 충족성 평가 패널": "📎 증거봇",
  "논리 구조 일관성 검증 패널": "🧠 논리봇",
  "행위 인과관계 분석 패널": "🔗 인과봇",
  "제3자 관점 사실 판단 패널": "👀 시점봇",
  "감정 반응 및 심리 영향 분석 패널": "❤️ 감정봇",
  "사회적 책임 및 도덕 규범 관점 패널": "⚖️ 도덕봇",
  "일반인 인식 및 상식 기준 판단 패널": "👥 상식봇",
  "분쟁 구조 지속성 및 재발 가능성 분석 패널": "🔁 재발봇",
  "객관·중립 종합 판단 패널": "🏛️ 솔로몬봇",
};

export default function ReportPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState("");
  const [panels, setPanels] = useState<Panel[]>([]);

  useEffect(() => {
    const text = localStorage.getItem("dispute_text");
    if (!text) {
      alert("분쟁 내용이 없습니다.");
      return;
    }

    fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    })
      .then((res) => res.json())
      .then((data) => {
        setSummary(data.summary);
        setPanels(data.panels);
        setLoading(false);
      })
      .catch(() => alert("AI 분석 요청 실패"));
  }, []);

  if (loading) {
    return (
      <div style={loadingStyle}>
        AI 패널 10명이 보고서를 작성 중입니다...
      </div>
    );
  }

  const countPos1 = panels.filter((p) => p.side === "입장 1 우세").length;
  const countPos2 = panels.filter((p) => p.side === "입장 2 우세").length;
  const countNeutral = panels.filter((p) => p.side === "중립").length;
  const percent = (v: number) => Math.round((v / 10) * 100);

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <h1 style={titleStyle}>📄 AI 솔로몬 분쟁 분석 보고서</h1>

        <h2 style={sectionTitle}>1. 사건 요약</h2>
        <div style={summaryBox}>{summary}</div>

        <h2 style={sectionTitle}>2. AI 패널별 분석 결과</h2>

        <div style={{ width: "100%", overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={th}>AI</th>
                <th style={th}>판단 방향</th>
                <th style={th}>사유</th>
              </tr>
            </thead>
            <tbody>
              {panels.map((p, i) => (
                <tr key={i}>
                  <td style={{ ...td, whiteSpace: "nowrap" }}>
                    {panelNameMap[p.style] ?? p.style}
                  </td>
                  <td
                    style={{
                      ...td,
                      whiteSpace: "nowrap",
                      textAlign: "center",
                      fontWeight: 600,
                      color:
                        p.side === "입장 1 우세"
                          ? "#2b7cff"
                          : p.side === "입장 2 우세"
                          ? "#d9534f"
                          : "#555",
                    }}
                  >
                    {p.side}
                  </td>
                  <td style={{ ...td, wordBreak: "break-word" }}>
                    {p.reason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 style={sectionTitle}>3. 종합 판단 비율</h2>

        {/* ✔ 모바일/웹 공통 안정 레이아웃 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 20,
            marginTop: 12,
          }}
        >
          <StatCard label="입장 1 우세" value={percent(countPos1)} count={countPos1} color="#2b7cff" />
          <StatCard label="중립" value={percent(countNeutral)} count={countNeutral} color="#555" />
          <StatCard label="입장 2 우세" value={percent(countPos2)} count={countPos2} color="#d9534f" />
        </div>

        <div style={{ textAlign: "center", marginTop: 50 }}>
          <button style={ctaButton} onClick={() => router.push("/feedback")}>
            💡 피드백 솔루션 제공받기
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= styles ================= */

const pageStyle = {
  minHeight: "100vh",
  background: "#f7f7f7",
  padding: "40px 20px",
  boxSizing: "border-box" as const,
};

const containerStyle = {
  maxWidth: 900,
  margin: "0 auto",
  background: "#fff",
  padding: 32,
  borderRadius: 16,
  boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
};

const loadingStyle = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: 20,
  fontWeight: 600,
};

const titleStyle = {
  fontSize: 26,
  fontWeight: 700,
  marginBottom: 12,
};

const sectionTitle = {
  fontSize: 20,
  fontWeight: 600,
  marginTop: 32,
};

const summaryBox = {
  background: "#fafafa",
  padding: 16,
  borderRadius: 12,
  marginTop: 8,
  whiteSpace: "pre-wrap" as const,
  lineHeight: 1.6,
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse" as const,
  marginTop: 12,
  fontSize: 14,
};

const th = {
  padding: 10,
  border: "1px solid #ddd",
  backgroundColor: "#eee",
};

const td = {
  padding: 10,
  border: "1px solid #ddd",
};

const ctaButton = {
  background: "linear-gradient(135deg, #4A6EF5, #6A8BFF)",
  color: "#fff",
  padding: "26px 50px",
  borderRadius: 18,
  border: "none",
  fontSize: 24,
  fontWeight: 800,
  cursor: "pointer",
  boxShadow: "0 10px 30px rgba(74,110,245,0.55)",
};

function StatCard({ label, value, count, color }: any) {
  return (
    <div
      style={{
        background: "#fafafa",
        padding: 16,
        borderRadius: 12,
        textAlign: "center",
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color }}>{value}%</div>
      <div style={{ fontSize: 12, color: "#555" }}>
        ({count} / 10명)
      </div>
    </div>
  );
}
