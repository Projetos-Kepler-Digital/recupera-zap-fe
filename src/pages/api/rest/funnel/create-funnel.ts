import type { NextApiRequest, NextApiResponse } from "next";

import { createFunnel, updateFunnel } from "@/database/functions";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  if (method === "POST") {
    const { userId, name, getaway, events, shoots, id } = req.body;

    if (!!id) {
      await updateFunnel(userId, id, {
        userId,
        name,
        getaway,
        events,
        shoots,
      });

      return res.status(200).json({ updated: true, funnelId: id });
    }

    const funnelId = await createFunnel(userId, name, getaway, events, shoots);

    return res.status(200).json({ created: true, funnelId });
  }

  res.status(405).json({ message: "Method Not Allowed" });
}
