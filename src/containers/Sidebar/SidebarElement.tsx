import React from 'react';
import styled from 'styled-components';
import { palette } from '../../theme/colors';
import { SidebarSection } from './Sidebar';
import Arrow from '../../assets/imgs/navigation/arrow.svg';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function SidebarElement(props: SidebarSection) {
  const { name, icon, to, onClick, style } = props;
  const { t } = useTranslation();

  const nameTx = t(`${name}`);
  if (to) {
    return (
      <STab as={Link} to={to} style={style}>
        <SRowContainers>
          <SIcon className="icon" src={icon} alt="" />
          {nameTx}
        </SRowContainers>
        <SIcon className="arrow" src={Arrow} alt="" />
      </STab>
    );
  } else {
    return (
      <STab onClick={onClick} style={style}>
        <SRowContainers>
          <SIcon className="icon" src={icon} alt="" />
          {nameTx}
        </SRowContainers>
        <SIcon className="arrow" src={Arrow} alt="" />
      </STab>
    );
  }
}

export default SidebarElement;

export const STab = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  background-color: ${palette.prussianBlue};
  border: 1px solid ${palette.queenBlue};
  border-radius: 10px;
  padding: 1.25rem 1.5rem;
  width: 100%;
  text-decoration: none;

  box-shadow: 6px 20px 20px ${palette.davysGrey1};
  backdrop-filter: blur(21.7463px);

  p {
    flex-grow: 1;
    margin: 0rem 1rem;
    font-family: 'Roboto-Regular';
    font-size: 1rem;
    line-height: 1.18rem;

    color: ${palette.white};
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
`;

export const SRowContainers = styled.div`
  color: ${palette.white};
  display: flex;
  align-items: center;
`;

export const SIcon = styled.img`
  vertical-align: text-bottom;
  &.icon {
    width: 1.2rem;
    margin-right: 17px;
  }
  &.arrow {
    margin: 0;
  }
`;
