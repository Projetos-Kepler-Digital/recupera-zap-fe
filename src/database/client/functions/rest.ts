import { db } from '..';

import * as firestore from 'firebase/firestore';

import type { License, User } from '@/types/User';
import type { Funnel } from '@/types/Funnel';

// CREATE
export const createDocument = async (
  data: Record<string, unknown>,
  col: string,
  id?: string
): Promise<firestore.DocumentReference> => {
  if (id) {
    const ref = firestore.doc(db, col, id);
    await firestore.setDoc(ref, data);
    return ref;
  }

  const ref = firestore.collection(db, col);
  return await firestore.addDoc(ref, data);
};

export const createUser = async (user: User): Promise<void> => {
  const { id, ...data } = user;
  await createDocument(data, 'users', id);
};

export const createFunnel = async (
  funnel: Omit<Funnel, 'id'>
): Promise<string> => {
  const ref = await createDocument(funnel, 'funnels');
  return ref.id;
};

// READ
export const getDocument = async <T>(
  col: string,
  id: string
): Promise<T | null> => {
  const ref = firestore.doc(db, col, id);
  const snapshot = await firestore.getDoc(ref);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as T;
};

export const getDocumentsWhere = async <T>(
  field: string,
  opStr: firestore.WhereFilterOp,
  value: unknown,
  path: string,
  ...pathSegments: string[]
): Promise<T[]> => {
  const query = firestore.query(
    firestore.collection(db, path, ...pathSegments),
    firestore.where(field, opStr, value)
  );

  const snapshot = await firestore.getDocs(query);

  if (snapshot.empty) {
    return [];
  }

  const docs: T[] = snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as T)
  );

  return docs;
};

export const getDocumentOnSnapshot = (
  col: string,
  id: string,
  callback: (snapshot: firestore.DocumentSnapshot) => unknown
): firestore.Unsubscribe => {
  const ref = firestore.doc(db, col, id);
  return firestore.onSnapshot(ref, callback);
};

export const getLicense = async (email: string): Promise<License | null> => {
  const licenses = await getDocumentsWhere<License>(
    'email',
    '==',
    email,
    'licenses'
  );

  if (!licenses.length) {
    return null;
  }

  return licenses[0];
};

export const getUser = async (uid: string): Promise<User | null> => {
  return await getDocument<User>('users', uid);
};

export const getUserOnSnapshot = (
  uid: string,
  callback: (user: User) => void
): firestore.Unsubscribe => {
  return getDocumentOnSnapshot('users', uid, (snapshot) =>
    callback({ id: snapshot.id, ...snapshot.data() } as User)
  );
};

export const getUserFunnelsOnSnapshot = (
  uid: string,
  callback: (funnels: Funnel[]) => void
) => {
  const query = firestore.query(
    firestore.collection(db, 'funnels'),
    firestore.where('uid', '==', uid)
  );

  return firestore.onSnapshot(query, (snapshot) =>
    callback(
      snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Funnel))
    )
  );
};

// UPDATE
export const updateDocument = async (
  col: string,
  id: string,
  data: Record<string, any>
) => {
  const ref = firestore.doc(db, col, id);
  return await firestore.updateDoc(ref, data);
};

export const updateUser = async (
  uid: string,
  user: Partial<User>
): Promise<void> => {
  return await updateDocument('users', uid, user);
};

export const updateFunnel = async (
  id: string,
  funnel: Partial<Funnel>
): Promise<void> => {
  return await updateDocument('funnels', id, funnel);
};

// DELETE
export const deleteDocument = async (
  col: string,
  id: string
): Promise<void> => {
  const ref = firestore.doc(db, col, id);
  await firestore.deleteDoc(ref);
};

export const deleteLicense = async (id: string): Promise<void> => {
  return await deleteDocument('licenses', id);
};

export const deleteUser = async (uid: string) => {
  return await deleteDocument('users', uid);
};

export const deleteFunnel = async (id: string) => {
  return await deleteDocument('funnels', id);
};
