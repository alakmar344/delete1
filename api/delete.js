export const config = {
  runtime: "nodejs"
};

export default async function handler(req, res) {
  return res.status(200).json({
    difyKey: process.env.DIFY_KEY || "NOT_FOUND",
    allEnvVars: Object.keys(process.env)
  });
}
