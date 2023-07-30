import type { NextApiRequest, NextApiResponse } from "next";

import axios from "axios";

const instanceUrl =
  "https://host1025.painelzapi.com.br/instance/create_connection";

const token = "12Htt0-hv99RT-H58xeT-Wkf8Mz-56lvGg";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  if (method === "POST") {
    const { userId } = req.body;
    const key = userId;

    const {
      data: { error, message, enabled, webhook },
    } = await axios.request({
      method: "get",
      url: `${instanceUrl}?key=${key}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.status(200).json({ created: !error });
  }

  res.status(405).json({ message: "Method Not Allowed" });
}
