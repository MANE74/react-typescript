import styled from 'styled-components';
import { palette } from '../../theme/colors';
import { Button } from '../Button/Button';
import { CheckBoxWithSubTitle } from '../CheckBoxWithSubTitle/CheckBoxWithSubTitle';

export const SCheckBoxWithSubTitle = styled(CheckBoxWithSubTitle)`
  .STitle {
    font-family: 'Roboto-Regular';
    font-weight: 400;
    font-size: 0.875rem;
  }
`;

export const SDrawerWrapper = styled.div`
  .profileDrawer {
    left: 0;
    right: 0;
    margin: auto;
    z-index: 1001;
    @media (min-width: 450px) {
      max-width: 26rem;
      margin: auto;
    }
    background-color: ${palette.prussianBlue2};
    max-height: 75vh;
  }
  .profileDrawer__backdrop {
    z-index: 1000;
  }
  .profileDrawer__handle-wrapper {
  }
  .profileDrawer__handle {
    width: 36%;
    margin-top: 1.3125rem;
  }
  .profileDrawer__content {
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .content-wrapper {
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      margin-bottom: 1rem;
    }
  }

  p.STitle {
    margin-left: 0rem;
    font-weight: 400;
  }

  .list-gap-item {
    &:not(:last-child) {
      margin-bottom: 1.25rem;
    }
  }
`;

export const SBottomLine = styled.div`
  border-radius: 5;

  background: ${palette.dustyGray};
  height: 5px;
  min-height: 5px;
  max-height: 5px;
  width: 40%;
  border-radius: 5px;

  margin: 1.375rem auto 0 auto;
  opacity: 0.4;
`;

export const STitle = styled.h1`
  margin-bottom: 0.25rem;

  font-weight: 500;
  font-size: 1rem;
  font-family: 'Roboto-Medium';
  color: ${palette.white};
  line-height: 1.18rem;
`;

export const SButton = styled(Button)`
  width: 100%;
  margin-top: 0.8125rem;
  button {
    max-width: 100rem;
    width: 100%;
    font-size: 1rem;
    padding: 0.8125rem 0;
    font-family: 'Roboto-Medium';
    color: ${palette.raisinBlack3};
  }
`;
