export const config = {
  runtime: "nodejs18.x"
};

export default async function handler(req, res) {
  console.log("🔥 Function started");

  try {
    const key = process.env.DIFY_KEY;
    if (!key) {
      console.error("❌ No DIFY_KEY found!");
      return res.status(500).json({ error: "DIFY_KEY missing" });
    }

    console.log("🔑 DIFY_KEY loaded");

    // Test call to Dify API
    const list = await fetch("https://api.dify.ai/v1/conversations", {
      headers: { Authorization: `Bearer ${key}` }
    });

    const data = await list.json();

    console.log("📥 Conversations fetched:", data);

    return res.status(200).json({
      ok: true,
      conversations_received: Array.isArray(data.data),
      count: data.data?.length || 0
    });

  } catch (err) {
    console.error("🔥 ERROR:", err);
    return res.status(500).json({ error: err.toString() });
  }
}
