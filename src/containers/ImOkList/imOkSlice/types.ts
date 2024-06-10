export interface ImOkDocumentState {
  imOkList: ImOkDocument[];
  isLoading: boolean;
  imOkErrors: string | null;
  imOkDocument: ImOkDocumentSimple | null;
  showImOkBottomModal: boolean;
}

export interface GroupInIamOk {
  id: number | null;
  name: string | null;
  image: string | null;
}

export interface ImOkUser {
  id: number | null;
  imok: boolean;
  lastupdated: string;
  locationId: number | null;
  locationLatitude: number | null;
  locationLongitude: number | null;
  locationName: string | null;
  userid: number | null;
  username: string | null;
}

export interface ImOkDocument {
  id: number;
  name: string | null;
  subject: string | null;
  recipientsOk: number | null;
  recipientsNotOk: number | null;
  recipients: number | null;
  ended: boolean;
  creatorid: number | null;
  creatorname: string | null;
  created: string;
  users: ImOkUser[];
  groups: GroupInIamOk[];
}

export interface ImOkDocumentSimple {
  id: number;
  creatorid: number;
  name: string;
  creatorname: string;
  ended: boolean;
  created: string;
  latitude: number;
  longitude: number;
  groups: GroupInIamOk[];
  recipients: number;
  recipientsNotOk: number;
  recipientsOk: number;
  users: ImOkUser[];
  subject: string;
}

export interface ImOkStatus {
  imok: boolean;
  locationID: number | null;
}
