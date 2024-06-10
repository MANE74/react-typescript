import styled from 'styled-components';
import { palette } from '../../theme/colors';

export const Column = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-self: center;
  cursor: pointer;

  &.left {
    width: 100%;
  }

  &.right {
    cursor: pointer;
    padding: 1.2rem;
  }
`;

export const Row = styled.div<any>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: ${(props) => props.padding && '0.5rem'};
`;

export const Subject = styled.p<any>`
  color: ${palette.white};
  font-weight: 600;
  max-width: 15rem;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  font-family: 'Roboto-Regular';
  font-size: 13px;
  background-color: ${(props) =>
    props.hasSubject || (!props.ended && `${palette.tartOrange}`)};
  border: ${(props) => (props.hasSubject === null ? 'none' : 'solid 0.01rem')};
  padding: 0.1rem 0.3rem;
  border-radius: 0.2rem;
  border-color: ${(props) =>
    props.ended
      ? props.theme.palette.border.primary
      : props.theme.palette.background.danger};
`;

export const SimpleText = styled.p<any>`
  margin: ${(props) => props.margin};
  color: ${(props) =>
    props.gray
      ? props.theme.palette.text.documentPrimary
      : props.theme.palette.text.menuPrimary};
  font-family: 'Roboto-Regular';
  font-size: ${(props) => props.fontSize};
  padding-left: 0.3rem;
  max-width: 11rem;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

export const LeftContainer = styled.div`
  margin-right: 0.5rem;
`;

export const MessageItemContainer = styled.div<any>`
  cursor: pointer;
  background-color: ${(props) => props.theme.palette.background.nav};
  margin-bottom: 0.5rem;
  border-radius: 0.5rem;
  padding: 1.2rem;
  padding-right: ${(props) =>
    props.overview ? '1.2rem' : props.alert ? '2.65rem' : '0'};
  display: flex;
  box-shadow: ${(props) =>
    props.alert && `inset 0px 0px 0px 2px ${palette.tartOrange}`};
`;

export const MessagesTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 2.5rem;
`;

export const GroupsTitle = styled.p`
  font-weight: 500;
  font-family: 'Roboto-Medium';
  font-size: 0.8rem;
  padding-left: 0.3rem;
  max-width: 11rem;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
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

export const SDots = styled.img`
  cursor: pointer;
`;

export const SBubble = styled.div`
  border-radius: 9.5px;
  // min-width: 1rem;
  // min-height: 1rem;
  padding: 2px 5px;
  background-color: ${palette.tartOrange};
  p {
    font-family: 'Roboto-Regular';
    font-weight: 500;
    font-size: 10px;
    line-height: 12px;
  }
`;
