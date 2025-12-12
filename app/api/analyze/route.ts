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

    // 🔹 프롬프트: 무조건 JSON 하나만 출력하게 강하게 지시
    const messages = [
      {
        role: "system",
        content: `
당신은 JSON만 출력하는 AI입니다.
설명 문장, 코드 블록, 주석, 텍스트 등은 절대 출력하지 말고
반드시 하나의 JSON 객체만 출력해야 합니다.

JSON 구조는 다음과 같습니다.

{
  "summary": "(사용자가 적은 사건을 3~5줄로 요약한 한국어 문장)",
  "panels": [
    {
      "panel": "AI Panel #1",
      "style": "사고 방식 설명(예: 사실 기반 논리 분석 전문가)",
      "side": "입장 1 우세" 또는 "입장 2 우세" 또는 "중립" 중 하나,
      "reason": "해당 판단을 한 간단한 이유(1~2문장)"
    },
    ...
    (총 10개 패널)
  ]
}
        `.trim(),
      },
      {
        role: "user",
        content: `
다음은 사용자가 작성한 분쟁 내용입니다.

"${text}"

1. 위 사건을 3~5줄로 자연스럽게 요약해서 "summary" 필드에 넣으세요.
2. 서로 다른 사고 방식을 가진 AI 패널 10명을 가정하고,
   각 패널에 대해 "panel", "style", "side", "reason"을 채워서 "panels" 배열을 만드세요.
3. "side" 값은 반드시 아래 셋 중 하나만 사용해야 합니다.
   - "입장 1 우세"
   - "입장 2 우세"
   - "중립"

위에서 제시한 JSON 형식 하나만 출력하세요.
        `.trim(),
      },
    ];

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

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", response.status, errorText);
      return NextResponse.json(
        { error: "OpenAI API 호출 실패" },
        { status: 500 }
      );
    }

    const result = await response.json();
    let raw: string = result.choices?.[0]?.message?.content ?? "";

    // 🔍 디버그용 (로컬 개발 시 콘솔에서 응답 형태 확인)
    console.log("RAW RESPONSE:", raw);

    if (!raw || typeof raw !== "string") {
      return NextResponse.json(
        { error: "OpenAI 응답이 비어 있습니다." },
        { status: 500 }
      );
    }

    // ```json ... ``` 같은 코드블록 제거 + 앞뒤 잡스러운 텍스트 제거
    raw = raw.replace(/```json/gi, "").replace(/```/g, "").trim();

    // 내용 중에서 첫 '{'부터 마지막 '}'까지를 잘라서 JSON으로 시도
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start === -1 || end === -1) {
      console.error("No JSON braces found in:", raw);
      return NextResponse.json(
        { error: "JSON 형식을 찾을 수 없습니다." },
        { status: 500 }
      );
    }

    const jsonString = raw.slice(start, end + 1);

    let data: any;
    try {
      data = JSON.parse(jsonString);
    } catch (e) {
      console.error("JSON parse error:", e, "\nJSON STRING:", jsonString);
      return NextResponse.json(
        { error: "JSON 파싱에 실패했습니다." },
        { status: 500 }
      );
    }

    // 최소 구조 검증
    if (!data.summary || !Array.isArray(data.panels)) {
      console.error("Invalid JSON structure:", data);
      return NextResponse.json(
        { error: "JSON 구조가 올바르지 않습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
