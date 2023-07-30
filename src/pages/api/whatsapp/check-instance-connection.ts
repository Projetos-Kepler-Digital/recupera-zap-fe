import type { NextApiRequest, NextApiResponse } from "next";

import axios from "axios";

const url = "https://host1025.painelzapi.com.br/instance/info_connection";
const token = "12Htt0-hv99RT-H58xeT-Wkf8Mz-56lvGg";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  if (method === "POST") {
    const { userId } = req.body;
    const key = userId;

    try {
      const {
        data: {
          instance_data: { phone_connected },
        },
      } = await axios.request({
        method: "get",
        url: `${url}?key=${key}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log({ connected: phone_connected });
      return res.status(200).json({ connected: !!phone_connected });
    } catch (err) {
      return res.status(200).json({ connected: false });
    }
  }

  res.status(405).json({ message: "Method Not Allowed" });
}
