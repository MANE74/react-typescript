import { decode } from 'html-entities';
import React, { useEffect, useState } from 'react';
import { getImage } from '../../../apis/mediaAPI';
import { MessageType } from '../../../utils/enums';
import MessageContainer from '../../MessageContainer/MessageContainer';
import { SMessageText } from '../TextMessage/TextMessage';
import ImagesModal from './ImagesModal';
import MessagesImagesGrid from './MessagesImagesGrid';

export interface ImageMessageProps {
  style?: React.CSSProperties;
  photoFileNames: Array<string>;
  messageText?: string;
  isSent: boolean;
  sentDateTime?: string;
  senderImage: string | null;
  senderName: string;
  isSameSender?: boolean;
  messageTo: string | null;
  subject: string | null;
  toggleModal?: () => void;
  showOnlyAttachment?: boolean;
  forwarded?: boolean;
  edited?: boolean;
}

function ImageMessage(props: ImageMessageProps) {
  const {
    toggleModal,
    photoFileNames,
    isSent,
    sentDateTime,
    senderImage,
    isSameSender = false,
    senderName,
    messageText,
    messageTo,
    subject,
    showOnlyAttachment = false,
    forwarded,
    edited,
  } = props;

  const [imagesToShow, setImagesToShow] = useState<string[]>([]);
  const [isLightBoxOpen, setIsLightBoxOpen] = useState<string | null>(null);
  const [imgKey, setImgKey] = useState(-1);

  useEffect(() => {
    getImages();
  }, [photoFileNames]);

  const getImages = async () => {
    let imgArr = [];
    for (let img of photoFileNames) {
      var res = await getImage({ imageName: img, size: 'large', svg: false });
      if (res) {
        imgArr.push(res);
      }
    }
    setImagesToShow(imgArr);
  };

  const messageType = isSent
    ? MessageType.SentImageMessage
    : MessageType.ReceivedImageMessage;

  const handleImageChange = (index: number, next: boolean) => {
    let nextImage = '';
    if (index > -1) {
      if (next && imagesToShow.length !== index + 1) {
        nextImage = imagesToShow[index + 1];
        setImgKey(imgKey + 1);
        setIsLightBoxOpen(nextImage);
      }
      if (!next && index !== 0) {
        nextImage = imagesToShow[index - 1];
        setImgKey(imgKey - 1);
        setIsLightBoxOpen(nextImage);
      }
    }
  };

  return (
    <MessageContainer
      messageType={messageType}
      sentDateTime={sentDateTime}
      senderImage={senderImage}
      senderName={senderName}
      isSameSender={isSameSender}
      messageTo={messageTo}
      subject={subject}
      toggleModal={toggleModal}
      showOnlyAttachment={showOnlyAttachment}
      forwarded={forwarded}
      edited={edited}
    >
      <div>
        {messageText && (
          <SMessageText margin>{decode(messageText)}</SMessageText>
        )}
        <MessagesImagesGrid
          photoFileNames={imagesToShow}
          setIsLightBoxOpen={setIsLightBoxOpen}
          setKey={setImgKey}
        />
      </div>
      <ImagesModal
        imgKey={imgKey}
        img={isLightBoxOpen}
        isOpen={isLightBoxOpen !== null}
        closeModal={() => setIsLightBoxOpen(null)}
        handleImageChange={handleImageChange}
      />
    </MessageContainer>
  );
}

export default ImageMessage;
