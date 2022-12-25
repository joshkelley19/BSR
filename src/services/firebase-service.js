
import { initializeApp, getApps } from '@firebase/app';
import { getAnalytics } from '@firebase/analytics';
import { getDocs, collection, getFirestore, doc, setDoc, getDoc } from '@firebase/firestore';

export const initApp = async (setFirebase) => {
  // TODO import from file

  const firebaseConfig = {
    apiKey: "AIzaSyALkwYKFFoRCzuraR-_XV3sVvIAKzMkGrE",
    authDomain: "becomingspirituallyrich-fe537.firebaseapp.com",
    projectId: "becomingspirituallyrich-fe537",
    storageBucket: "becomingspirituallyrich-fe537.appspot.com",
    messagingSenderId: "462765930653",
    appId: "1:462765930653:web:41ddaf1ea2e9ceb9f63c74",
    measurementId: "G-MXLYN1XPGG"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const analytics = getAnalytics();
  return { app, db, analytics };
}

export const getBaseUrl = async (db) => {
  const querySnapshot = await getDocs(collection(db, 'endpoints'));
  let ep = '';
  querySnapshot.forEach((doc) => {
    const endpoints = doc.data().endpoints;
    ep = endpoints.find(e => !!window.location.hostname.match(e.key)).val;
  });
  return ep;
}

export const saveMarketing = async (db, marketing) => {
  const marketingDoc = doc(db, 'config', 'marketing');
  const marketingData = (await getDoc(marketingDoc)).data().entries;
  marketingData.push(marketing);
  setDoc(marketingDoc, { entries: marketingData });
}

export const getMarketing = async (db) => {
  return await getDocs(collection(db, 'marketing'));
}

export const getAppCount = () => {
  return getApps().length
}