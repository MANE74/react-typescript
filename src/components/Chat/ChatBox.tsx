import React, { SyntheticEvent, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { palette } from '../../theme/colors';
import Camera from '../../assets/imgs/chats/camera.svg';
import Options, { OptionItemProps } from '../Options/Options';
import Gallery from '../../assets/imgs/chats/gallery.svg';
import Pin from '../../assets/imgs/chats/pin.svg';
import NewDoc from '../../assets/imgs/chats/new-doc.svg';
import SendIcon from '../../assets/imgs/chats/send-icon.svg';
import _ from 'lodash';
import { saveImageToServer } from '../../apis/mediaAPI';
import { useAppDispatch } from '../../hooks';
import { setIsLoading } from '../../containers/CreateMessage/createMessageSlice';

import { ReactComponent as Add } from '../../assets/imgs/chats/add.svg';
import { ReactComponent as PDF } from '../../assets/imgs/chats/pdf.svg';
import Delete from '../../assets/imgs/chats/delete-round.svg';
import { trunctateText } from '../../utils/truncate';
import { Wrapper } from '@googlemaps/react-wrapper';
import { Map } from '../Map/Map';
import { Marker } from '../Map/MapMarker/MapMarker';
import { saveLocation } from '../../apis/locationAPI';
import MapDisplay from '../Map/MapDisplay';
import Geocoder, { apiKey, defaultLat, defaultLng } from '../../utils/geocoder';
import { ReactComponent as Edit } from '../../assets/imgs/chats/edit.svg';
import { ReactComponent as Close } from '../../assets/imgs/chats/close.svg';
import { translate } from '../../utils/translate';

interface ChatBoxProps {
  editText?: string;
  tabBar: boolean;
  setTabBar: React.Dispatch<React.SetStateAction<boolean>>;
  setEditText?: React.Dispatch<React.SetStateAction<string | undefined>>;
  className?: string;

  isDependencyAdded?: boolean;
  dependencyRequired?: boolean;
  onDependencyReFocus?: () => void;

  onTextSend: (textMessage: string) => void;
  onPhotosSend: (photosList: string[], textMessage: string) => void;
  onDocumentsSend: (documentFiles: File[], textMessage: string) => void;
  onLocationSend: (locationId: number, text?: string) => void;
}

function ChatBox(props: ChatBoxProps) {
  const {
    editText,
    className,
    setEditText,
    onTextSend,
    onPhotosSend,
    onDocumentsSend,
    onLocationSend,
    isDependencyAdded,
    dependencyRequired,
    onDependencyReFocus,
  } = props;

  const dispatch = useAppDispatch();

  const [optionsOpen, setOptionsOpen] = useState(false);
  const [text, setText] = useState('');
  const [documents, setDocuments] = useState<File[] | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [imagesPreview, setImagesPreview] = useState<
    { name: string; id: number }[]
  >([]);
  const [keyReload, setKeyReload] = useState(0);
  const [showAttachmentMap, setShowAttachmentMap] = useState(false);
  const [attachedMap, setAttachedMap] = useState(false);
  const [location, setLocation] = useState<google.maps.LatLngLiteral>({
    lat: defaultLat,
    lng: defaultLng,
  });

  const fileUploadRef = useRef<any>(null);
  const imageUploadRef = useRef<any>(null);
  const imageContainerRef = useRef<any>(null);

  useEffect(() => {
    if (editText) {
      onCancelImages();
      onCancelDocuments();
      onCancelLocation();
      setText(editText);
    }
  }, [editText]);

  const onImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    var imageArr = Array.prototype.slice.call(e.target.files);
    if (_.isEmpty(imageArr)) return;

    let newImagesPreview = [...imagesPreview];
    let newImages = [...images];

    for (let image of imageArr) {
      const imageToPush = URL.createObjectURL(image);
      newImagesPreview.push({
        name: imageToPush,
        id: newImagesPreview.length,
      });
      newImages.push(image);
    }

    if (!_.isEmpty(newImagesPreview)) {
      setImages(newImages);
      setImagesPreview(newImagesPreview);
      setOptionsOpen(false);
    }
  };

  const onFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    var fileArr = Array.prototype.slice.call(e.target.files);
    if (_.isEmpty(fileArr)) return;

    if (!_.isNull(documents)) {
      setDocuments([...documents, ...fileArr]);
    } else {
      setDocuments(fileArr);
    }
    setOptionsOpen(false);
  };

  const options: OptionItemProps[] = [
    {
      name: 'messages_photo_or_video',
      icon: Gallery,
      callback: () => {
        imageUploadRef?.current?.click();
      },
    },
    {
      name: 'messages_location',
      icon: Pin,
      callback: () => {
        setShowAttachmentMap(true);
        setOptionsOpen(false);
      },
    },
    {
      name: 'messages_file',
      icon: NewDoc,
      callback: () => {
        fileUploadRef?.current?.click();
      },
    },
  ];

  const onClickAdd = () => {
    setOptionsOpen(!optionsOpen);
  };

  const saveImage = async (res: Blob) => {
    const formData = new FormData();
    formData.append('image', res);
    const result = await saveImageToServer(formData);
    if (result) {
      return result;
    }
  };

  const saveImages = async () => {
    let imagesFilesNamesArray = [];
    let index = 0;

    for await (let image of images!) {
      if (_.find(imagesPreview, e => e.id === index)) {
        const result = await saveImage(image);
        if (result) {
          imagesFilesNamesArray.push(result);
        }
      }
      index++;
    }
    return imagesFilesNamesArray;
  };

  const sendMessage = async () => {
    if (!_.isEmpty(images) && !_.isEmpty(imagesPreview)) {
      let imagesFilesNamesArray = await saveImages();
      onPhotosSend(imagesFilesNamesArray, text);
    } else if (!_.isNull(documents)) {
      onDocumentsSend(documents, text);
    } else if (attachedMap) {
      const result = await Geocoder({
        latitude: location.lat,
        longitude: location.lng,
      });
      const locName = result?.addressName
        ? result?.addressName
        : `${location.lat} | ${location.lng}`;
      const loc = {
        name: locName,
        latitude: location.lat,
        longitude: location.lng,
      };
      const createLocationResponse = await saveLocation(loc);
      onLocationSend(createLocationResponse.id, text);
    } else {
      onTextSend(text);
    }
  };

  const onMessageSend = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (dependencyRequired) {
      if (isDependencyAdded) {
        dispatch(setIsLoading(true));
        sendMessage();
        onCancelEdit();
        onCancelImages();
        onCancelDocuments();
        onCancelLocation();
      } else {
        onDependencyReFocus && onDependencyReFocus();
      }
    } else {
      dispatch(setIsLoading(true));
      sendMessage();
      onCancelEdit();
      onCancelImages();
      onCancelDocuments();
      onCancelLocation();
    }
  };

  const onCancelEdit = () => {
    setEditText && setEditText(undefined);
    setText('');
  };

  const onCancelImages = () => {
    setImages([]);
    setImagesPreview([]);
    if (imageUploadRef.current) imageUploadRef.current.value = null;
  };

  const onCancelDocuments = () => {
    setDocuments(null);
    if (fileUploadRef.current) fileUploadRef.current.value = null;
  };

  const onCancelLocation = () => {
    setAttachedMap(false);
    setLocation({ lat: 0, lng: 0 });
  };

  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    var containerScrollPosition = imageContainerRef.current.scrollLeft;
    imageContainerRef.current.scrollTo({
      top: 0,
      left: containerScrollPosition + e.deltaY * 0.1,
    });
  };

  const handleRemoveImage = (id: number) => {
    if (_.isEmpty([imagesPreview, images])) return;
    let newPreviewState = imagesPreview;

    newPreviewState.splice(
      newPreviewState.findIndex(e => e.id === id),
      1
    );

    setImagesPreview(newPreviewState);
    setKeyReload(keyReload + 1);
    if (_.isEmpty(newPreviewState)) {
      onCancelImages();
    }
  };

  const handleRemoveDocument = (id: number) => {
    if (_.isNull(documents)) return;

    let newDocState = [...documents];
    newDocState.splice(id, 1);
    setDocuments(newDocState);

    if (_.isEmpty(newDocState)) {
      onCancelDocuments();
    }
  };

  if (showAttachmentMap) {
    return (
      <MapDisplay
        backLink="#"
        handleClickBack={() => setShowAttachmentMap(false)}
        buttonColor="yellow"
        buttonTx="messages_attach_map"
        location={location}
        setLocation={setLocation}
        onButtonClick={() => {
          setShowAttachmentMap(false);
          setAttachedMap(true);
        }}
      />
    );
  }

  return (
    <>
      {props.tabBar && (
        <>
          {editText && (
            <EditContainer>
              <Edit />
              <p className="editText">{translate('message_editing')}</p>
              <Close onClick={onCancelEdit} className="close" />
            </EditContainer>
          )}
          <SChatBoxWrapper
            className={className}
            map={attachedMap}
            margin={!_.isEmpty(images) || !_.isNull(documents)}
          >
            <SChatBox>
              <STop>
                {!_.isEmpty(images) || !_.isNull(documents) || attachedMap ? (
                  <SIcon
                    onClick={
                      !_.isNull(documents)
                        ? onCancelDocuments
                        : attachedMap
                        ? onCancelLocation
                        : onCancelImages
                    }
                    src={Delete}
                    alt="Delete"
                  />
                ) : (
                  <YellowAdd
                    onClick={editText ? () => {} : onClickAdd}
                    $disable={editText}
                  />
                )}
                <STextContainer onSubmit={onMessageSend}>
                  <STextInput
                    value={text}
                    onChange={e => setText(e.target.value)}
                  />
                </STextContainer>
                {!_.isEmpty(text.trim()) ||
                !_.isNull(documents) ||
                !_.isEmpty(images) ||
                attachedMap ? (
                  <SIcon onClick={onMessageSend} src={SendIcon} alt="send" />
                ) : (
                  <SIcon
                    onClick={() => imageUploadRef?.current?.click()}
                    src={Camera}
                    alt="camera"
                  />
                )}
              </STop>
              {!_.isEmpty(imagesPreview) && (
                <SBottom>
                  <SImageContainer onWheel={onWheel} ref={imageContainerRef}>
                    <div className="scrollableImages" key={keyReload}>
                      {imagesPreview.map(image => (
                        <SImg key={image.id}>
                          <img className="picture" src={image.name} alt="" />
                          <img
                            className="del"
                            src={Delete}
                            alt=""
                            onClick={() => handleRemoveImage(image.id)}
                          />
                        </SImg>
                      ))}
                    </div>
                  </SImageContainer>
                  <SAddMoreImages
                    onClick={() => imageUploadRef?.current?.click()}
                  >
                    <YellowAdd />
                  </SAddMoreImages>
                </SBottom>
              )}
              {documents !== null && (
                <SBottom>
                  <SImageContainer
                    pdf={true}
                    onWheel={onWheel}
                    ref={imageContainerRef}
                  >
                    <div className="scrollableImages">
                      {documents.map((doc, key) => (
                        <SPdf key={key}>
                          <PDF />
                          <img
                            className="del"
                            src={Delete}
                            alt=""
                            onClick={() => {
                              handleRemoveDocument(key);
                            }}
                          />
                          <p>{trunctateText(doc.name, 20)}</p>
                        </SPdf>
                      ))}
                    </div>
                  </SImageContainer>
                  <SAddMoreImages
                    onClick={() => fileUploadRef?.current?.click()}
                  >
                    <YellowAdd />
                  </SAddMoreImages>
                </SBottom>
              )}
              {attachedMap && (
                <SAttachedMap>
                  <Wrapper apiKey={apiKey!} libraries={['places']}>
                    <Map
                      center={{
                        lat: location.lat,
                        lng: location.lng,
                      }}
                      zoom={12}
                      style={{ flexGrow: '1', height: '100%' }}
                      disableDefaultUI
                      clickableIcons={false}
                    >
                      <Marker
                        position={{
                          lat: location.lat,
                          lng: location.lng,
                        }}
                      />
                    </Map>
                  </Wrapper>
                </SAttachedMap>
              )}
            </SChatBox>
          </SChatBoxWrapper>
        </>
      )}
      <Options
        items={options}
        isOpen={optionsOpen}
        setIsOpen={setOptionsOpen}
        setChatBar={props.setTabBar}
      />
      <input
        onChange={onImageUpload}
        ref={imageUploadRef}
        id="imageUpload"
        type="file"
        multiple
        accept="image/*"
        style={{ display: 'none' }}
      />
      <input
        onChange={onFileUpload}
        ref={fileUploadRef}
        id="fileUpload"
        type="file"
        multiple
        accept="application/pdf"
        style={{ display: 'none' }}
      />
    </>
  );
}

export default ChatBox;

const SChatBoxWrapper = styled.div<any>`
  z-index: 15;
  width: 100%;
  height: ${props => (props.map ? '17rem' : props.margin ? '8rem' : '5rem')};
  background-color: ${palette.prussianBlue2};
  display: flex;
  flex-direction: column;
  align-items: center;
  place-content: space-evenly;
  padding: 0.75rem 1.5rem 0.75rem 1.3rem;

  &.checklist-comment {
    height: fit-content;
    padding: 1rem 0 0;
  }
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
  width: 100%;
`;

const SBottom = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-top: 0.5rem;
`;

const SAdd = styled(Add)`
  cursor: pointer;
  min-width: 24px;
`;

const YellowAdd = styled(SAdd)<any>`
  cursor: ${props => props.$disable && 'not-allowed'};
  path {
    stroke: ${palette.honeyYellow};
  }
`;

const SImageContainer = styled.div<any>`
  width: 100%;
  height: 4rem;
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  align-items: center;

  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */

  .scrollableImages {
    height: 100%;
    display: flex;
    align-items: center;
  }
  div + div {
    margin-left: ${props => (props.pdf ? '1.3rem' : '1rem')};
  }
`;

const SImg = styled.div`
  display: flex;
  position: relative;
  height: 80%;

  .picture {
    border-radius: 4px;
    width: 4rem;
    object-fit: cover;
  }
  .del {
    cursor: pointer;
    position: absolute;
    top: -6px;
    right: -6px;
  }
`;

const SPdf = styled.div`
  display: flex;
  position: relative;
  width: 4rem;
  flex-direction: column;
  align-items: center;
  height: 80%;

  svg {
    min-height: 35px;
  }

  p {
    text-align: center;
    line-break: anywhere;
    width: 100%;
    font-family: 'Roboto-Regular';
    font-weight: 400;
    font-size: 10px;
  }

  .del {
    cursor: pointer;
    position: absolute;
    top: -6px;
    right: -12px;
  }
`;

const SAddMoreImages = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;

  margin-left: 0.5rem;
  height: 50px;
  width: 5rem;
  border: 1px dashed ${palette.stormGray};
  border-radius: 3px;
`;

const STextContainer = styled.form`
  margin: 0 1.25rem 0 0.875rem;
  padding: 0 1rem 0 1rem;
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
`;

const SAttachedMap = styled.div`
  margin-top: 0.75rem;
  padding: 0;
  height: 12rem;
  width: 100%;
  border-radius: 10px;
  -webkit-mask-image: -webkit-radial-gradient(white, black);
`;

const EditContainer = styled.div`
  padding: 0.5rem 1.25rem;
  background-color: ${palette.charcoal2};
  height: 44px;
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;

  p {
    color: ${palette.silver};
    font-size: 12px;
    font-family: 'Roboto-Regular';
    margin-left: 1.25rem;
  }
  .close {
    cursor: pointer;
    margin-left: auto;
  }
`;
