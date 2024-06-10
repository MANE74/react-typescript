import { css } from 'styled-components';
import RobotoRegular from './roboto/Roboto-Regular.woff';
import RobotoBlack from './roboto/Roboto-Black.woff';
import RobotoMedium from './roboto/Roboto-Medium.woff';
import RobotoBold from './roboto/Roboto-Bold.woff';

export const Fonts = css`
  @font-face {
    font-family: 'Roboto-Regular';
    src: local('Roboto-Regular'), url(${RobotoRegular}) format('woff');
  }
  @font-face {
    font-family: 'Roboto-Black';
    src: local('Roboto-Black'), url(${RobotoBlack}) format('woff');
  }
  @font-face {
    font-family: 'Roboto-Medium';
    src: local('Roboto-Medium'), url(${RobotoMedium}) format('woff');
  }
  @font-face {
    font-family: 'Roboto-Bold';
    src: local('Roboto-Bold'), url(${RobotoBold}) format('woff');
  }
`;
