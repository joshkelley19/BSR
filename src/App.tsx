import React, { useEffect, useState } from 'react';
// import logo from './logo.svg';
import './App.css';
import Auth from './auth';
import { HoroscopeForm } from './horoscope-form';
import Marketing from './marketing';
import Navigation from './navigation';
import { getAppCount, initApp, getBaseUrl, onAuthStateChanged, checkAdmin, signOut } from './services/firebase-service';


const tabConfig = [{
  name: 'Horoscopes',
  id: 'horoscopes'
}, {
  name: 'Marketing',
  id: 'marketing'
}]

const render = (activeTab: string, firebase: object, baseUrl: string, setErrorMessage: React.Dispatch<React.SetStateAction<string>>) => {
  switch (activeTab) {
    case 'marketing':
      return <Marketing firebase={firebase} setErrorMessage={setErrorMessage} />
    case 'horoscopes':
    default:
      return <HoroscopeForm baseUrl={baseUrl} setErrorMessage={setErrorMessage} />
  }
}

function App() {
  const [firebase, setFirebase] = useState<object>({});
  const [baseUrl, setBaseUrl] = useState('');
  const [activeTab, setActiveTab] = useState(tabConfig[0].id);
  const [user, setUser] = useState<{ displayName: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!getAppCount()) {
      const initialize = async () => {
        const fb = await initApp();
        setFirebase(fb);
        onAuthStateChanged(async (user: { displayName: string }) => {
          setUser(user);
          const url = await getBaseUrl(fb.db);
          setBaseUrl(url);
          checkAdmin(user, setIsAdmin, setErrorMessage);
        },
          (err: Error) => {
            console.error('Error getting auth state: ', err);
          });
      }
      initialize();
    }
  }, [])

  return (
    <div className="App">
      <h1 className="text-center">
        Becoming Spiritually Rich - Admin
      </h1>
      <h4 className="text-center">
        {user ? <>
          `Welcome {user?.displayName || 'Admin'}`
          <button className="btn btn-danger m-2" onClick={() => { signOut() }}>Sign Out</button>
        </>
          :
          'Sign In'
        }
      </h4>
      {
        errorMessage ? <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {errorMessage}
          <button type="button" className="btn-close" onClick={() => setErrorMessage('')} data-bs-dismiss="alert" aria-label="Close"></button>
        </div> : <div></div>
      }
      {
        isAdmin ?
          <div>
            <Navigation activeTab={activeTab} setActiveTab={setActiveTab} tabConfig={tabConfig} />
            {render(activeTab, firebase, baseUrl, setErrorMessage)}
          </div>
          :
          <Auth setErrorMessage={setErrorMessage} />
      }
    </div >
  );
}

export default App;
