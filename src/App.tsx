import React, { useEffect, useState } from 'react';
// import logo from './logo.svg';
import './App.css';
import { HoroscopeForm } from './horoscope-form';
import Marketing from './marketing';
import Navigation from './navigation';
import { getAppCount, initApp, getBaseUrl } from './services/firebase-service';


const tabConfig = [{
  name: 'Horoscopes',
  id: 'horoscopes'
}, {
  name: 'Marketing',
  id: 'marketing'
}]

const render = (activeTab: string, firebase: any, baseUrl: string) => {
  switch (activeTab) {
    case 'marketing':
      return <Marketing firebase={firebase} />
    case 'horoscopes':
    default:
      return <HoroscopeForm firebase={firebase} baseUrl={baseUrl} />
  }
}

function App() {
  const [firebase, setFirebase] = useState({});
  const [baseUrl, setBaseUrl] = useState('');
  const [activeTab, setActiveTab] = useState(tabConfig[0].id);

  useEffect(() => {
    if (!getAppCount()) {
      const initialize = async () => {
        const fb = await initApp();
        setFirebase(fb);
        const url = await getBaseUrl(fb.db);
        setBaseUrl(url);
      }
      initialize();
    }
  }, [])

  return (
    <div className="App">
      <h1 className="text-center">Becoming Spiritually Rich</h1>
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} tabConfig={tabConfig} />
      {render(activeTab, firebase, baseUrl)}
    </div>
  );
}

export default App;
