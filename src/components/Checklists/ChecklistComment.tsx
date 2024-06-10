import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getImage, getImageWithSize } from '../../apis/mediaAPI';
import { Comment } from '../../containers/Checklists/checklistsSlice/types';
import { palette } from '../../theme/colors';
import { getDateFormatCustom, dateFormats } from '../../utils/date';
import { trunctateText } from '../../utils/truncate';
import ImagesModal from '../MessageItem/ImageMessage/ImagesModal';

interface CommentProps {
  comment: Comment;
}

function ChecklistComment(props: CommentProps) {
  const { comment } = props;
  const { id, author, text, imageFileName, sent, type } = comment;

  const types = {
    Checked: t('checklist_marked_as_done'),
    Unchecked: t('checklist_marked_as_undone'),
    Regular: t('checklist_regular'),
  };

  const [image, setImage] = useState<string | null>(null);
  const [size, setSize] = useState<string>('');
  const [openImage, setOpenImage] = useState(false);

  useEffect(() => {
    let mounted = true;
    const getSourceImage = async () => {
      var res = await getImageWithSize({
        imageName: imageFileName,
        size: 'medium',
        svg: false,
      });
      if (mounted) {
        setImage(res.image);
        setSize(res.size);
      }
    };

    if (imageFileName) {
      getSourceImage();
    }

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <SComment key={id} className="comment">
      <div className="wrapper">
        <p className="author">{author}</p>
        <p className="text">{text ? trunctateText(text, 360) : types[type]}</p>
        {image && (
          <SAttachementContainer>
            <SImageContainer>
              <img src={image} alt="" onClick={() => setOpenImage(true)} />
              <ImagesModal
                imgKey={0}
                img={image}
                isOpen={openImage}
                closeModal={() => setOpenImage(false)}
              />
            </SImageContainer>
          </SAttachementContainer>
        )}
      </div>
      <div>
        <p className="time">
          {getDateFormatCustom(sent, dateFormats.yearMonthDayTimeNoComma24)}
        </p>
      </div>
    </SComment>
  );
}

export default ChecklistComment;

const SComment = styled.div`
  background-color: ${palette.charcoal};
  border-radius: 6px;
  width: 100%;
  max-height: 10rem;
  padding: 10px;
  display: flex;
  justify-content: space-between;

  .wrapper {
    max-width: 80%;
    overflow-wrap: break-word;
    word-wrap: break-word;
    word-break: break-word;

    /* Adds a hyphen where the word breaks, if supported (No Blink) */
    -ms-hyphens: auto;
    -moz-hyphens: auto;
    -webkit-hyphens: auto;
    hyphens: auto;
  }

  .author {
    font-family: 'Roboto-Medium';
    font-weight: 500;
    font-size: 14px;
    margin-bottom: 0.5rem;
  }

  .text {
    font-family: 'Roboto-Regular';
    font-weight: 400;
    font-size: 12px;
    color: ${palette.silver};
  }

  .time {
    min-width: 5rem;
    font-family: 'Roboto-Regular';
    font-weight: 400;
    font-size: 12px;
  }
`;

const SAttachementContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  img {
    border-radius: 6px;
    width: 3.5rem;
  }
`;

const SImageContainer = styled.div`
  margin-right: 0.75rem;
  min-width: 3.5rem;
  height: 3.5rem;

  img {
    cursor: pointer;
    width: 100%;
    height: 100%;
    object-fit: cover;
    overflow: hidden;
  }
`;
