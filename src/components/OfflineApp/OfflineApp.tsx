import * as React from 'react';
import styled from 'styled-components';
import { Layout } from '../Layout/Layout';
import { Page } from '../Page/Page';
import { ReactComponent as Sign } from '../../assets/imgs/UnAvailableState/warning-sign.svg';
import { translate } from '../../utils/translate';

export interface IUnAvailableAppProps {}

const SPage = styled(Page)`
  min-height: 100%;

  .center-container {
    margin-top: 8.5625rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .text-container {
    margin-top: 1.625rem;
    font-family: 'Roboto-Regular';

    h1 {
      font-weight: 500;
      font-size: 1.625rem;
      line-height: 30px;
    }
    p {
      margin-top: 0.75rem;
      font-weight: 500;
      font-size: 0.875rem;
      line-height: 136.34%;
    }
  }
`;

export const OfflineApp = (props: IUnAvailableAppProps) => {
  const {} = props;

  return (
    <Layout isAuthLayout={false}>
      <SPage>
        <div className="center-container">
          <Sign />
          <div className="text-container">
            <h1>{translate('offline_text')}</h1>
            <p>{translate('connect_network_text')}</p>
          </div>
        </div>
      </SPage>
    </Layout>
  );
};
