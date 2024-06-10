import React, { useEffect } from 'react';
import styled, { css } from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { selectUserById, selectUserByIdLoading } from '../Login/LoginSlice';
import {
  changeProfileImage,
  getCurrentUserById,
} from '../Login/LoginSlice/actionCreators';
import userImg from '../../assets/imgs/general/user-login.svg';
import EditImg from '../../assets/imgs/general/edit.svg';
import { TextField } from '../../components/TextField/TextField';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { palette } from '../../theme/colors';
import parsePhoneNumber from 'libphonenumber-js';

import { CountryCodeDropDown } from '../../components/CountryCodeDropDown/CountryCodeDropDown';
import Loader from '../../components/Loader/Loader';
import { translate } from '../../utils/translate';
import { Page } from '../../components/Page/Page';
import { t } from 'i18next';
import { ChoosePhotoBottomSheet } from '../../components/ChoosePhotoBottomSheet/ChoosePhotoBottomSheet';
import { uploadImage } from '../../apis/mediaAPI';

export const Profile = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigate();

  const user = useAppSelector(selectUserById);
  const isLoading = useAppSelector(selectUserByIdLoading);

  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [profilePicURL, setProfilePicURL] = React.useState<string>();
  const [isLoadingPic, setIsloadingPic] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [profilePic, setProfilePic] = React.useState<string | undefined>(
    user?.photoUrl
  );

  const isValid = !!profilePicURL && !isUploading;

  // backend sends two phone numbers seperated with , and a space
  const phoneNumbers = user?.phoneNumber?.split(',');
  const primPhoneNumber = phoneNumbers && phoneNumbers[0];
  const secPhoneNumber =
    phoneNumbers && phoneNumbers?.length > 1 && phoneNumbers[1].substring(1);
  const primaryPhoneNumber = parsePhoneNumber(primPhoneNumber || '');
  const secondPhoneNumber = parsePhoneNumber(secPhoneNumber || '');

  useEffect(() => {
    dispatch(getCurrentUserById());
  }, [dispatch]);

  useEffect(() => {
    handleButtonCliked();
  }, [isValid]);

  const navigateToChangeSecNumber = () => navigation('/change-second-number');

  // profile pictrue

  const deletePic = () => {
    setProfilePic(undefined);
    setProfilePicURL('DELETE_PROFILE_PIC');
  };

  const handleButtonCliked = () => {
    if (profilePicURL) {
      try {
        setIsloadingPic(true);
        dispatch(
          changeProfileImage(
            profilePicURL === 'DELETE_PROFILE_PIC' ? null : profilePicURL
          )
        ).then(() => {
          setIsloadingPic(false);
          setProfilePicURL('');
        });
      } catch (e) {
        setIsloadingPic(false);
      }
    }
  };

  const toggleIsOpen = React.useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const onChoosePic = async (picUrl: string, picFile?: File) => {
    setProfilePic(picUrl);
    if (picFile) {
      const imageFormData = new FormData();
      imageFormData.append('image', picFile, picFile.name);
      try {
        setIsUploading(true);
        const res = await uploadImage(imageFormData);
        setIsUploading(false);
        if (res.URL) setProfilePicURL(res.URL);
      } catch (e) {
        setIsUploading(false);
      }
    }
  };

  if (isLoading || isLoadingPic || isUploading) return <Loader />;

  if (user) {
    return (
      <Page>
        <SUserImgContainer onClick={() => setIsOpen(!isOpen)}>
          <SUserImg
            style={{ backgroundColor: 'black' }}
            src={
              user.photoUrl ? user.photoUrl : profilePic ? profilePic : userImg
            }
            alt=""
          />
          <SEditImage src={EditImg} alt="edit" />
        </SUserImgContainer>
        <STextContainer>
          <STextFieldEndPlacHolder
            className="wrapper"
            $content={
              user.displayName ? undefined : translate('optional-brackets')
            }
          >
            <STextField
              className="wrapper"
              type="text"
              readOnly
              defaultValue={user.displayName}
              placeholder={translate('groupInfoName')!}
            />
          </STextFieldEndPlacHolder>
          <STextField
            className="wrapper"
            type="text"
            readOnly
            defaultValue={user.title}
            placeholder={translate('groups_member_additionalInfo')!}
          />
          <STextField
            className="wrapper"
            type="text"
            readOnly
            defaultValue={user.email}
            placeholder={translate('groups_emailAddress')!}
          />
          <SLink to="/change_password" className="wrapper">
            {translate('●●●●●●●●●●●●')}
            <img src={EditImg} alt="edit" />
          </SLink>
          <SLinkContainer className="wrapper">
            <CountryCodeDropDown
              readMode
              onPressed={() => {}}
              onChange={() => {}}
              initiallValue={primaryPhoneNumber?.country}
            />
            <SLink $nonPointer $textFieldLink to="">
              {primaryPhoneNumber?.nationalNumber || t('registration_phone')}
            </SLink>
          </SLinkContainer>
          <SLinkContainer linkeMode className="wrapper">
            <CountryCodeDropDown
              onPressed={navigateToChangeSecNumber}
              onChange={() => {}}
              initiallValue={secondPhoneNumber?.country}
            />
            <SLink
              $placeHolder={!secondPhoneNumber?.nationalNumber}
              $textFieldLink
              to="/change-second-number"
            >
              {secondPhoneNumber?.nationalNumber || t('registration_phone')}
              <img src={EditImg} alt="edit" />
            </SLink>
          </SLinkContainer>
        </STextContainer>
        <ChoosePhotoBottomSheet
          isOpen={isOpen}
          toggleIsOpen={toggleIsOpen}
          onDeletePic={deletePic}
          didChoosePic={onChoosePic}
          choosedPic={!!profilePic || !!user?.photoUrl}
        />
      </Page>
    );
  } else {
    return <></>;
  }
};

const SUserImgContainer = styled.div`
  margin: 2rem auto 1.125rem;
  display: block;
  width: 7rem;
  height: 7rem;
  aspect-ratio: 1;

  border-radius: 9999px;

  position: relative;
  &:hover {
    cursor: pointer;
  }
`;

const SUserImg = styled.img`
  border-radius: 9999px;
  width: 7rem;
  height: 7rem;
  aspect-ratio: 1;
  box-shadow: ${(props) => props.theme.shadow.primary};
  object-fit: cover;
`;
const SEditImage = styled.img`
  position: absolute;
  bottom: 1px;
  right: 1px;
`;

const STextField = styled(TextField)`
  input {
    padding: 0 1rem;
    height: 3.125rem;
    color: ${palette.white};
    font-family: 'Roboto-Regular';
    ::placeholder {
      color: ${palette.darkElecticBlue};
    }
    :-ms-input-placeholder {
      color: ${palette.darkElecticBlue};
    }
    ::-ms-input-placeholder {
      color: ${palette.darkElecticBlue};
    }
  }
`;

const STextFieldEndPlacHolder = styled.div<{ $content?: string }>`
  height: 3.125rem;
  position: relative;
  &::after {
    content: '${(props) => props.$content}';
    position: absolute;
    right: 10px;
    top: 50%;
    font-size: 15px;
    transform: translateY(-50%);
    color: ${palette.darkElecticBlue};
  }
`;

const STextContainer = styled.div`
  display: flex;
  flex-direction: column;

  .wrapper + * {
    margin-top: 0.625rem;
  }
`;

const SLink = styled(Link)<{
  $textFieldLink?: boolean;
  $nonPointer?: boolean;
  $placeHolder?: boolean;
}>`
  position: relative;

  color: ${palette.white};

  font-family: 'Roboto-Regular';
  font-size: 0.9rem;

  display: flex;
  align-items: center;

  height: 3.125rem;
  width: 100%;
  padding: 0 1rem;
  background: ${palette.fadedDarkBlue};
  background-color: ${palette.fadedDarkBlue};
  border: 1px solid ${palette.siamiBlue};
  border-radius: 0.93rem;
  text-decoration: none;

  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;

  img {
    position: absolute;
    top: 50%;
    right: 1.3rem;
    transform: translateY(-50%);
  }

  ${(props) =>
    props.$textFieldLink &&
    css`
      border-radius: 0 0.93rem 0.93rem 0;
    `}
  ${(props) =>
    props.$nonPointer &&
    css`
      &:hover {
        cursor: auto;
      }
    `}
`;

const SLinkContainer = styled.div<{ linkeMode?: boolean }>`
  width: 100%;
  height: 3.125rem;
  display: flex;
  ${(props) =>
    props.linkeMode &&
    css`
      &:hover {
        cursor: pointer;
      }
    `}
`;
