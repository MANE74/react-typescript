//TODO: View the document in here after you finish the component
import styled from 'styled-components';
import { palette } from '../../theme/colors';
import { Backdrop } from '../Backdrop/Backdrop';
import FilterCheckboxItem from '../FilterItem/FilterCheckboxItem';
import { useEffect, useState } from 'react';
import {
  FilterSection,
  SectionFilterItem,
} from '../SearchFilterBar/SearchFilterBar';
import { useTranslation } from 'react-i18next';
import { ActionButton } from '../ActionButtons/ActionButtons.style';
import { useLayoutContext } from '../../utils/customHooks/LayoutContext';

interface GroupFilterProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  filters: FilterSection[];
  onFilter: () => void;
  setCheckedState: (value: FilterSection[]) => void;
  label: string;
}

export const GroupFilter = (props: GroupFilterProps) => {
  const {
    isOpen,
    setIsOpen,
    onFilter,
    setCheckedState,
    filters: _filters,
  } = props;

  const [keyReload, setKeyReload] = useState(0);

  const [filters, setFilters] = useState<FilterSection[]>(_filters);
  useEffect(() => {
    setFilters(_filters);
  }, [_filters]);

  const handleCheckbox = (option: SectionFilterItem, key: number) => {
    const newCheckedState = filters;
    newCheckedState[key].content[option.id].checked =
      !filters[key].content[option.id].checked;
    setCheckedState(newCheckedState);
    setFilters(newCheckedState);
    setKeyReload(keyReload + 1);
  };

  const { t } = useTranslation();
  return (
    <>
      {isOpen && (
        <>
          <Sfilter key={keyReload}>
            <SHeader>
              <rect width="400" height="100" fill={palette.silver} />
            </SHeader>
            {filters.map((filter, key) => (
              <div key={key}>
                {key !== 0 && <SLine />}
                <SLabel>{t(`${filter.title}`)}</SLabel>
                <ul className={`list-${key}`}>
                  {filter.content.map((option, key2) => (
                    <FilterCheckboxItem
                      type="box"
                      checked={option.checked}
                      name={option.name}
                      setSelected={() => handleCheckbox(option, key)}
                      key={key2}
                      id={option.id}
                    />
                  ))}
                </ul>
              </div>
            ))}
            <ActionButton type="button" tx={props.label} onClick={onFilter} />
            <SFooter fill={palette.dustyGray}>
              <rect width="400" height="100" />
            </SFooter>
          </Sfilter>
          <Backdrop setModal={setIsOpen} />
        </>
      )}
    </>
  );
};

const Sfilter = styled.div`
  position: fixed;
  left: 50%;
  bottom: 0;
  padding: 20px;
  transform: translate(-50%);
  background-color: ${(props) => palette.prussianBlue2};
  max-height: 75vh;
  width: 100%;
  max-width: 26rem;
  z-index: 999;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  border-top-right-radius: 15px;
  border-top-left-radius: 15px;

  .list-1 {
    margin-bottom: 1.75rem;
  }
`;

const SHeader = styled.svg`
  width: 135px;
  height: 5px;
  place-self: center;
  margin-bottom: 30px;
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

const SLabel = styled.p`
  font-family: 'Roboto-Regular';
  font-weight: 500;
  font-size: 15px;
  line-height: 18px;
  color: ${palette.white};
  margin-bottom: 1.5rem;
`;

const SLine = styled.hr`
  border: 1px solid ${palette.davysGrey10};
  margin-top: 18px;
  margin-bottom: 18px;
`;
