import type { NextApiRequest, NextApiResponse } from "next";

import { updateDocument } from "@/database/functions/native-functions";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  await updateDocument("logs", "webhook-received", {
    method,
    body: req.body,
  });

  console.log({ method });
  console.log({ body: req.body });

  return res.status(200).json({ ok: true });
}
