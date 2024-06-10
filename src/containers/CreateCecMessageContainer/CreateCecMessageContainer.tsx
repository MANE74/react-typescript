import * as React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { Page } from '../../components/Page/Page';
import { useLayoutContext } from '../../utils/customHooks/LayoutContext';
import { CreateCecMessage } from '../CreateCecMessage/CreateCecMessage';
import { CreateCecMessageOptions } from '../CreateCecMessage/CreateCecMessageOptions';
import { CreateCecMessageSummary } from '../CreateCecMessage/CreateCecMessageSummary';
import {
  CreateCecMessageCtxProvider,
  useCreateCecMessageCtx,
} from './CreateCecMessageContext';

const SPage = styled(Page)<{ $chatInput?: boolean; $isOptions?: boolean }>`
  padding: 1.375rem 0 1.375rem 0;
  /* to make only the list overflow */
  position: relative;
  ${props =>
    props.$chatInput &&
    css`
      min-height: calc(100vh - 4.81rem);
    `}
  ${props =>
    props.$isOptions &&
    css`
      padding: 0 0 1.375rem 0;
    `}
  height: 100%;
  /* min-height: 100; */
`;

export interface ICreateCecMessageContainerProps {}

export const CreateCecMessageContainer = (
  props: ICreateCecMessageContainerProps
) => {
  const [isChatInput, setIsChatInput] = React.useState<boolean>(false);
  const [isOptionsPage, setIsOptionsPage] = React.useState<boolean>(false);

  const { pathname } = useLocation();
  const { setTabsState, toggleTabBarVisibility } = useLayoutContext();

  React.useEffect(() => {
    if (pathname === '/createCecMessage/summary') {
      toggleTabBarVisibility();
      setIsChatInput(true);
    } else {
      setTabsState(true);
      setIsChatInput(false);
    }
    if (pathname === '/createCecMessage/options') {
      setIsOptionsPage(true);
    } else {
      setIsOptionsPage(false);
    }
  }, [pathname]);

  return (
    <SPage $chatInput={isChatInput} $isOptions={isOptionsPage}>
      <CreateCecMessageCtxProvider>
        <Routes>
          <Route path="/" element={<CreateCecMessage />} />
          <Route path="options" element={<CreateCecMessageOptions />} />
          <Route path="summary" element={<CreateCecMessageSummary />} />
        </Routes>
      </CreateCecMessageCtxProvider>
    </SPage>
  );
};
