import { createHash } from "crypto";

function generateToken(password) {
  return createHash("sha256").update(`apex-autopilot-${password}`).digest("hex");
}

export async function POST(request) {
  try {
    const sitePassword = process.env.SITE_PASSWORD;
    if (!sitePassword) {
      return Response.json({ authenticated: true, token: "no-auth-required", hasGeminiKey: !!process.env.GEMINI_API_KEY });
    }

    const { password } = await request.json();
    if (password === sitePassword) {
      return Response.json({ authenticated: true, token: generateToken(sitePassword), hasGeminiKey: !!process.env.GEMINI_API_KEY });
    }

    return Response.json({ error: "Wrong password" }, { status: 401 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const sitePassword = process.env.SITE_PASSWORD;
    if (!sitePassword) {
      return Response.json({ authenticated: true, hasGeminiKey: !!process.env.GEMINI_API_KEY });
    }

    const token = request.headers.get("authorization");
    const expected = generateToken(sitePassword);
    if (token === expected) {
      return Response.json({ authenticated: true, hasGeminiKey: !!process.env.GEMINI_API_KEY });
    }

    return Response.json({ authenticated: false }, { status: 401 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
