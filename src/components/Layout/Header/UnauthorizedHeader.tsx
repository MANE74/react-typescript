import styled from 'styled-components';
import { palette } from '../../../theme/colors';
import { ReactComponent as Arrow } from '../../../assets/imgs/navigation/arrow-down.svg';
import i18n, { ELanguages } from '../../../i18n';
import { useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ReactComponent as BackBtn } from '../../../assets/imgs/general/back-arrow-yellow.svg';
import { ReactComponent as Logo } from '../../../assets/imgs/general/cosafe-logo.svg';
import { ReactComponent as English } from '../../../assets/imgs/general/english.svg';
import { ReactComponent as Swedish } from '../../../assets/imgs/general/sweden.svg';
import { saveItem } from '../../../utils/storage';
import { SLink } from './Header';

export interface IHeaderProps {
  to?: string;
  backBtn?: boolean;
}

export const UnauthorizedHeader = (props: IHeaderProps) => {
  const { backBtn, to } = props;
  const navigate = useNavigate();

  const [language, setLanguage] = useState<ELanguages>(ELanguages.se);
  const [languageList, setLanguageList] = useState([
    {
      name: ELanguages.en,
      icon: English,
    },
    {
      name: ELanguages.se,
      icon: Swedish,
    },
  ]);

  useLayoutEffect(() => {
    const lang = i18n.language;
    if (lang !== null) {
      const langValue: ELanguages = (ELanguages as any)[lang];
      setLanguage(langValue);
      changeFirstLanguage(langValue);
    }
  }, [language]);

  const handleLanguage = (lang: ELanguages) => {
    sessionStorage.setItem('selectedLang', lang);
    i18n.changeLanguage(lang);
    saveItem('language', lang);
    setLanguage(lang);
    navigate('');
  };

  const changeFirstLanguage = (lang: ELanguages) => {
    const foundLang = languageList.find((item) => item.name === lang);
    if (foundLang) {
      let newLangListState = languageList.filter((item) => item.name !== lang);
      newLangListState.unshift(foundLang);
      setLanguageList(newLangListState);
    }
  };

  const SelectedLanIcon =
    languageList.find((item) => item.name === language)?.icon ||
    languageList[1].icon;

  return (
    <SHeaderWrapper>
      <SHeader>
        {backBtn && to ? (
          <SLink to={to} replace>
            <BackBtn />
          </SLink>
        ) : (
          <SBalanceSpace />
        )}
        <Logo />
        <LanguageSelector>
          <div className="lang-select">
            <SelectedLanIcon className="flag" />
            <div className="gap" />
            <Arrow className="arrow" />
          </div>
          <div className="lang-menu">
            {languageList.map((lang) => (
              <span className="flag-select" key={lang.name}>
                <lang.icon
                  className="flag"
                  onClick={() => {
                    handleLanguage(ELanguages[lang.name]);
                  }}
                />
              </span>
            ))}
          </div>
        </LanguageSelector>
      </SHeader>
    </SHeaderWrapper>
  );
};

UnauthorizedHeader.defaultProps = {
  isMessageLayout: false,
  message: null,
};

const SHeaderWrapper = styled.header`
  background-color: ${palette.darkblack};
  position: fixed;
  top: 0;
  z-index: 9995;
  width: 100%;
  border-radius: 0 0 17px 17px;
`;

const SHeader = styled.div`
  background-color: ${(props) => props.theme.palette.background.primary};
  display: flex;
  place-content: space-between;
  align-items: center;

  max-width: 26rem;
  margin: auto;
  padding: 2em;

  height: 4.81rem;

  svg {
    aspect-ratio: 1;
  }
`;

const LanguageSelector = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;

  .lang-select {
    height: 1.25rem;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    .arrow {
      width: 0.5rem;
      z-index: 1000;
    }
  }
  :hover .lang-menu {
    visibility: visible;
  }
  :hover .arrow {
    transform: rotate(180deg);
  }

  .flag {
    border-radius: 3px;
  }
  .lang-select {
    .gap {
      width: 0.6875rem;
    }
  }

  .lang-menu {
    position: absolute;
    width: 66px;
    background-color: ${palette.pickedBluewood};
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    align-items: center;
    visibility: hidden;

    margin: -0.5rem 0 0.5rem;
    padding: 0.5rem 0;
  }

  .flag-select {
    margin-right: 15px;

    :first-of-type {
      padding: 0;
    }
    padding-top: 0.75rem;
    img,
    svg {
      cursor: pointer;
      :hover {
        transform: scale(1.1);
      }
    }
  }

  .arrow {
    /* margin: 0.25rem 0 0 0.5rem; */
    width: 0.5rem;
  }
`;

const SBalanceSpace = styled.div`
  aspect-ratio: 1;
  width: 32px;
`;
