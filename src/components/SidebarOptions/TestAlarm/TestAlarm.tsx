import React from 'react';
import styled from 'styled-components';
import { SSection, SSidebarWrapper } from '../../../containers/Sidebar/Sidebar';
import { palette } from '../../../theme/colors';
import { useConfirmation } from '../../../utils/ConfirmationServiceContext/confirmationContext';
import { ActionButton } from '../../ActionButtons/ActionButtons.style';
import { Layout } from '../../Layout/Layout';

const Title = styled.p`
  font-family: 'Roboto-Bold';
  font-weight: 700;
  font-size: 18px;
  line-height: 21px;
`;

const Text = styled.p`
  font-family: 'Roboto-Regular';
  font-weight: 400;
  font-size: 18px;
  line-height: 21px;
`;

function TestAlarm() {
  const confirm = useConfirmation();

  const confirmLogout = () => {
    confirm({
      title: 'warning',
      description: 'alarm_test_description',
      onSubmit: () => {
        alert('text alarm is not available in web app');
      },
      onCancel: () => {},
      confirmText: 'alarm_test_trigger',
      cancelText: 'cancel',
    });
  };

  return (
    <Layout isMessageLayout message="alarm_test_screen">
      <SSidebarWrapper>
        <SSection>
          <Title>
            Test out the alarm, This alarm test only alerts your own device.
          </Title>
          <br />
          <Text>1. Press the “Test” button.</Text>
          <br />
          <Text>
            2. Close the app (do not log out) if you want to receive the loud
          </Text>
          <br />
          <Text>
            3. Wait 15 seconds for the alarm to be sent to your own device.
          </Text>
          <div style={{ flex: 1 }} />
          <ActionButton
            type="button"
            tx="alarm_test_button"
            size="medium"
            marginVertical="medium"
            onClick={confirmLogout}
            style={{
              color: palette.white,
              backgroundColor: palette.appleGreeen,
            }}
          />
        </SSection>
      </SSidebarWrapper>
    </Layout>
  );
}

export default TestAlarm;
