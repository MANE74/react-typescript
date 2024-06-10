import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLayoutContext } from '../../utils/customHooks/LayoutContext';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { fetchImOkDocument } from '../ImOkList/imOkSlice/actionCreators';
import { selectImOkDocument, selectImOkIsLoading } from '../ImOkList/imOkSlice';
import Pencil from '../../assets/imgs/iamokay/iamok-edit-colored.svg';
import { translate } from '../../utils/translate';
import autoSize from 'autosize';
import Loader from '../../components/Loader/Loader';
import { useConfirmation } from '../../utils/ConfirmationServiceContext/confirmationContext';
import { editIamOkMessage } from '../../apis/imOkAPI';
import {
  SIcon,
  SInput,
  SItem,
  SLine,
  SPage,
  SSaveButton,
  STextArea,
  STitle,
} from './EditIamOkMessage.styles';

export interface IEditIamOkMessageProps {}

export const EditIamOkMessage = (props: IEditIamOkMessageProps) => {
  const {} = props;

  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const confirm = useConfirmation();

  const imOkDocument = useAppSelector(selectImOkDocument);
  const _isLoading = useAppSelector(selectImOkIsLoading);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const { setTabsState } = useLayoutContext();

  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);
  const textInputRef = React.useRef<HTMLInputElement>(null);

  const [subject, setSubject] = React.useState<string | undefined>(
    imOkDocument?.subject
  );
  const [message, setMessage] = React.useState<string>(
    imOkDocument?.name || ''
  );

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
        (await editIamOkMessage({
          id: +id,
          message: { name: message, subject },
        }));
      setIsLoading(false);
      fetchImOk();
      id && goToIamOk(+id);
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

  const goToIamOk = (id: number) => {
    navigate(`/muster/${id}`);
  };

  React.useEffect(() => {
    setSubject(imOkDocument?.subject);
    imOkDocument?.name && setMessage(imOkDocument?.name);
  }, [imOkDocument]);

  React.useEffect(() => {
    fetchImOk();
  }, []);

  const fetchImOk = async () => {
    dispatch(fetchImOkDocument(id || ''));
  };

  if (!imOkDocument && _isLoading && isLoading) return <Loader />;

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
