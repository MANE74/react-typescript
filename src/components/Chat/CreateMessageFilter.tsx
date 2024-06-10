//TODO: View the document in here after you finish the component
import styled from 'styled-components';
import { palette } from '../../theme/colors';
import { Backdrop } from '../Backdrop/Backdrop';
import FilterCheckboxItem from '../FilterItem/FilterCheckboxItem';
import { useState } from 'react';
import {
  FilterSection,
  SectionFilterItem,
} from '../SearchFilterBar/SearchFilterBar';
import { useTranslation } from 'react-i18next';
import { ActionButton } from '../ActionButtons/ActionButtons.style';

const SFilter = styled.div`
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
  margin-bottom: 24px;
`;

const SLine = styled.hr`
  border: 1px solid ${palette.davysGrey10};
  margin-top: 18px;
  margin-bottom: 18px;
`;

interface MessageFilterProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  filters: FilterSection[];
  onFilter: () => void;
  setCheckedState: (value: any) => void;
  label: string;
}

export const CreateMessageFilter = (props: MessageFilterProps) => {
  const { isOpen, setIsOpen, onFilter, setCheckedState, filters, label } =
    props;
  const [keyReload, setKeyReload] = useState(0);

  const handleCheckbox = (option: SectionFilterItem, key: number) => {
    const newCheckedState = filters;
    newCheckedState[key].content[option.id].checked =
      !filters[key].content[option.id].checked;
    setCheckedState(newCheckedState);
    setKeyReload(keyReload + 1);
  };

  const { t } = useTranslation();
  return (
    <>
      {isOpen && (
        <>
          <SFilter key={keyReload}>
            <SHeader>
              <rect width="400" height="100" fill={palette.silver} />
            </SHeader>
            {filters.map((filter, key) => (
              <div key={key}>
                {key !== 0 && <SLine />}
                <SLabel>{t(`${filter.title}`)}</SLabel>
                <ul>
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
            <div style={{ flex: 1 }} />
            <ActionButton
              margin="2rem 0 0"
              type="button"
              tx={label}
              size="small"
              key={label}
              onClick={onFilter}
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
