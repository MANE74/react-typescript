import styled from 'styled-components';
import { palette } from '../../theme/colors';

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Subject = styled.p`
  font-weight: 600;
  max-width: 15rem;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  font-family: 'Roboto-Regular';
  font-size: 0.7rem;
  border: solid 0.01rem;
  padding: 0.1rem 0.3rem;
  border-radius: 0.2rem;
  border-color: ${(props) =>
    props.ended
      ? props.theme.palette.border.primary
      : props.theme.palette.background.danger};
`;

export const SimpleText = styled.p`
  color: ${(props) =>
    props.gray
      ? props.theme.palette.text.documentPrimary
      : props.theme.palette.text.menuPrimary};
  font-family: 'Roboto-Regular';
  font-size: ${(props) => props.fontSize};
  padding-left: 0.3rem;
  max-width: 18rem;
  text-overflow: ellipsis;
  margin: 3px 0;
`;

export const LeftContainer = styled.p`
  margin-right: 0.5rem;
`;

export const MessageItemContainer = styled.div`
  border-bottom: 1px solid ${palette.queenBlue};
  padding-bottom: 5px;
  padding-top: 5px;
`;

export const MessagesTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 3rem;
`;

export const GroupsTitle = styled.h3`
  font-weight: 500;
  font-family: 'Roboto-Regular';
  font-size: 16;
  color: ${(props) => props.theme.palette.text.menuPrimary};
  max-width: 90%;
  padding-bottom: 0.5rem;
`;

export const MessagesText = styled.p`
  font-family: 'Roboto-Regular';
  font-size: 12;
  color: ${(props) => props.theme.palette.text.primary};
`;

export const WhiteSpan = styled.span`
  color: ${(props) => props.theme.palette.text.menuPrimary};
`;

export const BottomRow = styled.div`
  display: flex;
  align-items: center;
`;

export const Item = styled.div`
  display: flex;
  align-items: center;
  height: 48px;
  position: relative;
`;

export const RadioButtonLabel = styled.label`
  position: absolute;
  top: 25%;
  left: 4px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: ${palette.raisinBlack};
  border: 1px solid ${palette.honeyYellow};
  ${(props) =>
    props.checked &&
    `
  &::after {
    content: "";
    display: block;
    border-radius: 50%;
    width: 14px;
    height: 14px;
    margin: 3px;
    background: ${palette.honeyYellow};
    `}
}
`;

export const RadioButton = styled.input`
  opacity: 0;
  z-index: 1;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  margin-right: 10px;
`;
