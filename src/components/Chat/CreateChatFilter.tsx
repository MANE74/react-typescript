import styled from 'styled-components';
import { palette } from '../../theme/colors';
import { Backdrop } from '../Backdrop/Backdrop';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActionButton } from '../ActionButtons/ActionButtons.style';
import { SearchBarBase } from '../SearchBarBase/SearchBarBase';
import FilterCheckboxItem from '../FilterItem/FilterCheckboxItem';
import _ from 'lodash';
import { GroupMember } from '../../containers/GroupDetail/groupDetailSlice/types';
import SCheckbox from '../FilterItem/SBoxButton';
import { useConfirmation } from '../../utils/ConfirmationServiceContext/confirmationContext';
import { SelectListUser } from '../../containers/CreateMessage/createMessageSlice/types';
import { searchData } from '../../containers/ExternalContacts/helpers';
import { useSelectlist } from '../../utils/customHooks/useSelectList';

interface MessageFilterProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onFilter: (
    selectedMembers: GroupMember[],
    extraMemberslistSource?: SelectListUser[]
  ) => void;
  label: string;
  title: string;
  serachbarTitle: string;
  items: GroupMember[];
  //! this page need a series refactoring, did this shit dupication because we don't have enough time !!!!
  extraMembers?: SelectListUser[];
  isCoAlert?: boolean;
}

export const CreateChatFilter = (props: MessageFilterProps) => {
  const {
    isOpen,
    setIsOpen,
    onFilter,
    items,
    title,
    serachbarTitle,
    extraMembers,
    isCoAlert,
  } = props;
  const [searchText, setSearchText] = useState('');
  const [memberState, setMemberState] = useState(items);
  const [extraMembersState, setextraMembersState] = useState(extraMembers);

  const confirm = useConfirmation();

  useEffect(() => {
    if (!isOpen) {
      setMemberState(items);
      setextraMembersState(extraMembers);
      setSearchText('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const onSearch = (text: string) => {
    setSearchText(text);
  };

  const selectAll = (allChecked: boolean) => {
    let newState;
    let newExtraState;
    if (allChecked) {
      newState = memberState.map(member => ({
        ...member,
        isSelected: false,
      }));
      newExtraState = extraMembersState?.map(member => ({
        ...member,
        isSelected: false,
      }));
    } else {
      newState = memberState.map(member => ({ ...member, isSelected: true }));
      newExtraState = extraMembersState?.map(member => ({
        ...member,
        isSelected: true,
      }));
    }
    setMemberState(newState);
    setextraMembersState(newExtraState);
  };

  const handleCheckMember = (id: number) => {
    let selectedMembers = [...memberState];
    let found = _.findIndex(selectedMembers, member => member.userID === id);
    if (found > -1) {
      let newMember = {
        ...selectedMembers[found],
        isSelected: !selectedMembers[found].isSelected,
      };
      selectedMembers[found] = newMember;
      setMemberState(selectedMembers);
    }
  };
  const handleCheckExtraMember = (id: number) => {
    let selectedMembers = [...(extraMembersState ?? [])];
    let found = _.findIndex(selectedMembers, member => member.id === id);
    if (found > -1) {
      let newMember = {
        ...selectedMembers[found],
        isSelected: !selectedMembers[found].isSelected,
      };
      selectedMembers[found] = newMember;
      setextraMembersState(selectedMembers);
    }
  };

  const isListEmpty = () => {
    if (
      _.isEmpty(_.filter(memberState, x => x.isSelected)) &&
      _.isEmpty(_.filter(extraMembersState, x => x.isSelected))
    ) {
      confirm({
        title: 'warning',
        description: 'message_create_selectAtLeastOneGroup',
        onSubmit: () => {},
        confirmText: 'ok',
      });
      return true;
    }
    return false;
  };

  const handleFilter = () => {
    if (!isCoAlert && isListEmpty()) return;

    onFilter(memberState, extraMembersState);
  };

  const changeSelect = (id: number) => {
    handleCheckMember(id);
  };
  const changeExtraSelect = (id: number) => {
    handleCheckExtraMember(id);
  };

  const groupMembersFiltred = _.filter(memberState, x =>
    _.includes(_.toLower(x.userName), _.toLower(searchText))
  );
  const groupExtraMembersFiltred = _.filter(extraMembersState, x =>
    _.includes(_.toLower(x.displayName), _.toLower(searchText))
  );

  const allChecked =
    _.isEmpty(_.filter(groupMembersFiltred, x => !x.isSelected)) &&
    _.isEmpty(_.filter(groupExtraMembersFiltred, x => !x.isSelected));

  const { t } = useTranslation();
  return (
    <>
      {isOpen && (
        <>
          <SFilter>
            <SHeader>
              <rect width="400" height="100" fill={palette.silver} />
            </SHeader>
            <SSearchBarBase
              placeholderTx="documents_search"
              placeholder="Search..."
              fallback={onSearch}
              label={t(`${serachbarTitle}`)}
              value={searchText}
            />
            <SLabelContainer
              onClick={() => selectAll(allChecked)}
              $disable={!_.isEmpty(searchText)}
            >
              <SLabel>{t(`${title}`)}</SLabel>
              <SCheckbox isChecked={allChecked} />
            </SLabelContainer>
            <ScrollList>
              {groupExtraMembersFiltred.map((member, key) => (
                <div key={key}>
                  <FilterCheckboxItem
                    checked={member.isSelected ? true : false}
                    name={member.displayName}
                    setSelected={() => changeExtraSelect(member.id)}
                    key={key}
                    id={member.id}
                    type="box"
                    hasImage
                    image={null}
                    style={{ marginBottom: '0.75rem' }}
                  />
                </div>
              ))}
              {groupMembersFiltred.map((member, key) => (
                <div key={key}>
                  <FilterCheckboxItem
                    checked={member.isSelected ? true : false}
                    name={member.userName}
                    setSelected={() => changeSelect(member.userID)}
                    key={key}
                    id={member.userID}
                    type="box"
                    hasImage
                    image={null}
                    style={{ marginBottom: '0.75rem' }}
                  />
                </div>
              ))}
            </ScrollList>
            <div style={{ flex: 1 }} />
            <ActionButton
              type="button"
              tx={props.label}
              key={props.label}
              onClick={handleFilter}
            />
            <SFooter fill={palette.dustyGray}>
              <rect width="400" height="100" />
            </SFooter>
          </SFilter>
          <Backdrop setModal={setIsOpen} />
        </>
      )}
    </>
  );
};

const SFilter = styled.div`
  position: fixed;
  left: 50%;
  bottom: 0;
  padding: 20px;
  transform: translate(-50%);
  background-color: ${palette.prussianBlue2};
  max-height: 75vh;
  width: 100%;
  max-width: 26rem;
  z-index: 999;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  border-top-right-radius: 15px;
  border-top-left-radius: 15px;
`;

const SHeader = styled.svg`
  width: 135px;
  height: 5px;
  place-self: center;
  margin-bottom: 3.75rem;
  border-radius: 5px;
`;

const SFooter = styled.svg`
  width: 135px;
  height: 5px;
  margin-top: 13px;
  margin-bottom: -11px;
  place-self: center;
  border-radius: 5px;
  opacity: 0.4;
`;

const SSearchBarBase = styled(SearchBarBase)`
  margin-bottom: 1.25rem;
`;

const SLabelContainer = styled.div<any>`
  display: ${props => (props.$disable ? 'none' : 'inline-flex')};
  justify-content: space-between;
  align-items: center;
  margin: 0 0 1.25rem 0;
`;

const SLabel = styled.p`
  font-family: 'Roboto-Regular';
  font-weight: 500;
  font-size: 15px;
  line-height: 18px;
  color: ${palette.white};
`;

const ScrollList = styled.div`
  overflow-x: hidden;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;
