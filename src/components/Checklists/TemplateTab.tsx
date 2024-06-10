import React from 'react';
import BigFloatButton from '../BigFloatButton/BigFloatButton';
import { palette } from '../../theme/colors';
import { useConfirmation } from '../../utils/ConfirmationServiceContext/confirmationContext';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { selectUserRoles } from '../../containers/Login/LoginSlice';
import { setChecklistName } from '../../containers/Checklists/checklistsSlice';
import ChecklistItem from './ChecklistItem';
import { TabProps } from '../../containers/Checklists/Checklists';
import styled from 'styled-components';
import emptyList from '../../assets/imgs/NotFound/no-result.svg';
import { EmptyListFallback } from '../EmptyListFallback/EmptyListFallback';

interface TemplateProps extends TabProps {}

function Template(props: TemplateProps) {
  const { checklists, onDotsClick } = props;

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const confirm = useConfirmation();
  const roles = useAppSelector(selectUserRoles);

  const canSeeCreateBtn = roles?.includes('EditLiveChecklists');

  const handleName = () => {
    confirm({
      description: 'checklist_name_checklist_template',
      onSubmit: (text?: string) => {
        if (text && text.length > 0) {
          dispatch(setChecklistName(text));
          navigate('create');
        }
      },
      onCancel: () => {},
      confirmText: 'proceed',
      inputBox: true,
      placeholderTx: 'checklist_name_template',
    });
  };

  return (
    <STemplateTab>
      {checklists.map((item) => (
        <ChecklistItem
          checklist={item}
          key={item.id}
          onDotsClick={onDotsClick}
        />
      ))}
      {checklists.length === 0 &&
        <EmptyListFallback
          src={emptyList}
          listLength={checklists.length}
          isLoading={false}
          searchTerm={''}
          emptyListTx={'empty_checklists'}
          noSearchTx={'messages_not_found_search'}
        />}
      {canSeeCreateBtn && (
        <BigFloatButton
          tx={'checklist_new_template'}
          style={{
            backgroundColor: `${palette.navyBlue}`,
            color: `${palette.white}`,
            border: `1px solid ${palette.honeyYellow}`,
          }}
          onClick={handleName}
        />
      )}
    </STemplateTab>
  );
}

export default Template;

const STemplateTab = styled.div`
  padding-bottom: 5rem;
`;
