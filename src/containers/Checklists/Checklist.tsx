import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled, { css } from 'styled-components';
import {
  getActiveChecklist,
  getChecklistItems,
  isChecklistsLoading,
  setChecklistItems,
  setChecklistName,
  setPreSelectedGroups,
} from './checklistsSlice';
import {
  changeChecklistItemStatus,
  editChecklistItems,
  fetchChecklistItems,
  fetchContinueChecklist,
  fetchOneChecklist,
} from './checklistsSlice/actionCreators';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { palette } from '../../theme/colors';
import Dots from '../../assets/imgs/general/option-dots.svg';
import Loader from '../../components/Loader/Loader';
import {
  Checklist as ChecklistType,
  ChecklistItem,
} from './checklistsSlice/types';
import { ChecklistBottomSheet } from '../../components/Checklists/ChecklistBottomSheet';
import { ChecklistStatus } from '../../utils/enums';
import BigFloatButton from '../../components/BigFloatButton/BigFloatButton';
import { useConfirmation } from '../../utils/ConfirmationServiceContext/confirmationContext';
import { translate } from '../../utils/translate';
import { dateFormats, getDateFormatCustom } from '../../utils/date';
import { Page } from '../../components/Page/Page';
import ChecklistDetails from '../../components/Checklists/ChecklistDetails/ChecklistDetails';
import _ from 'lodash';
import SCheckbox from '../../components/FilterItem/SBoxButton';
import { t } from 'i18next';
import { useLayoutContext } from '../../utils/customHooks/LayoutContext';
import NameChecklistModal from '../../components/Checklists/NameChecklistModal';
import { trunctateText } from '../../utils/truncate';

function Checklist() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const confirm = useConfirmation();
  const navigate = useNavigate();
  const layout = useLayoutContext();

  const [sortedItems, setSortedItems] = useState<ChecklistItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ChecklistItem | null>(null);
  const [addItemModalOpen, setAddItemModalOpen] = useState(false);
  const [newChecklistTaskName, setNewChecklistTaskName] = useState('');

  const checklist = useAppSelector(getActiveChecklist);
  const items = useAppSelector(getChecklistItems);
  const isLoading = useAppSelector(isChecklistsLoading);

  const status = checklist?.status;

  const types = {
    Checked: t('checklist_marked_as_done'),
    Unchecked: t('checklist_marked_as_undone'),
    Regular: t('checklist_regular'),
  };

  useEffect(() => {
    dispatch(fetchOneChecklist(Number(id)));
    dispatch(fetchChecklistItems(Number(id)));
    dispatch(setPreSelectedGroups([]));

    return () => {
      dispatch(setChecklistItems([]));
    };
  }, [dispatch, id]);

  const getGroupLength = (checklist: ChecklistType) => {
    const length = checklist.sharedGroups.length;
    if (length === 1) {
      return `${length} ${translate('group')}`;
    }
    if (length > 1) {
      return `${length} ${translate('groups_title')}`;
    }
    return null;
  };

  const getUserLength = (checklist: ChecklistType) => {
    const length = checklist.usersCount;
    if (length === 1) {
      return `${length} ${translate('member')}`;
    }
    if (length > 1) {
      return `${length} ${translate('groups_members')}`;
    }
    return null;
  };

  useLayoutEffect(() => {
    if (checklist) {
      let subText = [];
      const groupLength = getGroupLength(checklist);
      const userLength = getUserLength(checklist);

      if (checklist.name) {
        layout.setMessage(checklist.name);
      }
      if (groupLength !== null) subText.push(groupLength);
      if (userLength !== null) subText.push(userLength);

      // for (orgName of checklist.organizationNames) {
      //   subText.push(orgName);
      // }
      layout.setSubTitle(subText.join(', '));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checklist]);

  useEffect(() => {
    let newItems = [...items];
    newItems.sort((a, b) => a.sortIndex - b.sortIndex);
    setSortedItems(newItems);

    if (selectedItem) {
      const index = newItems.findIndex((e) => e.id === selectedItem.id);
      setSelectedItem(newItems[index]);
    }
  }, [items]);

  const handleClickItem = (item: ChecklistItem | null) => {
    if (status === ChecklistStatus.NotStarted) {
      return;
    }
    setSelectedItem(item);
    setDrawerOpen(!drawerOpen);
  };

  const handleClickCheck = (itemId: number, checked: boolean) => {
    dispatch(changeChecklistItemStatus(Number(id), itemId, !checked));
  };

  const handleContinueChecklist = (id: number) => {
    confirm({
      title: 'checklist_confirmation',
      description: 'checklist_continue_confirmation',
      onSubmit: () => {
        dispatch(
          fetchContinueChecklist(id, () => {
            setDrawerOpen(false);
            dispatch(fetchOneChecklist(Number(id)));
            navigate(`/checklist/${id}`);
          })
        );
      },
      onCancel: () => {},
      confirmText: 'checklist_reactivate',
    });
  };

  const handleActiveChecklist = (id: number) => {
    confirm({
      description: 'checklist_name_checklist_template',
      onSubmit: (text?: string) => {
        if (text && text.length > 0) {
          dispatch(setChecklistName(text));
          dispatch(fetchOneChecklist(Number(id)));
          navigate('start');
        }
      },
      onCancel: () => {},
      confirmText: 'proceed',
      inputBox: true,
      inputBoxIntialValue: checklist?.name,
      placeholderTx: 'checklist_name_template',
    });
  };

  const handleAddNew = () => {
    var tasks = [];
    sortedItems.forEach((item) => {
      tasks.push({
        id: item.id,
        name: item.name,
        sortIndex: item.sortIndex,
        new: false,
      });
    });
    tasks.push({
      id: null,
      name: newChecklistTaskName,
      sortIndex: sortedItems.length + 1,
      new: true,
    });

    dispatch(
      editChecklistItems(Number(id), tasks, () =>
        dispatch(fetchChecklistItems(Number(id)))
      )
    );
    setAddItemModalOpen(false);
  };

  const renderCheckbox = (item: ChecklistItem) => {
    if (status === ChecklistStatus.Started) {
      return (
        <SCheckbox
          stopPropagation
          onClick={() => handleClickCheck(item.id, item.complete)}
          isChecked={item.complete}
          disabled={false}
        />
      );
    }
    if (status === ChecklistStatus.NotStarted) {
      return <></>;
    }
    if (status === ChecklistStatus.Ended) {
      return (
        <SCheckbox
          stopPropagation
          isChecked={item.complete}
          disabled={item.complete}
          grey
        />
      );
    }
  };

  if (isLoading || !status) return <Loader />;

  return (
    <>
      <Page>
        <SChecklist>
          {sortedItems.map((item) => {
            const hasComment = item.comments.length !== 0;
            const lastComment = hasComment
              ? item.comments[item.comments.length - 1]
              : null;
            const unread = false;
            const hasImg =
              hasComment && lastComment?.imageFileName ? true : false;
            return (
              <SItem
                key={item.id}
                checked={item.complete}
                ended={status === ChecklistStatus.Ended}
                onClick={() => handleClickItem(item)}
                className="checklist-item"
              >
                {renderCheckbox(item)}

                <SDetails>
                  <p>{`${item.sortIndex}. ${item.name}`}</p>

                  {lastComment && (
                    <SComment unread={unread}>
                      <p className="author-text">{`${lastComment.author}: ${
                        hasImg
                          ? translate(`imageReceived`, { count: 1 })
                          : _.isNull(lastComment.text)
                          ? types[lastComment.type]
                          : trunctateText(lastComment.text, 38)
                      }`}</p>
                      <p className="time">
                        {getDateFormatCustom(
                          lastComment.sent!,
                          dateFormats.yearMonthDayTimeNoComma24
                        )}
                      </p>
                    </SComment>
                  )}
                </SDetails>
                {status !== ChecklistStatus.NotStarted && (
                  <SDots src={Dots} alt="" onClick={() => {}} />
                )}
              </SItem>
            );
          })}
        </SChecklist>
        {selectedItem && (
          <ChecklistBottomSheet
            isOpen={drawerOpen}
            toggleIsOpen={() => setDrawerOpen((prev) => !prev)}
            selectedItem={selectedItem}
            status={status}
          />
        )}
        {status === ChecklistStatus.Ended && (
          <BigFloatButton
            tx="checklist_action_continue"
            onClick={() => handleContinueChecklist(checklist.id)}
          />
        )}
        {status === ChecklistStatus.NotStarted && (
          <BigFloatButton
            tx="checklist_action_activate"
            onClick={() => handleActiveChecklist(checklist.id)}
          />
        )}

        <ChecklistDetails
          isOpen={layout.isMenuOpen}
          setIsOpen={layout.toggleHeaderMenuVisability}
          data={checklist}
          setAddItemModalOpen={() => {
            layout.toggleHeaderMenuVisability();
            setAddItemModalOpen(!addItemModalOpen);
          }}
        />
      </Page>
      {status === ChecklistStatus.Started && (
        <NameChecklistModal
          isOpen={addItemModalOpen}
          setIsOpen={setAddItemModalOpen}
          onAdd={handleAddNew}
          text={newChecklistTaskName}
          setText={setNewChecklistTaskName}
        />
      )}
    </>
  );
}

export default Checklist;

const SChecklist = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-bottom: 5rem;

  .checklist-item + * {
    margin-top: 10px;
  }

  /* vertical scrolling + hide scroller bar  */
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const SItem = styled.div<any>`
  position: relative;
  display: flex;
  width: 100%;
  border-radius: 10px;
  padding: 1rem;
  align-items: flex-start;
  border: 1px solid transparent;
  cursor: pointer;

  p {
    padding-left: 0.75rem;
    font-family: 'Roboto-Regular';
    font-size: 14px;
  }

  ${(props) =>
    props.checked
      ? css`
          border: 1px solid ${palette.prussianBlue2};
        `
      : css`
          background-color: ${palette.prussianBlue};
        `}

  ${(props) =>
    props.ended &&
    css`
      background-color: ${props.checked
        ? palette.darkSlateLightGrey
        : palette.prussianBlue};
      border: 1px solid
        ${props.checked ? palette.checkedBorder : palette.prussianBlue};
    `}
`;

const SDetails = styled.div`
  width: 100%;
  align-self: center;
`;

const SDots = styled.img`
  position: absolute;
  right: 11px;
  top: 15px;
  cursor: pointer;
`;

const SComment = styled.div<any>`
  font-family: 'Roboto-Regular';
  font-size: 12px;
  display: flex;
  color: ${(props) => (props.unread ? palette.honeyYellow : palette.silver)};
  justify-content: space-between;
  padding-top: 0.5rem;

  .author-text {
  }
`;
