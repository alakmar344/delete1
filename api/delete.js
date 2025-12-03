export const config = {
  runtime: "nodejs"
};

export default async function handler(req, res) {
  const key = process.env.DIFY_KEY;

  try {
    // 1. Get ALL conversations
    const list = await fetch("https://api.dify.ai/v1/conversations", {
      headers: { Authorization: `Bearer ${key}` }
    });

    const data = await list.json();

    if (!data.data || !Array.isArray(data.data)) {
      return res.status(500).json({ error: "Unexpected Dify response", raw: data });
    }

    let deleted = 0;

    // 2. DELETE EVERYTHING (no condition)
    for (const convo of data.data) {
      await fetch(`https://api.dify.ai/v1/conversations/${convo.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${key}` }
      });
      deleted++;
    }

    return res.status(200).json({
      ok: true,
      total: data.data.length,
      deleted,
      message: `Deleted ALL (${deleted}) conversations`
    });

  } catch (err) {
    return res.status(500).json({ error: err.toString() });
  }
}
