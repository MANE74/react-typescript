import * as React from "react";
import { useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import { ReactComponent as InfoIcon } from "../../assets/imgs/navigation/navigate_back.svg";
import { translate } from "../../utils/translate";

export interface INaviageBarProps {
  titleTx: string
}

const NavigateWidth = css`
  width: calc(
    100% -
      (
        ${({ theme }) => theme.globalSizes.sideBarWidth} +
          ${({ theme }) => theme.globalSizes.sideNavBarWidth}
      )
  );
`;

const SNavigateBar = styled.div`
  display: flex;
  position: fixed;
  justify-content: space-between;
  align-items: center;
  z-index: 9999;
  left: 0;
  right: 0;
  top: 0;
  @media (min-width: 450px) {
    top: 0;
  }
  padding: 1rem 2.5rem;

  width: 100%;
  height: ${({ theme }) => theme.globalSizes.headerHeight};
  @media (min-width: 450px) {
    height: 4.81rem;
  }
  background-color: ${({ theme }) => theme.palette.background.naviageBar};
  svg {
    width: 0.9rem;
  }
`;

const SFlexContainer = styled.div`
  display: flex;
  width: 100%;
  min-width: 0;
`;

const STitle = styled.p`
  font-family: "Roboto-Regular";
  font-size: 1.125rem;
  padding: 0 0.375rem;
  width: 70%;
  text-align: center;
`;

const STitleLeft = styled.span`
  font-family: "Roboto-Regular";
  font-size: 1.125rem;
  padding: 0 0.375rem;
  width: 15%;
  svg {
    width: 1.375rem;
  }
`;

const STitleRight = styled.span`
  font-family: "Roboto-Regular";
  font-size: 1.125rem;
  padding: 0 0.375rem;
  width: 15%;
  svg {
    width: 1.375rem;
  }
`;

export const NavigateBar = (props: INaviageBarProps) => {
  const { titleTx } = props;
  const navigate = useNavigate();

  const onGoBack = () => {
      navigate(-1);
  }

  return (
    <SNavigateBar>
      <SFlexContainer>
        <STitleLeft onClick={onGoBack}>
            <InfoIcon/>
        </STitleLeft>
        <STitle>{translate(titleTx)}</STitle>
        <STitleRight></STitleRight>
      </SFlexContainer>
    </SNavigateBar>
  );
};
