import type { NextApiRequest, NextApiResponse } from "next";

import { createUser } from "@/database/functions";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  if (method === "POST") {
    const { userId, name } = req.body;

    await createUser(userId, name);

    return res.status(200).json({ created: true });
  }

  res.status(405).json({ message: "Method Not Allowed" });
}
