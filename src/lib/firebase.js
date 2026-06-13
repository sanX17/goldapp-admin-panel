import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";

import { getStorage } from "firebase/storage";

const fallbackFirebaseConfig = {
 apiKey: "AIzaSyARcrAtt1ucAjMqPEHxSx74kUDu2ILNBYA",
 authDomain: "gold-scheme-2026.firebaseapp.com",
 projectId: "gold-scheme-2026",
 storageBucket: "gold-scheme-2026.firebasestorage.app",
 appId: "1:945003319935:web:20b82f53154455cc72e54a"
};

const firebaseConfig = {

 apiKey: process.env.NEXT_PUBLIC_API_KEY || fallbackFirebaseConfig.apiKey,

 authDomain:
 process.env.NEXT_PUBLIC_AUTH_DOMAIN || fallbackFirebaseConfig.authDomain,

 projectId:
 process.env.NEXT_PUBLIC_PROJECT_ID || fallbackFirebaseConfig.projectId,

 storageBucket:
 process.env.NEXT_PUBLIC_STORAGE_BUCKET || fallbackFirebaseConfig.storageBucket,
 

 appId:
 process.env.NEXT_PUBLIC_APP_ID || fallbackFirebaseConfig.appId

};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const storage = getStorage(app);
