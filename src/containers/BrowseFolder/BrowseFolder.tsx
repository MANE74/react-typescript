import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DocumentItem } from '../../components/DocumentItem/DocumentItem';
import { EmptyListFallback } from '../../components/EmptyListFallback/EmptyListFallback';
import Loader from '../../components/Loader/Loader';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { translate } from '../../utils/translate';
import {
  selectDocumentGroupById,
  selectDocumentsIsListLoading,
  selectFiles,
  selectFilesByFolderIdWithSort,
  selectFilesByGroupIdWithSort,
  selectFolders,
  selectFoldersByGroupIdWithSortAndSearch,
} from '../Documents/documentsSlice';
import { fetchFolders } from '../Documents/documentsSlice/actionCreators';
import { handleDate } from '../ExternalContacts/helpers';
import EmptyDocuments from '../../assets/imgs/NotFound/no-result.svg';
import {
  BrowseFolderSort,
  BrowseSortType,
} from '../../components/BrowseFolderSort/BrowseFolderSort';
import { SDocumentButton, SHiddenInput } from '../Documents/styles';
import { selectUser } from '../Login/LoginSlice';
import { getCurrentUserById } from '../Login/LoginSlice/actionCreators';
import { FilesAndFoldersOptions } from '../../components/FilesAndFoldersOptions/FilesAndFoldersOptions';
import { OptionItemProps } from '../../components/Options/Options';
import {
  generateOptions,
  getFileOrFolderInfoById,
} from './BrowseFolder.helpers';
import { useConfirmation } from '../../utils/ConfirmationServiceContext/confirmationContext';
import { fetchAddDocumentFolders } from '../EditDocuments/EditDocumentSlice/actionCreators';
import { handleSubmissions } from '../EditDocuments/EditDocuments';
import { toNumber } from 'lodash';
import { isDocumentOffline } from '../Documents/helpers';
import { SList, SPage, SSearchFilterBar } from './BrowseFolder.styles';

export interface SelectedDocument {
  id: number;
  type: 'FILE' | 'FOLDER';
}
export interface BrowseFolderOptionsStateType {
  isOpen: boolean;
  options?: OptionItemProps[];
}

export const BrowseFolder = () => {
  const inputFile = React.useRef<HTMLInputElement>(null);
  const formData = new FormData();

  const [searchTerm, setSearchTerm] = React.useState<string | undefined>();
  const [sorting, setSorting] = React.useState<BrowseSortType>(
    BrowseSortType.date
  );
  const [filterOpen, setFilterOpen] = React.useState<boolean>(false);

  const dispatch = useAppDispatch();
  const navigation = useNavigate();
  const confirm = useConfirmation();
  const user = useAppSelector(selectUser);
  const isDocumentsManager = user?.roles?.includes('DocumentsManager');

  const { folderId, groupDocumentId } = useParams();

  const isFolderContentList = !!folderId;

  // Data sources START ====== ====== ====== ====== ====== ======

  const allFolders = useAppSelector(selectFolders);
  const allFiles = useAppSelector(selectFiles);
  const groupFolder = useAppSelector(
    selectDocumentGroupById(+groupDocumentId!)
  );
  const folders = useAppSelector(
    selectFoldersByGroupIdWithSortAndSearch(
      +groupDocumentId!,
      sorting,
      searchTerm
    )
  );
  const files = useAppSelector(
    isFolderContentList
      ? selectFilesByFolderIdWithSort(+folderId!, sorting, searchTerm)
      : selectFilesByGroupIdWithSort(+groupDocumentId!, sorting, searchTerm)
  );
  const isLoading = useAppSelector(selectDocumentsIsListLoading);

  // Data sources END ====== ====== ====== ====== ====== ======

  React.useEffect(() => {
    if (!user) dispatch(getCurrentUserById());
    dispatch(fetchFolders());
    // do we need this performance guard ?
    // if (folders.length === 0 || files.length === 0) dispatch(fetchFolders());
  }, []);

  const onSearch = (value: string) => {
    setSearchTerm(value);
  };
  const toggleFilterOpen = () => setFilterOpen(prev => !prev);

  const handleDocumentRedirect = (id: number) =>
    !isFolderContentList && navigation(`${id}`);

  const onSort = (sorting: BrowseSortType) => {
    setSorting(sorting);
  };

  // OPTIONS MANAGEMENT START ================================================================
  const handleMoreOptionClick = (type: 'FILE' | 'FOLDER') => (id: number) => {
    setSelected({ id, type });
    setOptionsOpen(true);

    generateOptions({
      dependencies: {
        confirm,
        navigation,
        setOptionsState,
        groupFolderId: +groupDocumentId!,
        browseFolderId: +folderId!,
        dispatch,
      },
      files,
      folders,
      selected: { id, type },
      isDocumentsManager: !!isDocumentsManager,
    });
  };

  const [selected, setSelected] = React.useState<SelectedDocument | undefined>(
    undefined
  );
  const [optionsState, setOptionsState] =
    React.useState<BrowseFolderOptionsStateType>({
      isOpen: false,
    });

  const setOptionsOpen = (isOpen: boolean) => {
    setOptionsState(prev => ({ ...prev, isOpen }));
  };

  React.useEffect(() => {
    return () => {
      setOptionsState({
        isOpen: false,
      });
    };
  }, []);

  // OPTIONS MANAGEMENT END ================================================================

  // creating folder & adding documents functionality

  const handleCreateFolder = (text: string | undefined) => {
    navigation(`/documents/edit/createFolder/${text}`);
  };

  const handleSubmission = (event: any) => {
    formData.append('filePDF', event.target.files[0]);
    dispatch(fetchAddDocumentFolders(folderId, formData));
  };

  const handleInputChange =
    (multi?: boolean) => (event: React.FormEvent<HTMLInputElement>) => {
      if (multi) {
        handleSubmissions(event);
        navigation('/documents/edit/addDocument');
        return;
      }
      handleSubmission(event);
    };

  const onAddDocumentClick = () => inputFile.current?.click();
  const onAddFolderClick = () => {
    confirm({
      title: 'documents_name_folder',
      placeholderTx: 'documents_folder_name',
      onSubmit: text => handleCreateFolder(text),
      onCancel: () => {},
      confirmText: 'messages_proceed',
      inputBox: true,
      confirmStyle: 'standard',
    });
  };

  const isListEmpty = isFolderContentList
    ? files.length === 0
    : [...folders, ...files].length === 0;

  if (isLoading) return <Loader />;

  return (
    <SPage>
      <SSearchFilterBar
        onSearch={onSearch}
        handleOpenFilter={toggleFilterOpen}
        value={searchTerm || ''}
      />
      <BrowseFolderSort
        isOpen={filterOpen}
        setIsOpen={setFilterOpen}
        onSort={onSort}
        initialSort={BrowseSortType.date}
      />

      <EmptyListFallback
        src={EmptyDocuments}
        listLength={
          isFolderContentList ? files.length : [...folders, ...files].length
        }
        isLoading={isLoading}
        searchTerm={searchTerm}
        emptyListTx={'documents_empty_list'}
        noSearchTx={'documents_not_found_by_search'}
      />
      {!isListEmpty && (
        <SList $bottomPad={isDocumentsManager}>
          {!isFolderContentList &&
            folders.map((folder, index) => (
              <DocumentItem
                key={`${folder.ID}-${index}`}
                iconVariant={folder.Offline ? 'OFFLINE_FOLDER' : 'FOLDER'}
                title={folder.Name}
                onCLick={handleDocumentRedirect}
                itemId={folder.ID}
                onMoreOptionClick={handleMoreOptionClick('FOLDER')}
              />
            ))}
          {files.map((file, index) => (
            <DocumentItem
              key={`${file.id}-${index}`}
              iconVariant={
                isDocumentOffline(
                  file,
                  Number(groupDocumentId),
                  Number(folderId)
                )
                  ? 'OFFLINE_FILE'
                  : 'FILE'
              }
              title={file.name}
              fileExtension
              pdfLink={file.document_url}
              subTitle={
                translate('imOk_updated')! + ' ' + handleDate(file.upload_time)
              }
              onCLick={handleDocumentRedirect}
              itemId={file.id}
              onMoreOptionClick={handleMoreOptionClick('FILE')}
            />
          ))}
        </SList>
      )}
      {selected && optionsState.options && (
        <FilesAndFoldersOptions
          items={optionsState.options}
          isOpen={optionsState.isOpen}
          setIsOpen={setOptionsOpen}
          withoutOptions={!isDocumentsManager}
          setTabBar
          info={getFileOrFolderInfoById(
            allFiles,
            allFolders,
            groupFolder!,
            selected,
            toNumber(groupDocumentId),
            toNumber(folderId)
          )}
        />
      )}

      {!isFolderContentList && isDocumentsManager && (
        <>
          <SDocumentButton
            onClick={onAddDocumentClick}
            tx={'documents_add_document'}
          />
          <SDocumentButton
            $right
            onClick={onAddFolderClick}
            tx={'documents_add_folder'}
          />
          {/* do we need the two inputs ?? */}
          <SHiddenInput
            type="file"
            id="file"
            accept=".pdf"
            ref={inputFile}
            onChange={handleInputChange(true)}
          />
        </>
      )}
      {isFolderContentList && isDocumentsManager && (
        <>
          <SDocumentButton
            $allSpace
            onClick={onAddDocumentClick}
            tx={'documents_add_document'}
          />
          {/* do we need the two inputs ?? */}
          <SHiddenInput
            type="file"
            id="file"
            accept=".pdf"
            ref={inputFile}
            onChange={handleInputChange(false)}
          />
        </>
      )}
    </SPage>
  );
};
