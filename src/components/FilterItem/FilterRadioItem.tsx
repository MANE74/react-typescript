import React, { SyntheticEvent } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { palette } from '../../theme/colors';
import SRadio from './SRoundButton';

export interface FilterItemProps {
  checked: boolean;
  name: string | undefined;
  setSelected: (e: SyntheticEvent) => void;
  id: number;
}

const SItemContainer = styled.li`
  display: flex;
  place-content: space-between;

  margin-top: 21px;
  :first-child {
    margin-top: 0;
  }
`;

const SItem = styled.div`
  font-family: 'Roboto-Regular';
  font-weight: 400;
  font-size: 14px;
  line-height: 25px;
  color: ${palette.white};
`;

function FilterRadioItem(props: FilterItemProps) {
  var { name, setSelected, checked, id } = props;

  const { t } = useTranslation();
  const buttonText = t(`${name}`);

  return (
    <SItemContainer onClick={setSelected}>
      <SItem>{buttonText}</SItem>
      <SRadio isChecked={checked} />
    </SItemContainer>
  );
}

export default FilterRadioItem;
