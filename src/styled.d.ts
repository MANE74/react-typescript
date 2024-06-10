// import original module declarations
import 'styled-components';

// and extend them!
declare module 'styled-components' {
  export interface DefaultTheme {
    palette: PaletteType;
    globalSizes: Record<string, string | number>;
    shadow: Record<string, string>;
  }
}
export interface PaletteType {
  // background: Record<string, string>; // what do you think is more convenient
  background: {
    primary: string;
    secondary?: string;
    nav?: string;
    danger?: string;
    bubble?: string;
    sideBar?: string;
    sideBarSelectedItem?: string;
    searchBar?: string;
    tutorialBar?: string;
    buttonPrimary?: string;
    naviageBar?: string;
  };
  text: Record<string, string>;
  border: {
    primary: string;
  };
  shadow: Record<string, string>;
}
