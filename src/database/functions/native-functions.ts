import {
  collection,
  doc,
  DocumentData,
  DocumentSnapshot,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  QueryDocumentSnapshot,
  updateDoc,
  where,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "..";

// Create
export const createDocument = async (_colletion: string, fields: {}) => {
  const doc = await addDoc(collection(db, _colletion), fields);
  return doc;
};

// Read
export const getDocument = async (_colletion: string, _document: string) => {
  const document = await getDoc(doc(db, _colletion, _document));

  return document;
};

export const getDocumentsWhere = async (
  _collection: string,
  field: string,
  opStr: "<" | "<=" | "==" | "<" | "<=" | "!=",
  value: unknown
) => {
  const docs = await getDocs(
    query(collection(db, _collection), where(field, opStr, value))
  );

  let documents: QueryDocumentSnapshot<DocumentData>[] = [];
  docs.forEach((doc) => {
    documents.push(doc);
  });

  return documents;
};

export const getOnSnapshot = (
  _collection: string,
  _document: string,
  fn: (doc: DocumentSnapshot<DocumentData>) => void
) => {
  const unsubscribe = onSnapshot(doc(db, _collection, _document), (doc) =>
    fn(doc)
  );

  return unsubscribe;
};

// Update
export const updateDocument = async (
  _colletion: string,
  _document: string,
  fields: {}
) => {
  await updateDoc(doc(db, _colletion, _document), fields);
};

// Delete
export const deleteDocument = async (_colletion: string, _document: string) => {
  await deleteDoc(doc(db, _colletion, _document));
};
