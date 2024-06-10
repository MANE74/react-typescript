import * as React from 'react';
import styled, { css } from 'styled-components';
import { palette } from '../../theme/colors';
import { translate } from '../../utils/translate';
import { Button } from '../Button/Button';
const SBackdrop = styled.div`
  background-color: ${palette.backDrop};
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 9998;
  left: 0;
  top: 0;
`;

const SPopup = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;

  z-index: 9999;

  max-height: 50vh;
  padding: 1.75rem;
  @media (min-width: 450px) {
    padding: 1.875rem 17.5vw;
  }

  background-color: ${palette.prussianBlue2};
  color: ${palette.white};
`;

const STitle = styled.p`
  text-align: center;
  font-family: 'Roboto-Medium';
  @media (min-width: 400px) {
    font-size: 2.25rem;
    line-height: 2.5rem;
  }
  font-size: 1.8rem;
`;

const SDescription = styled.p`
  text-align: center;
  font-family: 'Roboto-Regular';

  margin-top: 0.425rem;
  font-size: 1rem;
  line-height: 140%;
  @media (min-width: 400px) {
    line-height: 150%;
    font-size: 1.125rem;
    margin-top: 0.625rem;
  }
  a {
    text-decoration: none;
    color: ${palette.honeyYellow};
  }
`;

const SButtonContainer = styled.div`
  margin: 1.87rem auto 0 auto;
  @media (min-width: 400px) {
    margin: 1.87rem auto 0 auto;
  }
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 1rem;
`;

const SButton = styled(Button)<{ $outline?: boolean }>`
  width: 10rem;
  button {
    width: 100%;
    font-size: 1rem;
    padding: 0.875rem 0;
    line-height: 1.18rem;
    max-width: 400rem;
    font-family: 'Roboto-Medium';
    color: ${palette.raisinBlack3};
    ${props =>
      props.$outline &&
      css`
        color: ${palette.white};
        background-color: ${palette.transparent};
        border: 1px solid ${palette.honeyYellow};
      `}
  }
`;

export interface ICookiesPopupProps {
  onAllowCookies: () => void;
  onDeclineCookies: () => void;
}

export const CookiesPopup = (props: ICookiesPopupProps) => {
  const { onAllowCookies, onDeclineCookies } = props;
  return (
    <>
      <SPopup>
        <STitle>{translate('cookie_allow')}</STitle>
        <SDescription>
          {translate('cookie_allowDescription')}
          <a
            target="_blank"
            href={translate('cookie_cookiePolicyLink')!}
            rel="noreferrer noopener"
          >
            {' '}
            {translate('cookie_cookiePolicy')}{' '}
          </a>
          {translate('cookie_allowLearnMore')}
        </SDescription>
        <SButtonContainer>
          <SButton $outline tx="decline" onClick={onDeclineCookies} />
          <SButton tx="allow" onClick={onAllowCookies} />
        </SButtonContainer>
      </SPopup>
      <SBackdrop />
    </>
  );
};
