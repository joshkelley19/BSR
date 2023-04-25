import React, { useState, useEffect } from 'react';
import { HoroscopeGrid } from './grid';
import { renderOptions, setValue } from './services/form-service';
import { renderGridTypes } from './services/grid-service';
import { getAllCategories, getAllCategoriesByType, getCategoriesByTypeAndDate, getHoroscopeBySignAndDate, getRestDate, loadCategories, submitHoroscope } from './services/horoscope-service';
import { ToastContainer, Zoom, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function setCategoryFormFields(setSign, setInterval, setStartDate, category) {
  setSign(category.sign);
  setInterval(category.interval);
  const startDate = new Date(category.endDate);
  startDate.setMinutes(startDate.getMinutes() + 1);
  setStartDate(startDate.toISOString().slice(0, -2));
}

function submitHoroscopeForm(values, setters, baseUrl) {
  submitHoroscope(values, setters, baseUrl);
}

export const HoroscopeForm = ({ setErrorMessage, baseUrl }) => {
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
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [previewDate, setPreviewDate] = useState(new Date());
  const [previewSign, setPreviewSign] = useState('');
  const [gridType, setGridType] = useState('CATEGORY');

  useEffect(() => {
    switch (gridType) {
      case 'CATEGORY': if (type) {
        getAllCategoriesByType(type, setTableFields, setTableValues, setErrorMessage, baseUrl);
      }
        break;
      case 'ALL': getAllCategories(setTableFields, setTableValues, setErrorMessage, baseUrl);
        break;
      case 'APP': if (previewSign && previewDate) {
        Promise.all([getHoroscopeBySignAndDate(previewSign, getRestDate(previewDate), baseUrl),
        getCategoriesByTypeAndDate(types.slice(1), getRestDate(previewDate), baseUrl)])
          .then(async resArray => {
            const horoscopeRes = await resArray[0].json();
            const categoryRes = await resArray[1].json();
            //merge responses
            loadCategories(setTableFields, setTableValues, [horoscopeRes, ...categoryRes]);
          })
          .catch(err => {
            setErrorMessage(`Failed to load categories: ${err.toString()}`);
            console.error('Error loading categories', err);
          });
      } else {
        setErrorMessage('Be sure to select a sign and date to emulate an app display');
      }
        break;
      default:
    }
  }, [type, gridType, baseUrl, previewDate, previewSign, types, setErrorMessage])

  return <div>
    <div id="horoscope-fields" className="container">
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
      <button type="button" className="btn btn-primary my-2" disabled={!type || !sign || !startDate}
        onClick={() => submitHoroscopeForm({
          type,
          sign,
          header,
          horoscope,
          interval,
          startDate,
          endDate
        }, {
          setTableFields,
          setTableValues,
          setErrorMessage,
          toast
        }, baseUrl)}>Submit</button>
        <ToastContainer
          autoClose={10000}
          transition={Zoom}
        />
    </div>

    <div className="btn-group grid-type-selection" role="group" aria-label="Grid Types">
      {renderGridTypes(gridType, setGridType)}
    </div>

    <div id="horoscope-list">
      {gridType === 'APP' ? <div id="preview-fields" className="row w-50">
        <div className="col">
          <label htmlFor="preview-date" className="form-label">Preview Date</label>
          <input type="datetime-local" className="form-control"
            onChange={(e) => setValue(setPreviewDate, e)} value={previewDate} />
        </div>
        <div className="col">
          <label htmlFor="preview-sign-select" className="form-label">Sign</label>
          <select id="preview-sign-select" className="form-select form-select-med" aria-label="Sign select"
            onChange={(e) => setValue(setPreviewSign, e)} value={previewSign} >
            {renderOptions(signs, true, 'Please Select a Zodiac Sign')}
          </select>
        </div>
      </div> : ''}
      <HoroscopeGrid columns={tableFields} values={tableValues} blacklist={['id', 'name', 'active']}
        whitelist={['interval']} setCategory={setCategoryFormFields.bind(null, setSign, setInterval, setStartDate)} />
    </div>
  </div>
}