import { deleteSession, getSession, createAuditLog } from "@/app/lib/auth";

export async function POST(request: Request) {
  try {
    const ipAddress = request.headers.get("x-forwarded-for") || undefined;
    const userAgent = request.headers.get("user-agent") || undefined;
    const sessionData = await getSession();

    if (sessionData) {
      await createAuditLog("LOGOUT", sessionData.user.id, ipAddress, userAgent);
    }

    await deleteSession();
    return Response.json({ message: "Logged out successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Logout Error:", error.message);
    return Response.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
