import { db, storage } from "..";

import { deleteUser as deleteUserAuth } from "firebase/auth";

import {
  DocumentData,
  QueryDocumentSnapshot,
  QuerySnapshot,
  Timestamp,
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

import {
  deleteDocument,
  getDocumentsWhere,
  getOnSnapshot,
  updateDocument,
} from "./native-functions";

import type { User } from "../types/User";
import type { Funnel, Getaway } from "../types/Funnel";
import type { Shoot } from "../types/Shoot";
import type { Lead } from "../types/Lead";

const washDocs = (
  docs: QuerySnapshot<DocumentData>
): QueryDocumentSnapshot<DocumentData>[] => {
  let documents: QueryDocumentSnapshot<DocumentData>[] = [];
  docs.forEach((doc) => {
    documents.push(doc);
  });

  return documents;
};

// Colections
const _users = "users";
const _workers = "workers";
const _funnels = "funnels";
const _shoots = "shoots";

// Create
export const createUser = async (userId: string, name: string) => {
  const user = await updateDocument(_users, userId, {
    name,
    instance: null,
    activeFunnels: 0,
    leadsReached: 0,
    leadsRecovered: 0,
    revenue: 0,
  });

  return user;
};

export const createFunnel = async (
  userId: string,
  name: string,
  getaway: Getaway,
  events: Event[],
  shoots: Shoot[]
): Promise<string> => {
  const funnelRef = await addDoc(collection(db, _users, userId, _funnels), {
    createdAt: new Date(),
    isActive: true,
    name,
    getaway,
    events,
    leads: [],
    revenue: 0,
    leadsReached: 0,
    leadsRecovered: 0,
  });

  await updateDocument(_users, userId, {
    activeFunnels: increment(1),
  });

  Promise.all([
    shoots.forEach(async (shoot) => {
      await addDoc(
        collection(db, _users, userId, _funnels, funnelRef.id, _shoots),
        {
          ...shoot,
        }
      );
    }),
  ]);

  return funnelRef.id;
};

export const createWorker = async (
  userId: string,
  funnelId: string,
  lead: Lead,
  shoot: Shoot,
  performAt: Timestamp
) => {
  await addDoc(collection(db, _workers), {
    userId,
    funnelId,
    status: "scheduled",
    performAt,
    lead,
    shoot,
  });
};

export const uploadFileToStorage = async (userId: string, file: File) => {
  const fileRef = ref(storage, `${userId}/${file.name}`);
  await uploadBytes(fileRef, file);

  return await getDownloadURL(fileRef);
};

export const deleteFileFromStorage = async (
  userId: string,
  funnelId: string
) => {
  await deleteObject(ref(storage, `${userId}/${funnelId}`));
};

// Read
export const getUserByEmail = async (email: string) => {
  const docs = await getDocumentsWhere(_users, "email", "==", email);

  if (docs.length === 0) {
    return null;
  }

  return docs[0];
};

export const getUserOnSnapshot = async (
  userId: string,
  fn: (user: User) => void
) => {
  const unsubscribe = getOnSnapshot(_users, userId, (doc) => {
    fn({ ...doc.data(), id: doc.id } as User);
  });

  return unsubscribe;
};

export const getUserFunnelsByUserEmail = async (email: string) => {
  const user = await getUserByEmail(email);

  if (!user) return;

  const docs = await getDocs(collection(db, _users, user.id, _funnels));

  const funnelsDocs = washDocs(docs);
  const funnels = funnelsDocs.map((funnel) => {
    return { id: funnel.id, ...funnel.data() };
  });

  return funnels as Funnel[];
};

export const getFunnelById = async (userId: string, funnelId: string) => {
  const funnel = await getDoc(doc(db, _users, userId, _funnels, funnelId));

  return funnel.data() as Funnel;
};

export const getFunnelShots = async (userId: string, funnelId: string) => {
  const docs = await getDocs(
    collection(db, _users, userId, _funnels, funnelId, _shoots)
  );

  const shootsDocs = washDocs(docs);
  const shoots = shootsDocs.map((shoot) => shoot.data());

  return shoots as Shoot[];
};

// Update
export const reachLead = async (
  userId: string,
  funnelId: string,
  phone: string
) => {
  await updateDoc(doc(db, _users, userId), {
    leadsReached: increment(1),
  });

  await updateDoc(doc(db, _users, userId, _funnels, funnelId), {
    leadsReached: increment(1),
    leads: arrayUnion(phone),
  });
};

export const recoverLead = async (
  userId: string,
  funnelId: string,
  revenue: number,
  phone: string
) => {
  await updateDoc(doc(db, _users, userId, _funnels, funnelId), {
    leadsRecovered: increment(1),
    revenue: increment(revenue),
    leads: arrayRemove(phone),
  });

  await updateDoc(doc(db, _users, userId), {
    leadsRecovered: increment(1),
    revenue: increment(revenue),
  });
};

export const updateFunnel = async (
  userId: string,
  funnelId: string,
  data: {}
) => {
  await updateDoc(doc(db, _users, userId, _funnels, funnelId), {
    ...data,
  });
};

// Delete
export const deleteUser = async (userId: string) => {
  await deleteDocument(_users, userId);
};

export const deleteFunnel = async (
  userId: string,
  funnelId: string,
  revenue: number,
  leadsReached: number,
  leadsRecovered: number
) => {
  await deleteDoc(doc(db, _users, userId, _funnels, funnelId));

  const batch: Promise<any>[] = [];

  const shoots = await getDocs(
    collection(db, _users, userId, _funnels, funnelId, _shoots)
  );

  shoots.forEach((snapshot) => {
    const job = deleteDoc(snapshot.ref);
    batch.push(job);
  });

  await Promise.all(batch);

  await updateDoc(doc(db, _users, userId), {
    activeFunnels: increment(-1),
    revenue: increment(-revenue),
    leadsReached: increment(-leadsReached),
    leadsRecovered: increment(-leadsRecovered),
  });

  const workers = await getDocumentsWhere("jobs", "funnelId", "==", funnelId);

  await Promise.all(
    workers.map(async (worker) => {
      await deleteDoc(worker.ref);
    })
  );
};

export const deleteLead = async (phone: string) => {
  const leadWorkersDocs = await getDocs(
    query(collection(db, _workers), where("lead.phone", "==", phone))
  );

  const leadWorkers = washDocs(leadWorkersDocs);

  if (!!leadWorkers.length) {
    Promise.all([
      leadWorkers.forEach(async (lead) => {
        await deleteDoc(lead.ref);
      }),
    ]);
  }
};
