"use client";

import { useEffect, useMemo, useState } from "react";

declare global {
  interface Window {
    Kakao: any;
  }
}

type Tone = "formal" | "plain" | "repair";

export default function Step7Page() {
  const [tone, setTone] = useState<Tone>("formal");

  const [incidentSummary, setIncidentSummary] = useState("");
  const [responsibilityNote, setResponsibilityNote] = useState(
    "본 사안에 있어 본인에게 더 큰 책임이 있었음을 인정합니다."
  );
  const [writerName, setWriterName] = useState("");
  const [otherName, setOtherName] = useState("");

  useEffect(() => {
    const savedIncident = localStorage.getItem("incident_summary");
    if (savedIncident) setIncidentSummary(savedIncident);
  }, []);

  const today = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
  }, []);

  const documentText = useMemo(() => {
    const toneMap = {
      formal: {
        intro: `본인은 ${incidentSummary}과(와) 관련하여, 본인의 판단 및 행동으로 상대방에게 불편과 신뢰 훼손을 초래한 점에 대해 진심으로 사과드립니다.`,
        close:
          "본 확인서는 분쟁을 원만히 정리하고 신뢰 회복을 목적으로 하며, 향후 동일한 사안으로 갈등을 확대하지 않을 것을 확인합니다.",
      },
      plain: {
        intro: `저는 ${incidentSummary}에 대해 제 판단이 부족했음을 인정하고 사과드립니다.`,
        close:
          "이번 일을 계기로 같은 문제가 반복되지 않도록 노력하겠습니다.",
      },
      repair: {
        intro: `저는 ${incidentSummary}과(와) 관련해 상대방의 감정을 충분히 헤아리지 못한 점을 진심으로 미안하게 생각합니다.`,
        close:
          "이 문서는 관계 회복과 신뢰를 다시 쌓기 위한 약속입니다.",
      },
    }[tone];

    return `
분쟁 정리 및 재발방지 확인서

1. 사과 및 사건 인식
${toneMap.intro}

2. 책임 인정
${responsibilityNote}

3. 재발방지 약속
1) 동일하거나 유사한 문제가 재발하지 않도록 행동을 개선하겠습니다.
2) 유사 상황 발생 시 사전에 충분히 소통하고 협의하겠습니다.
3) 약속 및 합의 사항을 성실히 이행하겠습니다.
4) 문제 발생 시 감정적인 대응을 자제하겠습니다.

4. 분쟁 정리
${toneMap.close}

작성일: ${today}
작성자: ${writerName || "__________________"}
상대방 확인(선택): ${otherName || "__________________"}
`.trim();
  }, [tone, incidentSummary, responsibilityNote, writerName, otherName, today]);

  /* ===========================
     기능 버튼
  =========================== */
  const copyText = async () => {
    await navigator.clipboard.writeText(documentText);
    alert("문서가 복사되었습니다.");
  };

  const savePdf = () => {
    window.print();
  };

  const shareKakao = () => {
    if (typeof window === "undefined") return;

    const Kakao = window.Kakao;

    if (!Kakao || !Kakao.isInitialized()) {
      alert("카카오 공유를 준비 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: "AI 솔로몬 · 분쟁 정리 및 재발방지 확인서",
        description:
          incidentSummary || "AI가 정리한 분쟁 해결 문서입니다.",
        imageUrl: "https://ai-solomon.vercel.app/og-image.png",
        link: {
          webUrl: window.location.href,
          mobileWebUrl: window.location.href,
        },
      },
      buttons: [
        {
          title: "문서 확인하기",
          link: {
            webUrl: window.location.href,
            mobileWebUrl: window.location.href,
          },
        },
      ],
    });
  };

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
          maxWidth: 900,
          width: "100%",
          background: "#fff",
          borderRadius: 16,
          padding: 32,
          boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
        }}
      >
        {/* 헤더 */}
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, color: "#111" }}>
          분쟁 정리 및 재발방지 확인서
        </h1>
        <p style={{ fontSize: 13, color: "#666" }}>
          사과 · 재발방지 · 분쟁 정리를 하나의 문서로 제공합니다.
        </p>

        {/* 톤 선택 */}
        <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
          {[
            ["formal", "정중한 공식형"],
            ["plain", "담백한 약속형"],
            ["repair", "관계 회복형"],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTone(key as Tone)}
              style={{
                padding: "8px 14px",
                borderRadius: 10,
                border: "1px solid #ddd",
                background: tone === key ? "#111" : "#fafafa",
                color: tone === key ? "#fff" : "#111",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* 입력 */}
        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label style={labelStyle}>사건 요약</label>
            <textarea 
              value={incidentSummary} 
              onChange={(e) => setIncidentSummary(e.target.value)} 
              placeholder="사건을 간단히 요약해주세요" 
              style={{ ...input, minHeight: 80, padding: '12px 14px' }} 
            />
          </div>
          
          <div>
            <label style={labelStyle}>책임 인정 문구</label>
            <input 
              value={responsibilityNote} 
              onChange={(e) => setResponsibilityNote(e.target.value)} 
              style={input} 
            />
          </div>
          
          <div style={{ display: 'flex', gap: 16, width: '100%' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>작성자 이름</label>
              <input 
                value={writerName} 
                onChange={(e) => setWriterName(e.target.value)} 
                style={input} 
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>상대방 이름 <span style={{ color: '#999', fontWeight: 'normal' }}>(선택)</span></label>
              <input 
                value={otherName} 
                onChange={(e) => setOtherName(e.target.value)} 
                style={input} 
              />
            </div>
          </div>
        </div>

        {/* 문서 출력 */}
        <div style={{ marginTop: 32, background: "#fff", border: "1px solid #e5e5e5", borderRadius: 12, padding: 24 }}>
          <pre style={{ margin: 0, whiteSpace: "pre-wrap", lineHeight: 1.7, fontSize: 15, color: "#111" }}>
            {documentText}
          </pre>
        </div>

        {/* 버튼 */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 32 }}>
          <button onClick={savePdf} style={btnDark}>PDF로 저장</button>
          <button onClick={shareKakao} style={btnKakao}>카카오톡으로 공유</button>
        </div>
      </div>
    </div>
  );
}

/* ===== 스타일 ===== */
const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: 8,
  fontSize: 16,
  fontWeight: 700,
  color: '#2c3e50',
  marginTop: 16,
};

const input: React.CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: 8,
  border: "1px solid #e0e0e0",
  backgroundColor: "#fff",
  fontSize: 16,
  transition: 'all 0.2s ease',
  boxSizing: 'border-box',
  outline: 'none',
  marginTop: 8,
  color: "#2c3e50",
  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
};

const inputFocus = {
  borderColor: '#3498db',
  boxShadow: '0 0 0 3px rgba(52, 152, 219, 0.2)',
  backgroundColor: '#f8fafc'
};

const btnLight = {
  padding: "12px 20px",
  borderRadius: 12,
  border: "1px solid #ddd",
  background: "#fff",
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
};

const btnDark = {
  padding: "12px 20px",
  borderRadius: 12,
  border: "none",
  background: "#111",
  color: "#fff",
  fontSize: 14,
  fontWeight: 700,
  cursor: "pointer",
};

const btnKakao = {
  padding: "12px 20px",
  borderRadius: 12,
  border: "none",
  background: "#FEE500",
  color: "#000",
  fontSize: 14,
  fontWeight: 700,
  cursor: "pointer",
};
