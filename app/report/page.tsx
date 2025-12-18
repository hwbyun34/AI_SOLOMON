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

    const MIN_LOADING_TIME = 20000;
    const start = Date.now();

    let aiFinished = false;
    let aiResult: any = null;

    fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    })
      .then((res) => res.json())
      .then((data) => {
        aiFinished = true;
        aiResult = data;
        if (Date.now() - start >= MIN_LOADING_TIME) {
          applyResult(aiResult);
        }
      })
      .catch(() => alert("AI 분석 요청 실패"));

    const timer = setTimeout(() => {
      if (aiFinished && aiResult) {
        applyResult(aiResult);
      }
    }, MIN_LOADING_TIME);

    return () => clearTimeout(timer);
  }, []);

  function applyResult(data: any) {
    setSummary(data.summary);
    setPanels(data.panels);
    setLoading(false);
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 20,
          fontWeight: 600,
          background: "#f7f7f7",
          color: "#000",
        }}
      >
        AI 패널 10명이 보고서를 작성 중입니다...
      </div>
    );
  }

  const countPos1 = panels.filter((p) => p.side === "입장 1 우세").length;
  const countPos2 = panels.filter((p) => p.side === "입장 2 우세").length;
  const countNeutral = panels.filter((p) => p.side === "중립").length;
  const percent = (v: number) => Math.round((v / 10) * 100);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f7f7f7",
        padding: "40px 20px",
        boxSizing: "border-box",
        overflowX: "hidden", // ✅ 페이지 밀림 최종 차단
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          background: "#fff",
          padding: 32,
          borderRadius: 16,
          boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
          color: "#000",
        }}
      >
        <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 12 }}>
          📄 AI 솔로몬 분쟁 분석 보고서
        </h1>

        <h2 style={{ fontSize: 20, fontWeight: 600 }}>1. 사건 요약</h2>
        <div
          style={{
            background: "#fafafa",
            padding: 16,
            borderRadius: 12,
            marginTop: 8,
            whiteSpace: "pre-wrap",
            lineHeight: 1.6,
          }}
        >
          {summary}
        </div>

        <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 32 }}>
          2. AI 패널별 분석 결과
        </h2>

        <div style={{ width: "100%", overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: 12,
              fontSize: 14,
            }}
          >
            <thead>
              <tr style={{ background: "#eee" }}>
                <th style={th}>AI</th>
                <th style={th}>판단 방향</th>
                <th style={th}>사유</th>
              </tr>
            </thead>
            <tbody>
              {panels.map((p, index) => (
                <tr key={index}>
                  <td style={td}>
                    {panelNameMap[p.style] ?? p.style}
                  </td>
                  <td
                    style={{
                      ...td,
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
                  <td style={td}>{p.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 32 }}>
          3. 종합 판단 비율
        </h2>

        <div style={{ display: "flex", gap: 20, marginTop: 12, flexWrap: "wrap" }}>
          <StatCard label="입장 1 우세" value={percent(countPos1)} count={countPos1} color="#2b7cff" />
          <StatCard label="중립" value={percent(countNeutral)} count={countNeutral} color="#555" />
          <StatCard label="입장 2 우세" value={percent(countPos2)} count={countPos2} color="#d9534f" />
        </div>

        <div style={{ textAlign: "center", marginTop: 50 }}>
          <button
            onClick={() => router.push("/feedback")}
            style={{
              background: "linear-gradient(135deg, #4A6EF5, #6A8BFF)",
              color: "#fff",
              padding: "26px 50px",
              borderRadius: 18,
              border: "none",
              fontSize: 24,
              cursor: "pointer",
              fontWeight: 800,
              boxShadow: "0 10px 30px rgba(74,110,245,0.55)",
            }}
          >
            💡 피드백 솔루션 제공받기
          </button>
        </div>
      </div>
    </div>
  );
}

const th = {
  padding: 10,
  border: "1px solid #ddd",
  backgroundColor: "#eee",
  color: "#000",
};

const td = {
  padding: 10,
  border: "1px solid #ddd",
  color: "#000",
  overflowWrap: "anywhere" as const, // ✅ 타입 안전 + 줄바꿈
  whiteSpace: "normal" as const,
};

function StatCard({ label, value, count, color }: any) {
  return (
    <div
      style={{
        flex: 1,
        background: "#fafafa",
        padding: 16,
        borderRadius: 12,
        textAlign: "center",
        minWidth: 120,
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color }}>{value}%</div>
      <div style={{ fontSize: 12, color: "#555" }}>({count} / 10명)</div>
    </div>
  );
}
