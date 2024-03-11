'use server';

import { admin, db } from '@/database/admin';

import { addSeconds } from 'date-fns';

import type { Funnel, Lead } from '@/types/Funnel';
import type { Worker } from '@/types/Worker';

export async function createWorker(
  funnel: Funnel,
  lead: Lead,
  delay: number
): Promise<void> {
  var lastPerformance = addSeconds(new Date(), delay);

  const promises = funnel.shoots.map(async (shoot) => {
    lastPerformance = addSeconds(lastPerformance, shoot.shootAfter);

    const worker: Worker = {
      uid: funnel.uid,
      fid: funnel.id,
      lead,
      shoot,
      performAt: admin.firestore.Timestamp.fromDate(lastPerformance),
    };

    await db.collection('workers').add(worker);
  });

  await Promise.all(promises);
}

export async function sendMultiShot(
  fid: string,
  leads: Lead[],
  delay: number
): Promise<void> {
  const funnelQuery = db.collection('funnels').doc(fid);

  const snapshot = await funnelQuery.get();

  const funnel = { id: snapshot.id, ...snapshot.data() } as Funnel;

  await funnelQuery.update({
    leads: admin.firestore.FieldValue.arrayUnion(
      leads.map((lead) => lead.phone)
    ),
    reaches: admin.firestore.FieldValue.increment(leads.length),
  });

  const promises = leads.map((lead, index) =>
    createWorker(funnel, lead, delay * index)
  );

  await Promise.all(promises);
}
