import { compact } from 'lodash';
import { NavigateFunction } from 'react-router-dom';
import { FilesAndFoldersOptionsInfo } from '../../components/FilesAndFoldersOptions/FilesAndFoldersOptions';
import { OptionItemProps } from '../../components/Options/Options';
import { ConfirmationOptions } from '../../utils/ConfirmationServiceContext/confirmationContext';
import { dateFormats, getDateFormatCustom } from '../../utils/date';
import { translate } from '../../utils/translate';
import { FileItem, FolderItem } from '../Documents/documentsSlice/types';
import { Group } from '../GroupsList/groupsSlice/types';
import { BrowseFolderOptionsStateType, SelectedDocument } from './BrowseFolder';
import SetOFFLineIcon from '../../assets/imgs/documents/document-set-offline.svg';
import EditAccess from '../../assets/imgs/documents/document-edit-access.svg';
import Delete from '../../assets/imgs/documents/document-delete.svg';
import Edit from '../../assets/imgs/documents/document-edit.svg';
import {
  deleteFile,
  deleteFolder,
  toggleFileOrFolderOffline,
  renameFolder as renameFolderAction,
} from '../Documents/documentsSlice/actionCreators';
import { AppDispatch } from '../../store';
import { isDocumentOffline } from '../Documents/helpers';
import { ToggleOfflineModel } from '../../apis/documentsAPI/types';

function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export const getFileOrFolderInfoById = (
  files: FileItem[],
  folders: FolderItem[],
  groupFolder: Group,
  selected: SelectedDocument,
  groupId?: number,
  folderId?: number
): FilesAndFoldersOptionsInfo => {
  let info: FilesAndFoldersOptionsInfo = {
    created: '',
    creator: '',
    sharedWith: [''],
    size: '',
    title: '',
    type: '',
  };
  if (selected.type === 'FILE') {
    const _selectedFile = files.find(file => file.id === selected.id);
    if (_selectedFile)
      info = {
        created:
          getDateFormatCustom(
            _selectedFile.upload_time,
            dateFormats.yearMonthDayTimeNoComma24
          ) || '',
        creator:
          _selectedFile.userName || translate('documents_not_specified')!,
        sharedWith: [
          ...compact(_selectedFile.groups.map(g => g.name)),
          ...compact(_selectedFile.folders.map(f => f.Name)),
        ],
        size: formatBytes(_selectedFile.file_size),
        title: _selectedFile.name,
        type: isDocumentOffline(_selectedFile, groupId, folderId)
          ? translate('documents_offline')
          : translate('documents_online'),
      };
  }
  if (selected.type === 'FOLDER') {
    const _selectedFolder = folders.find(folder => folder.ID === selected.id);
    const filesOdSelectedFolder = files.filter(file =>
      file.folderids.includes(selected.id)
    );

    const filesSize = filesOdSelectedFolder
      .map(file => file.file_size)
      .reduce((accumulator, value) => {
        return accumulator + value;
      }, 0);

    const filesInFolderLength = files.filter(file =>
      file.folderids.includes(selected.id)
    ).length;
    info = {
      created: _selectedFolder?.creationTime
        ? getDateFormatCustom(
            _selectedFolder?.creationTime,
            dateFormats.yearMonthDayTimeNoComma24
          )
        : '',
      creator: _selectedFolder?.userName || '',
      sharedWith: [groupFolder.name],
      size: formatBytes(filesSize),
      title: _selectedFolder?.Name || translate('documents_not_specified')!,
      type: _selectedFolder?.Offline
        ? translate('documents_offline')
        : translate('documents_online'),
      insideCount: filesInFolderLength,
    };
  }
  return info;
};

const ToggleOffline =
  (
    toggleOfflineModel: ToggleOfflineModel,
    isOffline: boolean,
    confirm: (options: ConfirmationOptions) => Promise<void>,
    toggleIsOpen: () => void,
    dispatch: AppDispatch
  ) =>
  () => {
    confirm({
      title: 'messages_confirmation',
      description: isOffline
        ? 'documents_document_unset_offline_intro'
        : 'documents_document_set_offline_intro',
      onSubmit: () => {
        dispatch(toggleFileOrFolderOffline({ toggleOfflineModel, confirm }));
        toggleIsOpen();
      },
      onCancel: () => {},
      confirmText: isOffline ? 'documents_unset' : 'documents_setOffline',
    });
  };

const renameFolder =
  (
    selected: SelectedDocument,
    currentName: string,
    confirm: (options: ConfirmationOptions) => Promise<void>,
    toggleIsOpen: () => void,
    dispatch: AppDispatch
  ) =>
  () => {
    confirm({
      title: 'documents_name_folder',
      onSubmit: text => {
        dispatch(
          renameFolderAction({
            params: { id: selected.id, name: text || '' },
            confirm,
          })
        );
        toggleIsOpen();
      },
      onCancel: () => {},
      confirmText: 'messages_proceed',
      inputBox: true,
      inputBoxIntialValue: currentName,
      placeholderTx: 'documents_folder_name',
    });
  };

const deleteFolderOrFile =
  (
    selected: SelectedDocument,
    confirm: (options: ConfirmationOptions) => Promise<void>,
    dispatch: AppDispatch,
    toggleIsOpen: () => void,
    fileDelete?: { groupIds?: number[]; folderIds?: number[] }
  ) =>
  () => {
    if (selected.type === 'FOLDER') {
      confirm({
        title: 'messages_confirmation',
        description: 'documents_delete_document_confirm',
        onSubmit: () => {
          dispatch(deleteFolder(selected.id));
          toggleIsOpen();
        },
        onCancel: () => {},
        confirmText: 'delete',
        confirmStyle: 'red',
      });
    }
    if (selected.type === 'FILE') {
      confirm({
        title: 'messages_confirmation',
        description: 'documents_delete_document_confirm',
        onSubmit: () => {
          fileDelete &&
            dispatch(
              deleteFile({
                id: selected.id,
                folderIds: fileDelete.folderIds,
                groupIds: fileDelete.groupIds,
              })
            );
          toggleIsOpen();
        },
        onCancel: () => {},
        confirmText: 'delete',
        confirmStyle: 'red',
      });
    }
  };

const editFileAccess =
  (
    navigation: NavigateFunction,
    selected: SelectedDocument,
    groupFolderId: number,
    browseFolderId?: number
  ) =>
  () => {
    if (browseFolderId) {
      navigation(
        `/documents/${groupFolderId}/${browseFolderId}/editAccess/${selected.id}`
      );
      return;
    }
    navigation(`/documents/${groupFolderId}/editAccess/${selected.id}`);
  };

export interface GenerateOptionsProps {
  dependencies: {
    confirm: (options: ConfirmationOptions) => Promise<void>;
    navigation: NavigateFunction;
    setOptionsState: React.Dispatch<
      React.SetStateAction<BrowseFolderOptionsStateType>
    >;
    groupFolderId: number;
    browseFolderId?: number;
    dispatch: AppDispatch;
  };
  files: FileItem[];
  folders: FolderItem[];
  selected: SelectedDocument;
  isDocumentsManager: boolean;
}
export const generateOptions = (props: GenerateOptionsProps) => {
  const { dependencies, files, folders, selected, isDocumentsManager } = props;
  const {
    confirm,
    navigation,
    setOptionsState,
    groupFolderId,
    browseFolderId,
    dispatch,
  } = dependencies;

  const toggleIsOpen = () => {
    setOptionsState(prev => ({ ...prev, isOpen: !prev.isOpen }));
  };

  if (isDocumentsManager) {
    if (selected.type === 'FOLDER') {
      const _selectedFolder = folders.find(folder => folder.ID === selected.id);
      const isOffline = _selectedFolder?.Offline;

      const options: OptionItemProps[] = [
        {
          callback: ToggleOffline(
            { offline: !isOffline, folderID: selected.id },
            !!isOffline,
            confirm,
            toggleIsOpen,
            dispatch
          ),
          icon: SetOFFLineIcon,
          name: isOffline
            ? 'documents_unset_offline_status'
            : 'documents_set_mandatory_offline',
        },
        {
          callback: renameFolder(
            selected,
            _selectedFolder?.Name!,
            confirm,
            toggleIsOpen,
            dispatch
          ),
          icon: Edit,
          name: 'documents_rename_folder',
        },
        {
          callback: deleteFolderOrFile(
            selected,
            confirm,
            dispatch,
            toggleIsOpen
          ),
          icon: Delete,
          name: 'messages_delete',
        },
      ];
      setOptionsState(prev => ({ ...prev, isOpen: true, options }));
    }
    if (selected.type === 'FILE') {
      const _selectedFile = files.find(file => file.id === selected.id);
      const fileGroupIds = _selectedFile?.groups.map(g => g.GroupID);
      const fileFolderIds = _selectedFile?.folderids;
      // const isOffline = _selectedFile?.offline;
      const isOffline = isDocumentOffline(
        _selectedFile!,
        groupFolderId,
        browseFolderId
      );

      const options: OptionItemProps[] = [
        {
          callback: ToggleOffline(
            browseFolderId
              ? {
                  offline: !isOffline,
                  documentID: selected.id,
                  folderID: browseFolderId,
                }
              : {
                  offline: !isOffline,
                  documentID: selected.id,
                  groupID: groupFolderId,
                },
            !!isOffline,
            confirm,
            toggleIsOpen,
            dispatch
          ),
          icon: SetOFFLineIcon,
          name: !isOffline
            ? 'documents_set_mandatory_offline'
            : 'documents_unset_offline_status',
        },
        {
          callback: editFileAccess(
            navigation,
            selected,
            groupFolderId,
            browseFolderId
          ),
          icon: EditAccess,
          name: 'checklist_edit_acces',
        },
        {
          callback: deleteFolderOrFile(
            selected,
            confirm,
            dispatch,
            toggleIsOpen,
            { folderIds: fileFolderIds, groupIds: fileGroupIds }
          ),
          icon: Delete,
          name: 'messages_delete',
        },
      ];
      setOptionsState(prev => ({ ...prev, isOpen: true, options }));
    }
  } else {
    setOptionsState(prev => ({ ...prev, options: [] }));
  }
};
