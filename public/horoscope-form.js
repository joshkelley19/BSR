// 'use strict';
const { useState, useEffect } = React;

// import HoroscopeGrid from "./grid";

const e = React.createElement;

async function getAllCategoriesByType(type, columnSetter, valueSetter) {
  const categories = await (await fetch(`http://localhost:8080/api/horoscope/categories/${type}`)).json();
  if (categories.length) {
    columnSetter(Object.keys(categories[0]));
    valueSetter(categories);
  }
}

function setCategoryFormFields(setType, setSign, setStartDate, category) {
  setType(category.type);
  setSign(category.sign);
  // TODO add 1 second
  setStartDate(category.endDate + 1);
}

function HoroscopeForm(props) {
  const [sign, setSign] = useState(null);
  const [header, setHeader] = useState('');
  const [horoscope, setHoroscope] = useState('');
  const [interval, setInterval] = useState('');
  const [type, setType] = useState('');
  // TODO pull categories and signs from backend
  const [signs] = useState(['Aries', 'Taurus', 'Gemini', 'Cancer',
    'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius',
    'Capricorn', 'Aquarius', 'Pisces']);
  const [intervals] = useState(['None', 'Monthly', 'Weekly', 'Daily']);
  const [types] = useState(["Horoscope", "Sun", "Current Moon", "Rising", "New Moon",
    "Full Moon", "Mercury", "Venus", "Earth", "Mars",
    "Saturn", "Jupiter", "Uranus", "Neptune", "Pluto"]);
  const [tableValues, setTableValues] = useState([]);
  const [tableFields, setTableFields] = useState([]);
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)

  useEffect(() => {
    if (type) {
      getAllCategoriesByType(type, setTableFields, setTableValues);
    }
  }, [type])

  function renderOptions(options, upper) {
    const optionsList = options.map((val, index) => {
      return (<option key={index} value={upper ? val.toUpperCase() : val}>{val}</option>);
    });
    optionsList.unshift((<option id="select-placeholder" key="select-placeholder" disabled selected value> -- select an option -- </option>
    ))
    return optionsList;
  }

  function setValue(setFunction, event) {
    setFunction(event.target.value);
  }

  async function submitHoroscope() {
    const body = {
      type,
      sign,
      header,
      description: horoscope,
      increment: interval === 'NONE' ? null : interval,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      active: true,
      category: null
    }
    console.log('Submission', body);
    let horoscopeVal = [];
    try {
      // const res = await fetch('https://becoming-spiritually-rich.herokuapp.com/horoscope', {
      const res = await fetch('http://localhost:8080/api/horoscope', {
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        mode: 'cors'
      });
      horoscopeVal = await res.json();
      console.log('horoscopes', horoscopeVal);
      setTableFields(horoscopeVal.length ? Object.keys(horoscopeVal[0]) : []);
      setTableValues(horoscopeVal);
      // setValues();
    } catch (e) {
      console.error('fetch error', e);
    }
  }

  return <div>
    <h1 className="text-center">Becoming Spiritually Rich</h1>
    <div id="horoscope-fields">
      <div className="form-group">
        <label htmlFor="type-select" className="form-label">Type</label>
        <select id="type-select" className="form-select form-select-med" aria-label="Type select"
          onChange={(e) => setValue(setType, e)} value={type}>
          {renderOptions(types)}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="sign-select" className="form-label">Sign</label>
        <select id="sign-select" className="form-select form-select-med" aria-label="Sign select"
          onChange={(e) => setValue(setSign, e)} value={sign} >
          {renderOptions(signs, true)}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="interval-select" className="form-label">Interval</label>
        <select id="interval-select" className="form-select form-select-med" aria-label="Interval select"
          onChange={(e) => setValue(setInterval, e)} value={interval}>
          {renderOptions(intervals, true)}
        </select>
      </div>
      <div className="d-flex flex-row">
        <div className="form-group">
          <label htmlFor="start-date" className="form-label">Start Date</label>
          <input type="datetime-local" className="form-control" onChange={(e) => setValue(setStartDate, e)} value={startDate} />
        </div>
        <div className="form-group px-3">
          {!interval || interval == 'NONE' ? <div><label htmlFor="end-date" className="form-label">End Date</label>
            <input type="datetime-local" className="form-control" onChange={(e) => setValue(setEndDate, e)} value={endDate} /></div> : ''}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="header-input" className="form-label">Header</label>
        <input id="header-input" className="form-control" maxLength="120"
          onChange={(e) => setValue(setHeader, e)} value={header} />
      </div>
      <div className="form-group">
        <label htmlFor="horoscope-input" className="form-label">Horoscope</label>
        <textarea id="horoscope-input" className="form-control" maxLength="255"
          onChange={(e) => setValue(setHoroscope, e)} value={horoscope} />
      </div>
      <button type="button" className="btn btn-primary my-2"
        onClick={() => submitHoroscope()}>Submit</button>
    </div>
    <div id="horoscope-list">
      <HoroscopeGrid columns={tableFields} values={tableValues} blacklist={['id', 'name', 'active']} setCategory={setCategoryFormFields.bind(null, setType, setSign, setStartDate)} />
    </div>
  </div>
}

const domContainer = document.querySelector('#horoscope-form');
const root = ReactDOM.createRoot(domContainer);
root.render(e(HoroscopeForm));