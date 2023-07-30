import type { NextApiRequest, NextApiResponse } from "next";

import { getFunnelById } from "@/database/functions";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  if (method === "POST") {
    const { userId, funnelId } = req.body;

    const funnel = await getFunnelById(userId, funnelId);

    return res.status(200).json({ funnel });
  }

  res.status(405).json({ message: "Method Not Allowed" });
}
