import * as React from 'react';
import styled from 'styled-components';
import { palette } from '../../theme/colors';
export interface INotificationBubbleProps {
  notification: number | '!';
  isDanger?: boolean;
  style?: React.CSSProperties;
}

const SBubbleWrapper = styled.div<{ isDanger: boolean }>`
  position: absolute;
  top: 0;
  left: 70%;
  z-index: 98;
  height: 0.625rem;
  padding: 0 0.31rem;
  line-height: 0.625rem;

  border-radius: 9999px;

  display: flex;
  justify-content: cente;
  align-items: center;

  background-color: ${({ theme, isDanger }) =>
    isDanger
      ? theme.palette.background.danger
      : theme.palette.background.bubble};

  height: 1rem;
  padding: 0 0.31rem;
`;

const SBubbleText = styled.p`
  font-family: 'Roboto-Regular';
  color: ${palette.white};
  font-size: 0.5rem;
  text-align: center;
  color: ${palette.white};

  font-size: 0.75rem;
`;

export const NotificationBubble = (props: INotificationBubbleProps) => {
  const { notification, isDanger = false, style } = props;
  let notificationText = String(notification);
  if (typeof notification === 'number' && notification > 99) {
    notificationText = '99+';
  }
  const isNotification =
    typeof notification === 'number' || notification === '!';

  return (
    <React.Fragment>
      {isNotification && (
        <SBubbleWrapper isDanger={isDanger} style={style}>
          <SBubbleText>{notificationText}</SBubbleText>
        </SBubbleWrapper>
      )}
    </React.Fragment>
  );
};
