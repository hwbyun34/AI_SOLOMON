"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [text, setText] = useState("");

  const handleNext = () => {
    if (!text.trim()) {
      alert("분쟁 내용을 입력해주세요.");
      return;
    }

    localStorage.setItem("dispute_text", text);
    router.push("/loading");
  };

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
          maxWidth: 800,
          margin: "0 auto",
          background: "#fff",
          padding: "32px",
          borderRadius: 16,
          boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
        }}
      >
        {/* 헤더 */}
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            marginBottom: 8,
            WebkitTextFillColor: "#000",
          }}
        >
          AI 솔로몬
        </h1>
        <p style={{ color: "#666", marginBottom: 24, fontSize: 14 }}>
          분쟁 상황을 입력하면 AI가 사건을 분석하고 대응 보고서를 생성해드립니다.
        </p>

        {/* 라벨 */}
        <div
          style={{
            marginBottom: 8,
            fontWeight: 600,
            fontSize: 15,
            WebkitTextFillColor: "#000",
          }}
        >
          📝 분쟁 내용을 입력해주세요
        </div>

        {/* 🔧 수정된 textarea (문제 해결 핵심) */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          spellCheck={false} // ✅ 빨간 맞춤법 밑줄 제거
          placeholder={`예시)\n- 남자친구 , 여자친구의 의견이 충돌하여 갈등을 빚고있는 상황\n- 상대방과 의견 충돌이 지속되어 조정이나 대응 문서가 필요한 상황\n- 금전·물품·계약 관련 문제로 서로의 입장이 크게 엇갈리는 상황\n- 의사소통이 원활하지 않아 오해가 쌓이고 갈등이 심화된 상황`}
          style={{
            width: "100%",
            height: 320,
            padding: 16,
            borderRadius: 12,
            border: "1px solid #ccc",
            resize: "none",
            fontSize: 14,
            lineHeight: 1.6,
            boxSizing: "border-box",

            /* ✅ 여기부터가 핵심 수정 */
            color: "#111",              // 글자색 명시
            background: "#ffffff",      // 배경색 명시
            caretColor: "#111",         // 커서 색 명시
            WebkitTextFillColor: "#111" // 사파리/크롬 대비
          }}
        />

        {/* 작성 팁 */}
        <div
          style={{
            background: "#fafafa",
            padding: 16,
            borderRadius: 12,
            marginTop: 20,
            lineHeight: 1.6,
            fontSize: 13,
            color: "#555",
          }}
        >
          <strong style={{ fontWeight: 600 }}>✦ 작성 가이드</strong>
          <ul style={{ marginTop: 8, paddingLeft: 20 }}>
            <li>언제, 어디서, 누구와 발생한 일인지 설명해주세요.</li>
            <li>A의 의견 B의 의견을 분리해서 설명하면 더 정확한 분석 결과를 얻을 수 있습니다.</li>
            <li>복잡한 사건일수록 더 정확한 분석이 가능합니다.</li>
          </ul>
        </div>

        {/* 버튼 */}
        <button
          onClick={handleNext}
          style={{
            marginTop: 28,
            width: "100%",
            padding: "14px 0",
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 600,
            border: "none",
            background: "#000",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          AI에게 분석 요청하기 →
        </button>
      </div>
    </div>
  );
}
