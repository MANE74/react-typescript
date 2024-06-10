import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { CheckBoxWithSubTitle } from '../../components/CheckBoxWithSubTitle/CheckBoxWithSubTitle';
import { useSelectlist } from '../../utils/customHooks/useSelectList';
import { translate } from '../../utils/translate';
import { useCreateCecMessageCtx } from '../CreateCecMessageContainer/CreateCecMessageContext';
import {
  CecMessageSendingMethod,
  CecMessageSendMethods,
  checkVoiceMailDisable,
} from './helpers';
import { SList, SProceedButton } from './styles';

const SCheckBoxWithSubTitle = styled(CheckBoxWithSubTitle)`
  .STitle {
    font-family: 'Roboto-Regular';
  }
`;
export interface ICreateCecMessageOptionsProps {}

export const CreateCecMessageOptions = (
  props: ICreateCecMessageOptionsProps
) => {
  const {} = props;

  const navigation = useNavigate();

  const { setSendMethods, sendMethods } = useCreateCecMessageCtx();

  const initiallSendingMethods = React.useMemo(() => new Set(sendMethods), []);

  const { handleSelect, selectedItems } = useSelectlist({
    data: CecMessageSendMethods,
    initialSelected: initiallSendingMethods,
    options: { key: 'valueId' },
  });

  const canProceed = selectedItems.size !== 0;

  const handleProceed = () => {
    setSendMethods([...selectedItems]);
    navigation('/createCecMessage/summary');
  };

  React.useEffect(() => {
    if (
      selectedItems.has(CecMessageSendingMethod.voicemail) &&
      selectedItems.size === 1
    ) {
      handleSelect(CecMessageSendingMethod.voicemail);
    }
  }, [selectedItems.size]);

  return (
    <>
      <SList>
        {CecMessageSendMethods.map((method, index) => (
          <SCheckBoxWithSubTitle
            selected={selectedItems.has(method.valueId)}
            title={translate(method.tx)!}
            valueId={method.valueId}
            key={`${method.valueId}-${index}`}
            checkBoxType={'box'}
            onToggleCheck={handleSelect}
            disabled={
              method.valueId === CecMessageSendingMethod.voicemail
                ? checkVoiceMailDisable(selectedItems)
                : false
            }
          />
        ))}
      </SList>
      {canProceed && <SProceedButton tx="proceed" onClick={handleProceed} />}
    </>
  );
};
