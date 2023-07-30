import type { NextApiRequest, NextApiResponse } from "next";

import { deleteFunnel } from "@/database/functions";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  if (method === "POST") {
    const { userId, funnelId, revenue, leadsReached, leadsRecovered } =
      req.body;

    await deleteFunnel(userId, funnelId, revenue, leadsReached, leadsRecovered);

    return res.status(200).json({ deleted: true });
  }

  res.status(405).json({ message: "Method Not Allowed" });
}
