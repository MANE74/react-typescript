import * as React from 'react';
import Country from './resources/country';
import Flags from './resources/flags';
import {
  SCountryItem,
  SDropDown,
  SFlexabelMargin,
  SInnerDiv,
  Slabel,
} from './styles';
import { CountryCode, CountryData, ICountryCodeDropDownProps } from './types';
import { scrollTo } from './utils';

export const CountryCodeDropDown = (props: ICountryCodeDropDownProps) => {
  const { initiallValue, onPressed, onChange, readMode = false } = props;
  // Country is a singleton so we can relay on it
  const allCountries = Country.getAll();
  const allCountriesLength = Country.getAll().length;
  // state
  const [isOpen, setIsOpen] = React.useState(false);
  const [_countryCodeSelected, _setCountryCodeSelected] =
    React.useState<CountryCode>(initiallValue || 'SE');
  const [highLightedIndex, setHighlightedIndex] = React.useState<number>(
    allCountries.map((i) => i.code).indexOf(initiallValue || 'SE')
  );

  React.useEffect(() => {
    setHighlightedIndex(
      allCountries.map((i) => i.code).indexOf(initiallValue || 'SE')
    );
    _setCountryCodeSelected(initiallValue || 'SE');
  }, [initiallValue]);
  const [hoverIndex, setHoverIndex] = React.useState<number | undefined>();
  // elements refs
  let labelRef = React.useRef<HTMLLabelElement>(null);
  let dropDownRef = React.useRef<HTMLUListElement>(null);
  let dropDownContainerRef = React.useRef<HTMLDivElement>(null);
  const [countryItemsRef, setCountryItemsRef] = React.useState<
    React.RefObject<HTMLLIElement>[]
  >([]);
  const getCountryItemRef = (index: number) => countryItemsRef[index];

  // initialization
  React.useEffect(() => {
    if (isOpen) scrollTo(getCountryItemRef(highLightedIndex), dropDownRef);
  }, [isOpen]);

  React.useEffect(() => {
    setCountryItemsRef((countryItemsRef) =>
      Array(allCountriesLength)
        .fill()
        .map((_, i) => countryItemsRef[i] || React.createRef())
    );
  }, [allCountriesLength]);

  React.useLayoutEffect(() => {
    if (document.addEventListener) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      if (document.removeEventListener) {
        document.removeEventListener('mousedown', handleClickOutside);
      }
    };
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      !readMode && document.addEventListener('keypress', handleKeyDown, false);
    }
    if (!isOpen) {
      !readMode &&
        document.removeEventListener('keypress', handleKeyDown, false);
    }
    return () => {
      !readMode &&
        document.removeEventListener('keypress', handleKeyDown, false);
    };
  }, [isOpen]);

  const dissmissHover = () => {
    setHoverIndex(undefined);
  };

  // behavior
  const onValueChange = (
    countryCode: CountryCode,
    dialCode: string,
    highlightedIndex: number
  ) => {
    onChange({ countryCode, dialCode });

    _setCountryCodeSelected(countryCode);
    setHighlightedIndex(highlightedIndex);
    dismiss();
  };
  const handlItemClicked =
    (code: CountryCode, dialCode: string, countryIndex: number) => () =>
      onValueChange(code, dialCode, countryIndex);

  const toggleIsOpen = () => {
    setIsOpen((prev) => !prev);
  };
  const dismiss = () => {
    setIsOpen(false);
    dissmissHover();
  };
  const handleClickOutside = (e: MouseEvent) => {
    if (
      dropDownRef &&
      !dropDownContainerRef.current?.contains(e.target as Node) &&
      !labelRef.current?.contains(e.target as Node)
    ) {
      dismiss();
    }
  };

  const handleKeyDown = (e: any) => {
    e.preventDefault();
    if (isOpen) {
      const searchedIndex = allCountries
        .slice()
        .map((i) => i.name[0].toLowerCase())
        .indexOf(e.key);
      searchedIndex !== -1 &&
        scrollTo(getCountryItemRef(searchedIndex), dropDownRef);

      setHoverIndex(searchedIndex);
      const event = new MouseEvent('mouseover', {
        view: window,
        bubbles: true,
        cancelable: true,
      });
    }
  };

  //renders
  const renderItem = (item: CountryData, index: number) => (
    <SCountryItem
      role="option"
      key={`${item.code}-${index}`}
      isSelected={hoverIndex === index || highLightedIndex === index}
      ref={countryItemsRef[index]}
      onMouseOver={(e) => dissmissHover()}
      onClick={handlItemClicked(item.code, item.dial_code, index)}
    >
      <img src={Flags.get(item.code)} alt={`${item.name} country`} />
      <p className="name">{item.name}</p>
      <p>{item.dial_code}</p>
    </SCountryItem>
  );

  return (
    <>
      <Slabel
        ref={labelRef}
        onKeyPressCapture={handleKeyDown}
        readMode={readMode}
        onClick={onPressed || toggleIsOpen}
      >
        <img
          src={Flags.get(_countryCodeSelected)}
          alt={`${_countryCodeSelected} country`}
        />
        <SFlexabelMargin />
        <p>{Country.getDialCode(_countryCodeSelected)}</p>
      </Slabel>
      {!readMode && isOpen && (
        <SDropDown ref={dropDownContainerRef}>
          <SInnerDiv ref={dropDownRef} role="listbox">
            {allCountries.map(renderItem)}
          </SInnerDiv>
        </SDropDown>
      )}
    </>
  );
};
