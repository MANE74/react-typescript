import * as React from 'react';
import styled from 'styled-components';
import { palette } from '../../theme/colors';
import Remove from '../../assets/imgs/general/remove.svg';

export interface IRecipientButtonProps {
  name: string;
  onClick?: () => void;
}

export const RecipientButton = (props: IRecipientButtonProps) => {
  const { name, onClick } = props;

  return (
    <RecipientButtonWrapper>
      <GreyOutlinedBtn>{name}</GreyOutlinedBtn>
      <img
        src={Remove}
        alt="removeGroup"
        onClick={onClick}
        style={{ cursor: 'pointer' }}
      />
    </RecipientButtonWrapper>
  );
};

const GreyOutlinedBtn = styled.span`
  font-family: 'Roboto-Regular';
  font-size: 10px;
  font-weight: 400;
  color: ${palette.white};
`;

const RecipientButtonWrapper = styled.button`
  background-color: ${palette.fadedDarkBlue};
  outline: 0;
  border: 0;
  border: 1px solid ${palette.queenBlue};
  border-radius: 8px;
  padding: 6px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  margin-bottom: 10px;
`;
