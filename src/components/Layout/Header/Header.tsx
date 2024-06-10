import styled from 'styled-components';
import { ReactComponent as SideMenu } from '../../../assets/imgs/navigation/side-menu.svg';
import { ReactComponent as CoSafeLogo } from '../../../assets/imgs/general/cosafe-logo.svg';
import { ReactComponent as BackBtn } from '../../../assets/imgs/general/back-arrow-yellow.svg';
import { ReactComponent as BackBtnWhite } from '../../../assets/imgs/chats/back-btn-white.svg';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../../../hooks';
import { selectUser } from '../../../containers/Login/LoginSlice';
import { getImage } from '../../../apis/mediaAPI';
import { getItem, saveItem } from '../../../utils/storage';
import Dots from '../../../assets/imgs/navigation/header-dots.svg';
import { palette } from '../../../theme/colors';
import { translate } from '../../../utils/translate';

export interface IHeaderProps {
  isMessageLayout: boolean;
  message: string;
  to?: string;
  backBtn?: boolean;
  showCoSafeLogo?: boolean;
  subMessageText?: string | null;
  showDots?: boolean;
  dotsCallBack?: () => void;
  isAlarmActive: boolean;
  backBtnCallBack?: (e: any) => void;
}

export const Header = (props: IHeaderProps) => {
  const {
    isMessageLayout,
    message,
    to,
    backBtn,
    showCoSafeLogo,
    subMessageText,
    showDots,
    dotsCallBack,
    isAlarmActive,
    backBtnCallBack,
  } = props;
  const user = useAppSelector(selectUser);
  const [image, setImage] = useState<string>('');

  useEffect(() => {
    getCompanyLogo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getCompanyLogo = async () => {
    if (!image) {
      const logoName = user?.organizationLogo;
      const img = await getImage({ imageName: logoName! });
      setImage(img);
      // saveItem('organizationLogo', img);
    }
  };

  return (
    <SHeaderWrapper>
      <SHeader extra={!isMessageLayout && !to} isAlarmActive={isAlarmActive}>
        {!isMessageLayout && (
          <>
            {backBtn && to ? (
              <SLink to={to}>
                <BackBtn />
              </SLink>
            ) : (
              <SBalanceSpace />
            )}
            {showCoSafeLogo || image === '' ? (
              <CoSafeLogo />
            ) : (
              <Logo src={image} alt="" />
            )}
            {!backBtn ? (
              <SLink to="/sidebar">
                <SSideMenu />
              </SLink>
            ) : (
              <SBalanceSpace />
            )}
          </>
        )}
        {isMessageLayout && to && (
          <>
            <SLink
              to={to}
              onClick={(e) => backBtnCallBack && backBtnCallBack(e)}
            >
              {isAlarmActive ? <BackBtnWhite /> : <BackBtn />}
            </SLink>
            <SHeaderMessageWrapper>
              <HeaderMessageText>{translate(message)}</HeaderMessageText>
              {subMessageText && (
                <SSubMessageText>{subMessageText}</SSubMessageText>
              )}
            </SHeaderMessageWrapper>
            {showDots ? (
              <SDots width={32} src={Dots} alt="" onClick={dotsCallBack} />
            ) : (
              <SBalanceSpace />
            )}
          </>
        )}
      </SHeader>
    </SHeaderWrapper>
  );
};

const SHeaderWrapper = styled.header`
  position: fixed;
  top: 0;
  z-index: 99;
  width: 100%;
  border-radius: 0 0 17px 17px;
`;

const SHeader = styled.div<any>`
  background-color: ${(props) =>
    props.isAlarmActive
      ? palette.tartOrange
      : props.theme.palette.background.nav};
  color: ${palette.white};
  border-bottom-right-radius: 15px;
  border-bottom-left-radius: 15px;
  display: flex;
  place-content: space-between;
  align-items: center;

  max-width: 26rem;
  margin: auto;
  padding: 2em;

  height: ${(props) => (props.extra ? '4.86rem' : '4.81rem')};

  svg {
    aspect-ratio: 1;
  }
`;

const Logo = styled.img`
  height: inherit;
  padding: 0.5rem 0;
  object-fit: contain;
`;

const SBalanceSpace = styled.div`
  aspect-ratio: 1;
  width: 2rem;
`;

export const SLink = styled(Link)`
  height: 2.5rem;
  min-width: 2rem;
  display: flex;
  align-items: center;
`;

const SSideMenu = styled(SideMenu)`
  width: 2.25rem;
  height: 2.25rem;
`;

const SDots = styled.img`
  cursor: pointer;
`;

const SHeaderMessageWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

const HeaderMessageText = styled.h3`
  text-align: center;
`;

const SSubMessageText = styled.p`
  text-align: center;
  font-family: 'Roboto-Medium';
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  padding-top: 0.25rem;
  text-align: center;

  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* number of lines to show */
  -webkit-box-orient: vertical;
`;
