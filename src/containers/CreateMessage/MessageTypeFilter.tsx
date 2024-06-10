import styled from 'styled-components';
import { palette } from '../../theme/colors';
import {
  FilterSection,
  SectionFilterItem,
} from '../../components/SearchFilterBar/SearchFilterBar';
import { Backdrop } from '../../components/Backdrop/Backdrop';
import FilterRadioItem from '../../components/FilterItem/FilterRadioItem';
import { translate } from '../../utils/translate';

interface MessageFilterProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setType: React.Dispatch<React.SetStateAction<string>>;
  setCheckedState: (value: any) => void;
  list: FilterSection;
}

const MessageTypeFilter = (props: MessageFilterProps) => {
  const { isOpen, setIsOpen, setCheckedState, list, setType } = props;

  const handleRadio = (option: SectionFilterItem) => {
    const newCheckedState = list;
    newCheckedState.content.forEach((item) => (item.checked = false));

    newCheckedState.content[option.id].checked = true;
    setCheckedState(newCheckedState);
    setIsOpen(!isOpen);
    setType(newCheckedState.content[option.id].name!);
  };
  
  if (isOpen) {
    return (
      <>
        <SFilter>
          <SHeader>
            <rect width="400" height="100" fill={palette.silver} />
          </SHeader>
          <SLabel>{translate(`messages_selectReplyType`)}:</SLabel>
          <ul>
            {list.content.map((option, key2) => (
              <FilterRadioItem
                checked={option.checked}
                name={option.name}
                setSelected={() => {
                  handleRadio(option);
                }}
                key={key2}
                id={option.id}
              />
            ))}
          </ul>
        </SFilter>
        <Backdrop setModal={setIsOpen} />
      </>
    );
  } else {
    return <></>;
  }
};

export default MessageTypeFilter;

const SFilter = styled.div`
  position: fixed;
  left: 50%;
  bottom: 0;
  padding: 1.25rem 1.25rem 2rem;
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
  margin-bottom: 2rem;
  border-radius: 5px;
`;

const SLabel = styled.p`
  font-family: 'Roboto-Regular';
  font-weight: 500;
  font-size: 15px;
  line-height: 18px;
  color: ${palette.silver};
  margin: 0 0 1.8rem 0.1rem;
`;
