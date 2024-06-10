import { LoginForm } from '../containers/Login/Login';
import { ELanguages } from '../i18n';
import { saveItem } from '../utils/storage';
import { UserById } from './userAPI/types';
import { ApiCore } from './utils/core';

export interface MenuItemsEntity {
  id: number;
  technicalName: string;
}
export interface User {
  token: string | null;
  authenticationType: string | null;
  roles: string[] | null;
  organizationID: number | null;
  organizationName: string | null;
  organizationLogo: string | null;
  organizationWebsite: string | null;
  crisisTeamID: number | null;
  groupsInOrganization: string | null;
  personsInOrganization: string | null;
  organizationMusterCreateSetting: 0 | 1;
  subOrganizationsEnabled: boolean;
  preferredLanguage: string | null;
  menuItems: MenuItemsEntity[] | null;
  organizationCustomMainMenuEnabled: boolean;
  organizationHelpText: string | null;
  organizationExternalLink: string | null;
  isCrisisTeamMember?: boolean;
  photoFileName: string | null;
  permissions: string[] | string | null | [];
  organizations: string[] | string | null | [];
  managedOrganizations: string[] | string | null | [];
  personalAlarmId: number | null;
  organizationSupportPersonName: string | null;
  organizationSupportPhoneNumber: number | null;
  organizationSupportEmail: string | null;
  organizationHasImportSettings: string | null;
  loggedAsAdmin: boolean;
  sso_provider: number | null;
  id: number;
  name: string;
  email: string;
}

export interface Support {
  id: number;
  name: string;
  supportPersonName: string | null;
  supportPhoneNumber: string | null;
  supportEmail: string | null;
}

interface SSOParams {
  organization: {
    id: number;
    name: string;
    parentId: number;
  };
  url: string;
}

export type genericRequestResult = { kind: 'ok'; data: User };

const url = 'account';

const userAPI = new ApiCore({
  getAll: true,
  getSingle: true,
  post: true,
  put: false,
  patch: true,
  remove: false,
  singleExtra: true,
  url: url,
});

export const login = async ({ email, password }: LoginForm) => {
  const csrfToken = await getAntiForgeryToken();

  return userAPI.performExtra<User>({
    method: 'POST',
    extraResource: 'login',
    model: {
      email, // 'test02.user@qq.qq'
      password, // 'Test12345@'
    },
    headers: { 'X-XSRF-Token': csrfToken },
  });
};

export const loginWithCode = async ({ code, email, password }: LoginForm) => {
  const csrfToken = await getAntiForgeryToken();

  return userAPI.performExtra<User>({
    method: 'POST',
    extraResource: 'login',
    model: {
      code, // code *****
      email, // 'test02.user@qq.qq'
      password, // 'Test12345@'
    },
    headers: { 'X-XSRF-Token': csrfToken },
  });
};

export const ssoLogin = async ({
  email,
  code,
  url,
  provider,
}: {
  email: string | null;
  code: string;
  url: string;
  provider?: string;
}) => {
  const csrfToken = await getAntiForgeryToken();

  return userAPI.performExtra<User>({
    method: 'POST',
    extraResource: 'login',
    model: {
      email,
      oauth_code: code,
      redirect_url: url,
      sso_provider: provider,
    },
    headers: { 'X-XSRF-Token': csrfToken },
  });
};

export const fetchSsoUrl = async (url: string) => {
  return userAPI.performExtra<SSOParams>({
    method: 'GET',
    extraResource: url,
  });
};

export interface ForgetPasswordParams {
  email: string;
}

export const forgetPassword = async ({ email }: ForgetPasswordParams) => {
  const csrfToken = await getAntiForgeryToken();

  return userAPI.performExtra<{ ok?: boolean }>({
    method: 'POST',
    extraResource: 'Password/Token',
    model: {
      email, // 'test02.user@qq.qq'
    },
    headers: { 'X-XSRF-Token': csrfToken },
  });
};

export interface ValidateResetTokenParams {
  userId: number;
  token: string;
}

export const validateResetToken = async ({
  userId,
  token,
}: ValidateResetTokenParams) => {
  return userAPI.performExtra<{ ok?: boolean }>({
    method: 'GET',
    extraResource: `password/validatetoken`,
    params: { userId: userId, token: token },
  });
};

export interface ResetPasswordParams extends ValidateResetTokenParams {
  password: string;
}
export const resetPassword = async (params: ResetPasswordParams) => {
  const csrfToken = await getAntiForgeryToken();

  return userAPI.performExtra<{ ok?: boolean }>({
    method: 'POST',
    extraResource: `password/reset`,
    model: params,
    headers: { 'X-XSRF-Token': csrfToken },
  });
};

export const getSupportInfo = async () => {
  return userAPI.performExtra<Support[]>({
    method: 'GET',
    extraResource: `support`,
  });
};

export interface ChangePasswordParams {
  oldPassword: string;
  newPassword: string;
}
export const changePassword = async (params: ChangePasswordParams) => {
  const csrfToken = await getAntiForgeryToken();

  return userAPI.performExtra<{ ok?: boolean }>({
    method: 'POST',
    extraResource: `ChangePassword`,
    model: params,
    headers: { 'X-XSRF-Token': csrfToken },
  });
};

export interface EditSecondaryNumberParams {
  phoneNumbers: string;
  userById: UserById;
}
export const editSecondaryNumber = async (
  params: EditSecondaryNumberParams
) => {
  const csrfToken = await getAntiForgeryToken();

  const { phoneNumbers, userById } = params;
  return userAPI.performExtra<UserById>({
    method: 'POST',
    model: { ...userById, phoneNumber: phoneNumbers },
    extraResource: '',
    headers: { 'X-XSRF-Token': csrfToken },
  });
};

export interface ChangeProfilePhotoParams {
  photoUrl: string | null;
  userById: UserById;
}
export const _changeProfileImage = async (params: ChangeProfilePhotoParams) => {
  const { photoUrl, userById } = params;
  const csrfToken = await getAntiForgeryToken();

  return userAPI.performExtra<UserById>({
    method: 'POST',
    model: { ...userById, photoFileName: photoUrl },
    extraResource: '',
    headers: { 'X-XSRF-Token': csrfToken },
  });
};

// Verify user password
export interface VerifyParams {
  password: string;
}
export const verifyPassword = async (password: VerifyParams) => {
  const csrfToken = await getAntiForgeryToken();

  return userAPI.performExtra<any>({
    method: 'POST',
    extraResource: 'validate-password',
    model: password,
    headers: { 'X-XSRF-Token': csrfToken },
  });
};

export const getEmergencyTypes = async () => {
  return userAPI.performExtra<any>({
    method: 'GET',
    extraResource: 'EmergencyTypes',
  });
};

export const getAntiForgeryToken = async () => {
  const csrf = await userAPI.performExtra<any>({
    method: 'GET',
    extraResource: 'AntiForgeryToken',
  });
  saveItem('csrf', csrf.requestVerificationToken);
  return csrf.requestVerificationToken;
};

export const getAccountInfo = async () => {
  const csrfToken = await getAntiForgeryToken();

  return userAPI.performExtra<User>({
    method: 'GET',
    extraResource: 'info',
    headers: { 'X-XSRF-Token': csrfToken },
  });
};

export const logoutRequest = async () => {
  const csrfToken = await getAntiForgeryToken();

  return userAPI.performExtra<User>({
    method: 'POST',
    extraResource: 'logout',
    headers: { 'X-XSRF-Token': csrfToken },
  });
};

export const setUserSettings = async (data: {notifyWithEmail:boolean, notifyChecklists: boolean, notifyDocuments: boolean, phoneNumber: string | null | undefined, photoFileName: string | undefined, displayName: string|undefined}) => {
  const csrfToken = await getAntiForgeryToken();
  return userAPI.performExtra<any>({
    method: 'POST',
    extraResource: "",
    model: data,
    headers: { 'X-XSRF-Token': csrfToken },
  });
};

export const savePreferredLanguage = async (lang: ELanguages) => {
  const csrfToken = await getAntiForgeryToken();

  return userAPI.performExtra<User>({
    method: 'POST',
    extraResource: 'language',
    model:{
      "language": lang
    },
    headers: { 'X-XSRF-Token': csrfToken },
  });
};