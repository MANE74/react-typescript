import React from 'react';
import { translate } from '../../utils/translate';
import { ImOkEnded } from './ImOk.styles';

const ImOkStatusMessage = React.forwardRef<HTMLDivElement>((props, ref) => {
  return <ImOkEnded ref={ref}>{translate('imOk_ended')}</ImOkEnded>;
});

export default ImOkStatusMessage;
