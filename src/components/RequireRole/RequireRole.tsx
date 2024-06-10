import * as React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useConfirmation } from '../../utils/ConfirmationServiceContext/confirmationContext';
export interface IRequireRoleProps {
  children: JSX.Element;
  roleCondition: boolean;
  backTo: string;
}

export const RequireRole = (props: IRequireRoleProps) => {
  const { children, roleCondition, backTo } = props;
  const navigate = useNavigate();
  const confirm = useConfirmation();

  React.useLayoutEffect(() => {
    if (!roleCondition) {
      confirm({
        title: 'warning',
        description: 'not_allowed_to',
        onCancel: () => {
          navigate(backTo);
        },
        cancelText: 'ok',
      });
    }
  }, []);

  if (!roleCondition) {
    return <></>;
  }
  return <>{children}</>;
};
