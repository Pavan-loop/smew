import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      max_tokens: 150,
      temperature: 0.5,
      messages,
    }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({})) as { error?: { message?: string } };
    console.error("[/api/chat] OpenAI error:", res.status, error);
    return NextResponse.json(
      { error: error.error?.message || "API error" },
      { status: res.status }
    );
  }

  const data = await res.json() as { choices: { message: { content: string } }[] };
  return NextResponse.json({ reply: data.choices[0].message.content.trim() });
}
