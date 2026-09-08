import { db } from "@/db";
import { campaigns } from "@/db/schema";
import { desc } from "drizzle-orm";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function GET() {
  try {
    const rows = await db
      .select({
        id: campaigns.id,
        name: campaigns.name,
        productService: campaigns.productService,
        targetAudience: campaigns.targetAudience,
        budget: campaigns.budget,
        platform: campaigns.platform,
        startDate: campaigns.startDate,
        endDate: campaigns.endDate,
        goal: campaigns.goal,
        status: campaigns.status,
        createdAt: campaigns.createdAt,
      })
      .from(campaigns)
      .orderBy(desc(campaigns.id))
      .limit(100);

    return Response.json({ ok: true, campaigns: rows });
  } catch {
    return Response.json({ ok: false, message: "Unable to fetch campaigns." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;

    const name = body.name;
    const productService = body.productService;
    const targetAudience = body.targetAudience;
    const budget = body.budget;
    const platform = body.platform;
    const startDate = body.startDate;
    const endDate = body.endDate;
    const goal = body.goal;

    if (
      !isNonEmptyString(name) ||
      !isNonEmptyString(productService) ||
      !isNonEmptyString(targetAudience) ||
      !isNonEmptyString(platform) ||
      !isNonEmptyString(startDate) ||
      !isNonEmptyString(endDate) ||
      !isNonEmptyString(goal)
    ) {
      return Response.json({ ok: false, message: "Please fill all required fields." }, { status: 400 });
    }

    const budgetNumber = Number(budget);

    if (Number.isNaN(budgetNumber) || budgetNumber <= 0) {
      return Response.json({ ok: false, message: "Budget must be a positive number." }, { status: 400 });
    }

    const inserted = await db
      .insert(campaigns)
      .values({
        name: name.trim(),
        productService: productService.trim(),
        targetAudience: targetAudience.trim(),
        budget: budgetNumber.toFixed(2),
        platform: platform.trim(),
        startDate: startDate.trim(),
        endDate: endDate.trim(),
        goal: goal.trim(),
        status: "running",
      })
      .returning({ id: campaigns.id, name: campaigns.name });

    return Response.json({
      ok: true,
      campaign: inserted[0],
      message: "Campaign created successfully.",
    });
  } catch {
    return Response.json({ ok: false, message: "Unable to create campaign right now." }, { status: 500 });
  }
}
