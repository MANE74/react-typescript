import styled from 'styled-components';

const SBackdrop = styled.div`
  //TODO: replace rgba static color after polished
  background-color: rgba(0, 0, 0, 0.5);
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 99;
  left: 0;
  top: 0;
`;

interface BackdropProps {
  setModal:
    | React.Dispatch<React.SetStateAction<boolean>>
    | ((arg0: boolean) => void);
}

export const Backdrop = ({ setModal }: BackdropProps) => {
  return <SBackdrop onClick={() => setModal(false)} />;
};
