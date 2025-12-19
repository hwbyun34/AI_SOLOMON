"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<FeedbackSolution | null>(null);

  /* ===========================
     솔루션 데이터 로딩 (기존 그대로)
  =========================== */
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
        setError(e.message || "솔루션 생성 중 오류가 발생했습니다.");
        setLoading(false);
      }
    })();
  }, []);

  /* ===========================
     카카오톡 공유 (정답)
  =========================== */
  const shareKakao = () => {
    if (typeof window === "undefined") return;

    const Kakao = (window as any).Kakao;

    if (!data) {
      alert("공유할 데이터가 없습니다.");
      return;
    }

    if (!Kakao || !Kakao.isInitialized()) {
      alert("카카오 공유를 준비 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: "AI 솔로몬 합의 솔루션 보고서",
        description: data.solution.main_direction,
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

  /* ===========================
     6단계 이동 (기존 그대로)
  =========================== */
  const goToStep6Ad = () => {
    if (!data) return;

    localStorage.setItem("incident_summary", data.joint_summary);
    localStorage.setItem("solution_direction", data.solution.main_direction);

    router.push("/step6-ad");
  };


  /* ===========================
     로딩 / 에러 처리
  =========================== */
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
          WebkitTextFillColor: "#000",
        }}
      >
        AI 솔로몬이 합의 솔루션을 작성하고 있습니다...
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

  /* ===========================
     본문
  =========================== */
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
        <h1
          style={{
            fontSize: 28,
            fontWeight: 800,
            marginBottom: 12,
            color: "#1a365d",
            WebkitTextFillColor: "#1a365d",
          }}
        >
          🤝 AI 솔로몬 합의 솔루션 보고서
        </h1>

        <p style={{ fontSize: 15, color: "#4a5568", lineHeight: 1.6 }}>
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
          <div style={box}>
            <h3 style={h3}>A 입장 요약</h3>
            <p style={p}>{a_summary}</p>
          </div>

          <div style={box}>
            <h3 style={h3}>B 입장 요약</h3>
            <p style={p}>{b_summary}</p>
          </div>
        </div>

        {/* 전체 상황 */}
        <div style={{ ...box, marginTop: 24 }}>
          <h3 style={h3}>전체 상황 정리</h3>
          <p style={p}>{joint_summary}</p>
        </div>

        {/* 합의 방향 */}
        <div
          style={{
            marginTop: 24,
            background: "#f8f9ff",
            padding: 20,
            borderRadius: 12,
            border: "1px solid #e2e8ff",
          }}
        >
          <h3 style={h3}>합의의 큰 방향</h3>
          <p style={{ ...p, color: "#2d3748" }}>{solution.main_direction}</p>
        </div>

        {/* 단계 */}
        <div style={{ ...box, marginTop: 24 }}>
          <h3 style={h3}>단계별 실행 방법</h3>
          <ol style={{ marginTop: 8, paddingLeft: 20 }}>
            {solution.suggested_steps.map((s, i) => (
              <li key={i} style={{ marginBottom: 4 }}>
                {s}
              </li>
            ))}
          </ol>
        </div>

        {/* 대화 문장 */}
        <div
          style={{
            marginTop: 24,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
          }}
        >
          <div style={{ ...box, background: "#fffaf7", border: "1px solid #ffedd5" }}>
            <h3 style={h3}>A가 써볼 수 있는 말</h3>
            <ul>
              {solution.phrases_for_a.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          <div style={{ ...box, background: "#f7fff9", border: "1px solid #d1fae5" }}>
            <h3 style={h3}>B가 써볼 수 있는 말</h3>
            <ul>
              {solution.phrases_for_b.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* 주의 */}
        <div style={{ ...box, marginTop: 24, background: "#fff8f8", border: "1px solid #ffebeb" }}>
          <h3 style={{ ...h3, color: "#e53e3e" as const }}>주의해야 할 점</h3>
          <p style={p}>{caution}</p>
        </div>

        {/* 👉 6단계 이동 버튼 */}
        <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginTop: 50, flexWrap: "wrap" }}>
          <div>
            <button
              onClick={goToStep6Ad}
              style={{
                background: "linear-gradient(135deg, #2b6cb0, #4299e1)",
                color: "#fff",
                padding: "16px 32px",
                borderRadius: 14,
                border: "none",
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
                whiteSpace: "nowrap"
              }}
            >
              ✍️ 합의 · 재발방지 문서 작성하기
            </button>
          </div>
          <div>
            <button
              onClick={shareKakao}
              style={{
                background: "#d8d513ff",
                color: "#fff",
                padding: "16px 32px",
                borderRadius: 14,
                border: "none",
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
                whiteSpace: "nowrap"
              }}
            >
              📤 카카오톡으로 공유하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== 공통 스타일 ===== */
const box = {
  background: "#ffffff",
  padding: 20,
  borderRadius: 12,
  border: "1px solid #f0f0f0",
  boxShadow: "0 2px 12px rgba(0, 0, 0, 0.03)",
  WebkitTextFillColor: "#1a1a1a",
  transition: "all 0.3s ease",
};

const h3 = {
  fontSize: 17,
  fontWeight: 700,
  color: "#1a365d",
  marginBottom: 12,
  position: "relative" as const,
  paddingBottom: 8,
  WebkitTextFillColor: "#1a365d",
};

const p = {
  marginTop: 8,
  fontSize: 15,
  lineHeight: 1.7,
  color: "#2d3748",
  whiteSpace: "pre-wrap" as const,
  WebkitTextFillColor: "#2d3748",
};
