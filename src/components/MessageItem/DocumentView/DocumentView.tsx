import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getFile } from '../../../apis/mediaAPI';
import { Button } from '../../Button/Button';
import { Modal } from '../../Modal/Modal';

const SPdf = styled.iframe`
  height: 100%;
  width: 100%;
`;

interface DocumentProps {
  documentFileNames?: string[];
  messageId: number;
  chatId: number;
}

export interface Document {
  documentBase64: string;
  title: string;
  identifier: string;
}

export const DocumentView = (props: DocumentProps) => {
  const { documentFileNames, messageId, chatId } = props;

  const [documents, setDocuments] = useState<Document[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentDocument, setCurrentDocument] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>();

  const location = useLocation();
  const navigate = useNavigate();

  const urlFileName = location.search.split('?document=')[1];
  let mounted = true;

  // TODO: Think about moving the get request to MessageItem to keep this component ui only
  const getDocuments = async () => {
    setIsLoading(true);

    if (!documentFileNames || !documentFileNames?.length) return;
    // user can send more than one document
    await documentFileNames.map(async (fileName, index) => {
      const response = await getFile(fileName);

      // here we adding all documents so we can easily access them later
      if (mounted) {
        setDocuments([
          ...documents,
          {
            documentBase64: response,
            title: fileName,
            identifier: fileName + index + messageId,
          },
        ]);

        setIsLoading(false);
      }
    });
  };

  useEffect(() => {
    getDocuments();

    // cleanup
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      mounted = false;
      setIsLoading(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentFileNames?.length]);

  useEffect(() => {
    // here we compare the documnets and see if it matches the document search query in the url ( If yes we add it to current document to be displayed on modal open)
    if (documents.length) {
      const document = documents.filter(
        (singleDocument) => singleDocument.identifier === urlFileName
      )[0]?.documentBase64;

      setCurrentDocument(document);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documents.length, urlFileName]);

  const documentLinkClickHandler = (identitfier: string) => {
    navigate(`/message/${chatId}?document=${identitfier}`);

    setIsModalOpen(true);
  };

  if (!documentFileNames || !documentFileNames?.length) return <></>;

  return (
    <div>
      {documents.map((document, index) => (
        <Button
          onClick={() => documentLinkClickHandler(document.identifier)}
          key={document.identifier}
          text={document.title}
        />
      ))}
      {currentDocument && !isLoading && (
        <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen}>
          <SPdf
            src={`data:application/pdf;base64,${currentDocument}`}
            title="hello"
          ></SPdf>
        </Modal>
      )}
    </div>
  );
};
