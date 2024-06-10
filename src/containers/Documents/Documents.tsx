import * as React from 'react';
import styled, { css } from 'styled-components';
import { DocumentType } from '../../components/FolderitemCard/FolderItemCard';
import { SearchFilterBar } from '../../components/SearchFilterBar/SearchFilterBar';

import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  fetchFolders,
  toggleGroupOffline,
} from './documentsSlice/actionCreators';
import {
  selectDocumentGroupsWithSearchFilter,
  selectDocumentsIsListLoading,
  selectFiles,
  selectFolders,
  selectGroupsAccountsWithFilter,
  selectHasMultipleAccounts,
} from './documentsSlice';
import { Page } from '../../components/Page/Page';
import { DocumentItem } from '../../components/DocumentItem/DocumentItem';
import {
  DocumentFilter,
  DocumentFilters,
} from '../../components/DocumentFilter/DocumentFilter';
import Loader from '../../components/Loader/Loader';
import { useNavigate } from 'react-router-dom';
import { EmptyListFallback } from '../../components/EmptyListFallback/EmptyListFallback';

import EmptyDocuments from '../../assets/imgs/NotFound/no-result.svg';
import { checkGroupOffline } from './helpers';
import { selectUser } from '../Login/LoginSlice';
import { getCurrentUserById } from '../Login/LoginSlice/actionCreators';
import { OptionItemProps } from '../../components/Options/Options';

import SetOFFLineIcon from '../../assets/imgs/documents/document-set-offline.svg';
import { SDocumentButton, SHiddenInput, SOptions } from './styles';
import { useConfirmation } from '../../utils/ConfirmationServiceContext/confirmationContext';
import { handleSubmissions } from '../EditDocuments/EditDocuments';
import { palette } from '../../theme/colors';

interface OptionsStateType extends OptionItemProps {
  isOpen: boolean;
  selectedId?: number;
}
export interface Document {
  id: number;
  name: string;
  group: string;
  count: number;
  varient: DocumentType;
}
export interface DocumentFiles
  extends Omit<Document, 'varient' | 'group' | 'count'> {
  varient: 'document_vertical_date';
  size: string;
  date: string;
}

export interface IDocumentsProps {
  isHeaderOptionsOpen: boolean;
  setHeaderOptionsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SPage = styled(Page)`
  padding: 1.25rem 0 1.25rem 0;
  /* to make only the list overflow */
  position: relative;
  height: 100%;
`;

const SList = styled.ul<{ $bottomPad?: boolean }>`
  width: 90%;
  margin: 0.1875rem auto 1.25rem auto;

  list-style-type: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  overflow-y: auto;

  height: calc(100% - 4.25rem);

  ${props =>
    props.$bottomPad &&
    css`
      padding-bottom: 4.375rem;
    `}

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const SSearchFilterBar = styled(SearchFilterBar)<{
  $withoutFilterButton?: boolean;
}>`
  width: 90%;
  margin: auto;
  .SSearchBarBase {
    input {
      ::placeholder {
        color: ${palette.silver};
        opacity: 1;
      }

      :-ms-input-placeholder {
        color: ${palette.silver};
        font-size: 1rem;
      }

      ::-ms-input-placeholder {
        color: ${palette.silver};
        font-size: 1rem;
      }
    }
  }
  ${props =>
    props.$withoutFilterButton &&
    css`
      .SSearchBarBase {
        width: 100%;
      }
    `}
`;

export const Documents = (props: IDocumentsProps) => {
  const { isHeaderOptionsOpen, setHeaderOptionsOpen } = props;

  const inputFile = React.useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = React.useState<string | undefined>();
  const [filterOpen, setFilterOpen] = React.useState<boolean>(false);

  const dispatch = useAppDispatch();
  const navigation = useNavigate();
  const confirm = useConfirmation();

  const user = useAppSelector(selectUser);

  const folders = useAppSelector(selectFolders);
  const files = useAppSelector(selectFiles);
  const isMultipleAccounts = useAppSelector(selectHasMultipleAccounts);
  const isSeeOrgGroups = user?.roles?.includes('SeeOrgGroups');
  const isDocumentsManager = user?.roles?.includes('DocumentsManager');

  const [filters, setFilters] = React.useState<DocumentFilters>({
    showEmptyFolders: !!isDocumentsManager,
    memberFilter: isSeeOrgGroups ? ['MEMBER'] : undefined,
    selectedData: 'SELECTED_ALL',
  });
  const [stagedFilters, setStagedFilters] = React.useState<DocumentFilters>({
    showEmptyFolders: !!isDocumentsManager,
    memberFilter: isSeeOrgGroups ? ['MEMBER'] : undefined,
    selectedData: 'SELECTED_ALL',
  });

  const documentGroups = useAppSelector(
    selectDocumentGroupsWithSearchFilter(searchTerm, filters)
  );

  const groupAccounts = useAppSelector(
    selectGroupsAccountsWithFilter(stagedFilters)
  );

  const isLoading = useAppSelector(selectDocumentsIsListLoading);

  React.useEffect(() => {
    if (!user) dispatch(getCurrentUserById());
    dispatch(fetchFolders());
    // do we need this performance guard ?
    // if (documentGroups.length === 0) dispatch(fetchFolders());
  }, []);

  // OPTIONS MANAGMENT START ================================================================
  const [optionsState, setOptionsState] = React.useState<OptionsStateType>({
    isOpen: false,
    icon: SetOFFLineIcon,
  });
  var options: OptionItemProps[] = [
    {
      name: optionsState.name,
      icon: optionsState.icon,
      callback: optionsState.callback,
    },
  ];
  const setOptionsOpen = (isOpen: boolean) => {
    setOptionsState(prev => ({ ...prev, isOpen }));
  };

  // header options start
  const handleManageOffline = () => {
    navigation('edit/managOffline');
    setHeaderOptionsOpen(false);
  };
  React.useEffect(() => {
    if (isHeaderOptionsOpen) {
      setOptionsState(prev => ({
        ...prev,
        isOpen: true,
        selectedId: undefined,
        name: 'documents_manage_offline_files',
        callback: handleManageOffline,
      }));
    }
  }, [isHeaderOptionsOpen]);

  React.useEffect(() => {
    setOptionsState({
      isOpen: false,
      icon: SetOFFLineIcon,
    });
    return () => {
      setOptionsState({
        isOpen: false,
        icon: SetOFFLineIcon,
      });
    };
  }, []);
  // header options end

  const toggleOnline = (offline: boolean, id: number) => () => {
    confirm({
      title: 'messages_confirmation',
      description: offline
        ? 'documents_document_unset_offline_intro'
        : 'documents_document_set_offline_intro',
      onSubmit: () => {
        dispatch(toggleGroupOffline({ id, offline: !offline, confirm }));
        setOptionsOpen(false);
      },
      onCancel: () => {},
      confirmText: offline ? 'documents_unset' : 'documents_setOffline',
      confirmStyle: 'fit-big-text',
    });
  };

  const handleMoreOtionClick = (id: number) => {
    const isOffline = checkGroupOffline(id, folders, files);
    setOptionsState(prev => ({
      ...prev,
      isOpen: true,
      selectedId: id,
      name: isOffline
        ? 'documents_unset_offline_status'
        : 'documents_set_mandatory_offline',
      callback: toggleOnline(isOffline, id),
    }));
  };

  // OPTIONS MANAGMENT END ================================================================
  const toggleFilterOpen = () => setFilterOpen(prev => !prev);

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

  const handleDocumentRedirect = (id: number) => navigation(`${id}`);

  // createing folder & adding documents functionality

  const handleCreateFolder = (text: string | undefined) => {
    navigation(`edit/createFolder/${text}`);
  };

  const handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
    handleSubmissions(event);
    navigation('edit/addDocument');
  };
  const onAddDocumentClick = () => inputFile.current?.click();
  const onAddFolderClick = () => {
    confirm({
      title: 'documents_name_folder',
      onSubmit: text => {
        handleCreateFolder(text);
      },
      onCancel: () => {},
      confirmText: 'messages_proceed',
      inputBox: true,
      placeholderTx: 'documents_folder_name',
      confirmStyle: 'standard',
    });
  };

  // renders
  if (isLoading) return <Loader />;

  return (
    <SPage>
      <SSearchFilterBar
        onSearch={onSearch}
        handleOpenFilter={toggleFilterOpen}
        value={searchTerm}
      />

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
            ? new Set(groupAccounts.map(g => g.id))
            : filters.selectedData !== 'UNSELECTED_ALL'
            ? filters.selectedData
            : undefined
        }
      />

      <EmptyListFallback
        src={EmptyDocuments}
        listLength={documentGroups.length}
        isLoading={isLoading}
        searchTerm={''}
        emptyListTx={'documents_empty_list'}
        noSearchTx={'documents_not_found_by_search'}
      />
      {documentGroups.length !== 0 && (
        <SList $bottomPad={isDocumentsManager}>
          {documentGroups.map((group, index) => (
            <DocumentItem
              key={`${group.id}-${index}`}
              iconVariant={
                checkGroupOffline(group.id, folders, files)
                  ? 'OFFLINE_GROUP_FOLDER'
                  : 'GROUP_FOLDER'
              }
              title={group.name}
              subTitle={
                isMultipleAccounts
                  ? group.subOrganizationname
                    ? group.subOrganizationname
                    : group.organizationName!
                  : undefined
              }
              onCLick={handleDocumentRedirect}
              itemId={group.id}
              onMoreOptionClick={
                isDocumentsManager ? handleMoreOtionClick : undefined
              }
            />
          ))}
        </SList>
      )}

      {isDocumentsManager && (
        <SOptions
          items={options}
          isOpen={optionsState.isOpen}
          setIsOpen={setOptionsOpen}
          setTabBar
        />
      )}
      {isDocumentsManager && !optionsState.isOpen && (
        <>
          <SDocumentButton
            onClick={onAddDocumentClick}
            tx={'documents_add_document'}
          />
          <SDocumentButton
            $right
            tx={'documents_add_folder'}
            onClick={onAddFolderClick}
          />
        </>
      )}
      {/* adding document input  */}
      <SHiddenInput
        type="file"
        id="file"
        accept=".pdf"
        ref={inputFile}
        onChange={handleInputChange}
      />
    </SPage>
  );
};
