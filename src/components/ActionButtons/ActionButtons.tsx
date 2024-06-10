import * as React from 'react';
import { ActionButton } from './ActionButtons.style';

export interface UserAction {
  fireAction: () => void;
  label: string;
  style?: React.CSSProperties;
}
interface IActionButtonsProps {
  actions: UserAction[];
}

const ActionButtons = (props: IActionButtonsProps) => {
  const { actions } = props;
  return (
    <>
      {actions.map(action => (
        <ActionButton
          type="button"
          tx={action.label}
          margin="2rem"
          key={action.label}
          style={action.style}
          onClick={action.fireAction}
        />
      ))}
    </>
  );
};

export default ActionButtons;
