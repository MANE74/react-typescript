import { objectToQueryParams } from './format';
import { debounce } from 'lodash';
import axios from 'axios';

export const timing = {
  searchThrottleSpeed: 1000,

  quick: 300,
  slowSetMapLocation: 3000,
  editInfoThrottleSpeed: 3500,
};

export const defaultLat = Number(process.env.REACT_APP_STOCKHOLM_LAT);
export const defaultLng = Number(process.env.REACT_APP_STOCKHOLM_LNG);
export const apiKey = process.env.REACT_APP_GEOAPIKEY;

const GM_GEOCODE_BASE_URL = 'https://maps.googleapis.com/maps/api/geocode/';

export enum excutionTimingEnum {
  leading,
  trailing,
}

enum GeocodeType {
  standerdGeocoding,
  reversGeocoding,
}

interface GeocoderCoordinats {
  longitude: number;
  latitude: number;
}

export interface GeocoderResult {
  addressName: string;
  coordinates: GeocoderCoordinats;
}
export type GeocoderParams = string | GeocoderCoordinats;

export default async function Geocoder(
  address: GeocoderParams
): Promise<GeocoderResult> {
  let geocodeOptions;
  let geocodeType: GeocodeType;
  const apiSouce = axios.create({
    baseURL: GM_GEOCODE_BASE_URL,
  });

  if (typeof address === 'string') {
    geocodeOptions = { address: address, key: apiKey };
    geocodeType = GeocodeType.standerdGeocoding;
  } else {
    if (address.latitude && address.longitude) {
      geocodeOptions = {
        latlng: `${address.latitude},${address.longitude}`,
        key: apiKey,
      };
      geocodeType = GeocodeType.reversGeocoding;
    } else {
      console.error(
        `Geocoder: ${address} is not a valid object. Use 'longitude' & 'latitude'`
      );
    }
  }

  if (geocodeOptions) {
    // eslint-disable-next-line no-async-promise-executor
    // return new Promise(async (resolve, reject) => {
    try {
      const response = await apiSouce.get(
        `json?${objectToQueryParams(geocodeOptions)}`
      );
      if (response.data.results.length > 0) {
        // Use the first address in response since it's going to be most accurate
        const accurateAddress = response.data.results[0];

        const split: [string] =
          accurateAddress.formatted_address &&
          accurateAddress.formatted_address.includes(',')
            ? accurateAddress.formatted_address.split(',')
            : accurateAddress.formatted_address.split('-');
        const addressName: string = split
          ? split
              .slice(0, split.length <= 2 ? split.length : split.length - 2)
              .join(',')
          : 'N/A';

        return {
          addressName: addressName,
          coordinates: {
            longitude:
              geocodeType === GeocodeType.reversGeocoding
                ? (address as GeocoderCoordinats).longitude
                : accurateAddress.geometry.location.lng,
            latitude:
              geocodeType === GeocodeType.reversGeocoding
                ? (address as GeocoderCoordinats).latitude
                : accurateAddress.geometry.location.lat,
          },
        };
      }
    } catch (err) {
      return err;
    }
    // })
  }
}

export const geocode = (excutionTiming: excutionTimingEnum) =>
  debounce(
    async (
      param: GeocoderParams,
      onFinish: (result: GeocoderResult) => void
    ) => {
      const result = await Geocoder(param);
      onFinish(result);
    },
    timing.slowSetMapLocation,
    {
      leading: excutionTiming === excutionTimingEnum.leading,
      trailing: excutionTiming === excutionTimingEnum.trailing,
    }
  );
