import { DefaultTheme } from 'styled-components';
import { PaletteType } from '../styled';
import { palette } from './colors';

// const light: PaletteType = {
//   background: {
//     primary: palette.white,
//     secondary: palette.prussianBlue,
//     nav: palette.prussianBlue2,
//     danger: palette.tartOrange,
//     bubble: palette.vividSkyBlue,
//     sideBar: palette.raisinBlack2,
//     sideBarSelectedItem: palette.charcoal,
//     searchBar: palette.gunmetal,
//     tutorialBar: palette.wildBlue,
//     buttonPrimary: palette.gold,
//     naviageBar: palette.prussianBlue2,
//   },
//   text: {
//     primary: palette.raisinBlack,
//     menuPrimary: palette.white,
//     documentPrimary: palette.silver,
//     buttonPrimary: palette.black,
//     textPrimary: palette.grayx11gray,
//   },
//   border: {
//     primary: palette.queenBlue,
//   },
//   shadow: {
//     menuPrimary: palette.davysGrey10,
//   },
// };

const dark: PaletteType = {
  background: {
    primary: palette.navyBlue,
    secondary: palette.prussianBlue,
    nav: palette.prussianBlue2,
    danger: palette.tartOrange,
    bubble: palette.vividSkyBlue,
    sideBar: palette.raisinBlack2,
    sideBarSelectedItem: palette.charcoal,
    searchBar: palette.gunmetal,
    tutorialBar: palette.wildBlue,
    buttonPrimary: palette.gold,
    naviageBar: palette.prussianBlue2,
  },
  text: {
    primary: palette.white,
    menuPrimary: palette.white,
    documentPrimary: palette.silver,
    buttonPrimary: palette.black,
    inputPrimary: palette.grayx11gray,
  },
  border: {
    primary: palette.queenBlue,
  },
  shadow: {
    menuPrimary: palette.davysGrey10,
  },
};

const defaultTheme: Omit<DefaultTheme, 'palette'> = {
  globalSizes: {
    sideBarWidth: `clamp(17.5rem, 25% ,28rem)`,
    tutorialBarHeight: `3.75rem`,
    sideNavBarWidth: `5.3rem`,
    headerHeight: `3.81rem`,
  },
  shadow: {
    primary: `0px 20px 20px 0px ${palette.shadowColor}`,
  },
};

export const lightTheme: DefaultTheme = { ...defaultTheme, palette: dark };
export const darkTheme: DefaultTheme = { ...defaultTheme, palette: dark };
