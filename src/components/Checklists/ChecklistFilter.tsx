import React, { useState } from 'react';
import { SDrawerWrapper } from '../cec/CecTextTemplatesBottomSheet/CecTextTemplatesBottomSheet';
import Drawer from 'react-bottom-drawer';
import {
  FilterSection,
  SectionFilterItem,
} from '../SearchFilterBar/SearchFilterBar';
import { palette } from '../../theme/colors';
import styled from 'styled-components';
import { translate } from '../../utils/translate';
import FilterCheckboxItem from '../FilterItem/FilterCheckboxItem';
import FilterRadioItem from '../FilterItem/FilterRadioItem';
import { ActionButton } from '../ActionButtons/ActionButtons.style';

export interface ChecklistFilterProps {
  isOpen: boolean;
  setIsOpen: () => void;
  setCheckedState: (value: FilterSection[]) => void;
  filters: FilterSection[];
  onFilter: () => void;
}

function ChecklistFilter(props: ChecklistFilterProps) {
  const { isOpen, setIsOpen, onFilter, setCheckedState, filters } = props;

  const [keyReload, setKeyReload] = useState(0);

  const handleCheckbox = (option: SectionFilterItem) => {
    const newCheckedState = filters;
    newCheckedState[1].content[option.id].checked =
      !filters[1].content[option.id].checked;
    setCheckedState(newCheckedState);
    setKeyReload(keyReload + 1);
  };
  const handleRadio = (option: SectionFilterItem) => {
    const newCheckedState = filters;
    newCheckedState[0].content.forEach((item) => (item.checked = false));

    newCheckedState[0].content[option.id].checked = true;
    setCheckedState(newCheckedState);
    setKeyReload(keyReload + 1);
  };

  return (
    <SDrawerWrapper>
      <Drawer
        className="profileDrawer"
        isVisible={isOpen}
        onClose={setIsOpen}
        hideScrollbars
      >
        <Sfilter>
          {filters.map((filter, key) => (
            <div key={key}>
              {key !== 0 && <SLine />}
              <SLabel>{translate(`${filter.title}`)} </SLabel>
              <ul>
                {filter.type === 'checkbox'
                  ? filter.content.map((option) => (
                      <FilterCheckboxItem
                        type="box"
                        checked={option.checked}
                        name={option.nameTx}
                        setSelected={() => handleCheckbox(option)}
                        key={option.id}
                        id={option.id}
                      />
                    ))
                  : filter.type === 'radio' &&
                    filter.content.map((option) => (
                      <FilterRadioItem
                        checked={option.checked}
                        name={option.nameTx}
                        setSelected={() => handleRadio(option)}
                        key={option.id}
                        id={option.id}
                      />
                    ))}
              </ul>
            </div>
          ))}
        </Sfilter>
        <ActionButton type="button" tx="checklist_filter" onClick={onFilter} />
      </Drawer>
    </SDrawerWrapper>
  );
}

export default ChecklistFilter;

const Sfilter = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
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
