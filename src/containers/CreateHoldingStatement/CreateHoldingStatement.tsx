import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { MessageFilter } from '../../components/Chat/MessageFilter';
import { CheckBoxWithSubTitlePhotoWrapper } from '../../components/CheckBoxWithSubTitle/CheckBoxWithSubTitlePhotoWrapper';
import Loader from '../../components/Loader/Loader';
import { FilterSection } from '../../components/SearchFilterBar/SearchFilterBar';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { palette } from '../../theme/colors';
import { useConfirmation } from '../../utils/ConfirmationServiceContext/confirmationContext';
import { useLayoutContext } from '../../utils/customHooks/LayoutContext';
import { useSelectlist } from '../../utils/customHooks/useSelectList';
import { GroupType } from '../../utils/enums';
import { translate } from '../../utils/translate';
import { SProceedButton } from '../CreateCecMessage/styles';
import {
  selectGroupsIsLoading,
  selectGroupsNoCANoCOWithFilter,
} from '../GroupsList/groupsSlice';
import { fetchGroups } from '../GroupsList/groupsSlice/actionCreators';
import { Group } from '../GroupsList/groupsSlice/types';
import { selectUser } from '../Login/LoginSlice';
import { getCurrentUserById } from '../Login/LoginSlice/actionCreators';
import { SList } from '../StartIamOkMessage/styles';
import {
  MemberNotMemberFiltersTX,
  MemberNotMemberGroupsFilters,
} from '../StartOnCallAlertMessage/helpers';
import { SSearchFilterBar } from '../StartOnCallAlertMessage/StartOnCallAlertMessage';
import { useCreateHoldingStatementCtx } from './CreateHoldingStatementContext';
import {
  getGroupsNameById,
  getGroupsTypeOrMemberCount,
  isCurrentUserTheOnlyMemberOfGroup,
} from './helpers';

const SCheckBoxWithSubTitlePhotoWrapper = styled(
  CheckBoxWithSubTitlePhotoWrapper
)`
  .STitle {
    font-family: 'Roboto-Regular';
  }
`;

const SMessageFilter = styled(MessageFilter)`
  position: absolute;
  left: 0;
  right: 0;
  transform: none;
  width: auto;
`;

const GROUP_FILTER_SECTIONS: FilterSection[] = [
  {
    title: 'messages_show_groups',
    type: 'checkbox',
    content: [
      {
        id: 0,
        name: MemberNotMemberFiltersTX[
          MemberNotMemberGroupsFilters.MemberOfGroup
        ],
        checked: true,
      },
      {
        id: 1,
        name: MemberNotMemberFiltersTX[
          MemberNotMemberGroupsFilters.NotMemberOfGroup
        ],
        checked: false,
      },
    ],
  },
];

export const CreateHoldingStatement = () => {
  const [searchTerm, setSearchTerm] = React.useState<string | undefined>();
  const [filterOpen, setFilterOpen] = React.useState<boolean>(false);
  const [groupFilters, setGroupFilters] = React.useState<FilterSection[]>(
    GROUP_FILTER_SECTIONS
  );

  const groups = useAppSelector(
    selectGroupsNoCANoCOWithFilter(
      groupFilters[0].content
        .filter(filter => filter.checked)
        .map(filter => filter.id),
      searchTerm
    )
  );

  const confirm = useConfirmation();
  const isLoading = useAppSelector(selectGroupsIsLoading);
  const user = useAppSelector(selectUser);
  const isSeeOrgGroups = user?.roles?.includes('SeeOrgGroups');

  const { setTabsState } = useLayoutContext();
  const {
    groupIds: selectedGroupIds,
    setGroupIds,
    selectedGroupType,
    setSelectedGroupType,
  } = useCreateHoldingStatementCtx();

  const { handleSelect, selectedItems } = useSelectlist({
    data: groups,
    initialSelected: selectedGroupIds,
  });

  const dispatch = useAppDispatch();
  const navigation = useNavigate();

  React.useEffect(() => {
    try {
      dispatch(fetchGroups());
      if (!user) dispatch(getCurrentUserById());
    } catch (e) {}
  }, []);

  const canProceed = selectedItems.size !== 0;
  const handleProceed = async () => {
    const checkGroups = await isCurrentUserTheOnlyMemberOfGroup(
      [...selectedItems],
      user!.id
    );

    if (checkGroups.is) {
      if (checkGroups.singleCurrentUserGroupIds) {
        const singleGroupUser = getGroupsNameById(
          checkGroups.singleCurrentUserGroupIds,
          groups
        );

        confirm({
          title: 'warning',
          description: translate('select_single_user_group_error')!,
          onSubmit: () => {},
          confirmText: 'ok',
        });
        return;
      }
    }
    setGroupIds(selectedItems);
    navigation('summary');
  };

  const toggleFilterOpen = () => setFilterOpen(prev => !prev);

  const onSearch = (value: string) => {
    setSearchTerm(value);
  };

  const onSelectGroup = (group: Group) => (valueId: number) => {
    handleSelect(valueId);
    setSelectedGroupType(selectedItems.size === 0 ? [] : [group.groupType]);
  };

  React.useEffect(() => {
    if (selectedItems.size === 0) {
      setSelectedGroupType([]);
    }
    return () => {
      if (selectedItems.size === 0) {
        setSelectedGroupType([]);
      }
    };
  }, [selectedItems.size]);

  if (isLoading) return <Loader />;
  return (
    <>
      <SSearchFilterBar
        onSearch={onSearch}
        handleOpenFilter={toggleFilterOpen}
        withoutFilterButton={!isSeeOrgGroups}
        $withoutFilterButton={!isSeeOrgGroups}
        value={searchTerm}
      />
      <SMessageFilter
        setTabBar={setTabsState}
        label={'filter'}
        isOpen={filterOpen}
        filters={groupFilters}
        setIsOpen={setFilterOpen}
        setCheckedState={setGroupFilters}
        onFilter={groupFiltersNew => {
          setGroupFilters(groupFiltersNew);
          toggleFilterOpen();
        }}
      />
      <SList $buttonPadding={canProceed}>
        {groups.map((group, index) => {
          return (
            <SCheckBoxWithSubTitlePhotoWrapper
              selected={selectedItems.has(group.id)}
              title={group.name}
              subTitle={getGroupsTypeOrMemberCount(group)}
              valueId={group.id}
              key={`${group.id}-${index}`}
              separatorColor={palette.tinyBorder}
              imageName={group.imageFileName || undefined}
              checkBoxType="box"
              onToggleCheck={onSelectGroup(group)}
              disabled={
                selectedGroupType.length > 0 &&
                !selectedGroupType.includes(group.groupType!)
              }
            />
          );
        })}
      </SList>
      {canProceed && <SProceedButton tx="proceed" onClick={handleProceed} />}
    </>
  );
};
