import React, { SyntheticEvent, useRef, useState } from 'react';
import styled from 'styled-components';
import { palette } from '../../theme/colors';
import Camera from '../../assets/imgs/chats/camera.svg';
import SendIcon from '../../assets/imgs/chats/send-icon.svg';
import _ from 'lodash';
import { saveImageToServer } from '../../apis/mediaAPI';
import Delete from '../../assets/imgs/chats/delete-round.svg';

interface ChecklistInputProps {
  onSend: (textMessage: string, photoFile?: string) => void;
}

function ChecklistInput(props: ChecklistInputProps) {
  const { onSend } = props;

  const [text, setText] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const imageUploadRef = useRef<any>(null);

  const onImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    var imageToUpload = _.head(e.target.files!);
    if (!imageToUpload) return;

    const imagePreview = URL.createObjectURL(imageToUpload);
    setImage(imageToUpload);
    setImagePreview(imagePreview);
  };

  const saveImage = async (res: Blob) => {
    const formData = new FormData();
    formData.append('image', res);
    const result = await saveImageToServer(formData);
    if (result) {
      return result;
    }
  };

  const onMessageSend = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (!_.isNull(image) && !_.isNull(imagePreview)) {
      const result = await saveImage(image);
      if (result) {
        onSend(text, result);
      }
    } else {
      onSend(text);
    }
  };

  const onCancelImages = () => {
    setImage(null);
    setImagePreview(null);
    imageUploadRef.current.value = null;
  };

  return (
    <>
      <SChatBoxWrapper margin={!_.isNull(image)}>
        <SChatBox>
          <STop>
            {!_.isNull(image) ? (
              <SIcon
                className="left"
                onClick={onCancelImages}
                src={Delete}
                alt="Delete"
              />
            ) : (
              <SIcon
                className="left"
                onClick={() => imageUploadRef?.current?.click()}
                src={Camera}
                alt="camera"
              />
            )}
            <STextContainer onSubmit={onMessageSend}>
              <STextInput
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </STextContainer>
            {!_.isEmpty(text.trim()) || !_.isNull(image) ? (
              <SIcon onClick={onMessageSend} src={SendIcon} alt="send" />
            ) : (
              <SBalanceSpace />
            )}
          </STop>
          {imagePreview !== null && (
            <SImageContainer>
              {imagePreview && (
                <SImg>
                  <img className="picture" src={imagePreview} alt="" />
                </SImg>
              )}
            </SImageContainer>
          )}
        </SChatBox>
      </SChatBoxWrapper>

      <input
        onChange={onImageUpload}
        ref={imageUploadRef}
        id="imageUpload"
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
      />
    </>
  );
}

export default ChecklistInput;

const SChatBoxWrapper = styled.div<any>`
  border-top-right-radius: 15px;
  border-top-left-radius: 15px;
  z-index: 15;
  width: 100%;
  height: ${(props) => (props.map ? '17rem' : props.margin ? '8rem' : '5rem')};
  background-color: ${palette.prussianBlue2};
  display: flex;
  flex-direction: column;
  align-items: center;
  place-content: space-evenly;
  height: fit-content;
  padding: 1rem 0 0;
`;

const SChatBox = styled.div`
  display: flex;
  align-items: center;
  max-width: 24rem;
  flex-direction: column;
  width: 100%;
`;

const STop = styled.div`
  display: flex;
  align-items: center;
  width: 90%;
`;

const SImageContainer = styled.div<any>`
  width: 100%;
  height: 4rem;
  display: flex;
  margin-top: 0.5rem;
  align-items: center;
`;

const SImg = styled.div`
  display: flex;
  position: relative;
  height: 100%;

  .picture {
    border-radius: 4px;
    width: 4rem;
    object-fit: cover;
  }
`;

const STextContainer = styled.form`
  margin-right: 2.25rem;
  width: 100%;
`;

const STextInput = styled.input`
  resize: none;
  border-radius: 73px;
  border: none;
  background-color: ${palette.ebony};
  color: ${palette.white};
  height: 2.5rem;
  width: 100%;
  padding: 0 0.75rem;

  overflow: hidden;
  ::-webkit-scrollbar {
    display: none;
  }
  :focus-visible {
    outline: none;
  }
`;

const SIcon = styled.img`
  min-width: 1.5rem;
  height: 1.5rem;
  cursor: pointer;

  &.left {
    margin-right: 1rem;
  }
`;

const SBalanceSpace = styled.div`
  min-width: 1.5rem;
`;
