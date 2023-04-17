
import { initializeApp, getApps } from '@firebase/app';
import { getAnalytics } from '@firebase/analytics';
import { getDocs, collection, getFirestore, doc, setDoc, getDoc } from '@firebase/firestore';
import { signInWithEmailAndPassword, getAuth } from '@firebase/auth';

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
  try {
    const querySnapshot = await getDocs(collection(db, 'endpoints'));
    let ep = '';
    querySnapshot.forEach((doc) => {
      const endpoints = doc.data().endpoints;
      ep = endpoints.find(e => !!window.location.hostname.match(e.key)).val;
    });
    return ep;
  } catch (e) {
    return 'localhost:8080';
  }
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

export const login = (u, p, errorHandler) => {
  signInWithEmailAndPassword(getAuth(), u, p)
    .then(res => {
      console.log('Success Response', res);
    })
    .catch(err => {
      console.error('Failed to login', err);
      errorHandler(err.code || JSON.stringify(err));
    });
}

export const signOut = () => {
  getAuth().signOut();
}

export const checkAdmin = async (user, setIsAdmin, setErrorMessage) => {
  if (user) {
    const roleClaim = await user.getIdTokenResult();
    const isAdmin = roleClaim.claims.roles.includes('ADMIN');
    if (!isAdmin) {
      setErrorMessage(`User ${user.displayName} does not have admin permissions`);
      signOut();
    }
    setIsAdmin(isAdmin);
  } else {
    setIsAdmin(false);
  }
}

export const onAuthStateChanged = (next, error) => {
  getAuth().onAuthStateChanged(next, error);
}