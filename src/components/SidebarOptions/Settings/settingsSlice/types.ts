import { UserById } from '../../../../apis/userAPI/types';

export interface SettingsState {
  account: UserById | null;

  isLoading: boolean;
}

export interface SettingsType {
  notifyChecklists: boolean;
  notifyDocuments: boolean;
  notifyWithEmail: boolean;
}