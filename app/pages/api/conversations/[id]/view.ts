import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query as { id: string };
  if (!id) {
    return new Response("Invalid ID", { status: 400 });
  }
  if (req.method === "POST") {

    const response= await prisma.conversation.update({
      where: { id: id },
      data: { views: { increment: 1 } }
    });

    res.status(200).json(response);
  } else {
    return new Response(`Method ${req.method} Not Allowed`, { status: 405 });
  }
}
