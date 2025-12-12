"use client";

import React, { useEffect, useState } from "react";

type Panel = {
  panel: string;
  style: string;
  side: string;
  reason: string;
};

export default function ReportPage() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState("");
  const [panels, setPanels] = useState<Panel[]>([]);

  useEffect(() => {
    const text = localStorage.getItem("dispute_text");

    if (!text) {
      alert("분쟁 내용이 없습니다.");
      return;
    }

    // 🔥 서버 API 호출 → AI 패널 10명 판단 요청
    fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    })
      .then((res) => res.json())
      .then((data) => {
        // AI가 생성한 요약 사용
        setSummary(data.summary || text);

        // 패널 목록 적용
        setPanels(data.panels || []);

        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        alert("AI 분석 요청 실패");
      });
  }, []);

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
        }}
      >
        AI 패널 10명이 보고서를 작성 중입니다...
      </div>
    );
  }

  // 🔢 통계 계산
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
        }}
      >
        <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 12 }}>
          📄 AI 솔로몬 분쟁 분석 보고서
        </h1>

        {/* 1. 사건 요약 */}
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

        {/* 2. 패널 분석 결과 */}
        <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 32 }}>
          2. AI 패널별 분석 결과
        </h2>

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
              <th style={th}>패널</th>
              <th style={th}>판단 방향</th>
              <th style={th}>사유</th>
            </tr>
          </thead>
          <tbody>
            {panels.map((p, index) => (
              <tr key={index}>
                <td style={td}>{p.panel}</td>
                <td
                  style={{
                    ...td,
                    fontWeight: 600,
                    color:
                      p.side === "입장 1 우세"
                        ? "#2b7cff"
                        : p.side === "입장 2 우세"
                        ? "#d9534f"
                        : "#777",
                  }}
                >
                  {p.side}
                </td>
                <td style={td}>{p.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 3. 종합 비율 */}
        <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 32 }}>
          3. 종합 판단 비율
        </h2>

        <div style={{ display: "flex", gap: 20, marginTop: 12 }}>
          <StatCard
            label="입장 1 우세"
            value={percent(countPos1)}
            count={countPos1}
            color="#2b7cff"
          />
          <StatCard
            label="중립"
            value={percent(countNeutral)}
            count={countNeutral}
            color="#777"
          />
          <StatCard
            label="입장 2 우세"
            value={percent(countPos2)}
            count={countPos2}
            color="#d9534f"
          />
        </div>
      </div>
    </div>
  );
}

// 스타일 공통
const th = {
  padding: 10,
  border: "1px solid #ddd",
};

const td = {
  padding: 10,
  border: "1px solid #ddd",
};

// 통계 카드 컴포넌트
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
      <div style={{ fontSize: 12, color: "#777" }}>({count} / 10명)</div>
    </div>
  );
}
