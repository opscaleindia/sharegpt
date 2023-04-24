import { NextApiRequest, NextApiResponse } from "next";
import { createRedisInstance } from "@/lib/redis";

export default async function handler( req: NextApiRequest, res: NextApiResponse) 
{
  const redis = createRedisInstance();
  
  const { search } = req.query as { search: string };
  if (!search) {
    res.status(400).json({ error: "Invalid search param" });
    return;
  }
  if (req.method === "POST") {
    const response = await redis.zincrby("searches", 1, search.toLowerCase());
    res.status(200).json(response);
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
