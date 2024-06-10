// Api formating objects props to request params

import { isArray } from 'lodash';

export function objectToQueryParams(
  object:
    | {
        [index: string]: string | number | number[] | boolean | undefined;
      }
    | null
    | undefined
): string {
  if (!object) return '';
  return (
    Object.keys(object)
      .map(key => {
        const qureyValue = object[key];
        if (!qureyValue) return undefined;
        return isArray(qureyValue)
          ? qureyValue?.map(value => key + '=' + value)
          : key + '=' + encodeURIComponent(qureyValue);
      })
      .flat()
      .filter(q => q !== undefined)
      .join('&') || ''
  );
}
// to be turned on a test Coverage
// console.log(
//   'search=hey&sort=name&types=1&types=5 : =>  ',
//   objectToQueryParams({ search: 'hey', sort: 'name', types: [1, 5] })
// );

// to be turned on a test Coverage
// console.log(
//   'sort=name&types=1&types=5 : =>  ',
//   objectToQueryParams({  sort: 'name', types: [1, 5] })
// );

// to be turned on a test Coverage
// console.log(
//   "search=hey&id=5&hidden=true : =>",
//   objectToQueryParams({ search: "hey", id: 5, hidden: true })
// );
