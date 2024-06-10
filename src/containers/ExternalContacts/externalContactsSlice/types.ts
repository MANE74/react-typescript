import {
  CalculateSmsLengthRes,
  ExternalContact,
  ExternalContactTextTemplate,
  ExternalMessage,
} from '../../../apis/externalContacts/types';

export interface ExternalContactsState {
  externalMessages: ExternalMessage[];
  externalContacts: ExternalContact[];

  smsLength: CalculateSmsLengthRes;

  externalContactsTextTemplates: ExternalContactTextTemplate[];

  isLoading: {
    externalMessages: boolean;
    externalContacts: boolean;
  };
  error: string | null;
}
