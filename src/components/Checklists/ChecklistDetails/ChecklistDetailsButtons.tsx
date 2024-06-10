import React from 'react';
import { ChecklistStatus } from '../../../utils/enums';
import {
  SChecklistButton,
  SChecklistSettingsWrapper,
} from './ChecklistDetails';

import { ReactComponent as Play } from '../../../assets/imgs/checklists/play.svg';
import { ReactComponent as EditUser } from '../../../assets/imgs/checklists/edit.svg';
import { ReactComponent as EditTemplate } from '../../../assets/imgs/checklists/user-add.svg';
import { ReactComponent as Delete } from '../../../assets/imgs/checklists/delete.svg';
import { ReactComponent as Close } from '../../../assets/imgs/checklists/close.svg';
import { ReactComponent as AddSquare } from '../../../assets/imgs/checklists/add-square.svg';
import { useAppDispatch } from '../../../hooks';
import {
  setChecklistName,
  setPreSelectedGroups,
} from '../../../containers/Checklists/checklistsSlice';
import { useConfirmation } from '../../../utils/ConfirmationServiceContext/confirmationContext';
import {
  fetchContinueChecklist,
  fetchDeleteTemplate,
  fetchEndChecklist,
} from '../../../containers/Checklists/checklistsSlice/actionCreators';
import { useNavigate } from 'react-router-dom';
import { translate } from '../../../utils/translate';
import { GroupDetail } from '../../../containers/GroupDetail/groupDetailSlice/types';

interface ChecklistDetailsButtonsProps {
  canEdit: boolean | undefined;
  status: ChecklistStatus;
  insideChecklist: boolean;
  id: number;
  foundSharedGroups: GroupDetail[];
  setIsOpen: () => void;
  name: string;
  setAddItemModalOpen?: () => void;
}

function ChecklistDetailsButtons(props: ChecklistDetailsButtonsProps) {
  const {
    canEdit,
    status,
    insideChecklist,
    id,
    foundSharedGroups,
    setIsOpen,
    name,
    setAddItemModalOpen,
  } = props;

  const dispatch = useAppDispatch();
  const confirm = useConfirmation();
  const navigate = useNavigate();

  const handleEditAccess = (id: number) => {
    if (foundSharedGroups.length > 0) {
      dispatch(
        setPreSelectedGroups(
          foundSharedGroups.map((group) => ({
            id: group.id,
            name: group.name,
            hidden: group.hidden,
            groupType: group.type,
          }))
        )
      );
    }
    navigate(`/checklist/${id}/edit-access`, {
      state: {
        fromList: !insideChecklist,
      },
    });
  };

  const handleDeleteChecklist = (id: number) => {
    confirm({
      title: 'checklist_confirmation',
      description: 'checklist_delete_confirmation',
      onSubmit: () => {
        dispatch(fetchDeleteTemplate(id));
        setIsOpen();
      },
      onCancel: () => {},
      confirmText: 'messages_delete',
      confirmStyle: 'red',
    });
  };

  const handleCheckListEnd = (id: number) => {
    confirm({
      title: 'checklist_confirmation',
      description: 'checklist_end_confirmation',
      onSubmit: () => {
        dispatch(fetchEndChecklist(id, navigate));
      },
      onCancel: () => {},
      confirmText: 'messages_endAlarm',
      confirmStyle: 'red',
    });

    setIsOpen();
  };

  const handleContinueChecklist = (id: number) => {
    confirm({
      title: 'checklist_confirmation',
      description: 'checklist_continue_confirmation',
      onSubmit: () => {
        dispatch(
          fetchContinueChecklist(id, () => {
            setIsOpen();
            insideChecklist ? navigate(0) : navigate(`/checklist/${id}`);
          })
        );
      },
      onCancel: () => {},
      confirmText: 'checklist_reactivate',
    });
  };

  const handleStartChecklist = (id: number) => {
    confirm({
      description: 'checklist_name',
      onSubmit: (text?: string) => {
        if (text && text.length > 0) {
          dispatch(setChecklistName(text));
          dispatch(
            setPreSelectedGroups(
              foundSharedGroups.map((group) => ({
                id: group.id,
                name: group.name,
                hidden: group.hidden,
                groupType: group.type,
              }))
            )
          );
          navigate(`/checklist/${id}/start`);
        }
      },
      onCancel: () => {},
      confirmText: 'proceed',
      inputBox: true,
      inputBoxIntialValue: name,
      placeholderTx: 'checklist_name',
    });
  };

  if (!canEdit) return <></>;
  return (
    <div className="wrapper">
      {status === ChecklistStatus.Started && (
        <SChecklistSettingsWrapper button>
          {canEdit && (
            <>
              {insideChecklist && (
                <>
                  <SChecklistButton
                    onClick={() => {
                      setAddItemModalOpen && setAddItemModalOpen();
                    }}
                  >
                    <p>{translate(`checkListInfo_add_task`)}</p>
                    <AddSquare />
                  </SChecklistButton>
                  <SChecklistButton
                    onClick={() => {
                      handleEditAccess(id);
                    }}
                  >
                    <p>{translate(`checklist_edit_acces`)}</p>
                    <EditTemplate />
                  </SChecklistButton>
                </>
              )}

              <SChecklistButton
                onClick={() => {
                  handleCheckListEnd(id);
                }}
              >
                <p>{translate(`checklist_end_checklist`)}</p>
                <Close />
              </SChecklistButton>
            </>
          )}
        </SChecklistSettingsWrapper>
      )}
      {status === ChecklistStatus.NotStarted && (
        <SChecklistSettingsWrapper button>
          <SChecklistButton onClick={() => handleStartChecklist(id)}>
            <p>{translate(`checkist_start_template`)}</p>
            <Play />
          </SChecklistButton>

          {canEdit && (
            <>
              <SChecklistButton
                onClick={() => {
                  handleEditAccess(id);
                }}
              >
                <p>{translate(`checklist_edit_acces`)}</p>
                <EditTemplate />
              </SChecklistButton>

              <SChecklistButton
                onClick={() =>
                  navigate(`/checklist/${id}/edit`, {
                    state: {
                      fromList: !insideChecklist,
                      fromItem: insideChecklist,
                    },
                  })
                }
              >
                <p>{translate(`checklist_edit_template`)}</p>
                <EditUser />
              </SChecklistButton>

              <SChecklistButton onClick={() => handleDeleteChecklist(id)}>
                <p>{translate(`checklist_action_delete`)}</p>
                <Delete />
              </SChecklistButton>
            </>
          )}
        </SChecklistSettingsWrapper>
      )}
      {status === ChecklistStatus.Ended && (
        <SChecklistSettingsWrapper button>
          <SChecklistButton onClick={() => handleContinueChecklist(id)}>
            <p>{translate(`checklist_action_continue`)}</p>
            <Play />
          </SChecklistButton>
        </SChecklistSettingsWrapper>
      )}
    </div>
  );
}

export default ChecklistDetailsButtons;
