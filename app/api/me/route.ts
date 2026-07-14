import { getSession } from "@/app/lib/auth";

export async function GET() {
  try {
    const sessionData = await getSession();

    if (!sessionData) {
      return Response.json({ error: "Not authenticated" }, { status: 401 });
    }

    return Response.json({ user: sessionData.user }, { status: 200 });
  } catch (error: any) {
    console.error("Auth Error:", error.message);
    return Response.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
