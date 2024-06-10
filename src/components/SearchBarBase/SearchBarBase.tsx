import { debounce } from 'lodash';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { ReactComponent as SearchIcon } from '../../assets/imgs/general/search-icon.svg';
import ClearButton from '../../assets/imgs/general/clear-x-button.svg';
import { palette } from '../../theme/colors';

export interface ISearchBarBaseProps
  extends React.HTMLAttributes<HTMLInputElement> {
  placeholderTx?: string;
  placeholder?: string;
  forwardedRef?: any;
  onChangeText?: (text: string) => void;
  fallback: (value: string) => void;
  debouncedTimeMS?: number;
  debounced?: boolean;
  value?: string;
  label?: string;
}

const SSearch = styled.input`
  height: 3.25rem;
  width: 100%;
  min-width: 10rem;

  padding: 1rem 1rem 1rem 2.75rem;

  background-color: ${({ theme }) => theme.palette.background.searchBar};
  color: ${({ theme }) => theme.palette.text.documentPrimary};

  border: 1px solid ${({ theme }) => theme.palette.border.primary};
  border-radius: 0.75rem;

  font-family: 'Roboto-Regular';
  font-size: 14px;
  :focus-visible {
    outline: none;
  }

  ::placeholder {
    color: ${palette.silver};
    opacity: 1;
    font-size: 14px;
  }

  :-ms-input-placeholder {
    color: ${palette.silver};
  }

  ::-ms-input-placeholder {
    color: ${palette.silver};
  }

  ::-webkit-search-cancel-button {
    -webkit-appearance: none;
    height: 1.25rem;
    width: 1.25rem;
    background: url(/imgs/clear-x-button.svg) no-repeat 50% 50%;
    background-size: contain;
    cursor: pointer;
    opacity: 1;
  }
  &::-webkit-search-cancel-button:hover {
    opacity: 0.7;
  }
`;

const SLabel = styled.p`
  position: absolute;
  bottom: 4rem;
  font-family: 'Roboto-Regular';
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: ${palette.white};
`;

const SContainer = styled.div`
  position: relative;
  svg {
    position: absolute;
    left: 1.18rem;
    top: calc(50% - 33% / 2);
  }
`;

const SClear = styled.button.attrs({ type: 'reset' })`
  border: 0;
  padding: 0;
  border-radius: 0;
  background-color: transparent;
  cursor: pointer;
  &:hover {
    opacity: 0.7;
  }

  position: absolute;
  right: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
`;

export const SearchBarBase = (props: ISearchBarBaseProps) => {
  const {
    style,
    placeholderTx,
    placeholder,
    forwardedRef,
    onChangeText,
    debouncedTimeMS,
    debounced = true,
    value,
    className,
    fallback,
    label,
    ...rest
  } = props;
  const { t } = useTranslation();
  const actualPlaceholder = placeholderTx ? t(`${placeholderTx}`) : placeholder;

  const debouncedOnChange = React.useCallback(
    debounce(onChangeText || fallback, 1000, {
      leading: false,
      trailing: true,
    }),
    [onChangeText, fallback]
  );
  let agent = navigator.userAgent;

  const isFirefox =
    typeof InstallTrigger !== 'undefined' || agent.includes('Firefox');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    debounced
      ? debouncedOnChange(e.target.value)
      : onChangeText
      ? onChangeText(e.target.value)
      : fallback(e.target.value);
  };

  const renderSearch = () => (
    <>
      {label && <SLabel>{t(`${label}`)}</SLabel>}
      <SearchIcon />
      <SSearch
        type={isFirefox ? 'text' : 'search'}
        size={10}
        placeholder={actualPlaceholder}
        ref={forwardedRef}
        onChange={handleSearch}
      />
    </>
  );

  const formRef = React.useRef<HTMLFormElement>(null);

  const handleFireFoxClearButton = (e: React.SyntheticEvent) => {
    formRef.current?.reset();
    onChangeText && onChangeText('');
    fallback && fallback('');
  };

  return (
    <SContainer className={className}>
      {isFirefox ? (
        <form ref={formRef}>
          {renderSearch()}
          {value && value?.length > 0 && (
            <SClear onClick={handleFireFoxClearButton}>
              <img src={ClearButton} alt="clear button" />
            </SClear>
          )}
        </form>
      ) : (
        renderSearch()
      )}
    </SContainer>
  );
};
