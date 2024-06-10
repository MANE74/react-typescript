import * as React from 'react';
import styled, { css } from 'styled-components';
import { palette } from '../../theme/colors';

import { SBoxCheckBox } from './SBoxCheckBox';
import { SCircleCheckBox } from './SRoundCheckBox';

import { ReactComponent as PlaceHolder } from '../../assets/imgs/iamokay/img-placeholder.svg';

interface SItemContainerProps {
  $disabled?: boolean;
  selected: boolean;
  $squareBox?: boolean;
  $withPhoto?: boolean;
  $withoutSeparator?: boolean;
  $clickAll?: boolean;
  $separatorColor?: string;
}

const SItemContainer = styled.li<SItemContainerProps>`
  display: flex;
  place-content: space-between;
  align-items: center;
  width: 100%;

  ${props =>
    props.$clickAll &&
    css`
      cursor: pointer;
    `}
  ${props =>
    !props.$withoutSeparator &&
    css`
      border-bottom: 1px solid ${props.$separatorColor || palette.queenBlue};
      padding: 0.75rem 0rem;
    `}
  ${props =>
    props.$squareBox &&
    css`
      padding: 1rem 0rem;
    `}

  ${props =>
    props.$squareBox &&
    !props.$withPhoto &&
    css`
      .STitle {
        margin-left: 0.815rem;
      }
    `}

  ${props =>
    props.$disabled &&
    css`
      p {
        color: ${palette.darkGrey};
      }
      .checkBorder {
        border: 1px solid ${palette.darkGrey};
      }
    `}

  p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const SImg = styled.img`
  width: 2.875rem;
  height: 2.875rem;
  aspect-ratio: 1;

  border-radius: 9999px;
`;
const SImgContainer = styled.div`
  width: 2.875rem;
  height: 2.875rem;
  aspect-ratio: 1;

  border-radius: 9999px;
  box-shadow: ${props => props.theme.shadow.primary};
  background-color: ${palette.nightSkyBlue};

  display: flex;
  align-items: center;
  justify-content: center;
`;

const SLeftTextContainer = styled.div<{ $withPhoto?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  max-width: 75%;
  ${props =>
    props.$withPhoto &&
    css`
      flex-grow: 1;
    `}
`;

const STitle = styled.p`
  color: ${palette.white};
  font-family: 'Roboto-Medium';
  font-weight: 500;
  font-size: 1rem;
  line-height: 1.18rem;
`;

const SSubTitle = styled.p`
  font-family: 'Roboto-Regular';
  font-size: 0.75rem;
  line-height: 0.875rem;
  color: ${palette.silver};
`;

export interface ICheckBoxWithSubTitleProps {
  selected: boolean;
  title: string;
  valueId: number;
  onToggleCheck: (valueId: number) => void;
  subTitle?: string;
  checkBoxType?: 'box' | 'circle';
  disabled?: boolean;
  className?: string | undefined;

  withPhoto?: boolean;
  photoUrl?: string;

  withoutSeparator?: boolean;
  separatorColor?: string;
  clickAll?: boolean;
}

export const CheckBoxWithSubTitle = (props: ICheckBoxWithSubTitleProps) => {
  const {
    onToggleCheck,
    selected,
    title,
    subTitle,
    valueId,
    checkBoxType = 'circle',
    disabled = false,
    className,
    withPhoto = false,
    withoutSeparator = false,
    clickAll = false,
    photoUrl,
    separatorColor,
  } = props;

  const handleClick = () => {
    onToggleCheck(valueId);
  };
  return (
    <SItemContainer
      selected={selected}
      $disabled={disabled}
      $squareBox={checkBoxType === 'box'}
      $withPhoto={withPhoto}
      $withoutSeparator={withoutSeparator}
      $clickAll={clickAll}
      $separatorColor={separatorColor}
      onClick={clickAll ? handleClick : undefined}
      className={className}
    >
      {withPhoto && (
        <>
          {photoUrl ? (
            <SImg className="SImg" src={photoUrl} alt={'photo'} />
          ) : (
            <SImgContainer className="SImgPlacHolderContainer">
              <PlaceHolder />
            </SImgContainer>
          )}
        </>
      )}
      <SLeftTextContainer $withPhoto={withPhoto}>
        <STitle className="STitle">{title}</STitle>
        {subTitle && <SSubTitle className="SSubTitle">{subTitle}</SSubTitle>}
      </SLeftTextContainer>
      {checkBoxType === 'box' ? (
        <SBoxCheckBox
          value={valueId}
          onChange={clickAll ? undefined : handleClick}
          readOnly={clickAll}
          checked={selected}
          id={valueId.toString()}
          disabled={disabled}
        />
      ) : (
        <SCircleCheckBox
          value={valueId}
          onChange={clickAll ? undefined : handleClick}
          readOnly={clickAll ? true : false}
          checked={selected}
          id={valueId.toString()}
          disabled={disabled}
        />
      )}
    </SItemContainer>
  );
};
