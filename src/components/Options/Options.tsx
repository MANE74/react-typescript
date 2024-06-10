import React, { ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { palette } from '../../theme/colors';
import { useLayoutContext } from '../../utils/customHooks/LayoutContext';
import { Backdrop } from '../Backdrop/Backdrop';

export interface OptionItemProps {
  id?: number;
  name?: string | number;
  icon?: string;
  callback?: () => void;
}

export interface OptionProps {
  items: OptionItemProps[];
  isOpen: boolean;
  setIsOpen:
    | React.Dispatch<React.SetStateAction<boolean>>
    | ((isOpen: boolean) => void);
  setTabBar?: boolean;
  setChatBar?: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string | undefined;
  renderInfo?: () => ReactNode;
  withoutOptions?: boolean;
}

const Options = (props: OptionProps) => {
  const {
    isOpen,
    setIsOpen,
    items,
    setTabBar,
    setChatBar,
    className,
    renderInfo,
    withoutOptions = false,
  } = props;

  const layout = useLayoutContext();

  useEffect(() => {
    if (setTabBar) layout.setTabsState(!isOpen);
    if (setChatBar) setChatBar(!isOpen);
  }, [isOpen, setTabBar]);

  const handleCancel = () => {
    setIsOpen(false);
  };

  const { t } = useTranslation();

  if (!isOpen) return <></>;

  return (
    <>
      <SOptions className={className}>
        {renderInfo && renderInfo()}
        {!withoutOptions && (
          <SOptionsList className="SOptionsList">
            {items.map((item, key) => (
              <SOption onClick={item.callback} key={key}>
                <p>{t(`${item.name}`)}</p>{' '}
                <img id={`options_item_${item.name}`} src={item.icon} alt="" />
              </SOption>
            ))}
          </SOptionsList>
        )}
        <SCancel onClick={handleCancel} className="cancel">
          <p>{t(`cancel`)}</p>
        </SCancel>
      </SOptions>
      <Backdrop setModal={setIsOpen} />
    </>
  );
};

export default Options;

const SOptions = styled.div`
  padding: 0 1rem;
  position: fixed;
  left: 50%;
  bottom: 0;
  transform: translate(-50%);
  max-height: 75vh;
  max-width: 26rem;
  width: 100%;
  z-index: 999;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const SOptionsList = styled.div`
  background-color: ${palette.prussianBlue2};
  border-radius: 14px;
  margin-bottom: 0.5rem;
`;

const SButton = styled.button`
  display: flex;
  place-content: space-between;
  justify-content: center;
  align-items: center;
  border: none;
  cursor: pointer;
  background-color: ${palette.prussianBlue2};
  border-radius: 14px;

  label {
    cursor: pointer;
    display: flex;
    width: 100%;
    justify-content: space-between;
  }

  p {
    font-size: 16px;
  }

  :focus-visible {
    outline: none;
  }
`;

interface SButtonProps {
  center?: boolean;
}
const SOption = styled(SButton)<SButtonProps>`
  padding: 1rem 1.5rem 1rem 2.2rem;
  margin: 0.25rem 0;
  display: flex;
  width: 100%;
  justify-content: ${(props) => (props.center ? 'center' : 'space-between')};

  p {
    font-family: 'Roboto-Regular';
    font-weight: 400;
    line-height: 24px;
    color: ${palette.white};
  }

  img {
    width: 20px;
  }
`;

export const SCancel = styled(SButton)`
  margin-bottom: 2rem;

  min-height: 57px;

  p {
    font-weight: 600;
    color: ${palette.honeyYellow};
  }
`;
