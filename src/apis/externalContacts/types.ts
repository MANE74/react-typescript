export interface ExternalMessageContact {
  id: number;
  name: string;
  numberOfContacts: number;
  numberOfConfirmedContacts: number;
}

export interface ExternalMessage {
  id: number;
  text: string;
  contactLists: ExternalMessageContact[];
  numberOfReceivers: number;
  numberOfConfirmedReceivers: number;
  sendMethods: number[];
  senderName: string;
  senderId: number;
  sendTime: string; // could be of type date , maybe worth some expermints
}

export interface ExternalMessageRecipient {
  readEmail: boolean;
  readSms: boolean;
  id: number;
  name: string;
  title: string;
  email: string;
  phoneNumber1: string | null;
  phoneNumber2: string | null;
  contactListId: number;
  contactListName: string;
  emailReadTime: string | null;
  smsReadTime: string | null;
}
export interface ExternalMessageDetail extends ExternalMessage {
  recipients: ExternalMessageRecipient[];
}

export interface ExternalContact {
  numberOfContactsWithEmail: number;
  numberOfContactsWithPhoneNumber: number;
  id: number;
  name: string;
  numberOfContacts: number;
}

export interface ExternalContactTextTemplate {
  id: number;
  name: string;
  content: string;
  organizationId: number;
}
export interface CalculateSmsLengthRes {
  text: string;
  tokenLength: number;
}

export interface CecMessagePostType {
  text: string;
  sendMethods: number[];
  contactListIds: number[];
  generateToken: boolean;
}
