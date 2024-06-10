import { count } from 'sms-length';
import {
  CalculateSmsLengthRes,
  ExternalContactTextTemplate,
} from '../../apis/externalContacts/types';
import { translate } from '../../utils/translate';

export enum CecMessageSendingMethod {
  email = 1,
  SMS = 2,
  voicemail = 3,
}

export enum CecMessageLimitType {
  regular = 'REG',
  SMS = 'SMS',
  unicode = 'SMS_UNICODE',
}

export const CecMessageLimit: Record<CecMessageLimitType, number> = {
  REG: 3000,
  SMS: 1530,
  SMS_UNICODE: 670,
};

const decideCecMessageLimitType = (
  methods: CecMessageSendingMethod[],
  text: string
): CecMessageLimitType => {
  if (methods.includes(CecMessageSendingMethod.SMS)) {
    if (count(text).encoding === 'UTF16') {
      return CecMessageLimitType.unicode;
    }
    return CecMessageLimitType.SMS;
  }
  return CecMessageLimitType.regular;
};

const makeSmsTrackingToken = (length: number): string => {
  var result = '';
  var characters = 'abcdefghijklmnopqrstuvwxyz';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const getTrackingLinkCount = (
  smsLength: CalculateSmsLengthRes
): number => {
  const smsText = smsLength.text;
  const tokenCount = smsLength.tokenLength;
  const replacedSmsText = smsText.replace('{1}', '').replace('{0}', '{}');

  return count(replacedSmsText).length + tokenCount;
};

export const withTrackingLink = (
  message: string,
  smsLength: CalculateSmsLengthRes
): string => {
  const smsText = smsLength.text;
  const tokenCount = smsLength.tokenLength;
  const generatedToken = makeSmsTrackingToken(tokenCount);
  const replacedSmsText = smsText
    .replace('{1}', generatedToken)
    .replace('{0}', `{${message}}`);
  return replacedSmsText;
};

interface GetMessageLimitParams {
  text: string;
  methods: CecMessageSendingMethod[];
  withTrackingLinkofLenght?: number;
}

export const getMessageLimit = (params: GetMessageLimitParams): number => {
  const { methods, text, withTrackingLinkofLenght } = params;
  const limitType = decideCecMessageLimitType(methods, text);
  const limitOfTheType = CecMessageLimit[limitType];
  if (withTrackingLinkofLenght) {
    return limitOfTheType - withTrackingLinkofLenght;
  }
  return limitOfTheType;
};

export const getMessageTemplateName = (
  templateId: 'CUSTOM' | number,
  textTemplates: ExternalContactTextTemplate[]
): string => {
  if (templateId === 'CUSTOM') return translate('messages_custom')!;
  return textTemplates.find(template => template.id === templateId)?.name || '';
};
export const getMessageTemplateContent = (
  templateId: 'CUSTOM' | number,
  textTemplates: ExternalContactTextTemplate[]
): string => {
  if (templateId === 'CUSTOM') return '';
  return (
    textTemplates.find(template => template.id === templateId)?.content || ''
  );
};

export const CecMessageSendMethodsTx: Record<CecMessageSendingMethod, string> =
  {
    1: 'messages_cec_send_email',
    2: 'messages_cec_send_sms',
    3: 'messages_cec_send_voicemail',
  };
export const CecMessageSendMethodsSummaryTx: Record<
  CecMessageSendingMethod,
  string
> = {
  1: 'messages_email',
  2: 'messages_sms',
  3: 'cec_voiceMail',
};

export const CecMessageSendMethods = [
  {
    valueId: CecMessageSendingMethod.SMS,
    tx: CecMessageSendMethodsTx[CecMessageSendingMethod.SMS],
  },
  {
    valueId: CecMessageSendingMethod.email,
    tx: CecMessageSendMethodsTx[CecMessageSendingMethod.email],
  },
  {
    valueId: CecMessageSendingMethod.voicemail,
    tx: CecMessageSendMethodsTx[CecMessageSendingMethod.voicemail],
  },
];

export const checkVoiceMailDisable = (
  selected: Set<number | string>
): boolean => {
  return selected.size === 0;
};

export const getSendingMethodsNames = (methods: number[]): string[] => {
  return methods.map(
    method =>
      translate(
        CecMessageSendMethodsSummaryTx[method as CecMessageSendingMethod]
      )!
  );
};
