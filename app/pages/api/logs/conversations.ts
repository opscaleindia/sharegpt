import { NextApiRequest, NextApiResponse } from "next";
import { redis } from "@/lib/upstash";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { search } = req.query as { search: string };
  if (!search) {
    return new Response("Invalid search param", { status: 400 });
  }
  if (req.method === "POST") {
    const response = await redis.ZINCRBY("searches", 1, search.toLowerCase());
    res.status(200).json(response);
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
