import React, { useEffect } from 'react';
import styled, { css } from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { palette } from '../../theme/colors';
import { selectIsInternalSupportLoading, selectSupports } from './supportSlice';
import { getSupports } from './supportSlice/actionCreators';
import { Page } from '../../components/Page/Page';
import Loader from '../../components/Loader/Loader';
import { useConfirmation } from '../../utils/ConfirmationServiceContext/confirmationContext';

export const InternalSupport = () => {
  const dispatch = useAppDispatch();
  const confirm = useConfirmation();

  const supports = useAppSelector(selectSupports);
  const isLoading = useAppSelector(selectIsInternalSupportLoading);

  const handleError = (error: any) => {
    confirm({
      title: 'warning',
      description: 'general_network_error',
      onSubmit: () => {
        dispatch(getSupports(handleError));
      },
      confirmText: 'retry',
    });
  };

  useEffect(() => {
    dispatch(getSupports(handleError));
  }, [dispatch]);

  if (isLoading) return <Loader />;

  return (
    <SPage>
      <SInternalSupport>
        {supports &&
          supports?.map((item) => (
            <SContactCard key={`${item.id}`}>
              <span>{item.name}</span>
              <p>{item.supportPersonName}</p>
              {item.supportPhoneNumber && (
                <a href={`tel:${item.supportPhoneNumber}`}>
                  {item.supportPhoneNumber}
                </a>
              )}
              {item.supportEmail && (
                <a href={`mailto:${item.supportEmail}`}>{item.supportEmail}</a>
              )}
            </SContactCard>
          ))}
      </SInternalSupport>
    </SPage>
  );
};

const SPage = styled(Page)`
  padding 0 1.25rem;
`;

const SInternalSupport = styled.div`
  display: flex;
  flex-direction: column;
  * + * {
    margin-top: 10px;
  }
  height: 100%;

  padding: 1rem 0;

  /* vertical scrolling + hide scroller bar  */
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const longTextDefense = css`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const SContactCard = styled.div`
  display: flex;
  flex-direction: column;
  * + * {
    padding-top: 0.5rem;
  }
  padding: 0.8rem;
  width: 100%;

  background-color: ${palette.prussianBlue3};
  border: 1px solid ${palette.queenBlue};
  border-radius: 10px;
  font-family: 'Roboto-Regular';
  color: ${palette.white};

  p {
    font-weight: 400;
    text-transform: capitalize;
    ${longTextDefense}
  }

  a {
    display: block;
    text-decoration: none;
    color: ${palette.white};
    :hover {
      color: ${palette.wildBlue};
    }
    ${longTextDefense}
  }
  span {
    font-family: 'Roboto-Bold';
    display: inline-block;
    margin-bottom: 0.3rem;
    font-weight: 700;
    ${longTextDefense}
  }
`;
