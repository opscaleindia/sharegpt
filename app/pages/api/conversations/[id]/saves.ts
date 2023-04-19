import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { Session } from "@/lib/types";
import { authOptions } from "pages/api/auth/[...nextauth]";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const { id } = req.query as { id: string };
  
  const session = (await getServerSession(
    req,
    res,
    authOptions
  )) as Session;
  const userId = session?.user?.id;

  if (!userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  if (req.method === "GET") {
    const data = await prisma.save.findMany({
      where: {
          conversationId: id,
        },
      },
    );
    res.status(200).json({count: data.length});
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
