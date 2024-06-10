import React, {
  cloneElement,
  JSXElementConstructor,
  ReactElement,
  useLayoutEffect,
  useState,
} from 'react';
import styled from 'styled-components';
import { Header } from './Header/Header';
import { UnauthorizedHeader } from './Header/UnauthorizedHeader';
import Footer from './Footer/Footer';
import { LayoutContextProvider } from '../../utils/customHooks/LayoutContext';

export interface ILayoutProps {
  children: ReactElement<any, string | JSXElementConstructor<any>>;
  isMessageLayout: boolean;
  message: string;
  to?: string;
  backBtn?: boolean;
  isAuthLayout?: boolean;
  showCoSafeLogo?: boolean;
  showBottomTabs?: boolean;
  subMessageText?: string;
  showDots?: boolean;
  dotsCallBack?: () => void;
  isAlarmActive?: boolean;
  className?: string | undefined;
  backBtnCallBack?: (e: any) => void;
}

export const Layout = (props: ILayoutProps) => {
  const {
    children,
    message,
    isMessageLayout,
    to,
    backBtn,
    isAuthLayout = true,
    showCoSafeLogo = false,
    showBottomTabs = false,
    subMessageText,
    showDots = false,
    dotsCallBack,
    isAlarmActive,
    className,
    backBtnCallBack,
  } = props;

  const [tabsState, setTabsState] = useState<boolean>(showBottomTabs);
  const [backLink, setBackLink] = useState<string | undefined>(to);
  const [title, setTitle] = useState<string | undefined>(message);
  const [subTitle, setSubTitle] = useState<string | undefined>(subMessageText);
  const [doShowDots, setDoShowDots] = useState<boolean | undefined>(showDots);
  const [headerMenu, setHeaderMenu] = useState<boolean>(false);

  useLayoutEffect(() => {
    setTitle(message);
  }, [message]);

  useLayoutEffect(() => {
    setSubTitle(subMessageText);
  }, [subMessageText]);
  useLayoutEffect(() => {
    setDoShowDots(showDots);
  }, [showDots]);

  const handleDotsMenu = () => {
    setHeaderMenu(!headerMenu);
    dotsCallBack && dotsCallBack();
  };

  return (
    <React.Fragment>
      {!isAuthLayout && (
        <UnauthorizedHeader to={to ?? backLink} backBtn={backBtn} />
      )}
      {isAuthLayout && (
        <Header
          backBtnCallBack={backBtnCallBack}
          to={backLink ?? to}
          isMessageLayout={isMessageLayout}
          message={title ?? message}
          backBtn={backBtn}
          showCoSafeLogo={showCoSafeLogo}
          subMessageText={subTitle ?? subMessageText}
          showDots={doShowDots ?? showDots}
          dotsCallBack={handleDotsMenu}
          isAlarmActive={isAlarmActive!}
        />
      )}
      <LayoutContextProvider
        setTabsState={setTabsState}
        setBackLink={setBackLink}
        setMessage={setTitle}
        setSubTitle={setSubTitle}
        setDoShowDots={setDoShowDots}
        setHeaderMenu={setHeaderMenu}
        isMenuOpen={headerMenu}
      >
        <SMain className={className} extraFooterPadding={tabsState}>
          {cloneElement(children, { setShowBottomTabs: setTabsState })}
        </SMain>
      </LayoutContextProvider>
      {<Footer showBottomTabs={tabsState} />}
    </React.Fragment>
  );
};

Layout.defaultProps = {
  isMessageLayout: false,
  message: null,
};

const SMain = styled.main<any>`
  height: 100vh;
  @supports (-webkit-touch-callout: none) {
    /* CSS specific to iOS devices */
    /* height: 100%;
    min-height: 100vh; */
  }
  background-color: ${(props) => props.theme.palette.background.primary};
  /* header height  */
  padding-top: 4.81rem;
  /* footer height  */
  padding-bottom: ${(props) => (props.extraFooterPadding ? '4.81rem' : 0)};
  max-width: 26rem;
  margin: auto;
`;
