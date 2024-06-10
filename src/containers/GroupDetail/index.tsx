import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

import { useAppSelector, useAppDispatch } from '../../hooks';
import {
  selectGroupDetail,
  selectGroupDetailIsLoading,
  selectGroupDetailError,
  reset,
  selectGroupMembersSortedSearched,
} from './groupDetailSlice';
import { fetchGroupDetail } from './groupDetailSlice/actionCreators';
import { GroupType, UserPermision } from '../../utils/enums';
import { palette } from '../../theme/colors';
import { SSearchFilterBar } from '../GroupsList';
import GroupInfoCard from '../../components/GroupInfoCard/GroupInfoCard';

import { FilterSection } from '../../components/SearchFilterBar/SearchFilterBar';
import { MemberFilter } from '../../components/MemberFIlter/MemberFilter';
import _ from 'lodash';
import Loader from '../../components/Loader/Loader';
import { GroupMemberItem } from '../../components/GroupMemberItem/GroupMemberItem';
import { useTranslation } from 'react-i18next';
import BigFloatButton from '../../components/BigFloatButton/BigFloatButton';
import { setSelectedGroupsAction } from '../CreateMessage/createMessageSlice/actionCreators';
import {
  resetAll,
  setGroupMembers,
  setSelectedGroupType,
} from '../CreateMessage/createMessageSlice';
import { Page } from '../../components/Page/Page';

export enum MemberFilterTypes {
  Name = 'groupInfoName',
  Title = 'groups_member_additionalInfo',
}

const MEMBER_FILTER_SECTIONS: FilterSection[] = [
  {
    title: 'groups_sortBy',
    type: 'radio',
    content: [
      { id: 0, name: MemberFilterTypes.Name, checked: true },
      { id: 1, name: MemberFilterTypes.Title, checked: false },
    ],
  },
];

export const GroupDetail = () => {
  const groupDetail = useAppSelector(selectGroupDetail);
  const isLoading = useAppSelector(selectGroupDetailIsLoading);
  const error = useAppSelector(selectGroupDetailError);

  const { name, imageFileName, membersCount } = groupDetail || {};
  const [filterOpen, setFilterOpen] = useState(false);
  const [memberFilters, setMemberFilters] = useState<FilterSection[]>(
    JSON.parse(JSON.stringify(MEMBER_FILTER_SECTIONS))
  );
  const [sorting, setSorting] = useState<MemberFilterTypes>(
    MemberFilterTypes.Name
  );
  const [searchText, setSearchText] = useState('');
  const members = useAppSelector(
    selectGroupMembersSortedSearched(sorting, searchText)
  );

  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const userPermision: UserPermision = groupDetail?.admin
    ? UserPermision.admin
    : UserPermision.member;

  useEffect(() => {
    const isParamsTrueID = Number(id);
    if (!isParamsTrueID) {
      navigate('/groups', { replace: false });
    }

    dispatch(fetchGroupDetail({ id: +id! }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => {
      setMemberFilters(JSON.parse(JSON.stringify(MEMBER_FILTER_SECTIONS)));
      dispatch(reset());
    };
  }, [id]);

  const handleOpenFilter = () => {
    setFilterOpen(!filterOpen);
  };

  const onSearchChanged = (value: string) => {
    onSearch(value);
  };

  const handleFilter = (memberFiltersNew: FilterSection[]) => {
    setMemberFilters(memberFiltersNew);
    memberFiltersNew[0].content.forEach(item => {
      if (item.checked) setSorting(item.name as MemberFilterTypes);
    });
    setFilterOpen(false);
  };

  const onMemberClick = (memberID: number) => {
    navigate(`memberSettings/${memberID}`, { replace: false });
  };

  const onSearch = (value: string) => {
    setSearchText(value);
  };

  const handleSendNewMessage = () => {
    dispatch(resetAll());
    dispatch(
      setSelectedGroupsAction([
        {
          groupType: groupDetail?.groupType,
          id: groupDetail?.id,
          name: groupDetail?.name,
          isChecked: true,
        },
      ])
    );
    dispatch(
      setGroupMembers(
        members?.map(member => ({ ...member, isSelected: true })) ?? []
      )
    );
    if (groupDetail?.groupType === GroupType.Normal) {
      dispatch(setSelectedGroupType([GroupType.Normal]));
    }
    if (groupDetail?.groupType === GroupType.CoAlert) {
      dispatch(setSelectedGroupType([GroupType.CoAlert]));
    }
    if (groupDetail?.groupType === GroupType.CrossOrg) {
      dispatch(setSelectedGroupType([GroupType.CrossOrg]));
    }
    if (groupDetail?.groupType === GroupType.Hidden) {
      dispatch(setSelectedGroupType([GroupType.Hidden]));
    }

    navigate(`/createMessage/new`);
  };

  if (isLoading.all) {
    return <Loader />;
  }

  if (error) {
    return <></>;
  }

  return (
    <>
      <Page>
        {groupDetail && members && (
          <GroupInfoCard
            name={name!}
            membersLength={members!.length}
            hidden={groupDetail.hidden}
            isAdmin={userPermision === UserPermision.admin}
            imageFileName={imageFileName!}
          />
        )}
        <SSearchFilterBar
          onSearch={onSearchChanged}
          handleOpenFilter={handleOpenFilter}
          value={searchText}
        />
        <MemberFilter
          label={'sort'}
          isOpen={filterOpen}
          filters={memberFilters}
          setIsOpen={handleOpenFilter}
          setCheckedState={setMemberFilters}
          onFilter={groupFiltersNew => {
            handleFilter(groupFiltersNew);
          }}
        />
        <SMembersTitle> {t(`groups_members`)} </SMembersTitle>
        <SMembersList>
          {members &&
            members!.map((member, index) => (
              <GroupMemberItem
                key={`${member.userID}-${index}`}
                memberID={member.userID!}
                title={member.userName!}
                subTitle={member.info!}
                date={member.lastAccess!}
                onClick={onMemberClick}
                isAdmin={!!member.admin}
                isGroupHidden={groupDetail?.groupType === 2}
                photoFileName={member.photoFileName || null}
              />
            ))}
        </SMembersList>
        <BigFloatButton
          tx="groups_sendMessage"
          onClick={handleSendNewMessage}
        />
      </Page>
    </>
  );
};

export const SColumnsContainers = styled.div`
  cursor: pointer;
  background-color: ${palette.fadedDarkBlue};
  margin-bottom: 0.5rem;
  padding: 1.2rem;
  border: 1px solid ${palette.queenBlue};
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: flex-start;

  :last-child {
    margin-bottom: 5rem;
  }
`;

export const SRowContainers = styled.div`
  color: ${palette.white};
  padding: 8px 4px 8px 11px;
`;

export const SName = styled.div`
  font-size: 16px;
  font-family: 'Roboto-Regular';
  color: ${palette.white};
  line-height: 19px;
  margin: 0 0 5px;
  flex: none;

  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

export const SInfoContainer = styled.div`
  display: flex;
  align-items: baseline;
  .margin-left {
    align-self: center;
    margin-left: 0.75rem;
  }
`;

export const SInfo = styled.div`
  font-size: 12px;
  font-family: 'Roboto-Regular';
  color: ${palette.silver};
  line-height: 14px;
  overflow-wrap: normal;
  flex: none;
`;

export const SMembersList = styled.div`
  min-height: 0;
  height: calc(100% - 6.25rem);
  padding-bottom: 5rem;
  /* vertical scrolling + hide scrollbar   */
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

export const SMembersTitle = styled.h2`
  margin: 0.25rem 0 0.5rem;
  font-size: 16px;
  font-family: 'Roboto-Regular';
  color: ${palette.silver};
  line-height: 19px;
`;
