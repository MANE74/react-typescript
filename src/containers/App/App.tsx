import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RequireAuth } from '../../routes/requireAuth';
import { useDarkMode } from '../../utils/customHooks/useDarkMode';
import { darkTheme } from '../../theme/theme';
import { ThemeProvider } from 'styled-components';
import GlobalStyle from '../../theme/globalStyle';

import { Suspense, useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';

import i18n, { ELanguages } from '../../i18n';
import { selectIsAppLoading } from './AppSlice';

import { RequireCookies } from '../../components/RequireCookies/RequireCookies';
import { OpenMobileApp } from '../OpenMobileApp/OpenMobileApp';
import { auth_routes, public_routes } from '../../routes/AllRoutes';
import Splash from '../../components/Splash/Splash';
import { loadSkolonButtonScript } from '../../utils/skolon';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { selectUser } from '../Login/LoginSlice';
import { updateUser } from '../Login/LoginSlice/actionCreators';
import { fetchTotalUnread } from '../ChatsList/chatListSlice/actionCreators';
import { CheckAppAvailable } from '../CheckAppAvailable/CheckAppAvailable';
import { selectIsOnLine } from '../CheckAppAvailable/checkAppAvailableSlice';
import { setLanguage } from '../../components/SidebarOptions/Settings/settingsSlice/actionCreators';
import { getItem, saveItem } from '../../utils/storage';

function App() {
  // UI State
  const isAppLoading = useAppSelector(selectIsAppLoading);
  const user = useAppSelector(selectUser);
  const isOnline = useAppSelector(selectIsOnLine);

  const dispatch = useAppDispatch();
  const { mountedComponent } = useDarkMode();
  // always force dark them for now
  const themeMode = darkTheme;

  useEffect(() => {
    dispatch(updateUser());
  }, []);

  useEffect(() => {
    var interval: NodeJS.Timeout | undefined = undefined;

    const getUnread = () => {
      dispatch(fetchTotalUnread());
    };
    if (user && isOnline) {
      dispatch(fetchTotalUnread());
      handleLanguage();
      interval = setInterval(getUnread, 15000);
    }
    if (!isOnline) {
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isOnline]);

  const handleLanguage = () => {
    const initialLang = sessionStorage.getItem('selectedLang') as ELanguages;
    if (initialLang) {
      saveItem('language', initialLang);
      i18n.changeLanguage(initialLang);
      dispatch(setLanguage(initialLang));
      sessionStorage.removeItem('selectedLang');
    } else if (
      getItem('language') !== user!.preferredLanguage &&
      user!.preferredLanguage !== null
    ) {
      saveItem('language', user!.preferredLanguage);
      i18n.changeLanguage(user!.preferredLanguage);
    } else if (user!.preferredLanguage === null) {
      dispatch(setLanguage(i18n.language as ELanguages));
    }
  };

  // Renders
  if (!mountedComponent) return <div />;
  if (isAppLoading) return <Splash />;

  return (
    <ThemeProvider theme={themeMode}>
      {loadSkolonButtonScript()}
      <GlobalStyle />
      <I18nextProvider i18n={i18n}>
        <Suspense fallback="loading">
          <RequireCookies>
            <Router>
              <OpenMobileApp>
                <CheckAppAvailable>
                  <Routes>
                    {public_routes.map((route, key) => (
                      <Route
                        key={`public-${key}`}
                        path={route.path}
                        element={route.element}
                      />
                    ))}
                    {auth_routes.map((route, key) => (
                      <Route
                        key={`auth-${key}`}
                        path={route.path}
                        element={<RequireAuth>{route.element}</RequireAuth>}
                      />
                    ))}
                  </Routes>
                </CheckAppAvailable>
              </OpenMobileApp>
            </Router>
          </RequireCookies>
        </Suspense>
      </I18nextProvider>
    </ThemeProvider>
  );
}

export default App;
