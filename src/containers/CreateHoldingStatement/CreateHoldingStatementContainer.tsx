import * as React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { Page } from '../../components/Page/Page';
import { useLayoutContext } from '../../utils/customHooks/LayoutContext';
import { CreateCecMessage } from '../CreateCecMessage/CreateCecMessage';
import { CreateCecMessageOptions } from '../CreateCecMessage/CreateCecMessageOptions';
import { CreateCecMessageSummary } from '../CreateCecMessage/CreateCecMessageSummary';
import { CreateHoldingStatement } from './CreateHoldingStatement';
import { CreateHoldingStatementCtxProvider } from './CreateHoldingStatementContext';
import { CreateHoldingStatmentSummary } from './CreateHoldingStatmentSummary';

const SPage = styled(Page)<{ $chatInput?: boolean }>`
  padding: 1.25rem 0 0 0;
  /* to make only the list overflow */
  position: relative;
  ${props =>
    props.$chatInput &&
    css`
      min-height: calc(100vh - 4.81rem);
    `}
  height: 100%;
`;

export const CreateHoldingStatementContainer = () => {
  const [isChatInput, setIsChatInput] = React.useState<boolean>(false);

  const { pathname } = useLocation();
  const { setTabsState, toggleTabBarVisibility } = useLayoutContext();

  React.useEffect(() => {
    if (pathname === '/createHoldingStatement/summary') {
      toggleTabBarVisibility();
      setIsChatInput(true);
    } else {
      setTabsState(true);
      setIsChatInput(false);
    }
  }, [pathname]);

  return (
    <SPage $chatInput={isChatInput}>
      <CreateHoldingStatementCtxProvider>
        <Routes>
          <Route path="/" element={<CreateHoldingStatement />} />
          <Route path="summary" element={<CreateHoldingStatmentSummary />} />
        </Routes>
      </CreateHoldingStatementCtxProvider>
    </SPage>
  );
};
