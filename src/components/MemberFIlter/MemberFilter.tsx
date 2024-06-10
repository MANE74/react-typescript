//TODO: View the document in here after you finish the component
import styled from 'styled-components';
import { palette } from '../../theme/colors';
import { Backdrop } from '../Backdrop/Backdrop';
import FilterRadioItem from '../FilterItem/FilterRadioItem';
import { useEffect, useState } from 'react';
import {
  FilterSection,
  SectionFilterItem,
} from '../SearchFilterBar/SearchFilterBar';
import { useTranslation } from 'react-i18next';
import { ActionButton } from '../ActionButtons/ActionButtons.style';
import { useLayoutContext } from '../../utils/customHooks/LayoutContext';

const Sfilter = styled.div`
  position: fixed;
  left: 50%;
  bottom: 0;
  padding: 1.25rem;
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

  ul {
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

const SLabel = styled.p`
  font-family: 'Roboto-Regular';
  font-weight: 500;
  font-size: 15px;
  line-height: 18px;
  color: ${palette.white};
  margin-bottom: 1.5rem;
`;

interface FilterProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  filters: FilterSection[];
  onFilter: (value: FilterSection[]) => void;
  setCheckedState: (value: FilterSection[]) => void;
  label: string;
}

export const MemberFilter = (props: FilterProps) => {
  const { isOpen, setIsOpen, onFilter, setCheckedState, filters } = props;
  const layout = useLayoutContext();

  const [keyReload, setKeyReload] = useState(0);

  useEffect(() => {
    layout.setTabsState(!isOpen);
  }, [isOpen]);

  const handleRadio = (option: SectionFilterItem) => {
    const newCheckedState = filters;
    newCheckedState[0].content.forEach((item) => (item.checked = false));

    newCheckedState[0].content[option.id].checked = true;
    setCheckedState(newCheckedState);
    setKeyReload(keyReload + 1);
  };

  const { t } = useTranslation();
  return (
    <>
      {isOpen && (
        <>
          <Sfilter>
            <SHeader>
              <rect width="400" height="100" fill={palette.silver} />
            </SHeader>
            <SLabel>{t(`${filters[0].title}`)}</SLabel>
            <ul>
              {filters[0].content.map((option, key) => (
                <FilterRadioItem
                  checked={option.checked}
                  name={option.name}
                  setSelected={() => handleRadio(option)}
                  key={key}
                  id={option.id}
                />
              ))}
            </ul>
            <div style={{ flex: 1 }} />
            <ActionButton
              type="button"
              tx={props.label}
              onClick={() => onFilter(props.filters)}
            />
          </Sfilter>
          <Backdrop setModal={setIsOpen} />
        </>
      )}
    </>
  );
};
