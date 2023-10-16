import type { NextApiRequest, NextApiResponse } from 'next';

import axios from 'axios';

const qrcodeUrl = 'https://host1025.painelzapi.com.br/instance/qrcode_base64';
const token = '12Htt0-hv99RT-H58xeT-Wkf8Mz-56lvGg';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  if (method === 'POST') {
    const { userId } = req.body;
    const key = userId;

    const {
      data: { qrcode },
    } = await axios.request({
      method: 'get',
      url: `${qrcodeUrl}?key=${key}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log({ qrcode });

    return res.status(200).json({ qrcode });
  }

  res.status(405).json({ message: 'Method Not Allowed' });
}
