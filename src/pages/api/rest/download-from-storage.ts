import type { NextApiRequest, NextApiResponse } from "next";

import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  if (method === "POST") {
    const { url } = req.body;

    const { data } = await axios.get(url, { responseType: "blob" });

    return res.status(200).json({ fileData: data });
  }

  res.status(405).json({ message: "Method Not Allowed" });
}
