import React, { useState, useEffect } from 'react';
import { initializeApp, getApps } from '@firebase/app';
import { getAnalytics } from '@firebase/analytics';
import { getDocs, collection, getFirestore } from '@firebase/firestore';
import { format } from 'date-fns';
import { HoroscopeGrid } from './grid';

const gridTypesConfig = [{
  textVal: 'Categories by type',
  val: 'CATEGORY'
}, {
  textVal: 'All Categories',
  val: 'ALL'
}, {
  textVal: 'App Preview',
  val: 'APP'
}]

const renderGridTypes = function renderGridTypes(gridTypesConfig, type, setGridType) {
  return gridTypesConfig.map(config => {
    const configId = `grid-type-option-${config.val.toLowerCase()}`;
    return <React.Fragment key={`input-${configId}`}>
      <input type="radio" id={configId} className="btn-check" name="grid-type" autoComplete="off" />
      <label className={`btn btn-${type === config.val ? '' : `outline-`}primary`} htmlFor={configId} onClick={() => setGridType(config.val)}>{config.textVal}</label>
    </React.Fragment>
  })
}.bind(null, gridTypesConfig);

function setValue(setFunction, event) {
  setFunction(event.target.value);
}

// TODO convert to getCategoryUrl() with single categories loading and error message
async function getAllCategoriesByType(type, columnSetter, valueSetter, errorMessageSetter, baseUrl) {
  if (type) {
    try {
      const categories = await (await fetch(`${baseUrl}/api/horoscope/categories/${type}`)).json();
      loadCategories(columnSetter, valueSetter, categories)
    } catch (e) {
      errorMessageSetter(`Failed to load categories: ${e.toString()}`);
      console.error('Error loading categories', e);
    }
  }
}

async function getAllCategories(columnSetter, valueSetter, errorMessageSetter, baseUrl) {
  try {
    const categories = await (await fetch(`${baseUrl}/api/horoscope/categories/all`)).json();
    loadCategories(columnSetter, valueSetter, categories);
  } catch (e) {
    errorMessageSetter(`Failed to load categories: ${e.toString()}`);
    console.error('Error loading categories', e);
  }
}

function loadCategories(columnSetter, valueSetter, categories) {
  if (categories.length) {
    columnSetter(Object.keys(categories[0]));
    valueSetter(categories);
  }
}

function renderOptions(options, upper, label) {
  const optionsList = options.map((val, index) => {
    return (<option key={index} value={upper ? val.toUpperCase() : val}>{val}</option>);
  });
  optionsList.unshift((<option id="select-placeholder" key="select-placeholder"> {label} </option>
  ))
  return optionsList;
}

function setCategoryFormFields(setSign, setInterval, setStartDate, category) {
  setSign(category.sign);
  setInterval(category.interval);
  const startDate = new Date(category.endDate);
  startDate.setMinutes(startDate.getMinutes() + 1);
  console.log(startDate);
  setStartDate(startDate.toISOString().slice(0, -2));
  console.log('Category', category);
}

export const HoroscopeForm = (props) => {
  const [sign, setSign] = useState('');
  const [header, setHeader] = useState('');
  const [horoscope, setHoroscope] = useState('');
  const [interval, setInterval] = useState('NONE');
  const [type, setType] = useState('');
  // TODO pull categories and signs from backend
  const [signs] = useState(['Aries', 'Taurus', 'Gemini', 'Cancer',
    'Leo', 'Virgo', 'Libra', 'Scorpio',
    'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']);
  const [intervals] = useState(['None', 'Monthly', 'Weekly', 'Daily']);
  const [types] = useState(['Horoscope', 'Sun', 'Current Moon', 'Rising', 'New Moon',
    'Full Moon', 'Mercury', 'Venus', 'Earth', 'Mars',
    'Saturn', 'Jupiter', 'Uranus', 'Neptune', 'Pluto']);
  const [tableValues, setTableValues] = useState([]);
  const [tableFields, setTableFields] = useState([]);
  const [startDate, setStartDate] = useState((new Date()));
  const [endDate, setEndDate] = useState(new Date());
  const [gridType, setGridType] = useState('CATEGORY');
  const [baseUrl, setBaseUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (!getApps().length) {
      const initApp = async () => {
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
        console.log('firebase', app, analytics);

        const querySnapshot = await getDocs(collection(db, 'endpoints'));
        querySnapshot.forEach((doc) => {
          const endpoints = doc.data().endpoints;
          const ep = endpoints.find(e => !!window.location.hostname.match(e.key));
          setBaseUrl(ep.val);
          console.log(`${doc.id} => ${doc.data()}`);
          console.log('Endpoints', endpoints, ep);
        });
      }
      initApp();
    }
  }, [])

  useEffect(() => {
    switch (gridType) {
      case 'CATEGORY': if (type) {
        getAllCategoriesByType(type, setTableFields, setTableValues, setErrorMessage, baseUrl);
      }
        break;
      case 'ALL': getAllCategories(setTableFields, setTableValues, setErrorMessage, baseUrl); break;
      case 'APP': //TODO get categories for app
        break;
      default:
    }
  }, [type, gridType, baseUrl])

  async function submitHoroscope() {
    const body = {
      type,
      sign,
      header,
      description: horoscope,
      increment: interval,
      startDate: format(new Date(startDate), 'yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\''),//new Date(startDate).toISOString(),
      endDate: format(new Date(endDate), 'yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\''),//new Date(endDate).toISOString(),
      active: true,
      category: null
    }
    console.log('Submission', body);
    try {
      await fetch(`${baseUrl}/api/horoscope`, {
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        mode: 'cors'
      });
      getAllCategoriesByType(type, setTableFields, setTableValues, setErrorMessage, baseUrl);
    } catch (e) {
      console.error('fetch error', e);
    }
  }

  return <div>
    <h1 className="text-center">Becoming Spiritually Rich</h1>
    {errorMessage ? <div class="alert alert-danger alert-dismissible fade show" role="alert">
      {errorMessage}
      <button type="button" class="btn-close" onClick={() => setErrorMessage(null)} data-bs-dismiss="alert" aria-label="Close"></button>
    </div> : <div></div>}
    <div id="horoscope-fields" className="container">
      {/* TODO implement grid */}
      <div className="mb-3">
        <select id="type-select" className="form-select form-select-med" aria-label="Type select"
          onChange={(e) => setValue(setType, e)} value={type}>
          {renderOptions(types, false, 'Please Select a Type')}
        </select>
      </div>
      <div className="mb-3">
        <select id="sign-select" className="form-select form-select-med" aria-label="Sign select"
          onChange={(e) => setValue(setSign, e)} value={sign} >
          {renderOptions(signs, true, 'Please Select a Zodiac Sign')}
        </select>
      </div>
      <div className="mb-3">
        <select id="interval-select" className="form-select form-select-med" aria-label="Interval select"
          onChange={(e) => setValue(setInterval, e)} value={interval}>
          {renderOptions(intervals, true, 'Please Select an Interval')}
        </select>
      </div>
      <div className="d-flex flex-row">
        <div className="mb-3">
          <label htmlFor="start-date" className="form-label">Start Date</label>
          <input type="datetime-local" className="form-control"
            onChange={(e) => setValue(setStartDate, e)} value={startDate} />
        </div>
        <div className="mb-3 px-3">
          {!interval || interval === 'NONE' ?
            <div>
              <label htmlFor="end-date" className="form-label">End Date</label>
              <input type="datetime-local" className="form-control"
                onChange={(e) => setValue(setEndDate, e)} value={endDate} /></div> : ''}
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="header-input" className="form-label">Header</label>
        <input id="header-input" className="form-control" maxLength="120"
          onChange={(e) => setValue(setHeader, e)} value={header} />
      </div>
      <div className="mb-3">
        <label htmlFor="horoscope-input" className="form-label">Horoscope</label>
        <textarea id="horoscope-input" className="form-control" maxLength="255"
          onChange={(e) => setValue(setHoroscope, e)} value={horoscope} />
      </div>
      <button type="button" className="btn btn-primary my-2"
        onClick={() => submitHoroscope()}>Submit</button>
    </div>

    <div className="btn-group grid-type-selection" role="group" aria-label="Grid Types">
      {renderGridTypes(gridType, setGridType)}
    </div>

    <div id="horoscope-list">
      <HoroscopeGrid columns={tableFields} values={tableValues} blacklist={['id', 'name', 'active']}
        whitelist={['interval']} setCategory={setCategoryFormFields.bind(null, setSign, setInterval, setStartDate)} />
    </div>
  </div>
}