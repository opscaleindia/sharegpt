import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { Session } from "@/lib/types";

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
    const response = await prisma.save.findUnique({
      where: {
        conversationId_userId: {
          conversationId: id,
          userId,
        },
      },
    });
    res.status(200).json({
      saved: !!response,
    });
  } else if (req.method === "POST") {
    const response = await prisma.save.create({
      data: {
        conversationId: id,
        userId,
      },
    });
    res.status(200).json(response);
  } else if (req.method === "DELETE") {
    const response = await prisma.save.delete({
      where: {
        conversationId_userId: {
          conversationId: id,
          userId,
        },
      },
    });
    res.status(200).json(response);
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
