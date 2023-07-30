import { NextApiRequest, NextApiResponse } from "next";

import { createDocument } from "@/database/functions/native-functions";
import { deleteUser, getUserByEmail } from "@/database/functions";
import { Timestamp } from "firebase/firestore";

type Hotmart = {
  event: "PURCHASE_APPROVED";
  data: {
    buyer: {
      email: string;
    };
  };
} & {
  event: "SUBSCRIPTION_CANCELLATION";
  data: {
    subscriber: {
      email: string;
    };
  };
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("webhook recebido");

  const body: Hotmart = req.body;

  if (req.method === "POST") {
    const { event } = body;

    if (event === "PURCHASE_APPROVED") {
      const {
        data: {
          buyer: { email },
        },
      } = body;

      await createDocument("users", {
        createdAt: Timestamp.now(),
        email,
      });
    }

    if (event === "SUBSCRIPTION_CANCELLATION") {
      const {
        data: {
          subscriber: { email },
        },
      } = body;

      const user = await getUserByEmail(email);

      if (!!user) {
        await deleteUser(user.id);
      }
    }

    return res.status(200).send("2xx");
  } else {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed.");
  }
};
