import styled, { css } from 'styled-components';
import { palette } from '../../theme/colors';

export const MessagesContainer = styled.div`
  width: 100%;
  background-color: ${palette.gunmetal};
  padding: 1rem;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

interface TopRowProps {
  marginBottom?: string;
}

export const TopRow = styled.div<TopRowProps>`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${props => props.marginBottom};
  gap: 10px;
`;

export const CreatorName = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${palette.honeyYellow};
  word-break: break-all;
`;

export const Subject = styled.p`
  font-size: 0.75rem;
  font-weight: 600;
  word-break: break-all;
  max-width: 7rem;
`;

export const SimpleText = styled.p`
  font-size: 0.7rem;
  font-weight: 400;
  word-break: break-all;
`;

export const ToggleButton = styled.button`
  margin-top: -0.5rem;
  margin-right: -0.8rem;
  background-color: transparent;
  border: none;
`;

export const IconImage = styled.img`
  object-fit: cover;
`;

export const ButtonGroupContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  /* background-color: ${palette.gunmetal}; */
  width: 100%;
  padding: 1rem 1rem;
`;

export const ImOkEnded = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 1rem 1rem;
  background-color: ${palette.stormGray};
  font-family: 'Roboto-Medium';
  font-size: 1rem;
  font-weight: 500;
  text-align: center;
  color: ${palette.white};
`;

export const ProvideStatusText = styled.h3`
  font-family: 'Roboto-Medium';
  font-size: 1.1rem;
  font-weight: 500;
  text-align: center;
  margin-bottom: 1rem;
  color: ${palette.honeyYellow};
`;
interface ResponseButtonProps {
  red?: boolean;
  $loading?: boolean;
}

export const ResponseButton = styled.button<ResponseButtonProps>`
  width: 50%;
  border-radius: 2rem;
  height: 3rem;
  cursor: pointer;
  background-color: ${props =>
    props.red ? palette.tartOrange : palette.appleGreen};
  color: ${palette.white};
  border: none;
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  ${props =>
    props.$loading &&
    css`
      opacity: 0.5;
      cursor: not-allowed;
    `}
  :not(:last-child) {
    margin-right: 1rem;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
`;

export const Text = styled.p`
  font-family: 'Roboto-Medium';
  font-size: 1rem;
  font-weight: 500;
  text-align: center;
`;

export const Icon = styled.img`
  object-fit: cover;
  padding-left: 0.5rem;
`;

export const ResponseListContainer = styled.div<{ $removedHeight?: number }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 1.4375rem;
  padding-bottom: 3px;
  width: 100%;

  height: calc(100% - ${props => props.$removedHeight || 0}px);
`;

export const ResponseRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  cursor: pointer;
`;
interface SwitchButtonProps {
  align?: string;
  active?: boolean;
}

export const SwitchButton = styled.div<SwitchButtonProps>`
  display: flex;
  justify-content: ${props => props.align};
  align-items: center;
  width: 33%;
  padding-bottom: 0.4375rem;
  ${props =>
    props.active &&
    css`
      border-radius: 2px;
    `};
  border-bottom: ${props =>
    props.active
      ? `solid 2px ${palette.honeyYellow}`
      : `solid 1px ${palette.queenBlue}`};
`;

export const UserWrapper = styled.div`
  margin-top: 1rem;
  width: 100%;
  flex-grow: 1;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

export const SwitchButtonText = styled.p<{ $morePadding?: boolean }>`
  font-family: 'Roboto-Bold';

  font-size: 0.8rem;
  font-weight: 600;
  text-align: center;
  border-radius: 0.3rem;
  padding: 0.2rem 0.6rem;
  ${props =>
    props.$morePadding &&
    css`
      padding: 0.2rem 0.875rem;
    `}
  background-color: ${props => props.color};
`;

interface CountTextProps {
  active?: boolean;
}
export const CountText = styled.p<CountTextProps>`
  font-family: 'Roboto-Medium';
  font-size: 0.8rem;
  font-weight: 500;
  text-align: center;
  padding-left: 0.2rem;
  color: ${props => (props.active ? palette.honeyYellow : palette.white)};
`;

export const UserContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  border-bottom: solid 1px ${palette.tinyBorder};
  padding: 0.52rem 0;
  cursor: pointer;
`;

export const UserColumn = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const UserButton = styled.button`
  cursor:pointer;
  font-weight: 500;
  font-size: 0.875rem;
  color: ${palette.cultured};
  border: none;
  background-color: transparent;
  font-family: 'Roboto-Medium';
`;

export const UserLocation = styled.img`
  object-fit: cover;
  padding: 0rem 0.4rem;
  :hover {
    opacity: 0.6;
  }
`;

interface UserStatusProps {
  paddingRight?: boolean;
}

export const UserStatus = styled.p<UserStatusProps>`
  font-size: 0.7rem;
  font-weight: 400;
  text-align: center;
  padding-right: ${props => (props.paddingRight ? '0.5rem' : '0')};
  color: ${palette.silver};
`;

export const EmptyList = styled.div`
  flex-grow: 1;

  display: flex;
  justify-content: center;
  align-items: center;
  p {
    margin-bottom: 8vh;
    font-family: 'Roboto-Regular';
    font-size: 0.8125rem;
    font-weight: 400;
    text-align: center;
    color: ${palette.silver};
  }
`;
