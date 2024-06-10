import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks';
import Pencil from '../../assets/imgs/iamokay/iamok-edit-colored.svg';
import { translate } from '../../utils/translate';
import autoSize from 'autosize';
import Loader from '../../components/Loader/Loader';
import { useConfirmation } from '../../utils/ConfirmationServiceContext/confirmationContext';
import {
  SIcon,
  SInput,
  SItem,
  SLine,
  SPage,
  SSaveButton,
  STextArea,
  STitle,
} from './EditOnCallAlertMessage.styles';
import {
  selectOnCallAlertDocument,
  selectOnCallAlertIsLoading,
} from './onCallAlertSlice';
import { editOnCallAlertMessage } from '../../apis/onCallAlertApi';
import { fetchOnCallAlertDocument } from './onCallAlertSlice/actionCreators';

export const EditOnCallAlertMessage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const confirm = useConfirmation();

  const document = useAppSelector(selectOnCallAlertDocument);
  const _isLoading = useAppSelector(selectOnCallAlertIsLoading);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);
  const textInputRef = React.useRef<HTMLInputElement>(null);

  const [subject, setSubject] = React.useState<string | undefined>(
    document?.subject || ''
  );
  const [message, setMessage] = React.useState<string>(document?.text || '');

  React.useEffect(() => {
    textInputRef.current?.focus();
  }, []);
  React.useEffect(() => {
    textAreaRef.current && autoSize(textAreaRef.current);
  }, [message]);

  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubject(e.target.value);
  };
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      id &&
        (await editOnCallAlertMessage({
          id: +id,
          message: { text: message, subject },
        }));
      setIsLoading(false);
      fetchOnCallAlert();
      id && goToOnCallAlert(+id);
    } catch (e) {
      setIsLoading(false);
      confirm({
        title: 'warning',
        description: e,
        onCancel: () => {},
        cancelText: 'cancel',
      });
    }
  };

  const goToOnCallAlert = (id: number) => {
    navigate(`/oncall/${id}`);
  };

  React.useEffect(() => {
    setSubject(document?.subject || '');
    document?.text && setMessage(document?.text);
  }, [document]);

  React.useEffect(() => {
    fetchOnCallAlert();
  }, []);

  const fetchOnCallAlert = async () => {
    dispatch(fetchOnCallAlertDocument(+id!));
  };

  if (!document && _isLoading && isLoading) return <Loader />;

  return (
    <SPage>
      <SItem className="input">
        <STitle>{translate(`messages_subject_add`)}</STitle>
        <SInput
          ref={textInputRef}
          onChange={handleSubjectChange}
          value={subject}
          type="text"
          placeholder={translate(`messages_subject_add_placeholder`)}
        />
        <SIcon src={Pencil} alt="" />
      </SItem>
      <SLine />
      <SItem $textArea>
        <STitle>{translate(`imOk_message`)}:</STitle>
        <STextArea
          ref={textAreaRef}
          onChange={handleMessageChange}
          value={message}
          placeholder={translate(`imOk_message`)}
        />
        <SIcon src={Pencil} alt="" />
      </SItem>
      <SSaveButton tx="saveChanges" onClick={handleSave} />
    </SPage>
  );
};
