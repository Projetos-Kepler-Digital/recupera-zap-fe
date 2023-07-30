import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// DEV
// const firebaseConfig = {
//   apiKey: "AIzaSyAMisehSljYUgLBE3MGar9-gb0DaBYTCQ0",
//   authDomain: "recuperazap-7cc58.firebaseapp.com",
//   projectId: "recuperazap-7cc58",
//   storageBucket: "recuperazap-7cc58.appspot.com",
//   messagingSenderId: "902911258848",
//   appId: "1:902911258848:web:11a3e9fbdfadedb04d6085",
// };

const firebaseConfig = {
  apiKey: "AIzaSyBDPJgDhMnYwLnUdsnD68TFpmCegPeefTQ",
  authDomain: "recupera-zap.firebaseapp.com",
  projectId: "recupera-zap",
  storageBucket: "recupera-zap.appspot.com",
  messagingSenderId: "5219574980",
  appId: "1:5219574980:web:2677f1638c05b009cdd591",
  measurementId: "G-XWXN4MHCRL",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export default app;

export const db = getFirestore(app);
export const storage = getStorage();

export const provider = new GoogleAuthProvider();
export const auth = getAuth();
