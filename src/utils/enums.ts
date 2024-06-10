export enum UserPermision {
  admin = 'admin',
  member = 'member',
}

export enum GroupVisibality {
  hidden = 'hidden',
  normal = 'normal',
}

export enum MessageGroupTypes {
  Hidden = 2,
  CrossOrganization = 3,
  CoAlert = 4,
}

export enum ImOkStatusType {
  NotOk,
  Ok,
  NoStatus,
  All,
}

export enum MessageType {
  ReceivedTextMessage,
  SentTextMessage,
  ReceivedAudioMessage,
  SentAudioMessage,
  ReceivedFileMessage,
  SentFileMessage,
  ReceivedImageMessage,
  SentImageMessage,
  ReceivedAlarmMessage,
  SentAlarmMessage,
  ReceivedRecalledAlarmMessage,
  SentAlarmRecalledMessage,
  SentLocationMessage,
  ReceivedLocationMessage,
  HoldingStatement,
  LogNotes,
  ImOk,
  OnCallAlerts,
}

export enum SentMessageType {
  Chat = 1,
  LogNotes = 10,
  HoldingStatement = 9,
}

export enum ReceivedMessageType {
  Alarm = 2,
  Broadcast = 3,
  LogFile = 10,
}

export enum MessageReplyType {
  Message,
  Reply,
}

export enum OnCallAlertStatusType {
  Available = 1,
  NotAvailable = 2,
  NoStatus = 0,
  All = 3,
}
export enum AlarmTypes {
  Crime = 2,
  Scared = 3,
  FeelingIll = 4,
  Fire = 5,
  ImportantMessage = 6,
}
export enum ChecklistStatus {
  Started = 'Started',
  NotStarted = 'NotStarted',
  Ended = 'Ended',
}

export enum GroupType {
  Normal = 0,
  Hidden = 2,
  CrossOrg = 3,
  CoAlert = 4,
}

export const groupTypeNames: Record<GroupType, string> = {
  0: 'groups_normal',
  2: 'groups_hidden',
  3: 'groups_cossOrg',
  4: 'groups_coAlert',
};

export enum ActiveTab {
  Groups,
  Users,
}

export enum CreateMessageReplyType {
  replyAll,
  senderOnly,
  noReply,
}
