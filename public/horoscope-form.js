// 'use strict';
const { useState, useEffect } = React;

const e = React.createElement;

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
    return <React.Fragment>
      <input type="radio" class="btn-check" name="grid-type" id={configId} autoComplete="off" />
      <label className={`btn btn-${type == config.val ? '' : `outline-`}primary`} for={configId} onClick={() => setGridType(config.val)}>{config.textVal}</label>
    </React.Fragment>
  })
}.bind(null, gridTypesConfig);

function setValue(setFunction, event) {
  setFunction(event.target.value);
}

async function getAllCategoriesByType(type, columnSetter, valueSetter) {
  const categories = await (await fetch(`http://localhost:8080/api/horoscope/categories/${type}`)).json();
  if (categories.length) {
    columnSetter(Object.keys(categories[0]));
    valueSetter(categories);
  }
}

async function getAllCategories(columnSetter, valueSetter) {
  const categories = await (await fetch(`http://localhost:8080/api/horoscope/categories/all`)).json();
  if (categories.length) {
    columnSetter(Object.keys(categories[0]));
    valueSetter(categories);
  }
}

function renderOptions(options, upper) {
  const optionsList = options.map((val, index) => {
    return (<option key={index} value={upper ? val.toUpperCase() : val}>{val}</option>);
  });
  optionsList.unshift((<option id="select-placeholder" key="select-placeholder" disabled selected value> -- select an option -- </option>
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

function HoroscopeForm(props) {
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
  const [types] = useState(["Horoscope", "Sun", "Current Moon", "Rising", "New Moon",
    "Full Moon", "Mercury", "Venus", "Earth", "Mars",
    "Saturn", "Jupiter", "Uranus", "Neptune", "Pluto"]);
  const [tableValues, setTableValues] = useState([]);
  const [tableFields, setTableFields] = useState([]);
  const [startDate, setStartDate] = useState((new Date()));
  const [endDate, setEndDate] = useState(new Date());
  const [gridType, setGridType] = useState('CATEGORY');

  useEffect(() => {
    switch (gridType) {
      case 'CATEGORY': if (type) {
        getAllCategoriesByType(type, setTableFields, setTableValues);
      }
      break;
      case 'ALL': getAllCategories(setTableFields, setTableValues); break;
      case 'APP': //TODO get categories for app
        break;
    }
  }, [type, gridType])

  async function submitHoroscope() {
    const body = {
      type,
      sign,
      header,
      description: horoscope,
      increment: interval === 'NONE' ? null : interval,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      active: true,
      category: null
    }
    console.log('Submission', body);
    try {
      await fetch('http://localhost:8080/api/horoscope', {
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        mode: 'cors'
      });
      getAllCategoriesByType(type, setTableFields, setTableValues);
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
          <input type="datetime-local" className="form-control"
            onChange={(e) => setValue(setStartDate, e)} value={startDate} />
        </div>
        <div className="form-group px-3">
          {!interval || interval == 'NONE' ?
            <div>
              <label htmlFor="end-date" className="form-label">End Date</label>
              <input type="datetime-local" className="form-control"
                onChange={(e) => setValue(setEndDate, e)} value={endDate} /></div> : ''}
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

    <div class="btn-group grid-type-selection" role="group" aria-label="Grid Types">
      {renderGridTypes(gridType, setGridType)}
    </div>

    <div id="horoscope-list">
      <HoroscopeGrid columns={tableFields} values={tableValues} blacklist={['id', 'name', 'active']}
        whitelist={['interval']} setCategory={setCategoryFormFields.bind(null, setSign, setInterval, setStartDate)} />
    </div>
  </div>
}

const domContainer = document.querySelector('#horoscope-form');
const root = ReactDOM.createRoot(domContainer);
root.render(e(HoroscopeForm));