import * as React from 'react';
import styled from 'styled-components';
import { palette } from '../../theme/colors';
import { HorizontalScrollSummaryList } from '../../components/HorizontalScrollSummaryList/HorizontalScrollSummaryList';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { useCreateCecMessageCtx } from '../CreateCecMessageContainer/CreateCecMessageContext';
import {
  selectExternalContactsTextTemplates,
  selectExternalContactsWithFilter,
  selectSmsLength,
} from '../ExternalContacts/externalContactsSlice';
import { SummaryTab } from '../../components/SummaryTab/SummaryTab';
import { CheckBoxWithSubTitle } from '../../components/CheckBoxWithSubTitle/CheckBoxWithSubTitle';
import { translate } from '../../utils/translate';
import {
  getMessageLimit,
  getMessageTemplateContent,
  getMessageTemplateName,
  getSendingMethodsNames,
  getTrackingLinkCount,
} from './helpers';
import {
  getExternalContacts,
  getExternalContactsTextTemplates,
  getExternalMessages,
  getSmsLenght,
} from '../ExternalContacts/externalContactsSlice/actionCreators';
import { CecTextTemplatesBottomSheet } from '../../components/cec/CecTextTemplatesBottomSheet/CecTextTemplatesBottomSheet';
import { CecChatInput } from '../../components/cec/CecChatInput/CecChatInput';
import { count } from 'sms-length';
import { sendCecMessage } from '../../apis/externalContacts';
import { useConfirmation } from '../../utils/ConfirmationServiceContext/confirmationContext';
import Loader from '../../components/Loader/Loader';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SContainer = styled.div`
  width: 90%;
  margin: auto;
`;
export const SAddListButton = styled.div`
  height: 2rem;
  padding: 11px 11px;
  border-radius: 999rem;
  background-color: ${palette.honeyYellow};
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  margin-right: 10px;
`;

const SCheckBoxWithSubTitle = styled(CheckBoxWithSubTitle)`
  padding: 1rem 0.75rem 1rem 0rem;

  .STitle {
    margin-left: 0;
    font-family: 'Roboto-Regular';
    font-size: 0.75rem;
    line-height: 0.875rem;
  }
`;

export interface ICreateCecMessageSummaryProps {}

export const CreateCecMessageSummary = (
  props: ICreateCecMessageSummaryProps
) => {
  const {} = props;
  const { t } = useTranslation();

  const [isTextTemplateOpen, setIsTextTemplateOpen] =
    React.useState<boolean>(false);

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const toggleIsOpen = () => {
    setIsTextTemplateOpen(prev => !prev);
  };

  const {
    contactListIds: selectedContactList,
    setContactListIds,
    sendMethods: selectedSendingMethods,
    addTrackingLink,
    setAddTrackingLink,
    setCecmessageText: setText,
    cecMessageText: text,
    onFinish,
  } = useCreateCecMessageCtx();

  const excternalContacts = useAppSelector(
    selectExternalContactsWithFilter(selectedContactList)
  );
  const [selectedTemplate, setSelectedTemplate] = React.useState<
    'CUSTOM' | number
  >('CUSTOM');
  const textTemplates = useAppSelector(selectExternalContactsTextTemplates);

  const smsLenght = useAppSelector(selectSmsLength);

  const dispatch = useAppDispatch();
  const navigation = useNavigate();
  const confirm = useConfirmation();

  const goToSelectContactList = () => {
    navigation('/createCecMessage');
  };
  const goToSelectSenedingMethods = () => {
    navigation('/createCecMessage/options');
  };
  const goToCec = () => {
    navigation('/cec');
  };

  const toggleAddTrackingLink = () => {
    setAddTrackingLink(prev => !prev);
  };

  const deleteContact = (id: number) => {
    setContactListIds(prev => {
      const filterdSet = new Set(prev);
      filterdSet.delete(id);
      if (filterdSet.size === 0) {
        goToSelectContactList();
      }
      return filterdSet;
    });
  };

  React.useEffect(() => {
    try {
      dispatch(getExternalContactsTextTemplates());
      dispatch(getSmsLenght());
    } catch (e) {}
  }, []);

  // make sure that the sending methods and the contact lis tis not empty
  React.useEffect(() => {
    if (selectedContactList.size === 0) {
      goToSelectContactList();
      return;
    }
    if (selectedSendingMethods.length === 0) {
      goToSelectSenedingMethods();
    }
  }, [selectedSendingMethods.length, selectedContactList.size]);

  const handleMessageSend = async (text: string) => {
    try {
      setIsLoading(true);
      await sendCecMessage({
        contactListIds: excternalContacts.map(contact => contact.id),
        generateToken: addTrackingLink,
        sendMethods: selectedSendingMethods.map(method => method - 1),
        text,
      });
      setIsLoading(false);
      dispatch(getExternalMessages());
      onFinish();
      goToCec();
    } catch (e) {
      setIsLoading(false);
      confirm({
        title: 'warning',
        description: t('cec_message_warning_popup'),
        onCancel: () => {
          goToCec();
        },
        confirmText: 'retry',
      });
    }
  };

  const handleTemplateSelect = (tempalteID: 'CUSTOM' | number) => {
    if (selectedTemplate === 'CUSTOM' && tempalteID === 'CUSTOM') return;
    setText(getMessageTemplateContent(tempalteID, textTemplates));
    setSelectedTemplate(tempalteID);
    toggleIsOpen();
  };

  if (isLoading) return <Loader />;

  return (
    <SContainer>
      <HorizontalScrollSummaryList
        data={excternalContacts}
        onAddButtonClick={goToSelectContactList}
        omSummaryClick={goToSelectContactList}
        OnDeleteItem={deleteContact}
      />
      <SummaryTab
        title={translate('messages_replyTo')!}
        summaryText={getSendingMethodsNames(selectedSendingMethods)}
        onTabClick={goToSelectSenedingMethods}
      />
      <SummaryTab
        title={translate('groups_message')! + ':'}
        summaryText={getMessageTemplateName(selectedTemplate, textTemplates)}
        onTabClick={toggleIsOpen}
      />
      <SCheckBoxWithSubTitle
        selected={addTrackingLink}
        title={translate('messages_add_tracking_link')!}
        valueId={0}
        checkBoxType="box"
        onToggleCheck={toggleAddTrackingLink}
      />
      <CecTextTemplatesBottomSheet
        isOpen={isTextTemplateOpen}
        toggleIsOpen={toggleIsOpen}
        textTemplates={textTemplates}
        onSelectTemplate={handleTemplateSelect}
      />
      <CecChatInput
        onMessageSend={handleMessageSend}
        text={text}
        setText={setText}
        limit={getMessageLimit({
          methods: selectedSendingMethods,
          text,
          withTrackingLinkofLenght: addTrackingLink
            ? getTrackingLinkCount(smsLenght)
            : undefined,
        })}
        textLenght={count(text).length}
      />
    </SContainer>
  );
};
