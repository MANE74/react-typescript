import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { palette } from '../../../theme/colors';
import { SettingsSection } from './Settings';

const SOption = styled.div`
  display: flex;
  place-content: space-between;
}
p{
  font-family: 'Roboto-Regular';
  font-weight: 400;
  font-size: 18px;
  line-height: 21px;
  place-self:center;
}
`;

const SLine = styled.svg`
  width: 384px;
  height: 1px;
  place-self: center;
  margin: 15px 0;
  border-radius: 49px;
`;

const Switch = styled.label`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  input:checked + span:before {
    transform: translateX(26px);
    background-color: ${palette.honeyYellow};
  }

  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #34415a;
    border-radius: 34px;

    &:before {
      position: absolute;
      content: '';
      height: 26px;
      width: 26px;
      left: 4px;
      bottom: 4px;
      background-color: ${palette.white};
      border-radius: 50%;
    }
  }
`;

function SettingsItem(props: SettingsSection) {
  const { name, id, checked, callback, visable } = props;
  const { t } = useTranslation();
  const nameTx = t(`${name}`);

  if (!visable) return <></>;

  return (
    <>
      {id !== 0 && (
        <SLine>
          <rect width="400" height="100" fill={palette.queenBlue} />
        </SLine>
      )}
      <SOption>
        <p>{nameTx}</p>
        <Switch>
          <input
            type="checkbox"
            value={name}
            checked={checked}
            onChange={() => {
              callback(checked);
            }}
            id={id.toString()}
          />
          <span />
        </Switch>
      </SOption>
    </>
  );
}

export default SettingsItem;
