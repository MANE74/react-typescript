import React, { ChangeEvent, useEffect, useState } from 'react';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { Button } from '../../components/Button/Button';
import { CountryCodeDropDown } from '../../components/CountryCodeDropDown/CountryCodeDropDown';
import {
  CountryCode,
  OnCountryCodeChangeParams,
} from '../../components/CountryCodeDropDown/types';
import { CountryCodeTextField } from '../../components/CountryCodeTextField/CountryCodeTextField';
import Loader from '../../components/Loader/Loader';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { palette } from '../../theme/colors';
import { translate } from '../../utils/translate';
import { selectUserById, selectUserByIdLoading } from '../Login/LoginSlice';
import {
  editSecondaryPhoneNumber,
  getCurrentUserById,
} from '../Login/LoginSlice/actionCreators';
import { isNotNumbersOnly } from './helpers';

export const ChangeSecondaryNumber = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigate();

  const user = useAppSelector(selectUserById);
  const isGettingDataLoading = useAppSelector(selectUserByIdLoading);

  const [countryCode, setCountryCode] = useState<CountryCode>('SE');
  const [phoneNumber, setPhoneNumber] = useState<string|undefined>(undefined);
  const [isLoading, setIsloading] = useState(false);
  const [isInvalidPhoneNumber, setIsInvalidPhoneNumber] = useState(false);

  const finalNumber: any =
    phoneNumber &&
    isNotNumbersOnly(phoneNumber) &&
    parsePhoneNumberFromString(phoneNumber, {
      defaultCountry: countryCode,
      extract: false,
    });

  // backend sends two pohne number seperated with , and a space
  useEffect(() => {
    if (!user) {
      dispatch(getCurrentUserById());
    }
    const phoneNumbers = user?.phoneNumber?.split(',');
    const secPhoneNumber =
      phoneNumbers && phoneNumbers[1] && phoneNumbers[1].substring(1);
    const secondPhoneNumber = secPhoneNumber
      ? parsePhoneNumberFromString(secPhoneNumber || '')
      : undefined;
    secondPhoneNumber?.country && setCountryCode(secondPhoneNumber.country);
    secondPhoneNumber?.nationalNumber &&
      setPhoneNumber(secondPhoneNumber.nationalNumber);
  }, [dispatch, user]);

  const onCountryChanged = (params: OnCountryCodeChangeParams) => {
    const { countryCode } = params;
    setCountryCode(countryCode);
  };
  const onNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setPhoneNumber(value);
  };

  const handleButtonCliked = async () => {
    if(finalNumber?.number || phoneNumber === ''){
      try {
        setIsloading(true);
        await dispatch(editSecondaryPhoneNumber(finalNumber?.number));
        setIsInvalidPhoneNumber(false);
        setIsloading(false);
        navigation(-1);
      } catch (e) {
        setIsloading(false);
      }
    } else {
      setIsInvalidPhoneNumber(true);
    }
  };

  const currentNumber = user?.phoneNumber?.split(', +')[1]?.substring(finalNumber?.countryCallingCode?.length)

  if (isLoading || isGettingDataLoading) return <Loader />;
  
  return (
    <SContainer>
      <STitle>{translate('profile_changeSecNumber')}</STitle>
      <SSubTitle>{translate('profile_changeSecNumberDescription')}</SSubTitle>
      <CountryCodeTextField
        StartAdornment={
          !isGettingDataLoading && (
            <CountryCodeDropDown
              initiallValue={countryCode}
              onChange={onCountryChanged}
            />
          )
        }
        type="tel"
        name="number"
        placeHolderTx="profile_yourPhoneNumber"
        value={phoneNumber}
        onChange={onNumberChange}
        hasError={isInvalidPhoneNumber}
      />
      {isInvalidPhoneNumber && (
        <SErroText>{translate('invalid_phone_number')}</SErroText>
      )}
      <SStritchedSpace />
        {phoneNumber && currentNumber !== phoneNumber &&
          <SButton onClick={handleButtonCliked} tx="save" />
        }
        {phoneNumber !== undefined && !phoneNumber && user?.phoneNumber?.split(', ')[1] !== 'undefined' &&
          <SButton onClick={handleButtonCliked} tx="save" />
        }
    </SContainer>
  );
};

const SContainer = styled.div`
  width: 90%;
  margin: auto;
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
  padding-top: 3.5rem;
`;

const STitle = styled.h1`
  font-size: 1.125rem;
  font-family: 'Roboto-Medium';
  color: ${palette.white};
  text-align: left;
`;

const SSubTitle = styled.h2`
  font-size: 0.875rem;
  font-family: 'Roboto-Regular';
  color: ${palette.silver};
  line-height: 1.3;
  margin: 1.25rem 0rem;
  text-align: left;
`;

const SStritchedSpace = styled.div`
  flex-grow: 1;
`;

const SButton = styled(Button)`
  width: 100%;
  margin-top: 0.875rem;
  button {
    max-width: 200rem;

    width: 100%;
    font-size: 1rem;
    padding: 0.8125rem 0;
    font-family: 'Roboto-Medium';
    color: ${palette.raisinBlack3};
    margin-bottom:  3.5rem;
  }
`;

const SErroText = styled.p`
  font-size: 0.875rem;
  font-family: 'Roboto-Regular';
  color: ${palette.tartOrange};
  margin-right: auto;
  margin-top: 0.5rem;

  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;
