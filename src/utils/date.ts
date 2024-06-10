import moment from 'moment-timezone';

export const getDateFormatCustom = (jsData: string, dataFormat: string) => {
  const date = new Date(jsData);
  const offset = date.getTimezoneOffset();
  var newDateObj = new Date(date.getTime() - offset * 60000);
  const localtz = moment.tz.guess(); // user's timezone
  return moment(newDateObj).tz(localtz).format(dataFormat); // convert time to user's timezone
};
export const dateFormats = {
  mothNamePlusDate: 'MMMM D',
  dayLongMonth: 'DD MMMM',
  mothNameDateTime: 'DD MMMM HH:mm',
  mothNameShortDateTime: 'DD MMM, HH:mm',
  mothNameShortDateTimeNoComma: 'DD MMM hh:mm',
  mothNameShortDateTimeNoComma24: 'DD MMM HH:mm',
  simpleTime: 'HH:mm',
  simpleTime24: 'HH:mm',
  mothNameShort: 'DD MMM',
  dayMonthYear: 'DD.MM.YYYY',
  dayMonthNameYearSpace: 'DD MMMM YYYY',
  yearMonthDay: 'YYYY-MM-DD',
  yearMonthDayTimeNoComma24: 'YYYY-MM-DD HH:mm',
};

export const checkIfDateIsToday = (date: string) => {
  const today = new Date();
  const inputDate = new Date(date);
  return today.toDateString() === inputDate.toDateString();
};
export const checkIfDateIsCurrentYear = (date: string) => {
  const today = new Date();
  const inputDate = new Date(date);
  return today.getFullYear() === inputDate.getFullYear();
};
