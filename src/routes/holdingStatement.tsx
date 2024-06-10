import styled from 'styled-components';
import { Layout } from '../components/Layout/Layout';
import { HoldingStatement } from '../containers/HoldingStatement/HoldingStatement';

const SLayout = styled(Layout)`
  overflow-y: auto;
`;

export const HoldingStatementPage = () => {
  return (
    <SLayout
      isMessageLayout
      to="/dashboard"
      message={'home_holdingStatement'}
      showBottomTabs
    >
      <HoldingStatement />
    </SLayout>
  );
};
