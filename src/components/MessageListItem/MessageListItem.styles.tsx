import styled from 'styled-components';
import { palette } from '../../theme/colors';

export const MessageItemContainer = styled.div<any>`
  // background-color: ${(props) => props.theme.palette.navyBlue};
  margin-bottom: 0.5rem;
  padding: 0 0.25rem;
  padding-right: 0;
  display: flex;
  justify-content: flex-end;
  cursor: pointer;
`;

export const MessageItemWrapper = styled.div<any>`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  padding-right: 12px;
  width: calc(20rem + 12px);
  max-width: 75vw;
`;

export const ProfileContainer = styled.div<any>`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  width: 3.0rem;
  height: 3.0rem;
  margin-right: 1.5rem;

  img {
    width: 100%;
    height: auto;
  }
`;

export const MessagesContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding: 0.5rem 0 0.5rem;
  border-radius: 0.5rem;
  background-color: ${palette.cloudBurst};
`;

export const ContentRaw = styled.div<any>`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 0 0.85rem;
  width: 100%;
`;

export const ContentImgRaw = styled.div<any>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 20rem;
`;

export const TextName = styled.span<any>`
  font-size: 14px;
  font-weight: bold;
  color: ${palette.white};
  margin-bottom: 5px;
`;

export const TextInfo = styled.span<any>`
  font-size: 10px;
  color: ${palette.silver};
  margin-bottom: 3px;
`;

export const TextMessage = styled.span<any>`
  position: relative;
  font-size: 12px;
  color: ${palette.white};
  line-height: 1.25;
`;

export const TextDate = styled.span<any>`
  font-size: 10px;
  text-align: right;
  color: ${palette.silver};
  width: 100%;
  margin-top: 5px;
`;

export const SDotsWrapper = styled.span`
  display: inline-flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  position: absolute;
  top: 5px;
  right: 0px;
  cursor: pointer;
`;

export const SDots = styled.img`
  
`;

export const SArrow = styled.span`
  position: absolute;
  top: 0px;
  right: -8px;
  width: 0;
  height: 0;
  border-top: 0px solid transparent;
  border-bottom: 10px solid transparent;
  border-left: 14px solid ${palette.prussianBlue2};
`;
