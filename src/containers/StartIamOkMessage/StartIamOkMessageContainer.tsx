import * as React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { Page } from '../../components/Page/Page';
import { useLayoutContext } from '../../utils/customHooks/LayoutContext';
import { StartIamOkMessage } from './StartIamOkMessage';
import { StartIamOkMessageCtxProvider } from './StartIamOkMessageContext';
import { StartIamOkMessageSummary } from './StartIamOkMessageSummary';

const SPage = styled(Page)<{ $chatInput?: boolean }>`
  padding: 1.375rem 0 1.375rem 0;
  /* to make only the list overflow */
  position: relative;
  ${props =>
    props.$chatInput &&
    css`
      min-height: calc(100vh - 4.81rem);
    `}
  height: 100%;
`;

export const StartIamOkMessageContainer = () => {
  const [isChatInput, setIsChatInput] = React.useState<boolean>(false);

  const { pathname } = useLocation();
  const { setTabsState } = useLayoutContext();

  React.useEffect(() => {
    if (pathname === '/startIamOk/summary') {
      setTabsState(false);
      setIsChatInput(true);
    } else {
      setTabsState(true);
      setIsChatInput(false);
    }
  }, [pathname]);

  return (
    <SPage $chatInput={isChatInput}>
      <StartIamOkMessageCtxProvider>
        <Routes>
          <Route path="/" element={<StartIamOkMessage />} />
          <Route path="summary" element={<StartIamOkMessageSummary />} />
        </Routes>
      </StartIamOkMessageCtxProvider>
    </SPage>
  );
};
