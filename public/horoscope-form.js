'use strict';

const e = React.createElement;

class HoroscopeForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sign: '',
      horoscope: '',
      month: '',
      signs: ['Aries', 'Taurus', 'Gemini', 'Cancer',
        'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius',
        'Capricorn', 'Aquarius', 'Pisces'],
      months: ['January', 'February', 'March', 'April',
        'May', 'June', 'July', 'August', 'September',
        'October', 'November', 'December']
    };
  }

  renderOptions(optionsStr) {
    const optionsList = this.state[optionsStr].map((val, index) => {
      return (<option key={index} value={val}>{val}</option>);
    });
    optionsList.unshift((<option id="select-placeholder" key="select-placeholder" disabled selected value> -- select an option -- </option>
    ))
    return optionsList;
  }

  setValue(field, event) {
    console.log(field, event.target.value);
    this.setState({ [field]: event.target.value });
  }

  submit() {
    console.log('Submission', this.state);
    const {sign: zodiac, horoscope: reading, month} = this.state;
    fetch('https://becoming-spiritually-rich.herokuapp.com/horoscope', {
      body: {
        zodiac,
        reading,
        month,
        //TODO dynamically pull year
        year: '2022'
      },
      method: 'POST'
    })
  }

  render() {
    return <div>
      <h1 className="text-center">Becoming Spiritually Rich</h1>
      <label htmlFor="sign-select" className="form-label">Sign</label>
      <select id="sign-select" className="form-select form-select-med" aria-label="Sign select"
        onChange={(e) => this.setValue('sign', e)}>
        {this.renderOptions('signs')}
      </select>
      <label htmlFor="month-select" className="form-label">Horoscope</label>
      <select id="month-select" className="form-select form-select-med" aria-label="Month select"
        onChange={(e) => this.setValue('month', e)}>
        {this.renderOptions('months')}
      </select>
      <label htmlFor="horoscope-input" className="form-label">Horoscope</label>
      <textarea id="horoscope-input" className="form-control" maxLength="255"
        onChange={(e) => this.setValue('horoscope', e)} />
      <button type="button" className="btn btn-primary my-2"
        onClick={() => this.submit()}>Submit</button>
    </div>
  }
}

const domContainer = document.querySelector('#horoscope-form');
const root = ReactDOM.createRoot(domContainer);
root.render(e(HoroscopeForm));