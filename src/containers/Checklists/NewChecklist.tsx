import React, { SyntheticEvent, useEffect, useState } from 'react';
import styled from 'styled-components';
import BigFloatButton from '../../components/BigFloatButton/BigFloatButton';
import NameChecklistModal from '../../components/Checklists/NameChecklistModal';
import { palette } from '../../theme/colors';
import { ReactComponent as Burger } from '../../assets/imgs/checklists/burger.svg';
import { ReactComponent as Dots } from '../../assets/imgs/general/option-dots.svg';
import _ from 'lodash';
import Options, { OptionItemProps } from '../../components/Options/Options';
import Pencil from '../../assets/imgs/chats/edit-white.svg';
import Delete from '../../assets/imgs/chats/delete.svg';
import { useConfirmation } from '../../utils/ConfirmationServiceContext/confirmationContext';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  createChecklist,
  editChecklistItems,
  fetchChecklistItems,
  fetchOneChecklist,
} from './checklistsSlice/actionCreators';
import { useNavigate } from 'react-router-dom';
import {
  getActiveChecklist,
  getChecklistItems,
  getChecklistName,
  getSelectedGroups,
  getSelectedUsers,
  getTempChecklistTasks,
  reset,
  setActiveTab,
  setChecklistName,
  setTempChecklistTasks,
} from './checklistsSlice';
import { useLayoutContext } from '../../utils/customHooks/LayoutContext';
import { Page } from '../../components/Page/Page';
import { ChecklistTask } from './checklistsSlice/types';
import { translate } from '../../utils/translate';
import UserAdd from '../../assets/imgs/checklists/user-add.svg';
import { ChecklistStatus } from '../../utils/enums';

interface NewChecklistProps {
  id?: string;
  edit?: boolean;
  isHeaderOptionsOpen: boolean;
  setHeaderOptionsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function NewChecklist(props: NewChecklistProps) {
  const { id, edit, isHeaderOptionsOpen, setHeaderOptionsOpen } = props;

  const confirm = useConfirmation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const layout = useLayoutContext();

  const checklist = useAppSelector(getActiveChecklist);
  const items = useAppSelector(getChecklistItems);
  const preSelectedTasks = useAppSelector(getTempChecklistTasks);
  const checklistName = useAppSelector(getChecklistName);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [tasks, setTasks] = useState<ChecklistTask[]>([]);
  const [dragId, setDragId] = useState('');
  const [selectedList, setSelectedList] = useState('');
  const [text, setText] = useState('');
  const selectedUsers = useAppSelector(getSelectedUsers);
  const selectedGroups = useAppSelector(getSelectedGroups);
  const started = checklist?.status === 'Started';

  useEffect(() => {
    if (preSelectedTasks) {
      setTasks([...preSelectedTasks]);
    }
  }, []);

  useEffect(() => {
    if (!isOptionsOpen && !isModalOpen) setSelectedList('');
  }, [isOptionsOpen, isModalOpen]);

  useEffect(() => {
    if (!id || !edit) return;

    dispatch(fetchOneChecklist(Number(id)));
    dispatch(fetchChecklistItems(Number(id)));
  }, [id]);

  useEffect(() => {
    if (!id || !edit) return;

    layout.setMessage(checklist?.name);
    checklist?.name && dispatch(setChecklistName(checklist.name));
  }, [checklist]);

  useEffect(() => {
    if (!id || !edit) return;

    let newState = [];
    for (const item of items) {
      newState.push({
        id: item.id.toString(),
        sortIndex: item.sortIndex,
        name: item.name,
      });
    }

    setTasks(newState);
  }, [items]);

  const handleDelete = () => {
    const foundIndex = tasks.findIndex((item) => item.id === selectedList);
    const newList = [...tasks];
    newList[foundIndex].deleted = true;
    newList
      .filter((a) => !a.deleted)
      .forEach((item, key) => {
        item.sortIndex = key + 1;
      });
    setTasks(newList);
    setIsOptionsOpen(false);
  };

  const onDeleteTemplate = () => {
    dispatch(reset());
    navigate('/checklists');
  };

  const handleDeleteTemplate = () => {
    confirm({
      title: 'messages_confirmation',
      description: 'checklist_delete_confirmation',
      onSubmit: onDeleteTemplate,
      onCancel: () => {},
      confirmText: 'delete',
      confirmStyle: 'red',
    });
  };

  const handleEdit = () => {
    const newText =
      tasks.find((element) => element.id === selectedList)?.name || '';

    setIsModalOpen(true);
    setIsOptionsOpen(false);
    setText(newText);
  };

  const handleAddRecipients = () => {
    setHeaderOptionsOpen(false);
    dispatch(setTempChecklistTasks(tasks));
    if (edit) {
      navigate(`/checklist/${id}/edit-access`);
    } else {
      navigate('/checklists/create', { state: { fromNew: true } });
    }
  };

  const handleRenameChecklist = () => {
    setHeaderOptionsOpen(false);
    confirm({
      description: 'checklist_name_checklist_template',
      onSubmit: (text?: string) => {
        if (text && text.length > 0) {
          dispatch(setChecklistName(text));
        }
      },
      onCancel: () => {},
      confirmText: 'proceed',
      inputBox: true,
      placeholderTx: 'checklist_name_template',
      inputBoxIntialValue: checklistName,
    });
  };

  const CHECKLIST_OPTIONS: OptionItemProps[] = [
    {
      name: 'messages_edit',
      icon: Pencil,
      callback: handleEdit,
    },
    {
      name: 'messages_delete',
      icon: Delete,
      callback: handleDelete,
    },
  ];

  const CHECKLIST_HEADER_OPTIONS: OptionItemProps[] = [
    {
      name: 'messages_add_recipients',
      icon: UserAdd,
      callback: handleAddRecipients,
    },
    {
      name: 'checklist_edit_name',
      icon: Pencil,
      callback: handleRenameChecklist,
    },
    {
      name: 'messages_delete',
      icon: Delete,
      callback: handleDeleteTemplate,
    },
  ];

  if (started) {
    CHECKLIST_HEADER_OPTIONS.splice(0);
  }

  const handleDrag = (e: SyntheticEvent) => {
    setDragId(e.currentTarget.id);
  };

  const handleDrop = (e: SyntheticEvent) => {
    const dragItem = tasks.find((item) => item.id === dragId);
    const dropItem = tasks.find((item) => item.id === e.currentTarget.id);
    if (!dragItem || !dropItem) return;

    const dragItemOrder = dragItem.sortIndex;
    const dropItemOrder = dropItem.sortIndex;

    var newItemState = _.cloneDeep(tasks);

    _.forEach(newItemState, (item) => {
      if (item.id === dragId) {
        item.sortIndex = dropItemOrder;
      }
      if (item.id === e.currentTarget.id) {
        item.sortIndex = dragItemOrder;
      }
      return item;
    });

    setTasks(newItemState);
  };

  const handleAddNew = () => {
    if (selectedList) {
      let newList = tasks;
      const indx = newList.findIndex((item) => item.id === selectedList);
      newList[indx].name = text;
      setTasks(newList);
      setSelectedList('');
    } else {
      setTasks([
        ...tasks,
        {
          id: `${text}-${tasks.length + 1}`,
          name: text,
          sortIndex: tasks.length + 1,
          new: true,
        },
      ]);
    }
    setIsModalOpen(false);
  };

  const handleSaveEdit = () => {
    dispatch(setTempChecklistTasks(null));
    const activeTasks = _.filter(tasks, (task) => !task.deleted);
    const deletedTasks = _.filter(tasks, (task) => task.deleted === true);
    const taskList = _.map(activeTasks, (task, index) => {
      return {
        name: task.name,
        sortIndex: index + 1,
        delete: false,
        id: task.new ? null : task.id,
      };
    });
    _.forEach(deletedTasks, (task, index) => {
      taskList.push({
        name: task.name,
        sortIndex: index + 1,
        delete: true,
        id: task.id,
      });
    });

    dispatch(setActiveTab(ChecklistStatus.NotStarted));
    dispatch(
      editChecklistItems(Number(id), taskList, () =>
        navigate(`/checklist/${id}`)
      )
    );
  };

  const handleCreate = () => {
    dispatch(setTempChecklistTasks(null));
    const activeTasks = _.filter(tasks, (task) => !task.deleted);
    let selecterUserIds: any = selectedUsers.map((e) => e.id);
    let selectedGroupIds: any = selectedGroups.map((e) => e.id);

    const newList = activeTasks.map((task) => ({
      sortIndex: task.sortIndex,
      name: task.name,
    }));

    dispatch(
      createChecklist(newList, selecterUserIds, selectedGroupIds, () =>
        navigate('/checklists')
      )
    );
  };

  return (
    <SPage>
      <SNewChecklist>
        <SNewCheclistItemContainer>
          {tasks
            .sort((a, b) => a.sortIndex - b.sortIndex)
            .filter((a) => !a.deleted)
            .map((item) => (
              <SNewCheclistItem
                key={item.id}
                id={item.id}
                draggable={true}
                onDragOver={(e) => (!started ? e.preventDefault() : '')}
                onDragStart={handleDrag}
                onDrop={handleDrop}
              >
                {!started && <Burger />}
                <p>{`${item.sortIndex}. ${item.name}`}</p>
                {!started && (
                  <Dots
                    className="dots"
                    onClick={() => {
                      setIsOptionsOpen(!isOptionsOpen);
                      setSelectedList(item.id);
                    }}
                  />
                )}
              </SNewCheclistItem>
            ))}
        </SNewCheclistItemContainer>

        <BigFloatButton
          tx={translate('checklist_add_task') + ' +'}
          style={{
            backgroundColor: palette.navyBlue,
            color: palette.honeyYellow,
            border: `1px solid ${palette.honeyYellow}`,
            bottom: !_.isEmpty(tasks) ? '10rem' : '6rem',
          }}
          onClick={() => {
            setIsModalOpen(!isModalOpen);
          }}
        />

        {!_.isEmpty(tasks) && (
          <BigFloatButton
            onClick={edit ? handleSaveEdit : handleCreate}
            tx={'save_and_proceed'}
          />
        )}
      </SNewChecklist>
      <NameChecklistModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onAdd={handleAddNew}
        text={text}
        setText={setText}
      />
      <Options
        items={CHECKLIST_OPTIONS}
        isOpen={isOptionsOpen}
        setIsOpen={setIsOptionsOpen}
        setTabBar
      />

      <Options
        items={CHECKLIST_HEADER_OPTIONS}
        isOpen={isHeaderOptionsOpen}
        setIsOpen={setHeaderOptionsOpen}
        setTabBar
      />
    </SPage>
  );
}

export default NewChecklist;

const SPage = styled(Page)`
  padding: 1.25rem 0;
`;

const SNewChecklist = styled.div`
  padding: 0 1.25rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  min-height: 0;
  height: 100%;
`;

const SNewCheclistItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 9rem;
  div + * {
    margin-top: 10px;
  }

  min-height: 0;
  height: 100%;

  /* vertical scrolling + hide scroller bar  */
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const SNewCheclistItem = styled.div`
  display: flex;
  align-items: center;
  border-radius: 10px;
  border: 1px solid ${palette.queenBlue};
  background-color: ${palette.prussianBlue};
  padding: 1.25rem;

  p {
    margin-left: 10px;
    font-family: 'Roboto-Regular';
    font-size: 16px;
    letter-spacing: 0.01em;
  }

  .dots {
    margin-left: auto;
    cursor: pointer;
  }
`;
