import styled from 'styled-components';
import { palette } from '../../theme/colors';
import { Backdrop } from '../Backdrop/Backdrop';
import FilterCheckboxItem from '../FilterItem/FilterCheckboxItem';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActionButton } from '../ActionButtons/ActionButtons.style';
import { SearchBarBase } from '../SearchBarBase/SearchBarBase';
import { Group } from '../../containers/GroupsList/groupsSlice/types';
import _ from 'lodash';
import { useLayoutContext } from '../../utils/customHooks/LayoutContext';
import SCheckbox from '../FilterItem/SBoxButton';

interface MessageFilterProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onFilter: () => void;
  label: string;
  title: string;
  serachbarTitle: string;
  selected: number[];
  groupsList: Group[];
  chatsSearchText?: string;
  setSelected: React.Dispatch<React.SetStateAction<number[]>>;
}

export const ChatListFilter = (props: MessageFilterProps) => {
  const {
    isOpen,
    setIsOpen,
    onFilter,
    groupsList,
    title,
    serachbarTitle,
    chatsSearchText,
    selected,
    setSelected,
    label,
  } = props;

  const layout = useLayoutContext();

  const [searchText, setSearchText] = useState('');
  const [allSelected, setAllSelected] = useState(true);
  const [groupsToShow, setGroupsToShow] = useState<Group[]>(groupsList);

  const selectAll = () => {
    let newState: number[] = [];
    if (selected.length === groupsList.length) {
      setSelected(newState);
      return;
    }
    groupsList.forEach(item => {
      newState.push(item.id);
    });
    setSelected(newState);
  };

  useEffect(() => {
    if (isOpen) {
      setSearchText('');
    }

    layout.setTabsState(!isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (!_.isEqual(groupsToShow, groupsList)) {
      setGroupsToShow(groupsList);
    }
  }, [groupsList]);

  useEffect(() => {
    if (selected.length === groupsToShow.length) {
      setAllSelected(true);
    } else {
      setAllSelected(false);
    }
  }, [selected]);

  const handleSearch = (searchText: string) => {
    setSearchText(searchText);
  };

  const handleSelect = (groupId: number) => {
    let newState = [...selected];
    const isInArray = _.includes(newState, groupId);
    if (isInArray) {
      newState.splice(newState.indexOf(groupId), 1);
    } else {
      newState.push(groupId);
    }
    setSelected(newState);
  };

  const includesText = (mainText: string) => {
    return mainText.toLowerCase().includes(searchText.toLowerCase());
  };
  const searchedGroups = searchText
    ? groupsToShow?.filter(e => includesText(e.name))
    : groupsToShow;

  const { t } = useTranslation();

  if (!isOpen) return <></>;

  return (
    <>
      <SFilter>
        <SHeader>
          <rect width="400" height="100" fill={palette.silver} />
        </SHeader>
        <SSearchBarBase
          placeholderTx="documents_search"
          placeholder="Search..."
          fallback={handleSearch}
          label={t(`${serachbarTitle}`)}
          value={searchText}
        />
        <ListContainer>
          {!_.isEmpty(groupsList) && (
            <SLabelContainer onClick={selectAll}>
              <SLabel>{t(`${title}`)}</SLabel>
              <SCheckbox isChecked={allSelected} />
            </SLabelContainer>
          )}
          <div>
            {searchedGroups.map((group, key) => (
              <div key={key}>
                <ul>
                  <FilterCheckboxItem
                    checked={_.includes(selected, group.id)}
                    name={group.name}
                    setSelected={() => {
                      handleSelect(group.id);
                    }}
                    key={key}
                    id={group.id}
                    type={'box'}
                    hasImage
                    image={group.imageFileName}
                    isGroupImg
                    style={{ marginBottom: '0.75rem' }}
                  />
                </ul>
              </div>
            ))}
          </div>
        </ListContainer>
        <div style={{ flex: 1 }} />
        <ActionButton type="button" tx={label} key={label} onClick={onFilter} />
      </SFilter>
      <Backdrop setModal={setIsOpen} />
    </>
  );
};

export const SFilter = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  padding: 20px;
  background-color: ${palette.prussianBlue2};
  max-height: 75vh;
  max-width: 26rem;
  width: 100%;
  z-index: 999;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  border-top-right-radius: 15px;
  border-top-left-radius: 15px;
`;

const SHeader = styled.svg`
  width: 135px;
  max-height: 5px;
  flex: 1;
  place-self: center;
  margin-bottom: 3.75rem;
  border-radius: 5px;
`;

const SLabelContainer = styled.div`
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
`;

const SLabel = styled.p`
  font-family: 'Roboto-Regular';
  font-weight: 500;
  font-size: 15px;
  line-height: 18px;
  color: ${palette.white};
  margin: 1.5rem 0 0.8rem 0.1rem;
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;

  /* vertical scrolling + hide scroller bar  */
  overflow-y: auto;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const SSearchBarBase = styled(SearchBarBase)`
  input {
    ::placeholder {
      color: ${palette.silver};
      font-size: 1rem;
      opacity: 1;
    }

    :-ms-input-placeholder {
      color: ${palette.silver};
      font-size: 1rem;
    }

    ::-ms-input-placeholder {
      color: ${palette.silver};
      font-size: 1rem;
    }
  }
`;
