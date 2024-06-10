import * as React from 'react';
import dots from '../../assets/imgs/documents/documents_dots.svg';
import Loader from '../../components/Loader/Loader';
import fileIcon from '../../assets/imgs/documents/document-file.svg';
import arrowDown from '../../assets/imgs/documents/openedArrow.svg';
import arrowRight from '../../assets/imgs/documents/closedArrow.svg';
import folderIcon from '../../assets/imgs/documents/document-folder.svg';
import groupFolderIcon from '../../assets/imgs/documents/document-group-folder.svg';
import offlineFileIcon from '../../assets/imgs/documents/fileCloudYellow.svg';
import offlineFolderIcon from '../../assets/imgs/documents/document-offline-folder.svg';
import offlineGroupFolderIcon from '../../assets/imgs/documents/document-offline-group-folder.svg';
import { fetcDocumentGroups } from '../GroupsList/groupsSlice/actionCreators';
import { DocumentFolders } from '../../components/DocumentFolders/DocumentFolders';
import { selectGroupsIsLoading } from '../GroupsList/groupsSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { selectCreateFolderIsLoading } from './EditDocumentSlice';
import { selectUser, selectUserRoles } from '../Login/LoginSlice';
import { fetchFolders } from '../Documents/documentsSlice/actionCreators';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  DocumentFilter,
  DocumentFilters,
} from '../../components/DocumentFilter/DocumentFilter';
import {
  SContainer,
  SSearcFilterBar,
  STutorialText,
  SfoldersBox,
  SButton,
} from './styles';
import {
  fetchAddDocumentFolders,
  fetchAddDocumentGroupsAndFolders,
  fetchAddDocumentToGroups,
  fetchCreateFolders,
  fetchRemoveDocumentFromFolder,
  fetchRemoveDocumentFromGroup,
  fetchSetOffline,
  fetchShareDocumentWithMoreFolders,
  fetchShareDocumentWithMoreGroup,
} from './EditDocumentSlice/actionCreators';
import {
  selectDocumentGroupsWithSearchFilter,
  selectFiles,
  selectFolders,
  selectGroupsAccountsWithFilter,
  selectHasMultipleAccounts,
} from '../Documents/documentsSlice';
import { useTranslation } from 'react-i18next';
import { checkGroupOffline } from '../Documents/helpers';
import { Page } from '../../components/Page/Page';
import { useConfirmation } from '../../utils/ConfirmationServiceContext/confirmationContext';
import BigFloatButton from '../../components/BigFloatButton/BigFloatButton';

let getPdfFile = '';
export const handleSubmissions = (event: any) => {
  getPdfFile = event.target.files[0];
};

export const EditDocuments = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const { t } = useTranslation();
  const confirm = useConfirmation();

  const [type, setType] = React.useState({
    setOffline: params.type === 'managOffline' ? true : false,
    addDocument: params.type === 'addDocument' ? true : false,
    createFolders: params.type === 'createFolder' ? true : false,
    editAccess: params.type === 'editAccess' ? true : false,
  });

  const pdfFile: any = getPdfFile;
  const user: any = useAppSelector(selectUser);
  const roles = useAppSelector(selectUserRoles);
  const folders = useAppSelector(selectFolders);
  const documents = useAppSelector(selectFiles);
  const isLoading = useAppSelector(selectGroupsIsLoading);
  const isListLoading = useAppSelector(selectCreateFolderIsLoading);
  const isMultipleAccounts = useAppSelector(selectHasMultipleAccounts);
  const [unchecked, setUnchecked] = React.useState<Array<any>>([]);
  const [filterOpen, setFilterOpen] = React.useState<boolean>(false);
  const [isChecked, setIsChecked] = React.useState<Array<any>>([]);
  const [checkedData, setCheckedData] = React.useState<Array<any>>([]);
  const [foldersToShow, setFoldersToShow] = React.useState<Array<any>>([]);
  const [filesToShow, setFilesToShow] = React.useState<Array<any>>([]);
  const [isFolderOpen, setIsFolderOpen] = React.useState<any>({
    group: [],
    folder: [],
    file: [],
  });
  const [searchTerm, setSearchTerm] = React.useState<string | undefined>();
  const isSeeOrgGroups = roles?.includes('SeeOrgGroups');

  if (type.addDocument && !pdfFile) {
    navigate('/documents');
  }

  const [filters, setFilters] = React.useState<DocumentFilters>({
    showEmptyFolders: false,
    memberFilter: isSeeOrgGroups ? ['MEMBER'] : undefined,
    selectedData: 'SELECTED_ALL',
  });
  const [stagedFilters, setStagedFilters] = React.useState<DocumentFilters>({
    showEmptyFolders: false,
    memberFilter: isSeeOrgGroups ? ['MEMBER'] : undefined,
    selectedData: 'SELECTED_ALL',
  });

  const documentGroups = useAppSelector(
    selectDocumentGroupsWithSearchFilter(searchTerm, filters)
  );
  const groupAccounts = useAppSelector(
    selectGroupsAccountsWithFilter(stagedFilters)
  );
  const formData = new FormData();
  formData.append('FilePDF', pdfFile);

  React.useEffect(() => {
    dispatch(fetcDocumentGroups());
    dispatch(fetchFolders());
  }, []);
  React.useEffect(() => {
    setFilesToShow(documents);
    setFoldersToShow(folders);
    if (type.addDocument || type.createFolders) {
      setFilters({
        ...filters,
        showEmptyFolders: true,
      });
      setStagedFilters({
        ...filters,
        showEmptyFolders: true,
      });
    }
  }, [folders, documents]);
  React.useEffect(() => {
    if (
      type.editAccess &&
      documentGroups.length > 0 &&
      documents.length > 0 &&
      folders.length > 0
    ) {
      checkedData.splice(0);
      isChecked.splice(0);
      let selectedDocument: any = documents.find(
        (doc) => doc.id === Number(params.selectedFileId)
      );
      folders
        .filter((folder) => selectedDocument.folderids.includes(folder.ID))
        .forEach((e) => {
          !checkedData.includes(e) && checkedData.push(e);
          !isChecked.includes(e) && isChecked.push(e);
        });
      documentGroups
        .filter((group) =>
          selectedDocument.groups.find((e: any) => e.id === group.id)
        )
        .forEach((e) => {
          !checkedData.includes(e) && checkedData.push(e);
          !isChecked.includes(e) && isChecked.push(e);
        });
    }
  }, [documents, folders]);

  React.useLayoutEffect(() => {
    if (type.setOffline) {
      if (!!folders.length) {
        setIsChecked(
          folders
            .filter((e) => e.Offline)
            // @ts-ignore
            .concat(
              documentGroups.filter((e) =>
                checkGroupOffline(e.id, folders, documents)
              ),
              documents.filter(
                (e) =>
                  e.folders.find((f) => f.Offline) ||
                  e.groups.find((g) => g.offline)
              )
            )
        );
        setCheckedData(
          folders
            .filter((e) => e.Offline)
            // @ts-ignore
            .concat(
              documentGroups.filter((e) =>
                checkGroupOffline(e.id, folders, documents)
              ),
              documents.filter(
                (e) =>
                  e.folders.find((f) => f.Offline) ||
                  e.groups.find((g) => g.offline)
              )
            )
        );
      }
    }
  }, [folders]);

  const onFilter = (_filters: DocumentFilters) => {
    setFilters(_filters);
    setStagedFilters(_filters);

    setFilterOpen(false);
  };

  const onChange = (_filters: DocumentFilters) => {
    setStagedFilters({
      memberFilter: _filters.memberFilter,
      showEmptyFolders: _filters.showEmptyFolders,
    });
  };
  const resetStaged = () => {
    setStagedFilters({
      memberFilter: filters.memberFilter,
      showEmptyFolders: filters.showEmptyFolders,
      selectedData: filters.selectedData,
    });
  };

  const onSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleOpenFilter = () => {
    setFilterOpen(!filterOpen);
  };

  const handleOpenFolder = (folder: any) => {
    let currentOpened: any = { ...isFolderOpen };
    if (currentOpened.folder.includes(folder)) {
      let index = currentOpened.folder.indexOf(folder);
      currentOpened.folder.splice(index, 1);
    } else {
      currentOpened.folder.push(folder);
    }
    if (currentOpened.file.includes(folder)) {
      let index = currentOpened.file.indexOf(folder);
      currentOpened.file.splice(index, 1);
    } else {
      currentOpened.file.push(folder);
    }
    setIsFolderOpen(currentOpened);
  };

  const handleCheckBox = (
    folder: any,
    checked: boolean,
    groupID?: number,
    subFolderID?: number
  ) => {
    const isGroupChecked = documentGroups.includes(folder);
    const isFolderChecked = folders.includes(folder);
    const isFileChecked = documents.includes(folder);
    let currentChecked = [...isChecked];
    let currentFolders = [...foldersToShow];
    let currentData = [...checkedData];
    let currentDocuments = [...filesToShow];

    if (currentChecked.includes(folder)) {
      let index = currentChecked.indexOf(folder);
      currentChecked.splice(index, 1);
    } else {
      currentChecked.push(folder);
    }

    if (type.createFolders) {
      let newFolder = {
        Name: params?.value,
        GroupID: folder.id,
        offline: true,
      };
      if (!checked) {
        isFolderOpen.folder.push(folder);
        currentFolders.push(newFolder);
        currentData.push(newFolder);
      }
      if (checked) {
        isFolderOpen.folder.splice(isFolderOpen.folder.indexOf(folder), 1);
        currentFolders.splice(
          currentFolders.indexOf(
            currentFolders.find((e: any) => e.GroupID === folder.id && !e.ID)
          ),
          1
        );
        currentData.splice(
          currentData.indexOf(
            currentData.find((e: any) => e.GroupID === folder.id && !e.ID)
          ),
          1
        );
      }
    }

    if (type.setOffline) {
      if (isGroupChecked) {
        if (!checked) {
          if (!isChecked.includes(folder) && checkedData.includes(folder)) {
            unchecked.splice(unchecked.indexOf(folder), 1);
          }
          foldersToShow
            .filter((e) => e.GroupID === folder.id)
            .forEach((e) => {
              if (!isChecked.includes(e) && checkedData.includes(e)) {
                unchecked.splice(unchecked.indexOf(e), 1);
              }
              !currentChecked.includes(e) && currentChecked.push(e);
            });
          filesToShow
            .filter((d) => d.groups.find((e: any) => e.GroupID === folder.id))
            .forEach((file) => {
              if (!isChecked.includes(file) && checkedData.includes(file)) {
                unchecked.splice(unchecked.indexOf(file), 1);
              }
              !currentChecked.includes(file) &&
                currentChecked.push(file) &&
                currentChecked.push({
                  ...file,
                  groupID: folder.id,
                  folderID: undefined,
                });
            });
        }
        if (checked) {
          if (isChecked.includes(folder) && checkedData.includes(folder)) {
            !unchecked.includes(folder) && unchecked.push(folder);
          }
          foldersToShow
            .filter((e) => e.GroupID === folder.id)
            .forEach((e) => {
              if (isChecked.includes(e) && checkedData.includes(e)) {
                !unchecked.includes(e) && unchecked.push(e);
              }
              currentChecked.includes(e) &&
                currentChecked.splice(currentChecked.indexOf(e), 1);
            });
          filesToShow
            .filter((d) => d.groups.find((e: any) => e.GroupID === folder.id))
            .forEach((file) => {
              if (isChecked.includes(file) && checkedData.includes(file)) {
                !unchecked.includes(file) &&
                  //! what the fuck is that ?
                  //!{
                  unchecked.push({
                    ...file,
                    groupID: folder.id,
                    folderID: undefined,
                  });
                //!}
              }
              currentChecked.includes(file) &&
                currentChecked.splice(currentChecked.indexOf(file), 1);
            });
        }
      }
      if (isFolderChecked) {
        let groupByFolderID: any = documentGroups.find(
          (group) => group.id === folder.GroupID
        );
        let isEveryChecked =
          currentFolders
            .filter((fol) => fol.GroupID === groupByFolderID.id)
            .every((e) => currentChecked.includes(e)) &&
          currentDocuments
            .filter((doc) =>
              doc.groups.find((g: any) => g.GroupID === folder.GroupID)
            )
            .every((e) => currentChecked.includes(e));

        if (!checked) {
          if (!isChecked.includes(folder) && checkedData.includes(folder)) {
            unchecked.splice(unchecked.indexOf(folder), 1);
          }
          if (isEveryChecked && !currentChecked.includes(groupByFolderID)) {
            currentChecked.push(
              documentGroups.find((doc) => doc.id === folder.GroupID)
            );
          }
        }
        if (checked) {
          if (isChecked.includes(folder) && checkedData.includes(folder)) {
            !unchecked.includes(folder) && unchecked.push(folder);
          }
          if (currentChecked.includes(groupByFolderID)) {
            currentChecked.splice(
              currentChecked.indexOf(
                documentGroups.find((doc) => doc.id === folder.GroupID)
              ),
              1
            );
          }
        }
      }
      if (isFileChecked) {
        let groupByFileId: any = documentGroups.find((group) =>
          folder.groups.find((g: any) => g.GroupID === group.id)
        );
        let isEveryChecked =
          currentFolders
            .filter((fol) => fol.GroupID === groupByFileId?.id)
            .every((e) => currentChecked.includes(e)) &&
          currentDocuments
            .filter((doc) =>
              doc.groups.find((g: any) => g.GroupID === groupByFileId?.id)
            )
            .every((e) => currentChecked.includes(e));
        if (!checked) {
          if (!isChecked.includes(folder) && checkedData.includes(folder)) {
            unchecked.splice(
              unchecked.indexOf({ ...folder, groupID, subFolderID }),
              1
            );
          }
          if (isEveryChecked && groupID) {
            currentChecked.push({ ...folder, groupID, subFolderID });
          }
          !currentChecked.includes({ ...folder, groupID, subFolderID }) &&
            currentChecked.push({ ...folder, groupID, subFolderID });
        }
        if (checked) {
          if (isChecked.includes(folder) && checkedData.includes(folder)) {
            !unchecked.includes({ ...folder, groupID, subFolderID }) &&
              unchecked.push({ ...folder, groupID, subFolderID });
          }

          currentChecked.includes({ ...folder, groupID, subFolderID }) &&
            currentChecked.splice(
              currentChecked.indexOf({ ...folder, groupID, subFolderID }),
              1
            );
        }
      }
    }

    if (type.addDocument) {
      let newFile = {
        name: pdfFile.name,
        userId: user.id,
        userName: user.name,
        folders: [isFolderChecked && folder],
        folderids: [isFolderChecked && folder.ID],
        groups: [isGroupChecked && folder.id],
        GroupID: isGroupChecked && folder.id,
        original_filen_name: pdfFile.name,
      };
      if (!checked) {
        isFolderOpen.folder.push(folder);
        isGroupChecked && currentFolders.push(newFile);
        isFolderChecked && currentDocuments.push(newFile);
      }
      if (checked) {
        isFolderOpen.folder.splice(isFolderOpen.folder.indexOf(folder), 1);
        isGroupChecked &&
          currentFolders.splice(
            currentFolders.indexOf(
              currentFolders.find((e: any) => e.GroupID === folder.id && !e.ID)
            ),
            1
          );
        isFolderChecked &&
          currentDocuments.splice(
            currentDocuments.indexOf(
              currentDocuments.find(
                (d) =>
                  d.folderids.includes(folder.ID) &&
                  !Object.keys(d).includes('default')
              )
            ),
            1
          );
      }
    }

    if (type.editAccess) {
      if (checked && checkedData.includes(folder)) {
        unchecked.push(folder);
      }
      if (!checked && checkedData.includes(folder)) {
        unchecked.splice(unchecked.indexOf(folder), 1);
      }
    }

    setCheckedData(currentData);
    setIsChecked(currentChecked);
    setFoldersToShow(currentFolders);
    setFilesToShow(currentDocuments);
  };

  const handleAddFolder = () => {
    if (type.createFolders && checkedData.length > 0) {
      checkedData.forEach(e => {
        dispatch(fetchCreateFolders(e));
        setCheckedData([]);
        setIsChecked([]);
        setIsFolderOpen({ folder: [], file: [] });
        setType({ ...type, createFolders: false });
        navigate('/documents');
      });
    }
  };

  const handleSetOffline = () => {
    let files: any = [];
    unchecked.forEach((item) => {
      const dataObjects: any[] = [];

      if (documentGroups.includes(item)) {
        // group item
      } else if (foldersToShow.includes(item)) {
        // folder item
        dataObjects.push({ folderID: item.ID, offline: false });
      } else {
        if (item.subFolderID) {
          dataObjects.push({
            folderID: item.subFolderID,
            documentID: item.id,
            offline: false,
          });
        } else {
          dataObjects.push({
            groupID: item.groupID,
            documentID: item.id,
            offline: false,
          });
        }
      }

      files = [...files, ...dataObjects];
    });
    isChecked.forEach((item) => {
      const dataObjects: any[] = [];
      if (!checkedData.includes(item)) {
        if (documentGroups.includes(item)) {
          // group item
        } else if (foldersToShow.includes(item)) {
          // folder item
          dataObjects.push({ folderID: item.ID, offline: true });
        } else {
          if (item.subFolderID) {
            dataObjects.push({
              folderID: item.subFolderID,
              documentID: item.id,
              offline: true,
            });
          } else {
            dataObjects.push({
              groupID: item.groupID,
              documentID: item.id,
              offline: true,
            });
          }
        }
      }

      files = [...files, ...dataObjects];
    });

    dispatch(fetchSetOffline(files));
    setCheckedData([]);
    setIsChecked([]);
    navigate('/documents');
  };

  const handleAddDocument = () => {
    let checkedGroups = isChecked.filter((item) =>
      documentGroups.includes(item)
    ); //groups
    let checkedFolders = isChecked.filter((item) =>
      foldersToShow.includes(item)
    ); //folders
    if (checkedGroups.length > 0 && checkedFolders.length > 0) {
      checkedGroups.forEach((group) => {
        let foldersInGroup = checkedFolders.filter(
          (e) => e.GroupID === group.id
        );
        dispatch(
          fetchAddDocumentGroupsAndFolders(group.id, foldersInGroup, formData)
        );
        checkedGroups.splice(checkedGroups.indexOf(group), 1);
        foldersInGroup.forEach((folder) => {
          checkedFolders.splice(checkedFolders.indexOf(folder), 1);
        });
      });
    }
    if (checkedGroups.length > 0) {
      let groupIds = [...checkedGroups.map((e) => e.id)];
      dispatch(fetchAddDocumentToGroups(groupIds, formData));
      navigate('/documents');
    }
    if (checkedFolders.length > 0) {
      let folderIds = [...checkedFolders.map((e) => e.ID)];
      dispatch(fetchAddDocumentFolders(folderIds, formData));
      navigate('/documents');
    }
    navigate('/documents');
  };

  const handleEditAccess = () => {
    let isSmtChanged = false;
    isChecked.forEach((checkedItem) => {
      if (
        documentGroups.includes(checkedItem) &&
        !checkedData.includes(checkedItem)
      ) {
        dispatch(
          fetchShareDocumentWithMoreGroup(
            Number(params.selectedFileId),
            checkedItem.id
          )
        );
        isSmtChanged = true;
      }
      if (
        foldersToShow.includes(checkedItem) &&
        !checkedData.includes(checkedItem)
      ) {
        dispatch(
          fetchShareDocumentWithMoreFolders(
            Number(params.selectedFileId),
            checkedItem.ID
          )
        );
        isSmtChanged = true;
      }
    });

    if (unchecked.length > 0) isSmtChanged = true;

    setTimeout(() => {
      if (isChecked.length === 0) {
        confirm({
          title: 'warning',
          description: 'documents_remove_files_warning',
          onSubmit: () => {},
          confirmText: 'close',
        });
        return;
      }
      unchecked.forEach((uncheckItem) => {
        if (documentGroups.includes(uncheckItem)) {
          dispatch(
            fetchRemoveDocumentFromGroup(
              Number(params.selectedFileId),
              uncheckItem.id
            )
          );
          isSmtChanged = true;
        }
        if (foldersToShow.includes(uncheckItem)) {
          dispatch(
            fetchRemoveDocumentFromFolder(
              Number(params.selectedFileId),
              uncheckItem.ID
            )
          );
          isSmtChanged = true;
        }
      });
    });
    if (isChecked.length === 0) return;
    if (isSmtChanged) {
      navigate('/documents');
    } else {
      confirm({
        title: 'warning',
        description: 'documents_remove_files_warning',
        onSubmit: () => {},
        confirmText: 'close',
      });
    }
  };

  if (isLoading || isListLoading) {
    return <Loader />;
  }

  return (
    <Page>
      <SContainer>
        <SSearcFilterBar
          handleOpenFilter={handleOpenFilter}
          onSearch={onSearch}
        />
        {type.createFolders && (
          <STutorialText>{t('documents_tutorial_add_folder')}</STutorialText>
        )}
        {type.setOffline && (
          <STutorialText>{t('documents_tutorial_set_offline')}</STutorialText>
        )}
        {type.addDocument && (
          <STutorialText>{t('documents_tutorial_add_document')}</STutorialText>
        )}
        <SfoldersBox length={isChecked.length > 0}>
          {documentGroups.map((folder: any, index: number) => {
            const isOpenFolder = isFolderOpen.folder.includes(folder);
            return (
              <DocumentFolders
                key={index}
                type={type}
                dots={dots}
                index={index}
                folder={folder}
                fileIcon={fileIcon}
                documents={filesToShow}
                arrowDown={arrowDown}
                isChecked={isChecked}
                arrowRight={arrowRight}
                folderIcon={folderIcon}
                isOpenFolder={isOpenFolder}
                isFolderOpen={isFolderOpen}
                handleCheckBox={handleCheckBox}
                groupFolderIcon={groupFolderIcon}
                offlineFileIcon={offlineFileIcon}
                handleOpenFolder={handleOpenFolder}
                offlineFolderIcon={offlineFolderIcon}
                offlineGroupFolderIcon={offlineGroupFolderIcon}
                subFolders={foldersToShow
                  .filter((e) => e.GroupID === folder.id)
                  .concat(
                    filesToShow.filter((d) =>
                      d.groups.find((g: any) => g.GroupID === folder.id)
                    )
                  )}
              />
            );
          })}
        </SfoldersBox>

        {isChecked.length > 0 && type.createFolders && (
          <SButton onClick={handleAddFolder}> Add </SButton>
        )}
        {isChecked.length > 0 && type.addDocument && (
          <SButton onClick={handleAddDocument}> Add </SButton>
        )}
        {(unchecked.length > 0 || isChecked.length > checkedData.length) &&
          type.setOffline && (
            <BigFloatButton onClick={handleSetOffline} tx="set_unset_files" />
          )}
        {type.editAccess && (
          <BigFloatButton
            onClick={handleEditAccess}
            tx="documents_share_document"
          />
        )}

        <DocumentFilter
          data={groupAccounts} // if subbaccounts
          isOpen={filterOpen}
          setIsOpen={setFilterOpen}
          onFilter={onFilter}
          onChange={onChange}
          resetStaged={resetStaged}
          initialtShowEmptyFolders={filters.showEmptyFolders}
          initialtMemberFilter={
            isSeeOrgGroups ? new Set(stagedFilters.memberFilter) : undefined
          }
          initialSelectedData={
            filters.selectedData === 'SELECTED_ALL'
              ? new Set(groupAccounts.map((g) => g.id))
              : filters.selectedData !== 'UNSELECTED_ALL'
              ? filters.selectedData
              : undefined
          }
        />
      </SContainer>
    </Page>
  );
};
