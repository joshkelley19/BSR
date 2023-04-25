import { format } from 'date-fns';

export const submitHoroscope = async (values, setters, baseUrl) => {
  const { type, sign, header, horoscope, interval, startDate, endDate } = values;
  const body = {
    type,
    sign,
    header,
    description: horoscope,
    increment: interval,
    startDate: getRestDate(startDate),
    endDate: validInterval(interval) ? null : getRestDate(endDate),
    active: true,
    category: null
  }
  const { setTableFields, setTableValues, setErrorMessage, toast } = setters;
  try {
    await saveHoroscope(baseUrl, body);
    getAllCategoriesByType(type, setTableFields, setTableValues, setErrorMessage, baseUrl);
    toast(`Saved ${sign} ${type} entry successfully`, {type: 'success'});
  } catch (e) {
    console.error('fetch error', e);
    setErrorMessage(`Failed saving horoscope: `, e);
  }
}

const validInterval = (interval) => {
  return interval && interval !== 'NONE';
}
const saveHoroscope = async (baseUrl, body) => {
  const res = await fetch(`${baseUrl}/api/horoscope`, {
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    mode: 'cors'
  });
  await res.json();
}


export const getCategoriesByTypeAndDate = async (types, date, baseUrl) => {
  return fetch(`${baseUrl}/api/horoscope/categories`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      types,
      date
    })
  });
}

export const getAllCategories = async (columnSetter, valueSetter, errorMessageSetter, baseUrl) => {
  try {
    const categories = await (await fetch(`${baseUrl}/api/horoscope/categories/all`)).json();
    loadCategories(columnSetter, valueSetter, categories);
  } catch (e) {
    errorMessageSetter(`Failed to load categories: ${e.toString()}`);
    console.error('Error loading categories', e);
  }
}

// TODO convert to getCategoryUrl() with single categories loading and error message
export const getAllCategoriesByType = async (type, columnSetter, valueSetter, errorMessageSetter, baseUrl) => {
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

export const getHoroscopeBySignAndDate = async (sign, date, baseUrl) => {
  return fetch(`${baseUrl}/api/horoscope/sign/date`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      types: null,
      date,
      sign
    })
  });
}

export const loadCategories = (columnSetter, valueSetter, categories) => {
  if (categories.length) {
    columnSetter(Object.keys(categories[0]));
    valueSetter(categories);
  }
}

export const getRestDate = (date) => {
  return format(new Date(date), 'yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\'')
}