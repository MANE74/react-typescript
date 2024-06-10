import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { Button } from '../../components/Button/Button';
import { NavDots } from '../../components/NavDots/NavDots';
import { Page } from '../../components/Page/Page';
import { palette } from '../../theme/colors';
import { useLayoutContext } from '../../utils/customHooks/LayoutContext';
import { translate } from '../../utils/translate';
import { introTutorial } from './helpers';

export const LoginIntro = () => {
  const { index } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { setBackLink } = useLayoutContext();
  useEffect(() => {
    if (!!index) {
      if (isNaN(+index)) {
        navigate(`/intro`);
        return;
      }
      if (+index >= introTutorial.length) {
        navigate(`/intro/${introTutorial.length - 1}`);
        return;
      }
      if (+index < 1) {
        navigate(`/intro`);
        return;
      }
      setBackLink(introTutorial[+index].back);
    } else {
      setBackLink(undefined);
    }
  }, [pathname]);

  const _index = index ? +index : 0;

  const handleNext = () => {
    navigate(introTutorial[_index].next);
  };
  return (
    <SPage>
      <SGapFiller />
      <SVerticalContainer>
        <img
          className="intro-pic"
          src={introTutorial[_index]?.pic}
          alt={translate(introTutorial[_index]?.title)}
        />
        <NavDots count={introTutorial.length} currentIndex={_index} />
      </SVerticalContainer>
      <SVerticalContainer $maxWidth $fixedSize className="middle">
        <h2>{translate(introTutorial[_index]?.title)}</h2>
        <p className="top-margin">{translate(introTutorial[_index]?.disc)}</p>
      </SVerticalContainer>
      <SVerticalContainer>
        <SButton tx="next" onClick={handleNext} />
        <SSkip className="top-margin" to={'/login'}>
          {translate('login_intro_skip')}
        </SSkip>
      </SVerticalContainer>
      <SGapFiller />
    </SPage>
  );
};

const SPage = styled(Page)`
  padding-top: 0;
  display: flex;
  flex-direction: column;
`;

const SVerticalContainer = styled.div<{
  $maxWidth?: boolean;
  $fixedSize?: boolean;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: 'Roboto-Regular';
  color: ${palette.lightGrey};
  .intro-pic {
    margin-bottom: 0.625rem;
  }

  .top-margin {
    color: ${palette.silver};
    margin-top: 1.25rem;
  }

  &.middle {
    margin-top: 2.5rem;
    height: 10rem;
    justify-content: flex-start;
  }

  ${(props) =>
    props.$maxWidth &&
    css`
      max-width: 84%;
      margin: 0 auto 0 auto;
      text-align: center;
    `}
  ${(props) =>
    props.$fixedSize &&
    css`
      min-height: 6.625rem;
    `}
`;

const SGapFiller = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
  max-height: 6rem;
`;

export const SButton = styled(Button)`
  width: 100%;
  margin-top: 0.8125rem;
  button {
    width: 100%;
    max-width: 100rem;
    font-size: 1rem;
    padding: 0.8125rem 0;
    font-family: 'Roboto-Medium';
    font-weight: 500;
    background-color: ${palette.honeyYellow};
    color: ${palette.raisinBlack3};
  }
`;

const SSkip = styled(Link)`
  text-decoration: none;
  align-self: center;
  font-size: 1rem;
  font-family: 'Roboto-Regular';
  &:visited {
    color: ${palette.honeyYellow};
  }
  color: ${palette.honeyYellow};
  font-weight: 500;
`;
