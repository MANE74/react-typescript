import styled from 'styled-components';
import { palette } from '../../theme/colors';
import { Backdrop } from '../Backdrop/Backdrop';
import FilterCheckboxItem from '../FilterItem/FilterCheckboxItem';
import { useLayoutEffect, useState } from 'react';
import {
  FilterSection,
  SectionFilterItem,
} from '../SearchFilterBar/SearchFilterBar';
import { useTranslation } from 'react-i18next';
import { Button } from '../Button/Button';
import { useLayoutContext } from '../../utils/customHooks/LayoutContext';

const SBackDrop = styled(Backdrop)`
  z-index: 9998;
`;

const SFilter = styled.div`
  position: fixed;
  left: 50%;
  bottom: 0;
  padding: 20px;
  transform: translate(-50%);
  background-color: ${(props) => palette.prussianBlue2};
  max-height: 75vh;
  max-width: 26rem;
  width: 100%;
  z-index: 9999;

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

const SButton = styled(Button)`
  width: 100%;
  margin-top: 1.625rem;

  button {
    margin: auto;
    width: 100%;
    max-width: 100rem;
    font-size: 1rem;
    padding: 0.8125rem 0;
    font-family: 'Roboto-Medium';
    color: ${palette.raisinBlack3};
  }
`;

interface MessageFilterProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  filters: FilterSection[];
  onFilter: (value: FilterSection[]) => void;
  setCheckedState: (value: FilterSection[]) => void;
  label: string;
  setTabBar?: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string | undefined;
}

export const MessageFilter = (props: MessageFilterProps) => {
  const {
    isOpen,
    setIsOpen,
    onFilter,
    setCheckedState,
    filters,
    setTabBar,
    className,
  } = props;
  const layout = useLayoutContext();
  const [keyReload, setKeyReload] = useState(0);

  useLayoutEffect(() => {
    if (setTabBar) setTabBar(!isOpen);
    else layout.setTabsState(!isOpen);
  }, [isOpen, setTabBar]);

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
          <SFilter className={className} key={keyReload}>
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
                      checked={option.checked}
                      name={option.name}
                      setSelected={() => handleCheckbox(option, key)}
                      key={key2}
                      id={option.id}
                      type={filter.type === 'checkbox' ? 'box' : 'circle'}
                    />
                  ))}
                </ul>
              </div>
            ))}
            <div style={{ flex: 1 }} />
            <SButton
              key={props.label}
              onClick={() => onFilter(props.filters)}
              tx={props.label}
            />
          </SFilter>
          <SBackDrop setModal={setIsOpen} />
        </>
      )}
    </>
  );
};
