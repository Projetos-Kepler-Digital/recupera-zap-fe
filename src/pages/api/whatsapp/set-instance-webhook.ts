import type { NextApiRequest, NextApiResponse } from "next";

import axios from "axios";

const url = "https://host1025.painelzapi.com.br/webhook/setWebhookUpdate";

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
      data: { error, message },
    } = await axios.request({
      method: "post",
      url: `${url}?key=${key}&webhook=https://recupera-zap.vercel.app/api/${userId}/wpp-connection`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.status(200).json({ setted: !error });
  }

  res.status(405).json({ message: "Method Not Allowed" });
}
