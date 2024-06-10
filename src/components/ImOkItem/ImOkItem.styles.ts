import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { palette } from '../../theme/colors';

export const ImOkContainer = styled(Link)`
  background-color: ${props => props.theme.palette.background.nav};
  border-radius: 0.5rem;
  padding: 1.2rem;
  text-decoration: none;
  border: solid 0.05rem ${props => props.theme.palette.background.nav};
  width: 100%;
  &:not(:first-child) {
    margin-top: 0.5rem;
  }
`;

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.5rem;
`;

interface SubjectProps {
  ended?: boolean;
}

export const Subject = styled.p<SubjectProps>`
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
  color: ${props => props.theme.palette.text.menuPrimary};
  border-color: ${props =>
    props.ended
      ? props.theme.palette.border.primary
      : props.theme.palette.background.danger};
`;

interface SimpleTextProps {
  gray?: boolean;
  fontSize?: string;
}

export const SimpleText = styled.p<SimpleTextProps>`
  color: ${props =>
    props.gray
      ? props.theme.palette.text.documentPrimary
      : props.theme.palette.text.menuPrimary};
  font-family: 'Roboto-Regular';
  font-size: ${props => props.fontSize};
  padding-left: 0.3rem;
  max-width: 11rem;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

export const LeftContainer = styled.p`
  margin-right: 0.5rem;
`;

export const MessagesTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 3rem;
`;

export const SGroupsTitle = styled.h3`
  font-weight: 500;
  font-family: 'Roboto-Regular';
  font-size: 1rem;
  color: ${palette.white};
`;

export const MessagesText = styled.p`
  font-family: 'Roboto-Regular';
  font-size: 12;
  color: ${props => props.theme.palette.text.primary};
`;

export const WhiteSpan = styled.span`
  color: ${props => props.theme.palette.text.menuPrimary};
`;

export const BottomRow = styled.div`
  display: flex;
  align-items: center;
`;
