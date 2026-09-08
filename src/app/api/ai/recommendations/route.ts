import { NextResponse } from "next/server";

type RecommendationPayload = {
  name: string;
  productService: string;
  targetAudience: string;
  budget: string;
  platform: string;
  startDate: string;
  endDate: string;
  goal: string;
};

function fallbackRecommendations(payload: RecommendationPayload) {
  return {
    score: 82,
    label: "Strong",
    insights: [
      `Audience fit is promising for ${payload.targetAudience}.`,
      `Budget pacing for ${payload.platform} can be optimized week-by-week.`,
      `Goal alignment is clear for ${payload.goal}.`,
    ],
    recommendations: [
      `Increase top-performing ${payload.platform} ad-set budget by 10–15%.`,
      "Run 2 creative variants focused on short-form value messaging.",
      "Review conversion funnel drop-offs every 72 hours and adjust CTA.",
    ],
  };
}

export async function POST(request: Request) {
  const apiKey = process.env.MARKETMIND_AI_API_KEY;
  const aiApiUrl = process.env.MARKETMIND_AI_API_URL ?? "https://api.openai.com/v1/responses";
  const aiModel = process.env.MARKETMIND_AI_MODEL ?? "gpt-4.1-mini";

  let payload: RecommendationPayload;

  try {
    payload = (await request.json()) as RecommendationPayload;
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request payload." }, { status: 400 });
  }

  if (!apiKey) {
    return NextResponse.json({
      ok: true,
      source: "fallback",
      ...fallbackRecommendations(payload),
      message: "AI key not configured. Showing fallback strategy.",
    });
  }

  try {
    const prompt = `You are a senior growth strategist. Analyze this campaign and return strict JSON with keys: score (number 0-100), label (string), insights (string[] max 3), recommendations (string[] max 4). Campaign: ${JSON.stringify(
      payload,
    )}`;

    const response = await fetch(aiApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: aiModel,
        input: prompt,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({
        ok: true,
        source: "fallback",
        ...fallbackRecommendations(payload),
        message: "AI service unavailable. Showing fallback strategy.",
      });
    }

    const data = (await response.json()) as {
      output_text?: string;
      output?: Array<{ content?: Array<{ text?: string }> }>;
    };

    const text =
      data.output_text ??
      data.output?.flatMap((item) => item.content ?? []).map((item) => item.text ?? "").join("\n") ??
      "";

    let parsed: { score: number; label: string; insights: string[]; recommendations: string[] } | null = null;

    try {
      parsed = JSON.parse(text) as { score: number; label: string; insights: string[]; recommendations: string[] };
    } catch {
      parsed = null;
    }

    if (!parsed) {
      return NextResponse.json({
        ok: true,
        source: "fallback",
        ...fallbackRecommendations(payload),
        message: "AI response format mismatch. Showing fallback strategy.",
      });
    }

    return NextResponse.json({ ok: true, source: "ai", ...parsed });
  } catch {
    return NextResponse.json({
      ok: true,
      source: "fallback",
      ...fallbackRecommendations(payload),
      message: "AI request failed. Showing fallback strategy.",
    });
  }
}
