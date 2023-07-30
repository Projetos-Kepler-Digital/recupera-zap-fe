import type { NextApiRequest, NextApiResponse } from "next";

import { getUserFunnelsByUserEmail } from "@/database/functions";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  if (method === "POST") {
    const { email } = req.body;

    const funnels = await getUserFunnelsByUserEmail(email);

    return res.status(200).json({ funnels });
  }

  res.status(405).json({ message: "Method Not Allowed" });
}
