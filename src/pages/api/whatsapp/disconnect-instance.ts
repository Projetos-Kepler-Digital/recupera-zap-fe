import type { NextApiRequest, NextApiResponse } from "next";

import { updateDocument } from "@/database/functions/native-functions";
import axios from "axios";

const instanceUrl =
  "https://host1025.painelzapi.com.br/instance/logout_connection";

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
      method: "delete",
      url: `${instanceUrl}?key=${key}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    await updateDocument("users", userId, {
      whatsapp: false,
    });

    return res.status(200).json({ deleted: !error });
  }

  res.status(405).json({ message: "Method Not Allowed" });
}
