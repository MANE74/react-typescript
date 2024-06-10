import { createContext, useContext, useMemo } from 'react';

interface LayoutContextProps {
  toggleTabBarVisibility: () => void;
  toggleHeaderMenuVisability: () => void;
  setTabsState: React.Dispatch<React.SetStateAction<boolean>>;
  setBackLink: React.Dispatch<React.SetStateAction<string | undefined>>;
  setMessage: React.Dispatch<React.SetStateAction<string | undefined>>;
  setSubTitle: React.Dispatch<React.SetStateAction<string | undefined>>;
  setDoShowDots: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  isMenuOpen: boolean;
}

const layoutContextDefualtValue: LayoutContextProps = {
  toggleTabBarVisibility: () => {},
  toggleHeaderMenuVisability: () => {},
  setTabsState: () => {},
  setBackLink: () => {},
  setMessage: () => {},
  setSubTitle: () => {},
  setDoShowDots: () => {},
  isMenuOpen: false,
};

export const useLayoutContext = () => useContext(LayoutContext);

const LayoutContext = createContext<LayoutContextProps>(
  layoutContextDefualtValue
);

interface LayoutContextProviderProps {
  setTabsState: React.Dispatch<React.SetStateAction<boolean>>;
  setBackLink: React.Dispatch<React.SetStateAction<string | undefined>>;
  setMessage: React.Dispatch<React.SetStateAction<string | undefined>>;
  setSubTitle: React.Dispatch<React.SetStateAction<string | undefined>>;
  setDoShowDots: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  setHeaderMenu: React.Dispatch<React.SetStateAction<boolean>>;
  isMenuOpen: boolean;
  children: React.ReactNode;
}
export const LayoutContextProvider = (props: LayoutContextProviderProps) => {
  const {
    setTabsState,
    children,
    setBackLink,
    setMessage,
    setSubTitle,
    setDoShowDots,
    setHeaderMenu,
    isMenuOpen,
  } = props;

  const toggleTabBarVisibility = () => {
    setTabsState((prev) => !prev);
  };
  const toggleHeaderMenuVisability = () => {
    setHeaderMenu((prev) => !prev);
  };

  const value = useMemo(
    () => ({
      toggleTabBarVisibility,
      setTabsState,
      setBackLink,
      setMessage,
      setSubTitle,
      setDoShowDots,
      toggleHeaderMenuVisability,
      isMenuOpen,
    }),
    [isMenuOpen]
  );

  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  );
};
