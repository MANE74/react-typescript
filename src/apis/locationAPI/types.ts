import { Location } from '../../containers/GroupDetail/groupDetailSlice/types';

export interface LocationResult extends Location {
  id: number;
  creatorUserID: number;
  created: string;
  hidden: boolean;
  geoCountry: string | null;
  geoRegion: string | null;
  geoTown: string | null;
  geoSubLocality: string | null;
  geoStreet: string | null;
  geoStreetNumber: string | null;
  geoPostalCode: string | null;
  timeZone: string | null;
}
