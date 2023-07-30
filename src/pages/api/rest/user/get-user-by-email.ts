import type { NextApiRequest, NextApiResponse } from "next";

import { getUserByEmail } from "@/database/functions";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  if (method === "POST") {
    const { email } = req.body;
    const user = await getUserByEmail(email);

    return res.status(200).json({ userId: user?.id, user: user?.data() });
  }

  res.status(405).json({ message: "Method Not Allowed" });
}
