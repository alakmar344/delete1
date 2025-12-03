export const config = {
  runtime: "nodejs"
};

export default async function handler(req, res) {
  const key = process.env.DIFY_KEY;

  try {
    // 1. Get conversation list
    const list = await fetch("https://api.dify.ai/v1/conversations", {
      headers: { Authorization: `Bearer ${key}` }
    });

    const data = await list.json();

    if (!data.data || !Array.isArray(data.data)) {
      return res.status(500).json({ error: "Unexpected Dify response", raw: data });
    }

    const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000; // 30 days

    let deleted = 0;

    // 2. Delete old conversations
    for (const convo of data.data) {
      const created = new Date(convo.created_at).getTime();

      if (created < cutoff) {
        await fetch(`https://api.dify.ai/v1/conversations/${convo.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${key}` }
        });
        deleted++;
      }
    }

    return res.status(200).json({
      ok: true,
      total: data.data.length,
      deleted,
      message: `Deleted ${deleted} conversations older than 30 days`
    });

  } catch (err) {
    return res.status(500).json({ error: err.toString() });
  }
}
