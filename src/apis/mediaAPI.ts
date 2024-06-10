import { ELanguages } from '../i18n';
import { formatBytes } from '../utils/formatBytes';
import { getAntiForgeryToken } from './authAPI';
import { ApiCore } from './utils/core';

const url = 'media';

const mediaAPI = new ApiCore({
  singleExtra: true,
  url,
});

export interface TutorialContent {
  title: string;
  language: string;
  content: string | null;
  tutorialID: number | null;
}

export enum menuItemName {
  groups = 'groups',
  messages = 'messages',
  checklists = 'checklists',
  documents = 'documents',
  muster = 'muster',
  profile = 'profile',
  group_alarm = 'group_alarm',
}

export interface Tutorial {
  id: number;
  menuItemId: number;
  roleId: number | null;
  isOnlyWebAdminAccessible: boolean;
  iconName: string | null;
  sortOrder: number | null;
  parentId: number | null;
  tutorialContents: TutorialContent[];
  roleName: string | null;
  menuItemName: menuItemName | null;
}

export interface GetImageProps {
  imageName: string | null;
  size?: 'small' | 'medium' | 'large';
  svg?: boolean;
  getSize?: boolean;
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
  var binary = '';
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export const getImage = async (props: GetImageProps) => {
  const { imageName, size, svg } = props;
  if (!imageName) return '';
  const imageWithoutExtention = imageName.replace(/\.[^/.]+$/, '');
  const imageExtention = imageName.split('.').pop();
  const response = await mediaAPI.performExtra<ArrayBuffer>({
    method: 'GET',
    buffer: true,
    extraResource: `file/${imageWithoutExtention}${
      size ? '_' + size : ''
    }.${imageExtention}`,
  });
  if (!response) return '';
  return `data:image/${svg ? 'svg+xml' : 'png'};base64, ${arrayBufferToBase64(
    response
  )}`;
};

export const getImageWithSize = async (props: GetImageProps) => {
  const { imageName, size, svg } = props;
  if (!imageName) return { image: '', size: '0' };
  const imageWithoutExtention = imageName.replace(/\.[^/.]+$/, '');
  const imageExtention = imageName.split('.').pop();
  const response = await mediaAPI.performExtra<ArrayBuffer>({
    method: 'GET',
    buffer: true,
    extraResource: `file/${imageWithoutExtention}${
      size ? '_' + size : ''
    }.${imageExtention}`,
  });
  if (!response) return { image: '', size: '0' };
  return {
    image: `data:image/${svg ? 'svg+xml' : 'png'};base64, ${arrayBufferToBase64(
      response
    )}`,
    size: formatBytes(response.byteLength),
  };
};

export const getFile = async (name: string, getSize = false) => {
  const response = await mediaAPI.performExtra<any>({
    method: 'GET',
    buffer: true,
    extraResource: `file/${name}`,
  });

  if (!response) return { file: '' };
  if (getSize) {
    return {
      file: `data:application/pdf;base64, ${arrayBufferToBase64(response)}`,
      size: formatBytes(response.byteLength),
    };
  } else {
    return {
      file: `data:application/pdf;base64, ${arrayBufferToBase64(response)}`,
    };
  }
};

export const getDocument = async (id: number) => {
  const response = await mediaAPI.performExtra<any>({
    method: 'GET',
    buffer: true,
    extraResource: `GroupDocument/${id}`,
  });

  if (!response) return { file: '' };

  return {
    file: `data:application/pdf;base64, ${arrayBufferToBase64(response)}`,
  };
};

export const getAudioFile = async (name: string) => {
  const response = await mediaAPI.performExtra<any>({
    method: 'GET',
    buffer: true,
    extraResource: `file/${name}`,
  });

  if (!response) return '';

  return `data:audio/aac;base64, ${arrayBufferToBase64(response)}`;
};

export const _getTutorials = async () => {
  return await mediaAPI.performExtra<Tutorial[]>({
    method: 'GET',
    extraResource: `Tutorials`,
  });
};

export interface GetTutorialDetailParams {
  id: number;
  language: ELanguages;
}
export const _getTutorialDetail = async (params: GetTutorialDetailParams) => {
  const { id, language } = params;
  return await mediaAPI.performExtra<Tutorial>({
    method: 'GET',
    extraResource: `Tutorials/${id}/${language}`,
  });
};

interface PutImageRes {
  URL: string;
}

export const uploadImage = async (image: FormData) => {
  const csrfToken = await getAntiForgeryToken();

  return await mediaAPI.performExtra<PutImageRes>({
    method: 'PUT',
    extraResource: `Image/Cropped`,
    model: image,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
      'X-XSRF-Token': csrfToken,
    },
  });
};

export const saveImageToServer = async (formData: FormData) => {
  const csrfToken = await getAntiForgeryToken();

  const headers = {
    Accept: 'application/json',
    'Content-Type': 'multipart/form-data',
    'X-XSRF-Token': csrfToken,
  };
  const response = await mediaAPI.performExtra<any>({
    method: 'put',
    extraResource: `Image`,
    model: formData,
    headers: headers,
  });

  return response?.URL;
};

export const saveDocumentToServer = async (document: FormData) => {
  const csrfToken = await getAntiForgeryToken();

  const headers = {
    Accept: 'application/json',
    'Content-Type': 'multipart/form-data',
    'X-XSRF-Token': csrfToken,
  };

  const response = await mediaAPI.performExtra<any>({
    method: 'put',
    extraResource: `Document`,
    model: document,
    headers: headers,
  });

  return response?.URL;
};

export const uploadImageCropped = async (image: FormData) => {
  const csrfToken = await getAntiForgeryToken();

  return await mediaAPI.performExtra<PutImageRes>({
    method: 'PUT',
    extraResource: `Image/Cropped`,
    model: image,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
      'X-XSRF-Token': csrfToken,
    },
  });
};
