import React from 'react';
import {
  SElementContainer,
  SidebarSection,
} from '../../../containers/Sidebar/Sidebar';
import { Layout } from '../../Layout/Layout';
import EnglishIcon from '../../../assets/imgs/general/united-kingdom-round.svg';
import SwedishIcon from '../../../assets/imgs/general/sweden-round.svg';
import SidebarElement from '../../../containers/Sidebar/SidebarElement';
import i18n, { ELanguages } from '../../../i18n';
import { useNavigate } from 'react-router-dom';
import { Page } from '../../Page/Page';
import { setLanguage } from '../Settings/settingsSlice/actionCreators';
import { useAppDispatch } from '../../../hooks';

function Language() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const saveLanguage = (language: ELanguages) => {
    dispatch(
      setLanguage(language, () => {
        i18n.changeLanguage(language);
        navigate('/sidebar');
      })
    );
  };

  const languageElements: SidebarSection[] = [
    {
      name: ELanguages.se,
      icon: SwedishIcon,
      onClick: () => {
        saveLanguage(ELanguages.se);
      },
    },
    {
      name: ELanguages.en,
      icon: EnglishIcon,
      onClick: () => {
        saveLanguage(ELanguages.en);
      },
    },
  ];

  return (
    <Layout isMessageLayout message="language" to="/sidebar" showBottomTabs>
      <Page>
        <SElementContainer>
          {languageElements.map((element, key) => (
            <SidebarElement
              key={key}
              name={element.name}
              icon={element.icon}
              onClick={element.onClick}
            />
          ))}
        </SElementContainer>
      </Page>
    </Layout>
  );
}

export default Language;
