import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: "분쟁 내용이 비어 있습니다." },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY가 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    // AI 패널 10명 구성
    const panelStyles = [
      "사실 기반 논리 분석 전문가",
      "정서·감정 공감형 판단 전문가",
      "법적 절차 및 계약 중심 분석가",
      "분쟁 조정 전문가",
      "객관적 데이터 우선 판단 전문가",
      "사회적 상식 기반 분석가",
      "타협점 도출 중심 중재자",
      "증거와 기록 중심 검토 전문가",
      "위험 최소화 관점 전문가",
      "중립적 조정 + 논리 혼합형 분석가",
    ];

    const messages = [
      {
        role: "system",
        content: `
당신은 분쟁 해결 전문가입니다.
사용자가 입력한 사건을 기반으로 "입장 1"과 "입장 2"를 먼저 구조화하여 분리하세요.

그 후 각 패널은 자신의 스타일에 따라 다음 정보를 생성합니다:
- 판단 방향: (입장 1 우세 / 입장 2 우세 / 중립)
- 판단 근거: (간단한 사유 1~2줄)

절대 입장 1, 입장 2의 텍스트를 다시 복사하거나 길게 반복하지 마십시오.
전체 출력은 JSON 배열 형태로만 작성하십시오.
        `,
      },
      {
        role: "user",
        content: `
다음은 사용자가 입력한 분쟁 내용입니다:

"${text}"

AI 패널 10명이 서로 다른 사고 방식으로 판단을 수행하세요.
출력 형식은 반드시 아래 JSON과 동일해야 합니다:

[
  {
    "panel": "AI Panel #1",
    "style": "(해당 패널의 사고 방식)",
    "side": "입장 1 우세 / 입장 2 우세 / 중립 중 하나",
    "reason": "(짧고 명확한 사유)"
  }
]

단, 반드시 10개의 패널이 서로 다른 style을 가져야 합니다.
      `,
      },
    ];

    // OpenAI API 호출
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.6,
      }),
    });

    const result = await response.json();

    const raw = result.choices?.[0]?.message?.content || "[]";
    let panels = [];

    try {
      panels = JSON.parse(raw);
    } catch (err) {
      console.error("JSON Parse Error:", err);
    }

    return NextResponse.json({
      summary: text,
      panels,
    });
  } catch (error) {
    console.error("API error:", error);

    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
