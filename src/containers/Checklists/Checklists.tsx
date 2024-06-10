import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { SearchBarBase } from '../../components/SearchBarBase/SearchBarBase';
import { Tabs, TabPanel, Tab } from 'react-tabs';
import { useTranslation } from 'react-i18next';
import Active from '../../components/Checklists/ActiveTab';
import Ended from '../../components/Checklists/EndedTab';
import Template from '../../components/Checklists/TemplateTab';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchChecklists } from './checklistsSlice/actionCreators';
import {
  getActiveChecklist,
  getActiveTab,
  getChecklists,
  isChecklistsLoading,
  reset,
  setActiveTab,
  setPreSelectedGroups,
} from './checklistsSlice';
import { ChecklistStatus } from '../../utils/enums';
import ChecklistDetails from '../../components/Checklists/ChecklistDetails/ChecklistDetails';
import { Checklist } from './checklistsSlice/types';
import {
  FilterSection,
  SearchFilterBar,
} from '../../components/SearchFilterBar/SearchFilterBar';
import Loader from '../../components/Loader/Loader';
import { selectUser, selectUserRoles } from '../Login/LoginSlice';
import ChecklistFilter from '../../components/Checklists/ChecklistFilter';
import { selectGroups } from '../GroupsList/groupsSlice';
import { fetchGroups } from '../GroupsList/groupsSlice/actionCreators';
import { STabList } from '../CreateMessage/CreateMessageList';
import { Page } from '../../components/Page/Page';
import { palette } from '../../theme/colors';
import { useLayoutContext } from '../../utils/customHooks/LayoutContext';

const filters: FilterSection[] = [
  {
    title: 'checklist_filter_by_sort',
    type: 'radio',
    content: [
      { id: 0, name: 'Name', nameTx: 'alphabet', checked: false },
      { id: 1, name: 'DateTime', nameTx: 'groups_filter_doc', checked: true },
    ],
  },
  {
    title: 'checklists_checklistType',
    type: 'checkbox',
    content: [
      {
        id: 0,
        name: 'Created by me',
        nameTx: 'checklists_filter_created_me',
        checked: true,
      },
      {
        id: 1,
        name: 'Created by others',
        nameTx: 'checklists_filter_created_other',
        checked: true,
      },
      {
        id: 2,
        name: 'Only shared with me',
        nameTx: 'checklists_filter_shared',
        checked: true,
      },
    ],
  },
];

export interface TabProps {
  checklists: Checklist[];
  onDotsClick: () => void;
}

function Checklists() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const layout = useLayoutContext();

  const checklists = useAppSelector(getChecklists);
  const activeChecklist = useAppSelector(getActiveChecklist);
  const groupList = useAppSelector(selectGroups);
  const isLoading = useAppSelector(isChecklistsLoading);
  const roles = useAppSelector(selectUserRoles);
  const user = useAppSelector(selectUser);
  const activeTab = useAppSelector(getActiveTab);

  const [searchText, setSearchText] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [checklistFilter, setChecklistFilter] =
    useState<FilterSection[]>(filters);
  const [checklistsToShow, setChecklistsToShow] = useState(checklists);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    setChecklistsToShow(checklists);
    handleFilter();
  }, [checklists]);

  useEffect(() => {
    getSelectedTab();

    dispatch(setPreSelectedGroups([]));
    if (checklists.length === 0) {
      dispatch(fetchChecklists());
      dispatch(fetchGroups({ menuitem: 'checklists' }));
    }

    var handle = setInterval(() => {
      dispatch(fetchChecklists(false));
      dispatch(fetchGroups({ menuitem: 'checklists' }, false));
    }, 15000);

    return () => {
      clearInterval(handle);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    if (!isSettingsOpen) dispatch(reset());
  }, [dispatch, isSettingsOpen]);

  const getSelectedTab = () => {
    if (activeTab === ChecklistStatus.Started) {
      setTabIndex(0);
    }
    if (activeTab === ChecklistStatus.NotStarted) {
      setTabIndex(1);
    }
    if (activeTab === ChecklistStatus.Ended) {
      setTabIndex(2);
    }
  };

  const onSearch = (value: string) => {
    setSearchText(value);
  };
  const includesText = (mainText: string) => {
    return mainText.toLowerCase().includes(searchText.toLowerCase());
  };
  const searchedChecklists = searchText
    ? checklistsToShow?.filter((item) => includesText(item.name))
    : checklistsToShow;

  const getStartedChecklists = () => {
    return searchedChecklists.filter(
      (item) => item.status === ChecklistStatus.Started
    );
  };

  const getNotStartedChecklists = () => {
    return searchedChecklists.filter(
      (item) => item.status === ChecklistStatus.NotStarted
    );
  };

  const getEndedChecklists = () => {
    return searchedChecklists.filter(
      (item) => item.status === ChecklistStatus.Ended
    );
  };

  const handleOpenFilter = () => {
    setFilterOpen(!filterOpen);
  };

  const handleFilter = () => {
    let currentList = [...checklists];
    checklistFilter.forEach((item) => {
      if (item.type === 'checkbox') {
        currentList = currentList.filter((e) => {
          if (
            filters[1].content[0].checked &&
            e.owner?.displayName === user?.name
          ) {
            return true;
          }
          if (
            filters[1].content[1].checked &&
            e.owner?.displayName !== user?.name
          ) {
            return true;
          }
          if (filters[1].content[2].checked) {
            if (
              groupList.filter(
                (gItem) => e.sharedGroups.includes(gItem.id) && gItem.member
              ).length
            ) {
              return true;
            }
          }
          return false;
        });
      }
      if (item.type === 'radio') {
        item.content.forEach((element) => {
          if (element.checked) {
            if (element.name === 'Name') {
              currentList.sort(function (a, b) {
                if (a.name < b.name) {
                  return -1;
                }
                if (a.name > b.name) {
                  return 1;
                }
                return 0;
              });
            }
            if (element.name === 'DateTime') {
              currentList.sort(
                (a: any, b: any) =>
                  Date.parse(b.created) - Date.parse(a.created)
              );
            }
          }
        });
      }
    });

    setChecklistsToShow(currentList);
    setFilterOpen(false);
  };

  const isManager = roles?.includes('EditLiveChecklists');

  return (
    <SPage noBottomPadding>
      <SSelect>
        <STabs
          selectedTabClassName="is-selected"
          selectedTabPanelClassName="is-selected"
          selectedIndex={tabIndex}
          onSelect={(index) => setTabIndex(index)}
        >
          <STabList>
            <STab
              onClick={() => dispatch(setActiveTab(ChecklistStatus.Started))}
            >
              {t('checklist_active')} {`(${getStartedChecklists().length})`}
            </STab>
            <STab
              onClick={() => dispatch(setActiveTab(ChecklistStatus.NotStarted))}
            >
              {t('checklist_template')}{' '}
              {`(${getNotStartedChecklists().length})`}
            </STab>
            <STab onClick={() => dispatch(setActiveTab(ChecklistStatus.Ended))}>
              {t('checklist_ended')} {`(${getEndedChecklists().length})`}
            </STab>
          </STabList>
          <div>
            {isManager ? (
              <SSearchFilterBar
                onSearch={onSearch}
                handleOpenFilter={handleOpenFilter}
                value={searchText}
              />
            ) : (
              <SSearchBarBase
                placeholderTx="documents_search"
                placeholder="Search..."
                fallback={onSearch}
                value={searchText}
              />
            )}
          </div>
          <STabPanel>
            {activeTab === ChecklistStatus.Started && (
              <>
                {isLoading ? (
                  <Loader />
                ) : (
                  <Active
                    checklists={getStartedChecklists()}
                    onDotsClick={layout.toggleHeaderMenuVisability}
                  />
                )}
              </>
            )}
          </STabPanel>
          <STabPanel>
            {activeTab === ChecklistStatus.NotStarted && (
              <>
                {isLoading ? (
                  <Loader />
                ) : (
                  <Template
                    checklists={getNotStartedChecklists()}
                    onDotsClick={layout.toggleHeaderMenuVisability}
                  />
                )}
              </>
            )}
          </STabPanel>
          <STabPanel>
            {activeTab === ChecklistStatus.Ended && (
              <>
                {isLoading ? (
                  <Loader />
                ) : (
                  <Ended
                    checklists={getEndedChecklists()}
                    onDotsClick={layout.toggleHeaderMenuVisability}
                  />
                )}
              </>
            )}
          </STabPanel>
        </STabs>
      </SSelect>
      <ChecklistDetails
        isOpen={layout.isMenuOpen}
        setIsOpen={layout.toggleHeaderMenuVisability}
        data={activeChecklist}
      />
      <ChecklistFilter
        isOpen={filterOpen}
        setIsOpen={() => setFilterOpen((prev) => !prev)}
        filters={filters}
        onFilter={handleFilter}
        setCheckedState={setChecklistFilter}
      />
    </SPage>
  );
}

const SPage = styled(Page)`
  padding-top: 2rem;
  display: flex;
  flex-direction: column;
`;

const SSelect = styled.div`
  min-height: 0;
  height: 100%;
`;

export const STabs = styled(Tabs)`
  font-size: 12px;
  width: 100%;
  height: 100%;
  padding-top: 0px;
  display: flex;
  flex-direction: column;
`;
export const STab = styled(Tab)<any>`
  cursor: pointer;
  color: ${(props) => props.disabled && palette.silver};
  width: 50%;
  text-align: center;
  user-select: none;
  padding: 0 0 10px 0;
  border-bottom: 1px solid ${palette.queenBlue};
  font-family: 'Roboto-Regular';
  font-size: 14px;

  &.is-selected {
    border-bottom: 2px solid ${palette.honeyYellow};
    color: ${palette.honeyYellow};
    margin-bottom: -0.5px;
  }

  &:focus {
    outline: none;
  }
`;

export const STabPanel = styled(TabPanel)`
  &.is-selected {
    /* vertical scrolling + hide scroller bar  */
    overflow-x: hidden;
    overflow-y: auto;
    &::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;

    height: 100%;
    display: block;
  }
`;

export const SSearchFilterBar = styled(SearchFilterBar)`
  margin: 1.25rem 0;
`;

const SSearchBarBase = styled(SearchBarBase)`
  margin: 1.25rem 0;
`;

export default Checklists;
