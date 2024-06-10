import * as React from 'react';
import styled, { css } from 'styled-components';
import { ExternalContactTextTemplate } from '../../../apis/externalContacts/types';
import { palette } from '../../../theme/colors';
import { useLayoutContext } from '../../../utils/customHooks/LayoutContext';
import { useSelectlist } from '../../../utils/customHooks/useSelectList';
import { translate } from '../../../utils/translate';
import { Backdrop } from '../../Backdrop/Backdrop';
import FilterCheckboxItem from '../../FilterItem/FilterCheckboxItem';
import { SFilter, SHeader } from '../../FilterOrSelectBottomSheet/styles';

export const SDrawerWrapper = styled.div`
  .profileDrawer {
    left: 0;
    right: 0;
    margin: auto;
    z-index: 1001;

    @media (min-width: 450px) {
      max-width: 26rem;
      margin: auto;
    }
    background-color: ${palette.prussianBlue2};
    max-height: 80vh;
  }
  .profileDrawer__backdrop {
    z-index: 1000;
  }
  .profileDrawer__handle-wrapper {
    padding-top: 1.25rem;
  }
  .profileDrawer__handle {
    width: 36%;
  }
  .profileDrawer__content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    padding: 1.875rem 1.25rem;
  }
`;

const SList = styled.ul<{ isOpen?: boolean }>`
  margin-top: 2.56rem;
  overflow-y: auto;
  @supports (-webkit-touch-callout: none) {
    overflow-x: hidden;
  }
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

export const SBottomLine = styled.div`
  border-radius: 5;

  background: ${palette.dustyGray};
  height: 5px;
  min-height: 5px;
  max-height: 5px;
  width: 40%;
  border-radius: 5px;

  margin: 1.375rem auto 0 auto;
  opacity: 0.4;
`;

const STitle = styled.p`
  color: ${palette.white};
  font-family: 'Roboto-Medium';
  font-weight: 500;
  font-size: 1rem;
  line-height: 1.18rem;
`;

const SFilterCheckboxItem = styled(FilterCheckboxItem)`
  margin-top: 2.56rem;
  margin-left: 2px;
`;

export interface ICecTextTemplatesBottomSheetProps {
  isOpen: boolean;
  toggleIsOpen: () => void;
  textTemplates: ExternalContactTextTemplate[];
  onSelectTemplate: (templateId: 'CUSTOM' | number) => void;
}

export const CecTextTemplatesBottomSheet = (
  props: ICecTextTemplatesBottomSheetProps
) => {
  const { isOpen, toggleIsOpen, textTemplates, onSelectTemplate } = props;

  const [selectedValue, setSelectedValue] = React.useState<'CUSTOM' | number>(
    'CUSTOM'
  );

  const onItemPressed = (valueId: 'CUSTOM' | number) => () => {
    setSelectedValue(valueId);
    onSelectTemplate(valueId);
  };

  const layout = useLayoutContext();

  let isInit = true;

  React.useLayoutEffect(() => {
    if (!isInit) {
      layout.setTabsState(!isOpen);
    }
    isInit = false;
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <>
          <SFilter>
            <SHeader>
              <rect width="400" height="100" fill={palette.silver} />
            </SHeader>
            <STitle>{translate('messages_choose_message_text')}:</STitle>
            <SList isOpen={isOpen}>
              <SFilterCheckboxItem
                checked={selectedValue === 'CUSTOM'}
                name={translate('messages_custom')!}
                setSelected={onItemPressed('CUSTOM')}
                id={0}
                type={'circle'}
              />
              {/* [TODO] generic rquired here  */}
              {textTemplates.map((template, index) => (
                <SFilterCheckboxItem
                  checked={selectedValue === template.id}
                  name={template.name}
                  setSelected={onItemPressed(template.id)}
                  key={`${template.id}-${index}`}
                  id={template.id}
                  type={'circle'}
                />
              ))}
            </SList>
            <SBottomLine />
          </SFilter>
          <Backdrop setModal={toggleIsOpen} />
        </>
      )}
    </>
  );
};
