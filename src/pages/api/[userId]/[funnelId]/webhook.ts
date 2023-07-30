import type { NextApiRequest, NextApiResponse } from "next";

import {
  createWorker,
  deleteLead,
  getFunnelById,
  getFunnelShots,
  reachLead,
  recoverLead,
} from "@/database/functions";

import { extractWebhook } from "@/lib/webhooks";

import { Timestamp } from "firebase/firestore";
import { updateDocument } from "@/database/functions/native-functions";

const incrementTimestamp = (timestamp: Timestamp, increment: number) => {
  const milliseconds = timestamp.toMillis();
  const newTimestamp = new Timestamp(
    Math.floor(milliseconds / 1000 + increment),
    milliseconds % 1000
  );

  return newTimestamp;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { method } = req;

    console.log("Webhook recebido");

    await updateDocument("logs", "webhook-received", {
      method,
      body: req.body,
    });

    if (method === "POST") {
      const { userId, funnelId } = req.query;

      const uid = userId as string;
      const fid = funnelId as string;

      await updateDocument("logs", "webhook-received", {
        ids: { uid, fid },
      });

      const funnel = await getFunnelById(uid, fid);

      await updateDocument("logs", "webhook-received", {
        funnel: funnel.name,
      });

      if (!funnel.isActive) {
        await updateDocument("logs", "webhook-received", {
          status: "Funil suspenso",
        });

        return res.status(200).send("2xx");
      }

      console.log({ funnel });

      const data = await extractWebhook(req.body, funnel.getaway);

      console.log({ data });

      await updateDocument("logs", "webhook-received", {
        data,
      });

      if (!data.event) {
        return res.status(200).send("2xx");
      }

      if (data.type !== "buy" && !funnel.events.includes(data.event)) {
        console.log("Evento desconsiderado");

        await updateDocument("logs", "webhook-received", {
          status: "Evento desconsiderado",
        });

        return res.status(200).send("2xx");
      }

      if (data.type === "recover") {
        if (funnel.leads.includes(data.lead.phone)) {
          console.log("o lead já está adicionado");

          await updateDocument("logs", "webhook-received", {
            status: "o lead já está adicionado",
          });

          return res.status(200).send("2xx");
        }

        console.log("Adicionando lead");

        await updateDocument("logs", "webhook-received", {
          status: "Adicionando lead",
        });

        const shoots = await getFunnelShots(uid, fid);

        let performAt = Timestamp.fromDate(new Date());

        await Promise.all([
          shoots.forEach(async (shoot) => {
            performAt = incrementTimestamp(performAt, shoot.startAt);
            await createWorker(uid, fid, data.lead, shoot, performAt);
          }),
        ]);

        await reachLead(uid, fid, data.lead.phone);
      }

      if (data.type === "buy") {
        if (!funnel.leads.includes(data.lead.phone)) {
          if (funnel.events.includes(data.event)) {
            console.log("Adicionando lead");

            await updateDocument("logs", "webhook-received", {
              status: "Adicionando lead",
            });

            const shoots = await getFunnelShots(uid, fid);

            let performAt = Timestamp.fromDate(new Date());

            await Promise.all([
              shoots.forEach(async (shoot) => {
                performAt = incrementTimestamp(performAt, shoot.startAt);
                await createWorker(uid, fid, data.lead, shoot, performAt);
              }),
            ]);

            await reachLead(uid, fid, data.lead.phone);

            return res.status(200).send("2xx");
          }

          console.log("O lead não está na lista de leads");

          await updateDocument("logs", "webhook-received", {
            status: "O lead não está na lista de leads",
          });

          return res.status(200).send("2xx");
        }

        console.log("Deletando lead");

        await recoverLead(uid, fid, data.revenue!, data.lead.phone);
        await deleteLead(data.lead.phone);
      }

      return res.status(200).send("2xx");
    }

    return res.status(405).json({ message: "Method Not Allowed" });
  } catch (err) {
    await updateDocument("logs", "webhook-received", {
      status: "error",
      error: err,
    });
  }
}
