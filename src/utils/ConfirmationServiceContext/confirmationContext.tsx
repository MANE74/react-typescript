import React, { Fragment } from 'react';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';

export interface ConfirmationOptions {
  title?: string;
  description?: string;
  catchOnCancel?: boolean;
  onSubmit?: (text?: string) => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  inputBox?: boolean;
  inputBoxIntialValue?: string;
  placeholderTx?: string;
  confirmStyle?: 'standard' | 'green' | 'red' | 'fit-big-text';
}

export const useConfirmation = () =>
  React.useContext(ConfirmationServiceContext);

const ConfirmationServiceContext = React.createContext<
  // we will pass the openning dialog function directly to consumers
  (options: ConfirmationOptions) => Promise<void>
>(Promise.reject);

export const ConfirmationServiceProvider: React.FunctionComponent = ({
  children,
}) => {
  const [confirmationState, setConfirmationState] =
    React.useState<ConfirmationOptions | null>(null);
  // const [open, setOpen] = React.useState<boolean>(false);
  //const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const awaitingPromiseRef = React.useRef<{
    resolve: () => void;
    reject: () => void;
  }>();

  const openConfirmation = (options: ConfirmationOptions) => {
    setConfirmationState(options);
    return new Promise<void>((resolve, reject) => {
      // save the promise result to the ref
      awaitingPromiseRef.current = { resolve, reject };
    });
  };

  const handleClose = () => {
    // Mostly always you don't need to handle canceling of alert dialog
    // So shutting up the unhandledPromiseRejection errors
    // if (confirmationState?.catchOnCancel && awaitingPromiseRef.current) {
    //   awaitingPromiseRef.current.reject();
    // }
    confirmationState?.onCancel && confirmationState.onCancel();
    setConfirmationState(null);
  };

  const dismiss = () => setConfirmationState(null);

  const handleSubmit = async (text?: string) => {
    // setIsLoading(true);

    // if (awaitingPromiseRef.current) {
    //   awaitingPromiseRef.current.resolve();
    // }
    // if we will activate the waiting loading
    // confirmationState?.onSubmit && (await confirmationState.onSubmit());
    confirmationState?.onSubmit && confirmationState.onSubmit(text);
    // setIsLoading(false);
    setConfirmationState(null);
  };
  return (
    <Fragment>
      <ConfirmationServiceContext.Provider
        value={openConfirmation}
        children={children}
      />
      <ConfirmDialog
        isOpen={Boolean(confirmationState)}
        onSubmit={confirmationState?.onSubmit && handleSubmit}
        onCancel={confirmationState?.onCancel && handleClose}
        dismiss={dismiss}
        title={confirmationState?.title!}
        description={confirmationState?.description}
        isLoading={false}
        confirmText={confirmationState?.confirmText}
        cancelText={confirmationState?.cancelText}
        inputBox={confirmationState?.inputBox}
        initialInputValue={confirmationState?.inputBoxIntialValue}
        placeholderTx={confirmationState?.placeholderTx}
        confirmStyle={confirmationState?.confirmStyle}
        // {...confirmationState}
      />
    </Fragment>
  );
};
