import React, { SyntheticEvent } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { palette } from '../../theme/colors';
import { ProfilePicture } from '../ProfilePicture/ProfilePicture';
import SCheckbox from './SBoxButton';
import SRadio from './SRoundButton';

export interface FilterItemProps {
  checked: boolean;
  name: string | undefined;
  setSelected: (e: SyntheticEvent) => void;
  id: number;
  type: 'box' | 'circle';
  image?: string | null;
  hasImage?: boolean;
  isGroupImg?: boolean;
  style?: React.CSSProperties;
  className?: string | undefined;
}

const SItemContainer = styled.li`
  display: flex;
  place-content: space-between;

  margin-top: 21px;
  :first-child {
    margin-top: 0;
  }
`;

const SLeft = styled.div`
  display: inline-flex;
  align-items: center;
`;

const SItem = styled.div`
  font-family: 'Roboto-Regular';
  font-weight: 400;
  font-size: 14px;
  line-height: 25px;
  color: ${palette.white};
`;

function FilterCheckboxItem(props: FilterItemProps) {
  var {
    name,
    setSelected,
    checked,
    id,
    type,
    hasImage,
    image,
    isGroupImg,
    style,
    className,
  } = props;

  const { t } = useTranslation();
  const buttonText = t(`${name}`);

  return (
    <SItemContainer className={className} style={style} onClick={setSelected}>
      <SLeft>
        {hasImage && (
          <ProfilePicture
            diameter={55}
            profilePictureFileName={image!}
            isGroup={isGroupImg}
            style={{ marginRight: '1rem' }}
          />
        )}
        <SItem>{buttonText}</SItem>
      </SLeft>

      {type === 'box' ? (
        <SCheckbox isChecked={checked} />
      ) : (
        <SRadio isChecked={checked} />
      )}
    </SItemContainer>
  );
}

export default FilterCheckboxItem;
