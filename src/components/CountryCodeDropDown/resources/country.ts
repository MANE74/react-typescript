import { find, orderBy } from 'lodash';
import { CountryCode, CountryData } from '../types';

let instance: Country | null = null;

class Country {
  countriesData: CountryData[] | null;
  countries: CountryData[] | null;
  static getInstance() {
    if (!instance) {
      instance = new Country();
    }
    return instance;
  }

  constructor() {
    this.countries = null;
    this.countriesData = null;
  }

  setCustomCountriesData(json: CountryData[]) {
    this.countriesData = json;
  }
  getAll() {
    if (!this.countries) {
      this.countries = orderBy(
        this.countriesData || require('./countries.json'),
        ['name'],
        ['asc']
      );
    }

    return this.countries;
  }
  getCountryDataByCode(code: CountryCode) {
    return find(this.getAll(), country => country.code === code);
  }
  getDialCode(code: CountryCode) {
    return find(this.getAll(), country => country.code === code)?.dial_code;
  }
}
// these countries do Not have't have a flag png
// { "name": "Pitcairn", "dial_code": "+872", "code": "PN" },/
// { "name": "Greenland", "dial_code": "+299", "code": "GL" },
// { "name": "Netherlands Antilles", "dial_code": "+599", "code": "AN" },
export default Country.getInstance();
