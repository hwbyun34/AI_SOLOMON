import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "분쟁 텍스트가 필요합니다." },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY가 설정되어 있지 않습니다." },
        { status: 500 }
      );
    }

    const prompt = `
당신은 갈등 조정 전문가 AI입니다.
사용자가 제공한 분쟁 내용을 읽고, A와 B의 입장을 최대한 공정하게 정리한 뒤,
합의 솔루션을 제안하는 JSON만 출력하세요.

반드시 아래 형식의 JSON만 출력하세요. 설명 문장, 코드블럭(\`\`\`) 절대 금지.

{
  "a_summary": "A(질문자 또는 발신자)의 입장을 요약",
  "b_summary": "B(상대방)의 입장을 요약",
  "joint_summary": "전체 상황을 중립적으로 정리",
  "solution": {
    "main_direction": "합의의 큰 방향 (예: 서로 어떤 부분을 인정하고, 어디까지 조정할지)",
    "suggested_steps": [
      "단계별 실행 방법 1",
      "단계별 실행 방법 2",
      "단계별 실행 방법 3"
    ],
    "phrases_for_a": [
      "A가 B에게 말할 때 도움이 되는 문장 1",
      "A가 B에게 말할 때 도움이 되는 문장 2"
    ],
    "phrases_for_b": [
      "B가 A에게 말할 때 도움이 되는 문장 1",
      "B가 A에게 말할 때 도움이 되는 문장 2"
    ]
  },
  "caution": "주의해야 할 점, 피해야 할 표현 등"
}

분쟁 내용:
${text}
    `.trim();

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.6,
        messages: [
          {
            role: "system",
            content:
              "너는 감정적인 갈등을 부드럽게 풀어주는 중재 전문가 AI 솔로몬이다. 한국어로만 답한다.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!openaiRes.ok) {
      const errText = await openaiRes.text();
      console.error("OpenAI error:", errText);
      return NextResponse.json(
        { error: "피드백 솔루션 생성 중 오류가 발생했습니다." },
        { status: 500 }
      );
    }

    const json = await openaiRes.json();
    const content =
      json.choices?.[0]?.message?.content?.trim() ?? "";

    // 혹시 코드블럭으로 감싸져 있다면 제거
    let raw = content;
    const match = content.match(/\{[\s\S]*\}/);
    if (match) {
      raw = match[0];
    }

    let data;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      console.error("JSON parse error:", e, raw);
      return NextResponse.json(
        { error: "AI 응답을 파싱하는 데 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "피드백 솔루션 생성 중 예기치 못한 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
