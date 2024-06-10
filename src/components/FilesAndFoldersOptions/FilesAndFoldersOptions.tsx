import * as React from 'react';
import { translate } from '../../utils/translate';

import Options, { OptionProps } from '../Options/Options';
import {
  SInfoContainer,
  SLine,
  SOptions,
  SRow,
  SSharedContainer,
} from './FilesAndFoldersOptions.styles';

export interface FilesAndFoldersOptionsInfo {
  title: string;
  size: string;
  type: string;
  creator: string;
  created: string;
  insideCount?: number;
  sharedWith: string[];
}

export interface IFilesAndFoldersOptionsProps
  extends Omit<OptionProps, 'renderInfo'> {
  info: FilesAndFoldersOptionsInfo;
}

export const FilesAndFoldersOptions = (props: IFilesAndFoldersOptionsProps) => {
  const {
    isOpen,
    items,
    setIsOpen,
    setTabBar,
    info,

    ...rest
  } = props;
  const { created, creator, sharedWith, size, title, type, insideCount } = info;

  // renders
  const renderInfo = () => (
    <SInfoContainer>
      <p className="STitle"> {title}</p>

      <SRow>
        <p className="SSubTitle">{translate('documents_size')}:</p>
        <p className="SSubTitleValue">{size}</p>
      </SRow>
      <SRow>
        <p className="SSubTitle">{translate('messages_replyTo')}</p>
        <p className="SSubTitleValue">{type}</p>
      </SRow>
      {creator && (
        <SRow>
          <p className="SSubTitle">{translate('modal_creator')}</p>
          <p className="SSubTitleValue">{creator}</p>
        </SRow>
      )}
      {created && (
        <SRow>
          <p className="SSubTitle">{translate('modal_created')}</p>
          <p className="SSubTitleValue">{created}</p>
        </SRow>
      )}
      {insideCount !== undefined && (
        <SRow>
          <p className="SSubTitle">{translate('documents_document_count')}:</p>
          <p className="SSubTitleValue">{insideCount}</p>
        </SRow>
      )}
      <SLine />
      <SRow $scroll>
        <p className="SSubTitle">{translate('modal_shared_with')}</p>
        <SSharedContainer>
          {sharedWith.map((item, index) => (
            <p key={`${item}-${index}`} className="SSubTitleValue SharedItem">
              {item},{' '}
            </p>
          ))}
        </SSharedContainer>
      </SRow>
    </SInfoContainer>
  );

  return (
    <SOptions
      renderInfo={renderInfo}
      items={items}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      setTabBar={setTabBar}
      {...rest}
    />
  );
};
