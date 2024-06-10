import { useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { MessageType } from '../../../utils/enums';
import MessageContainer from '../../MessageContainer/MessageContainer';
import { ReactComponent as PlayButton } from '../../../assets/imgs/chats/play-button.svg';
import { getAudioFile } from '../../../apis/mediaAPI';

interface AudioMessageProps {
  audioFile: string;
  sentDateTime: string;
  isAudioActive: boolean;
  onPlayClick: (id: number | null) => void;
  isSent: boolean;
  isSameSender?: boolean;
  senderImage: string | null;
  senderName: string;
  messageTo: string | null;
  subject: string | null;
  toggleModal?: () => void;
  messageId: number;
  showOnlyAttachment?: boolean;
  forwarded?: boolean;
  edited?: boolean;
}

function AudioMessage(props: AudioMessageProps) {
  const {
    sentDateTime,
    audioFile,
    subject,
    isAudioActive,
    onPlayClick,
    isSent,
    senderImage,
    isSameSender = false,
    senderName,
    messageTo,
    messageId,
    toggleModal,
    showOnlyAttachment = false,
    forwarded,
    edited,
  } = props;

  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [audio, setAudio] = useState('');

  const audioRef = useRef(new Audio(audio));

  useEffect(() => {
    getAudio();
    audioRef.current.onloadedmetadata = () => {
      const duration = Math.round(audioRef.current.duration);

      setDuration(duration);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isAudioActive) {
      setCurrentTime(0);
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsAudioPlaying(true);
    } else {
      audioRef.current.pause();
      setIsAudioPlaying(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAudioActive]);

  useEffect(() => {
    let interval: any = null;
    if (isAudioPlaying) {
      if (currentTime === duration) {
        setIsAudioPlaying(false);
        onPlayClick(null);
        return clearInterval(interval);
      }
      interval = setInterval(() => {
        setCurrentTime((seconds) => seconds + 1);
      }, 1000);
    } else if (!isAudioPlaying && currentTime !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAudioPlaying, currentTime]);

  const formatedTime = (dur: number) => {
    var minutes = Math.floor(dur / 60);
    var seconds = dur % 60;
    var twoDigit = seconds >= 10;

    return `${minutes}:${!twoDigit ? '0' : ''}${seconds}`;
  };

  const getAudio = async () => {
    let res = await getAudioFile(audioFile);
    setAudio(res);
  };

  const currentPercentage = duration
    ? `${(currentTime / duration) * 100}%`
    : '0%';

  const onScrubEnd = () => {
    // If not already playing, start
    if (!isAudioPlaying) {
      setIsAudioPlaying(true);
    }
  };

  const messageType = isSent
    ? MessageType.SentAudioMessage
    : MessageType.ReceivedAudioMessage;

  return (
    <div>
      <MessageContainer
        messageType={messageType}
        sentDateTime={sentDateTime}
        senderImage={senderImage}
        senderName={senderName}
        messageTo={messageTo}
        toggleModal={toggleModal}
        isSameSender={isSameSender}
        showOnlyAttachment={showOnlyAttachment}
        subject={subject}
        forwarded={forwarded}
        edited={edited}
      >
        <audio controls src={audio} ref={audioRef} hidden />
        <SAudioPLayer currentPercentage={currentPercentage}>
          <PlayButton onClick={() => onPlayClick(messageId)} />
          <SRangeContainer>
            <input
              type="range"
              value={currentTime}
              step="0.01"
              min="0"
              max={isAudioActive ? duration : 0}
              onMouseUp={onScrubEnd}
              onKeyUp={onScrubEnd}
            />
            <STime>
              <p>{formatedTime(currentTime)}</p>
              <p>{formatedTime(duration)}</p>
            </STime>
          </SRangeContainer>
        </SAudioPLayer>
      </MessageContainer>
    </div>
  );
}

export default AudioMessage;

const SAudioPLayer = styled.div<any>`
  padding: 0.5rem 1rem 0.5rem 0;
  display: flex;
  align-items: center;
  position: relative;

  svg {
    cursor: pointer;
  }

  input {
    overflow: hidden;
    display: block;
    appearance: none;
    max-width: 700px;
    width: 100%;
    margin: 0;
    height: 4px;
    border-radius: 27px;
    cursor: pointer;

    &::-webkit-slider-thumb {
      appearance: none;
    }

    ${(props) => css`
      background: -webkit-gradient(
        linear,
        0% 0%,
        100% 0%,
        color-stop(${props.currentPercentage}, #fff),
        color-stop(${props.currentPercentage}, #777)
      );
    `}
  }
`;

const SRangeContainer = styled.div`
  margin-left: 0.5rem;
  position: relative;
`;

const STime = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0;
  display: flex;
  width: 100%;
  justify-content: space-between;

  font-family: 'Roboto-Regular';
  font-weight: 400;
  font-size: 12px;
`;
