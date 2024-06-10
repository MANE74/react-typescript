export interface OnCallAlertState {
  onCallAlertList: OnCallAlertDocument[];
  isLoading: boolean;
  onCallAlertErrors: string | null;
  onCallAlertDocument: OnCallAlertDocumentSimple | null;
  showOnCallAlertBottomModal: boolean;
}

export interface Group {
  id: number | null;
  name: string | null;
}

export interface OnCallAlertUser {
  userId: number | null;
  hasPhoneNumber: boolean;
  status: number | null;
  userName: string | null;
  responseTime: string | null;
}

export interface OnCallAlertDocument {
  // sent & recieved
  id: number;
  subject: string | null;
  senderId: number | null;
  text: string | null;
  ended: boolean;
  senderName: string | null;
  started: string | null;
  groupId: number | null;
  groupName?: string | null;

  totalRecipients: number;
  canParticipate: number;

  // recieved only
  status?: number;
  groupImage?: string | null;
}

export interface OnCallAlertDocumentSimple {
  // sent & recieved
  id: number;
  subject: string | null;
  senderId: number | null;
  text: string | null;
  ended: boolean;
  senderName: string | null;
  started: string | null;
  groupId: number | null;
  groupName?: string | null;

  // recieved only
  status?: number;
  groupImage?: string | null;

  users: OnCallAlertUser[];
}

export interface OnCallAlertStatus {
  status: number;
}
