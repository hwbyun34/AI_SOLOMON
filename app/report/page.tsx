"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Panel = {
  panel: string;
  style: string;
  side: string;
  reason: string;
};

type Positions = {
  position1: string;
  position2: string;
};

const panelNameMap: Record<string, string> = {
  "사실관계 정합성 분석 패널": "🗂️ 팩트봇",
  "증거 신뢰도 및 근거 충족성 평가 패널": "🔍 증거봇",
  "논리 구조 일관성 검증 패널": "🧠 논리봇",
  "분쟁 발생의 핵​심 원인 제공 분석 패널": "🧩 원인봇",
  "제3자 관점 사실 판단 패널": "👀 시점봇",
  "감정 반응 및 심리 영향 분석 패널": "❤️ 감정봇",
  "사회적 책임 및 도덕 규범 관점 패널": "🪞 도덕봇",
  "일반인 인식 및 상식 기준 판단 패널": "👥 상식봇",
  "갈등 점화 및 확대 행위 분석 패널": "🔥 점화봇",
  "객관·중립 종합 판단 패널": "🏛️ 솔로몬봇",
};

export default function ReportPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState("");
  const [panels, setPanels] = useState<Panel[]>([]);
  const [positions, setPositions] = useState<Positions>({
  position1: "",
  position2: "",
});

  const [kakaoReady, setKakaoReady] = useState(false);

  useEffect(() => {
    // 🔥 추가 1: 기존 분석 결과 캐시 확인
  const cached = localStorage.getItem("analysis_result");
  const cachedText = localStorage.getItem("analysis_text");
  const currentText = localStorage.getItem("dispute_text");

  if (cached && cachedText && currentText && cachedText === currentText) {
    applyResult(JSON.parse(cached));
    return; // 🔥 같은 지문일 때만 재사용
  }

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
        // 🔥 추가 2: 최초 분석 결과 캐시 저장
        localStorage.setItem("analysis_result", JSON.stringify(data));

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

  useEffect(() => {
    if (typeof window === "undefined") return;

    const interval = setInterval(() => {
      const Kakao = (window as any).Kakao;
      if (!Kakao) return;

      if (!Kakao.isInitialized()) {
        Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
      }

      setKakaoReady(true);
      clearInterval(interval);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  function applyResult(data: any) {
    setSummary(data.summary);
    setPanels(data.panels);
    if (data.positions)
    {
      setPositions(data.positions);
    }
    setLoading(false);
  }

  const shareKakao = () => {
    const Kakao = (window as any).Kakao;

    if (!kakaoReady || !Kakao?.Share) {
      alert("카카오톡 공유 준비 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: "AI 솔로몬 · 분쟁 분석 보고서",
        description: summary || "AI 패널 10명이 분석한 분쟁 보고서입니다.",
        imageUrl: "https://ai-solomon.vercel.app/og-image.png",
        link: {
          webUrl: window.location.href,
          mobileWebUrl: window.location.href,
        },
      },
      buttons: [
        {
          title: "보고서 확인하기",
          link: {
            webUrl: window.location.href,
            mobileWebUrl: window.location.href,
          },
        },
      ],
    });
  };

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
          boxSizing: "border-box",
        }}
      >
        <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 12, color: "#000" }}>
          📄 AI 솔로몬 분쟁 분석 보고서
        </h1>

        <h2 style={{ fontSize: 20, fontWeight: 600, color: "#000" }}>1. 사건 요약</h2>
        <div
          style={{
            background: "#fafafa",
            padding: 16,
            borderRadius: 12,
            marginTop: 8,
            whiteSpace: "pre-wrap",
            lineHeight: 1.6,
            color: "#000",
          }}
        >
          {summary}
        </div>

        <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 32, color: "#000" }}>
          2. 입장별 정리
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
            marginTop: 12,
          }}
        >
          {/* 입장 1 */}
          <div
            style={{
              background: "#f3f7ff",
              borderRadius: 14,
              padding: 20,
              border: "1px solid #d6e2ff",
            }}
          >
            <div style={{ fontWeight: 700, color: "#2b7cff", marginBottom: 8 }}>
              🔵 입장 1 요약
            </div>
            <div style={{ lineHeight: 1.6, whiteSpace: "pre-wrap",color: "#000", }}>
              {positions.position1 || "해당 없음"}
            </div>
          </div>

          {/* 입장 2 */}
          <div
            style={{
              background: "#fff3f3",
              borderRadius: 14,
              padding: 20,
              border: "1px solid #ffd6d6",
            }}
          >
            <div style={{ fontWeight: 700, color: "#d9534f", marginBottom: 8 }}>
              🔴 입장 2 요약
            </div>
            <div style={{ lineHeight: 1.6, whiteSpace: "pre-wrap" ,color: "#000",}}>
              {positions.position2 || "해당 없음"}
            </div>
          </div>
        </div>

        <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 32, color: "#000" }}>
          3. AI 패널별 분석 결과
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
              <th style={th}>AI</th>
              <th style={th}>판단 방향</th>
              <th style={th}>사유</th>
            </tr>
          </thead>
          <tbody>
            {panels.map((p, index) => (
              <tr key={index}>
                <td style={{ ...td, whiteSpace: "nowrap" }}>
                  {panelNameMap[p.style] ?? p.style}
                </td>
                <td
                  style={{
                    ...td,
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    textAlign: "center",
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

        <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 32, color: "#000" }}>
          4. 종합 판단 비율
        </h2>

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

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 20,
            marginTop: 50,
            flexWrap: "wrap",
          }}
        >
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

          <button
            onClick={shareKakao}
            style={{
              background: "#FEE500",
              color: "#000",
              padding: "26px 40px",
              borderRadius: 18,
              border: "none",
              fontSize: 22,
              cursor: "pointer",
              fontWeight: 800,
              boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
              whiteSpace: "nowrap",
            }}
          >
            📤 카카오톡으로 공유
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
};

function StatCard({ label, value, count, color }: any) {
  return (
    <div
      style={{
        background: "#fafafa",
        padding: 16,
        borderRadius: 12,
        textAlign: "center",
        color: "#000",
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color }}>{value}%</div>
      <div style={{ fontSize: 12, color: "#555" }}>({count} / 10명)</div>
    </div>
  );
}
