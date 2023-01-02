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

const render = (activeTab: string, firebase: any, baseUrl: string, setErrorMessage: Function) => {
  switch (activeTab) {
    case 'marketing':
      return <Marketing firebase={firebase} setErrorMessage={setErrorMessage} />
    case 'horoscopes':
    default:
      return <HoroscopeForm firebase={firebase} baseUrl={baseUrl} setErrorMessage={setErrorMessage} />
  }
}

function App() {
  const [firebase, setFirebase] = useState({});
  const [baseUrl, setBaseUrl] = useState('');
  const [activeTab, setActiveTab] = useState(tabConfig[0].id);
  const [user, setUser] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!getAppCount()) {
      const initialize = async () => {
        const fb = await initApp();
        setFirebase(fb);
        onAuthStateChanged(async (user: any) => {
          setUser(user);
          const url = await getBaseUrl(fb.db);
          setBaseUrl(url);
          checkAdmin(user, setIsAdmin, setErrorMessage);
        },
          (err: any) => {
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
        {`Welcome ${user?.displayName}`}
        <button className="btn btn-danger m-2" onClick={() => { signOut() }}>Sign Out</button>
      </h4>
      {errorMessage ? <div className="alert alert-danger alert-dismissible fade show" role="alert">
        {errorMessage}
        <button type="button" className="btn-close" onClick={() => setErrorMessage('')} data-bs-dismiss="alert" aria-label="Close"></button>
      </div> : <div></div>}
      {isAdmin ?
        <div>
          <Navigation activeTab={activeTab} setActiveTab={setActiveTab} tabConfig={tabConfig} />
          {render(activeTab, firebase, baseUrl, setErrorMessage)}
        </div>
        :
        <Auth setErrorMessage={setErrorMessage} />}
    </div>
  );
}

export default App;
