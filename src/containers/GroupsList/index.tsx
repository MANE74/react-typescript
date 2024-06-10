import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { selectGroups, selectGroupsIsLoading } from './groupsSlice';
import { fetchGroups } from './groupsSlice/actionCreators';
import {
  FilterSection,
  SearchFilterBar,
} from '../../components/SearchFilterBar/SearchFilterBar';
import NoGroupsImage from '../../assets/imgs/NotFound/no-result.svg';
import _, { debounce } from 'lodash';
import { Group } from './groupsSlice/types';
import { GroupFilter } from '../../components/GroupFilter/GroupFilter';
import { useTranslation } from 'react-i18next';
import Loader from '../../components/Loader/Loader';
import GroupListItem from '../../components/GroupListItem/GroupListItem';
import { selectUserRoles } from '../Login/LoginSlice';
import { SearchBarBase } from '../../components/SearchBarBase/SearchBarBase';
import { Page } from '../../components/Page/Page';
import { GroupType } from '../../utils/enums';
import { EmptyListFallback } from '../../components/EmptyListFallback/EmptyListFallback';

export enum GroupsFilterTypes {
  Member = 'groups_filter_member',
  NotAMember = 'groups_notAMember',
  Normal = 'groups_filter_normal',
  Hidden = 'groups_filter_hidden',
  CoAlert = 'groups_coAlert',
  CossOrg = 'groups_cossOrg',
}

const GROUP_FILTER_SECTIONS: FilterSection[] = [
  {
    title: 'groups_filter_by_status',
    type: 'checkbox',
    content: [
      {
        id: 0,
        name: GroupsFilterTypes.Member,
        checked: true,
      },
      {
        id: 1,
        name: GroupsFilterTypes.NotAMember,
        checked: false,
      },
    ],
  },
  {
    title: 'groups_groupType',
    type: 'checkbox',
    content: [
      {
        id: 0,
        name: GroupsFilterTypes.Normal,
        checked: true,
      },
      {
        id: 1,
        name: GroupsFilterTypes.Hidden,
        checked: true,
      },
    ],
  },
];

const GROUP_FILTER_SECTIONS_ALL: FilterSection[] = [
  {
    title: 'groups_filter_by_status',
    type: 'checkbox',
    content: [
      {
        id: 0,
        name: GroupsFilterTypes.Member,
        checked: true,
      },
      {
        id: 1,
        name: GroupsFilterTypes.NotAMember,
        checked: false,
      },
    ],
  },
  {
    title: 'groups_groupType',
    type: 'checkbox',
    content: [
      {
        id: 2,
        name: GroupsFilterTypes.CoAlert,
        checked: true,
      },
      {
        id: 3,
        name: GroupsFilterTypes.CossOrg,
        checked: true,
      },
      {
        id: 0,
        name: GroupsFilterTypes.Normal,
        checked: true,
      },
      {
        id: 1,
        name: GroupsFilterTypes.Hidden,
        checked: true,
      },
    ],
  },
];

export const GroupsList = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const groups = useAppSelector(selectGroups);
  const isLoading = useAppSelector(selectGroupsIsLoading);
  const roles = useAppSelector(selectUserRoles);

  const [groupsToShow, setGroupsToShow] = useState<Group[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const groupListRef = useRef<HTMLDivElement>(null);
  const [limit, setLimit] = useState(12);

  const showMoreFilters =
    _.filter(groups, group =>
      [GroupType.CrossOrg, GroupType.CoAlert].includes(group.groupType)
    ).length !== 0;
  const [groupFilters, setGroupFilters] = useState<FilterSection[]>(
    showMoreFilters
      ? JSON.parse(JSON.stringify(GROUP_FILTER_SECTIONS_ALL))
      : JSON.parse(JSON.stringify(GROUP_FILTER_SECTIONS))
  );

  const [afterShowMore, setAfterShowMore] = useState(false);

  useEffect(() => {
    dispatch(fetchGroups());
    return () => {
      setGroupFilters([...GROUP_FILTER_SECTIONS]);
    };
  }, [dispatch]);

  useEffect(() => {
    setGroupFilters(
      showMoreFilters
        ? JSON.parse(JSON.stringify(GROUP_FILTER_SECTIONS_ALL))
        : JSON.parse(JSON.stringify(GROUP_FILTER_SECTIONS))
    );
    setAfterShowMore(prev => !prev);
  }, [showMoreFilters]);
  useEffect(() => {
    setGroupsToShow(_.filter(groups, group => group.member));
    handleFilter();
  }, [groups]);

  useEffect(() => {
    handleFilter();
  }, [afterShowMore]);

  const handleOpenFilter = () => {
    setFilterOpen(!filterOpen);
  };

  const onGroupSelect = (id: number) => {
    navigate(`../groups/${id}`, {});
  };

  const handleFilter = () => {
    let newGroupListByStatus: Group[] = [];
    let newGroupList: Group[] = [];
    let filterByMember = false;

    groupFilters.forEach(group => {
      group.content.forEach(element => {
        if (element.checked) {
          if (element.name === GroupsFilterTypes.Member) {
            newGroupListByStatus = groups.filter(e => e.member);
            filterByMember = true;
          }
          if (element.name === GroupsFilterTypes.NotAMember) {
            if (filterByMember) {
              newGroupListByStatus = groups;
            } else {
              newGroupListByStatus = groups.filter(e => !e.member);
            }
          }
          if (element.name === GroupsFilterTypes.CoAlert) {
            const filteredGroups = newGroupListByStatus?.filter(
              e => e.groupType === 4
            );
            const itemsToAdd = _.filter(
              filteredGroups,
              group => !_.includes(newGroupList, group)
            );
            newGroupList = [...newGroupList, ...itemsToAdd];
          }
          if (element.name === GroupsFilterTypes.CossOrg) {
            const filteredGroups = newGroupListByStatus?.filter(
              e => e.groupType === 3
            );
            const itemsToAdd = _.filter(
              filteredGroups,
              group => !_.includes(newGroupList, group)
            );
            newGroupList = [...newGroupList, ...itemsToAdd];
          }
          if (element.name === GroupsFilterTypes.Normal) {
            const filteredGroups = newGroupListByStatus?.filter(
              e => e.groupType === 0
            );
            const itemsToAdd = _.filter(
              filteredGroups,
              group => !_.includes(newGroupList, group)
            );
            newGroupList = [...newGroupList, ...itemsToAdd];
          }
          if (element.name === GroupsFilterTypes.Hidden) {
            const filteredGroups = newGroupListByStatus?.filter(
              e => e.groupType === 2
            );
            const itemsToAdd = _.filter(
              filteredGroups,
              group => !_.includes(newGroupList, group)
            );
            newGroupList = [...newGroupList, ...itemsToAdd];
          }
        }
      });
    });
    setGroupsToShow(newGroupList);
    setFilterOpen(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handler = useCallback(
    debounce((limit: number) => {
      if (groupListRef.current) {
        groupListRef.current.scrollBy(0, -100);
      }
      setLimit(limit + 12);
    }, 300),
    [limit]
  );

  const scrolled = () => {
    if (!groupListRef.current) {
      return;
    }
    if (limit >= searchedGroups.length) {
      return;
    }
    if (
      groupListRef.current.offsetHeight + groupListRef.current.scrollTop + 50 >=
      groupListRef.current.scrollHeight
    ) {
      handler(limit);
    }
  };

  const checkGroupsType = (group: Group) => {
    if (group.groupType === 0) {
      return 'groups_filter_normal';
    } else if (group.groupType === 2) {
      return 'groups_filter_hidden';
    } else if (group.groupType === 3) {
      return 'groups_cossOrg';
    } else if (group.groupType === 4) {
      return 'groups_coAlert';
    }
    return '';
  };

  const onSearch = (value: string) => {
    setSearchText(value);
  };
  const includesText = (mainText: string) => {
    return mainText.toLowerCase().includes(searchText.toLowerCase());
  };

  const searchedGroups = searchText
    ? _.filter(groupsToShow, e => includesText(e.name))
    : groupsToShow;

  if (isLoading) {
    return <Loader />;
  }

  const seeFilter = roles?.includes('SeeOrgGroups');

  return (
    <>
      <SPage>
        {seeFilter ? (
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
        <GroupFilter
          label={'messages_filter'}
          isOpen={filterOpen}
          filters={groupFilters}
          setIsOpen={handleOpenFilter}
          setCheckedState={setGroupFilters}
          onFilter={handleFilter}
        />
        <SGroupsList ref={groupListRef} onScroll={scrolled}>
          {searchedGroups.slice(0, limit).map(group => (
            <GroupListItem
              key={String(group.id)}
              name={group.name}
              groupID={group.id}
              memberCount={group.groupMembersCount}
              onClick={onGroupSelect}
              hidden={group.hidden}
              imageFileName={group.imageFileName!}
              type={t(`${checkGroupsType(group)}`)}
            />
          ))}
          {searchedGroups.length === 0 && (
            <EmptyListFallback
              src={NoGroupsImage}
              listLength={searchedGroups.length}
              isLoading={false}
              searchTerm={''}
              emptyListTx={'groups_emptyGroups'}
              noSearchTx={''}
            />
          )}
        </SGroupsList>
      </SPage>
    </>
  );
};

const SPage = styled(Page)`
  padding-bottom: 0;
`;

export const SSearchFilterBar = styled(SearchFilterBar)`
  width: 100%;
  margin: 0 0 1rem 0;
`;

export const SSearchBarBase = styled(SearchBarBase)`
  margin: 0 0 1rem 0;
`;

export const SGroupsList = styled.div`
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
