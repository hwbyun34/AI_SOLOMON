"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Panel = {
  panel: string;
  style: string;
  side: string;
  reason: string;
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

    const MIN_LOADING_TIME = 20000; // 20초 유지
    const start = Date.now();

    let aiFinished = false;
    let aiResult: any = null;

    // 🔥 AI 요청
    fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    })
      .then((res) => res.json())
      .then((data) => {
        aiFinished = true;
        aiResult = data;

        const elapsed = Date.now() - start;

        // 20초 통과 이후면 바로 표시
        if (elapsed >= MIN_LOADING_TIME) {
          applyResult(aiResult);
        }
      })
      .catch((err) => {
        console.error(err);
        alert("AI 분석 요청 실패");
      });

    // 🔥 20초 타이머
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

  // 🔥 로딩 화면 (20초 유지)
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

  // 통계 계산
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

        {/* 사건 요약 */}
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

        {/* 패널 분석 */}
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
              <th style={th}>패널 성향</th>
              <th style={th}>판단 방향</th>
              <th style={th}>사유</th>
            </tr>
          </thead>
          <tbody>
            {panels.map((p, index) => (
              <tr key={index}>
                <td style={td}>{p.style}</td>
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

        {/* 종합 판단 비율 */}
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

        {/* 🔥 강조 버튼 */}
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
              transition: "0.25s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.085)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
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
};

const td = {
  padding: 10,
  border: "1px solid #ddd",
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
      <div style={{ fontSize: 12, color: "#777" }}>({count} / 10명)</div>
    </div>
  );
}
