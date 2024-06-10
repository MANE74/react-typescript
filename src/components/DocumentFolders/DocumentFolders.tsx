import styled from 'styled-components';
import {
  checkGroupOffline,
  isDocumentOffline,
} from '../../containers/Documents/helpers';
import { palette } from '../../theme/colors';
import SCheckbox from '../FilterItem/SBoxButton';

interface IFolder {
  type: any;
  dots: string;
  index: number;
  folder: any;
  fileIcon: string;
  documents: Array<any>;
  isChecked: Array<any>;
  arrowDown: string;
  folderIcon: string;
  arrowRight: string;
  subFolders: Array<any>;
  isOpenFolder: boolean;
  isFolderOpen: any;
  handleCheckBox: Function;
  offlineFileIcon: string;
  groupFolderIcon: string;
  handleOpenFolder: Function;
  offlineFolderIcon: string;
  offlineGroupFolderIcon: string;
}
const SmapItem = styled.div``;
const SCheckBox = styled(SCheckbox)`
  width: 500px;
`;
const SCheckBoxContainer = styled.div``;
const SGroupIcon = styled.img`
  height: 34%;
`;
const SFolderIcon = styled.img`
  height: 38%;
`;
const SFileIcon = styled.img`
  height: 35%;
`;
const Name = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 25px;
`;
const FoldersItemBox = styled.div`
  cursor: pointer;
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${palette.pickedBluewood};
`;
const SubFolderItem = styled.div`
  cursor: pointer;
  width: 100%;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const InnerFolders = styled.div`
  width: 100%;
  display: flex;
  transition: 1s;
  min-height: 0px;
  align-items: center;
  padding-left: 20px;
  justify-content: space-between;
`;
const SInnerFolders = styled.div`
  width: 100%;
  display: flex;
  transition: 1s;
  min-height: 0px;
  padding-left: 55px;
  align-items: center;
  justify-content: space-between;
`;
const InnerItem = styled.div`
  width: 100%;
  margin: 15px;
  display: flex;
  cursor: pointer;
  justify-content: center;
  flex-direction: column;
`;
const SArrowIcon = styled.div`
  height: 22px;
  width: 35px;
  cursor: pointer;
  transition: 0.1s;
`;
const SLine = styled.div`
  width: 100%;
  border-bottom: 1px solid ${palette.pickedBluewood};
`;

export function DocumentFolders({
  type,
  index,
  folder,
  fileIcon,
  isChecked,
  arrowDown,
  documents,
  arrowRight,
  subFolders,
  folderIcon,
  isOpenFolder,
  isFolderOpen,
  handleCheckBox,
  offlineFileIcon,
  groupFolderIcon,
  handleOpenFolder,
  offlineFolderIcon,
  offlineGroupFolderIcon,
}: IFolder) {
  const activeType =
    type.createFolders ||
    type.addDocument ||
    type.setOffline ||
    type.editAccess;

  return (
    <SmapItem>
      <FoldersItemBox
        onClick={activeType ? () => handleOpenFolder(folder, index) : () => {}}
      >
        <SArrowIcon>
          {subFolders.length > 0 && activeType && (
            <img alt="arrowIcon" src={isOpenFolder ? arrowDown : arrowRight} />
          )}
        </SArrowIcon>
        <SGroupIcon
          alt="folderIcon"
          src={
            checkGroupOffline(folder.id, subFolders, documents)
              ? offlineGroupFolderIcon
              : groupFolderIcon
          }
        />
        <InnerItem>
          <Name> {folder.name.slice(0, 30)} </Name>
        </InnerItem>
        {activeType && (
          <SCheckBoxContainer
            onClick={() => handleCheckBox(folder, isChecked.includes(folder))}
          >
            <SCheckBox isChecked={isChecked.includes(folder)} />
          </SCheckBoxContainer>
        )}
      </FoldersItemBox>
      {isOpenFolder &&
        subFolders.map((subFolder: any, subFolderIndex: number) => {
          const folderFiles = documents.filter((file) =>
            file.folderids.includes(subFolder.ID)
          );
          const includeFld = isFolderOpen.folder.includes(subFolder);
          const isFile = Object.keys(subFolder).includes('original_filen_name');
          const isFolder = subFolders.includes(subFolder);

          return (
            <SmapItem key={subFolderIndex}>
              <InnerFolders>
                <SubFolderItem
                  onClick={
                    activeType
                      ? () => handleOpenFolder(subFolder, subFolderIndex)
                      : () => {}
                  }
                >
                  <SArrowIcon>
                    {folderFiles.length > 0 && !isFile && (
                      <img
                        alt="arrowIcon"
                        src={includeFld ? arrowDown : arrowRight}
                      />
                    )}
                  </SArrowIcon>
                  <SFolderIcon
                    src={
                      isFile
                        ? type.setOffline &&
                          isDocumentOffline(subFolder, folder.id, undefined)
                          ? offlineFileIcon
                          : fileIcon
                        : subFolder.Offline
                        ? offlineFolderIcon
                        : folderIcon
                    }
                    alt="folderIcon"
                  />
                  <InnerItem>
                    <Name>
                      {isFile ? subFolder.name.slice(0, 22) : subFolder.Name}
                    </Name>
                  </InnerItem>
                  {(type.addDocument
                    ? !isFile
                    : type.setOffline
                    ? true
                    : type.editAccess
                    ? !isFile
                    : type.createFolders && !isFile && !isFolder) && (
                    <SCheckBoxContainer
                      onClick={() =>
                        !!isFile
                          ? handleCheckBox(
                              subFolder,
                              isChecked.includes(subFolder),
                              folder.id,
                              undefined
                            )
                          : handleCheckBox(
                              subFolder,
                              isChecked.includes(subFolder)
                            )
                      }
                    >
                      <SCheckBox isChecked={isChecked.includes(subFolder)} />
                    </SCheckBoxContainer>
                  )}
                </SubFolderItem>
              </InnerFolders>
              {includeFld &&
                folderFiles.map((file: any, fileIndex: number) => {
                  return (
                    <SInnerFolders key={fileIndex}>
                      <SubFolderItem>
                        <SFileIcon
                          src={
                            isDocumentOffline(file, folder.id, subFolder.ID)
                              ? offlineFileIcon
                              : fileIcon
                          }
                          alt="folderIcon"
                        />
                        <InnerItem>
                          <Name>
                            {file.name.slice(0, 22)}
                            {file.name.length > 22 && '...'}
                          </Name>
                        </InnerItem>
                        {!type.createFolders &&
                          !type.addDocument &&
                          !type.editAccess && (
                            <SCheckBoxContainer
                              onClick={() =>
                                handleCheckBox(
                                  file,
                                  isChecked.includes(file),
                                  folder.id,
                                  subFolder.ID
                                )
                              }
                            >
                              <SCheckBox isChecked={isChecked.includes(file)} />
                            </SCheckBoxContainer>
                          )}
                      </SubFolderItem>
                    </SInnerFolders>
                  );
                })}
            </SmapItem>
          );
        })}
      {isOpenFolder && <SLine></SLine>}
    </SmapItem>
  );
}
