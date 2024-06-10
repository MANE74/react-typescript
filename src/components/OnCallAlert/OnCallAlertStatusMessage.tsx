import React from 'react';
import { translate } from '../../utils/translate';
import { OnCallAlertEnded } from './OnCallAlert.styles';

const OnCallAlertStatusMessage = React.forwardRef<HTMLDivElement>(
  (props, ref) => {
    return (
      <OnCallAlertEnded ref={ref}>
        {translate('onCallAlert_ended')}
      </OnCallAlertEnded>
    );
  }
);

export default OnCallAlertStatusMessage;
