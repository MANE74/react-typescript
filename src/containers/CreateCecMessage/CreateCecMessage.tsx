import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '../../components/Button/Button';
import { CheckBoxWithSubTitle } from '../../components/CheckBoxWithSubTitle/CheckBoxWithSubTitle';
import Loader from '../../components/Loader/Loader';

import { useAppDispatch, useAppSelector } from '../../hooks';
import { palette } from '../../theme/colors';
import { useSelectlist } from '../../utils/customHooks/useSelectList';
import { translate } from '../../utils/translate';
import { useCreateCecMessageCtx } from '../CreateCecMessageContainer/CreateCecMessageContext';
import {
  selectExternalContacts,
  selectIsExternalContactsLoading,
} from '../ExternalContacts/externalContactsSlice';
import { getExternalContacts } from '../ExternalContacts/externalContactsSlice/actionCreators';
import { SCheckBoxWithSubTitle, SList, SProceedButton } from './styles';

export interface ICreateCecMessageProps {}

export const CreateCecMessage = (props: ICreateCecMessageProps) => {
  const {} = props;

  const isLoading = useAppSelector(selectIsExternalContactsLoading);
  const excternalContacts = useAppSelector(selectExternalContacts);

  const dispatch = useAppDispatch();
  const navigation = useNavigate();

  const { contactListIds: selectedContactList, setContactListIds } =
    useCreateCecMessageCtx();

  const { handleSelect, selectedItems } = useSelectlist({
    data: excternalContacts,
    initialSelected: selectedContactList,
  });
  const canProceed = selectedItems.size !== 0;

  React.useEffect(() => {
    try {
      if (excternalContacts.length === 0) {
        dispatch(getExternalContacts());
      }
    } catch (e) {}
  }, []);

  const handleProceed = () => {
    setContactListIds(selectedItems);
    navigation('options');
  };

  if (isLoading) return <Loader />;
  return (
    <>
      <SList>
        {excternalContacts.map((contact, index) => (
          <SCheckBoxWithSubTitle
            selected={selectedItems.has(contact.id)}
            title={contact.name}
            subTitle={
              contact.numberOfContacts
                ? contact.numberOfContacts === 1
                  ? `${contact.numberOfContacts} ${translate('member')}`
                  : `${contact.numberOfContacts} ${translate('groups_members')}`
                : translate('cec_noMembers')!
            }
            valueId={contact.id}
            key={`${contact.id}-${index}`}
            separatorColor={palette.tinyBorder}
            checkBoxType="box"
            onToggleCheck={handleSelect}
          />
        ))}
      </SList>
      {canProceed && <SProceedButton tx="proceed" onClick={handleProceed} />}
    </>
  );
};
