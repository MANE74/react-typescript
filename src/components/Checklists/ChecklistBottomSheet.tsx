import React, { useEffect, useState } from 'react';
import Drawer from 'react-bottom-drawer';
import styled from 'styled-components';
import { ChecklistItem } from '../../containers/Checklists/checklistsSlice/types';
import { palette } from '../../theme/colors';
import { translate } from '../../utils/translate';
import { SDrawerWrapper } from '../cec/CecTextTemplatesBottomSheet/CecTextTemplatesBottomSheet';
import { ReactComponent as Add } from '../../assets/imgs/checklists/add.svg';
import { useAppDispatch } from '../../hooks';
import { sendComment } from '../../containers/Checklists/checklistsSlice/actionCreators';
import ChecklistInput from './ChecklistInput';
import ChecklistComment from './ChecklistComment';
import { ChecklistStatus } from '../../utils/enums';

export interface ChecklistBottomSheetProps {
  isOpen: boolean;
  toggleIsOpen: () => void;
  selectedItem: ChecklistItem;
  status: ChecklistStatus;
}

export const ChecklistBottomSheet = (props: ChecklistBottomSheetProps) => {
  const { isOpen, toggleIsOpen, selectedItem, status } = props;

  const dispatch = useAppDispatch();

  const [chatBoxOpen, setChatBoxOpen] = useState(false);

  useEffect(() => {
    setChatBoxOpen(false);
  }, [isOpen]);

  const handleClickAddComment = () => {
    setChatBoxOpen(!chatBoxOpen);
  };

  const addComment = (textMessage: string, photoFile?: string) => {
    const model = {
      text: textMessage,
      imageFileName: photoFile || null,
    };
    dispatch(sendComment(selectedItem.checklistID, selectedItem.id, model));
  };

  return (
    <SDrawerWrapper>
      <Drawer
        className="profileDrawer"
        isVisible={isOpen}
        onClose={toggleIsOpen}
        hideScrollbars
      >
        <STitle>{`${selectedItem.sortIndex}. ${selectedItem.name}`}</STitle>
        {selectedItem.comments.length > 0 && (
          <>
            <SSubTitle>{translate(`comments`)}:</SSubTitle>
            <SCommentsList>
              {selectedItem.comments.map((comment) => (
                <ChecklistComment key={comment.id} comment={comment} />
              ))}
            </SCommentsList>
          </>
        )}
        {status !== ChecklistStatus.Ended && (
          <>
            {!chatBoxOpen ? (
              <SAddComment onClick={handleClickAddComment}>
                <Add /> {translate(`add_comment`)}
              </SAddComment>
            ) : (
              <ChecklistInput onSend={addComment} />
            )}
          </>
        )}
      </Drawer>
    </SDrawerWrapper>
  );
};

const STitle = styled.p`
  color: ${palette.white};
  font-family: 'Roboto-Medium';
  font-weight: 500;
  font-size: 1rem;
`;

const SSubTitle = styled.p`
  color: ${palette.white};
  font-family: 'Roboto-Medium';
  font-weight: 500;
  font-size: 1rem;
  margin: 1.25rem 0 1rem;
`;

const SAddComment = styled.div`
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  width: fit-content;
  color: ${palette.honeyYellow};
  font-family: 'Roboto-Medium';
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
`;

const SCommentsList = styled.div`
  max-height: 20rem;
  display: flex;
  flex-direction: column;

  .comment + * {
    margin-top: 0.5rem;
  }
  /* vertical scrolling + hide scroller bar  */
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;
