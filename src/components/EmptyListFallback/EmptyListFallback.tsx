import * as React from 'react';
import styled from 'styled-components';
import { translate } from '../../utils/translate';

export const NoMessagesWrapper = styled.div`
  text-align: center;
  margin-top: 6rem;
  p {
    font-family: 'Roboto-Medium';
    font-size: 1rem;
    margin-top: 1rem;
  }
`;

export interface IEmptyListFallbackProps {
  src: string;
  listLength: number;
  isLoading: boolean;
  searchTerm: string | undefined;
  emptyListTx: string;
  noSearchTx: string;
  className?: string | undefined;
}

export const EmptyListFallback = (props: IEmptyListFallbackProps) => {
  const {
    emptyListTx,
    isLoading,
    listLength,
    noSearchTx,
    searchTerm,
    src,
    className,
  } = props;
  return (
    <>
      {listLength === 0 && !isLoading && (
        <NoMessagesWrapper className={className}>
          <img src={src} alt="" />
          <p>
            {translate(searchTerm ? noSearchTx : emptyListTx)}
            {searchTerm && ' ' + searchTerm}
          </p>
        </NoMessagesWrapper>
      )}
    </>
  );
};
