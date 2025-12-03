export default async function handler(req, res) {
  await fetch("https://api.dify.ai/v1/conversations", {
    headers: { Authorization: `Bearer ${process.env.DIFY_KEY}` }
  })
    .then(r => r.json())
    .then(async data => {
      const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;

      for (const c of data.data) {
        const created = new Date(c.created_at).getTime();
        if (created < cutoff) {
          await fetch(`https://api.dify.ai/v1/conversations/${c.id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${process.env.DIFY_KEY}` }
          });
        }
      }
    });

  res.status(200).json({ ok: true });
}
