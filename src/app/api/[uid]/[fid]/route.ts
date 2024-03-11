import { NextRequest, NextResponse } from 'next/server';

import { parse } from '../../lib/getaways';

import { admin, db } from '@/database/admin';

import { addSeconds } from 'date-fns';

import type { User } from '@/types/User';
import type { Funnel } from '@/types/Funnel';
import type { Worker } from '@/types/Worker';

interface RequestParams {
  params: {
    uid: string;
    fid: string;
  };
}

export async function POST(request: NextRequest, { params }: RequestParams) {
  const { uid, fid } = params;

  const userQuery = db.collection('users').doc(uid);
  const funnelQuery = db.collection('funnels').doc(fid);

  const getUser = async (): Promise<User | null> => {
    const snapshot = await userQuery.get();

    if (!snapshot.exists) {
      return null;
    }

    const doc = { id: snapshot.id, ...snapshot.data() } as User;

    return doc;
  };

  const getFunnel = async (): Promise<Funnel | null> => {
    const snapshot = await funnelQuery.get();

    if (!snapshot.exists) {
      return null;
    }

    const doc = { id: snapshot.id, ...snapshot.data() } as Funnel;

    return doc;
  };

  const [user, funnel] = await Promise.all([getUser(), getFunnel()]);

  if (!user || !funnel) {
    // update error backlog
    const backlog = '';

    return NextResponse.json(
      { message: 'User or Funnel could not be found', error: backlog },
      { status: 201 }
    );
  }

  if (funnel.status === 'suspended') {
    // update error backlog
    const backlog = '';

    return NextResponse.json(
      { message: 'Funnel suspended', error: backlog },
      { status: 201 }
    );
  }

  const body = await request.json();

  const data = parse(body, funnel.getaway);

  if (!data.success) {
    // update error backlog
    const backlog = data.backlog;

    return NextResponse.json(
      { message: 'Invalid request body', error: backlog },
      { status: 400 }
    );
  }

  if (data.type === 'lead') {
    if (!funnel.events.includes(data.event)) {
      // update warn backlog
      const backlog = '';

      return NextResponse.json(
        { message: 'Event not included', error: backlog },
        { status: 200 }
      );
    }

    if (funnel.leads.includes(data.lead.phone)) {
      // update warn backlog
      const backlog = '';

      return NextResponse.json(
        { message: 'Lead is already in remarketing', error: backlog },
        { status: 200 }
      );
    }

    // update funnel statistics on leads reached
    await funnelQuery.update({
      reaches: admin.firestore.FieldValue.increment(1),
    });

    var lastPerformance = new Date();

    // create shoot workers
    const promises = funnel.shoots.map(async (shoot) => {
      lastPerformance = addSeconds(lastPerformance, shoot.shootAfter);

      const worker: Worker = {
        uid,
        fid,
        lead: data.lead,
        shoot,
        performAt: admin.firestore.Timestamp.fromDate(lastPerformance),
      };

      await db.collection('workers').add(worker);
    });

    await Promise.all(promises);

    // update success backlog

    return NextResponse.json(
      {
        sucess: true,
        message: 'Lead sucessfully introduced into funnel conversion',
      },
      { status: 200 }
    );
  }

  if (data.type === 'sale') {
    if (!funnel.leads.includes(data.lead.phone)) {
      // update warn backlog
      const backlog = '';

      return NextResponse.json(
        {
          message: 'Converted lead was not from funnel conversion',
          error: backlog,
        },
        { status: 200 }
      );
    }

    // update funnel statistics on leads recovered and revenue recovered
    const revenue = data.revenue;

    await funnelQuery.update({
      revenue: admin.firestore.FieldValue.increment(revenue),
    });

    // delete lead from funnel list of leads
    await funnelQuery.update({
      leads: admin.firestore.FieldValue.arrayRemove(data.lead.phone),
    });

    // delete shoot workers ment for this lead
    const query = db
      .collection('workers')
      .where('lead.phone', '==', data.lead.phone);

    const snapshot = await query.get();

    const promises = snapshot.docs.map((doc) => doc.ref.delete());

    await Promise.all(promises);

    // update success backlog

    return NextResponse.json(
      {
        success: true,
        message: 'Recovered lead successfully processed',
      },
      { status: 200 }
    );
  }
}
