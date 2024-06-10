//TODO: View the document in here after you finish the component
import styled from 'styled-components';
import Drawer from 'react-bottom-drawer';
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
import FilterRadioItem from '../FilterItem/FilterRadioItem';
import { SDrawerWrapper } from '../cec/CecTextTemplatesBottomSheet/CecTextTemplatesBottomSheet';

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

interface CreateFolderProps {
    isOpen: boolean;
    setIsOpen: any;
    filters: FilterSection[];
    onFilter: (value: FilterSection[]) => void;
    setCheckedState: (value: FilterSection[]) => void;
    label: string;
    setTabBar: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CreateFolderFilter = (props: CreateFolderProps) => {
    const { isOpen, setIsOpen, onFilter, setCheckedState, filters, setTabBar } =
        props;
    const [keyReload, setKeyReload] = useState(0);

    const handleCheckbox = (option: SectionFilterItem, key: number) => {
        const newCheckedState = filters;
        newCheckedState[key].content[option.id].checked =
            !filters[key].content[option.id].checked;
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
    useEffect(() => {
        setTabBar(!isOpen);
        setTabBar(false)
    }, [isOpen, setTabBar]);

    const { t } = useTranslation();
    return (
        <SDrawerWrapper>
            <Drawer
                className="profileDrawer"
                isVisible={isOpen}
                onClose={setIsOpen}
                hideScrollbars
            >
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
                                    <ul>
                                        {
                                            filter.type === 'checkbox' ?
                                                filter.content.map((option, key2) => (
                                                    <FilterCheckboxItem
                                                        type="box"
                                                        checked={option.checked}
                                                        name={option.name}
                                                        setSelected={() => handleCheckbox(option, key)}
                                                        key={key2}
                                                        id={option.id}
                                                    />
                                                ))
                                                :
                                                filter.type === 'radio' &&
                                                filter.content.map((option, key2) => (
                                                    <FilterRadioItem
                                                        checked={option.checked}
                                                        name={option.name}
                                                        setSelected={() => handleRadio(option)}
                                                        key={key2}
                                                        id={option.id}
                                                    />
                                                ))
                                        }
                                    </ul>
                                </div>
                            ))}
                            <div style={{ flex: 1 }} />
                            <ActionButton
                                type="button"
                                tx={props.label}
                                size="medium"
                                key={props.label}
                                style={{ marginTop: 26 }}
                                onClick={() => onFilter(props.filters)}
                            />
                            <SFooter fill={palette.dustyGray}>
                                <rect width="400" height="100" />
                            </SFooter>
                        </Sfilter>
                        <Backdrop setModal={setIsOpen} />
                    </>
                )}
            </Drawer>
        </SDrawerWrapper>
    );
};
