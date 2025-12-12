"use client";

import { useEffect, useState } from "react";

type FeedbackSolution = {
  a_summary: string;
  b_summary: string;
  joint_summary: string;
  solution: {
    main_direction: string;
    suggested_steps: string[];
    phrases_for_a: string[];
    phrases_for_b: string[];
  };
  caution: string;
};

export default function FeedbackResultPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<FeedbackSolution | null>(null);

  useEffect(() => {
    const text = localStorage.getItem("dispute_text");

    if (!text) {
      setError("분쟁 내용이 없어 솔루션을 생성할 수 없습니다.");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await fetch("/api/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });

        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j.error || "솔루션 생성 중 오류가 발생했습니다.");
        }

        const json = await res.json();
        setData(json);
        setLoading(false);
      } catch (e: any) {
        console.error(e);
        setError(e.message || "솔루션 생성 중 오류가 발생했습니다.");
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f7f7f7",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 18,
          fontWeight: 600,
        }}
      >
        AI 솔로몬이 합의 솔루션을 정리하고 있습니다...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f7f7f7",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <div
          style={{
            maxWidth: 600,
            width: "100%",
            padding: 24,
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
            textAlign: "center",
          }}
        >
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#d9534f" }}>
            솔루션 생성 실패
          </h2>
          <p style={{ marginTop: 10, color: "#555" }}>{error}</p>
        </div>
      </div>
    );
  }

  const { a_summary, b_summary, joint_summary, solution, caution } = data;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f7f7f7",
        padding: 20,
        display: "flex",
        justifyContent: "center",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: 800,
          width: "100%",
          padding: 32,
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
        }}
      >
        <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 8 }}>
          🤝 AI 솔로몬 합의 솔루션 보고서
        </h1>
        <p style={{ fontSize: 13, color: "#777" }}>
          양쪽 입장을 모두 고려하여, 감정적인 상처는 줄이고 현실적인 해결을 돕기 위한 제안입니다.
        </p>

        {/* A / B 요약 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            marginTop: 24,
          }}
        >
          <div
            style={{
              background: "#fafafa",
              padding: 16,
              borderRadius: 12,
              border: "1px solid #eee",
            }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>A 입장 요약</h3>
            <p style={{ marginTop: 8, fontSize: 14, color: "#555", whiteSpace: "pre-wrap" }}>
              {a_summary}
            </p>
          </div>

          <div
            style={{
              background: "#fafafa",
              padding: 16,
              borderRadius: 12,
              border: "1px solid #eee",
            }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>B 입장 요약</h3>
            <p style={{ marginTop: 8, fontSize: 14, color: "#555", whiteSpace: "pre-wrap" }}>
              {b_summary}
            </p>
          </div>
        </div>

        {/* 전체 상황 정리 */}
        <div
          style={{
            marginTop: 24,
            background: "#fafafa",
            padding: 16,
            borderRadius: 12,
            border: "1px solid #eee",
          }}
        >
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>전체 상황 정리</h3>
          <p style={{ marginTop: 8, fontSize: 14, color: "#555", whiteSpace: "pre-wrap" }}>
            {joint_summary}
          </p>
        </div>

        {/* 솔루션 메인 방향 */}
        <div
          style={{
            marginTop: 24,
            background: "#f0f4ff",
            padding: 16,
            borderRadius: 12,
            border: "1px solid #d6e0ff",
          }}
        >
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>합의의 큰 방향</h3>
          <p style={{ marginTop: 8, fontSize: 14, color: "#333", whiteSpace: "pre-wrap" }}>
            {solution.main_direction}
          </p>
        </div>

        {/* 단계별 실행 방법 */}
        <div
          style={{
            marginTop: 24,
            background: "#fafafa",
            padding: 16,
            borderRadius: 12,
            border: "1px solid #eee",
          }}
        >
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>단계별 실행 방법</h3>
          <ol style={{ marginTop: 8, paddingLeft: 20, fontSize: 14, color: "#555" }}>
            {solution.suggested_steps?.map((step, idx) => (
              <li key={idx} style={{ marginBottom: 4 }}>
                {step}
              </li>
            ))}
          </ol>
        </div>

        {/* 대화에 써먹을 수 있는 문장들 */}
        <div
          style={{
            marginTop: 24,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
          }}
        >
          <div
            style={{
              background: "#fff7f0",
              padding: 16,
              borderRadius: 12,
              border: "1px solid #ffe0c2",
            }}
          >
            <h3 style={{ fontSize: 15, fontWeight: 700 }}>A가 써볼 수 있는 말들</h3>
            <ul style={{ marginTop: 8, paddingLeft: 20, fontSize: 13, color: "#555" }}>
              {solution.phrases_for_a?.map((s, idx) => (
                <li key={idx} style={{ marginBottom: 4 }}>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div
            style={{
              background: "#f0fff4",
              padding: 16,
              borderRadius: 12,
              border: "1px solid #c2ffd7",
            }}
          >
            <h3 style={{ fontSize: 15, fontWeight: 700 }}>B가 써볼 수 있는 말들</h3>
            <ul style={{ marginTop: 8, paddingLeft: 20, fontSize: 13, color: "#555" }}>
              {solution.phrases_for_b?.map((s, idx) => (
                <li key={idx} style={{ marginBottom: 4 }}>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 주의사항 */}
        <div
          style={{
            marginTop: 24,
            background: "#fff5f5",
            padding: 16,
            borderRadius: 12,
            border: "1px solid #ffd6d6",
          }}
        >
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#c0392b" }}>주의해야 할 점</h3>
          <p style={{ marginTop: 8, fontSize: 13, color: "#555", whiteSpace: "pre-wrap" }}>
            {caution}
          </p>
        </div>
      </div>
    </div>
  );
}
