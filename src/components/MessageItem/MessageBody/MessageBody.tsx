import { AudioPlayer } from '../../AudioPlayer/AudioPlayer';
import { DocumentView } from '../DocumentView/DocumentView';
interface MessageBodyProps {
  documentFileNames?: string[];
  id: number;
  chatId: number;
  audio?: string;
  isAudioLoading: boolean;
}
export const MessageBody = (props: MessageBodyProps) => {
  const { documentFileNames, id, chatId, audio, isAudioLoading } = props;
  return (
    <div>
      Message Content
      <DocumentView
        documentFileNames={documentFileNames}
        messageId={id}
        chatId={chatId}
      />
      {audio && !isAudioLoading && <AudioPlayer audioBase64={audio} />}
    </div>
  );
};
