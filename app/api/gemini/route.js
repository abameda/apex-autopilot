export async function POST(request) {
  try {
    const body = await request.json();
    const { endpoint, payload, apiKey } = body;

    if (!apiKey) {
      return Response.json({ error: 'No API key provided' }, { status: 400 });
    }

    const url = `${endpoint}?key=${apiKey}`;
    
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
