import { createHash } from "crypto";

function verifyAuth(request) {
  const sitePassword = process.env.SITE_PASSWORD;
  if (!sitePassword) return true;
  const token = request.headers.get("authorization");
  const expected = createHash("sha256").update(`apex-autopilot-${sitePassword}`).digest("hex");
  return token === expected;
}

export async function POST(request) {
  try {
    if (!verifyAuth(request)) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { endpoint, payload } = body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json({ error: "Gemini API key not configured on server" }, { status: 500 });
    }

    const url = `${endpoint}?key=${apiKey}`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      return Response.json({ error: data.error?.message || `Gemini API error ${res.status}` }, { status: res.status });
    }

    return Response.json(data);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
