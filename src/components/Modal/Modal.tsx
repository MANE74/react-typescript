//TODO: View the document in here after you finish the component
import styled from 'styled-components';
import { palette } from '../../theme/colors';
import { Backdrop } from './Backdrop/Backdrop';

const SModal = styled.div`
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  max-height: 100vh;
  max-width: 60vw;
  min-width: 21rem;
  z-index: 999;
`;

interface ModalProps {
  isOpen: boolean;
  setIsOpen:
    | React.Dispatch<React.SetStateAction<boolean>>
    | ((arg0: boolean) => void);
  children: React.ReactNode;
}
export const Modal = (props: ModalProps) => {
  const { isOpen, children, setIsOpen } = props;
  return (
    <>
      {isOpen && (
        <>
          <SModal>{children}</SModal>
          <Backdrop setModal={setIsOpen} />
        </>
      )}
    </>
  );
};
