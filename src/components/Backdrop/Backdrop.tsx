import styled from 'styled-components';
import { palette } from '../../theme/colors';

const SBackdrop = styled.div`
  background-color: ${palette.backDrop};
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 998;
  left: 0;
  top: 0;
`;

interface BackdropProps {
  setModal:
    | React.Dispatch<React.SetStateAction<boolean>>
    | ((isOpen: boolean) => void);
  className?: string | undefined;
  onClick?: () => void;
}

export const Backdrop = ({ setModal, className, onClick }: BackdropProps) => {
  return (
    <SBackdrop
      className={className}
      onClick={() => {
        onClick && onClick();
        setModal(false);
      }}
    />
  );
};
