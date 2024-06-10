import styled  from 'styled-components';
import { palette } from '../../theme/colors';
import ArrowRight from '../../assets/imgs/arrow-right-light.svg';
import EditText from "../../assets/imgs/edit-text.svg"

import { t, TFunctionKeys } from 'i18next';



interface CustomInputProps extends React.HTMLProps<HTMLInputElement> {
  value: string;
  placeHolderTx: TFunctionKeys;
  onClick: () => void;
  isEdit: boolean;
  toTextTx: TFunctionKeys;
  disabled: boolean;
}

export const CustomInput = (props: CustomInputProps) => {
  const {
    placeHolderTx,
    toTextTx,
    value,
    onClick,
    isEdit,
    disabled
  } = props;

  return (
  <ReceiversContainer onClick={onClick}>
      <ToContainer>
          <ToText>{t(toTextTx)}</ToText>
      </ToContainer>
      <SInput
        placeholder={t(placeHolderTx)}
        value={value}
        disabled={disabled}
      />
      {isEdit ? 
      <img src={EditText} alt={"EditText"} /> 
      : <img src={ArrowRight} alt={"ArrowRight"} />}
    </ReceiversContainer>
  );
};


const  ToContainer = styled.div`
    width: 70px;
    justify-content: center;

`;

const ToText = styled.span`
    color: ${palette.white};
    font-family: 'Roboto-Regular';
    font-size: 12px;
`;

const ReceiversContainer = styled.div`
    padding: 0px 5px;
    display:flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    border-bottom: 2px solid ${palette.tinyBorder};
   
`;

const SInput = styled.input`
    width: 20rem;
    background: ${palette.raisinBlack};
    border: none;
    color: ${palette.white};
    &:focus {
      outline: none;
    }
    ::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
      color: ${palette.bluishGrey};
      opacity: 1; /* Firefox */
    }

   

`;
