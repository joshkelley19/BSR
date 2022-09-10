// 'use strict';
const { useState } = React;

// import HoroscopeGrid from "./grid";

const e = React.createElement;

function HoroscopeForm(props) {
  const [sign, setSign] = useState('');
  const [horoscope, setHoroscope] = useState('');
  const [month, setMonth] = useState('');
  const [signs, setSigns] = useState(['Aries', 'Taurus', 'Gemini', 'Cancer',
    'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius',
    'Capricorn', 'Aquarius', 'Pisces']);
  const [months, setMonths] = useState(['January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August', 'September',
    'October', 'November', 'December'])
  const [horoscopes, setHoroscopes] = useState([]);
  const [tableFields, setTableFields] = useState([]);


  function renderOptions(options, upper) {
    const optionsList = options.map((val, index) => {
      return (<option key={index} value={upper ? val.toUpperCase() : val}>{val}</option>);
    });
    optionsList.unshift((<option id="select-placeholder" key="select-placeholder" disabled selected value> -- select an option -- </option>
    ))
    return optionsList;
  }

  function setValue(setFunction, event) {
    console.log(event.target.value);
    setFunction(event.target.value);
  }

  async function submit() {
    const body = {
      zodiac: sign,
      reading: horoscope,
      month,
      //TODO dynamically pull year
      year: '2022'
    }
    console.log('Submission', body);
    const horoscopes = await fetch('https://becoming-spiritually-rich.herokuapp.com/horoscope', {
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      mode: 'cors'
    })
    console.log('horoscopes', horoscopes);
    setTableFields(horoscopes.length ? Object.keys(horoscopes[0]) : []);
    setHoroscopes(horoscopes);
  }

  return <div>
    <h1 className="text-center">Becoming Spiritually Rich</h1>
    <div id="horoscope-fields">
      <label htmlFor="sign-select" className="form-label">Sign</label>
      <select id="sign-select" className="form-select form-select-med" aria-label="Sign select"
        onChange={(e) => setValue(setSign, e)}>
        {renderOptions(signs, true)}
      </select>
      <label htmlFor="month-select" className="form-label">Horoscope</label>
      <select id="month-select" className="form-select form-select-med" aria-label="Month select"
        onChange={(e) => setValue(setMonth, e)}>
        {renderOptions(months, true)}
      </select>
      <label htmlFor="horoscope-input" className="form-label">Horoscope</label>
      <textarea id="horoscope-input" className="form-control" maxLength="255"
        onChange={(e) => setValue(setHoroscope, e)} />
      <button type="button" className="btn btn-primary my-2"
        onClick={() => submit()}>Submit</button>
    </div>
    <div id="horoscope-list">
      <HoroscopeGrid columns={tableFields} values={horoscopes} />
    </div>
  </div>
}

const domContainer = document.querySelector('#horoscope-form');
const root = ReactDOM.createRoot(domContainer);
root.render(e(HoroscopeForm));