import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getGroupById } from '../../../apis/groupsAPI';
import { Checklist } from '../../../containers/Checklists/checklistsSlice/types';
import { GroupDetail } from '../../../containers/GroupDetail/groupDetailSlice/types';
import { useAppSelector } from '../../../hooks';
import { palette } from '../../../theme/colors';
import { useLayoutContext } from '../../../utils/customHooks/LayoutContext';
import { Backdrop } from '../../Backdrop/Backdrop';
import { SCancel } from '../../Options/Options';
import { selectUserRoles } from '../../../containers/Login/LoginSlice';
import { useParams } from 'react-router-dom';
import ChecklistDetailsButtons from './ChecklistDetailsButtons';
import { translate } from '../../../utils/translate';
import ChecklistInfo from './ChecklistInfo';

interface ChecklistDetailsProps {
  isOpen: boolean;
  setIsOpen: () => void;
  data: Checklist | null;
  setAddItemModalOpen?: () => void;
}

function ChecklistDetails(props: ChecklistDetailsProps) {
  const { isOpen, setIsOpen, data, setAddItemModalOpen } = props;

  const { id: idFromUrl } = useParams();
  const layout = useLayoutContext();

  const roles = useAppSelector(selectUserRoles);
  const insideChecklist = idFromUrl !== undefined;

  const [foundSharedGroups, setFoundSharedGroups] = useState<GroupDetail[]>([]);

  useEffect(() => {
    let isMounted = true;
    getGroups().then((data) => {
      if (isMounted && data) setFoundSharedGroups(data);
    });
    return () => {
      isMounted = false;
    };
  }, [data, isOpen]);

  useEffect(() => {
    layout.setTabsState(!isOpen);
    if (!isOpen) setFoundSharedGroups([]);
  }, [isOpen]);

  const getGroups = async () => {
    if (!data?.sharedGroups) return;
    let tempArr: GroupDetail[] = [];
    for await (let groupId of data?.sharedGroups) {
      try {
        if (!tempArr.find((group) => group.id === groupId)) {
          const foundGroup = await getGroupById(groupId);
          tempArr.push(foundGroup);
        }
      } catch (error) {
        console.error('Error: Failed to find group');
      }
    }
    return tempArr;
  };

  const canEdit = roles?.includes('EditLiveChecklists');

  if (!data) return <></>;

  const { id, name, status } = data;

  if (!isOpen) return <></>;

  return (
    <>
      <SChecklistSettingsContainer>
        <ChecklistInfo data={data} foundSharedGroups={foundSharedGroups} />
        <ChecklistDetailsButtons
          canEdit={canEdit}
          status={status}
          insideChecklist={insideChecklist}
          id={id}
          foundSharedGroups={foundSharedGroups}
          setIsOpen={setIsOpen}
          name={name}
          setAddItemModalOpen={setAddItemModalOpen}
        />
        <SCancel onClick={setIsOpen} className="wrapper cancel">
          <p>{translate(`cancel`)}</p>
        </SCancel>
      </SChecklistSettingsContainer>
      <Backdrop setModal={setIsOpen} />
    </>
  );
}

export default ChecklistDetails;

const SChecklistSettingsContainer = styled.div`
  position: fixed;
  left: 50%;
  bottom: 0;
  transform: translate(-50%);
  max-height: 100vh;
  width: 100%;
  padding: 0 1rem;
  max-width: 26rem;
  z-index: 999;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .wrapper + * {
    margin-top: 0.5rem;
  }
`;

export const SChecklistSettingsWrapper = styled.div<any>`
  cursor: ${(props) => props.button && 'pointer'};
  background-color: ${palette.prussianBlue2};
  border-radius: 14px;
  max-height: 24rem;
  height: 100%;
  width: 100%;
  padding: ${(props) => (props.button ? '0.5rem 0' : '1.5rem')};
  display: flex;
  flex-direction: column;
  overflow-wrap: break-word;
`;

export const SChecklistSettings = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 0;
}
`;

export const SHeader = styled.div`
  font-family: 'Roboto-Medium';
  font-weight: 500;
  font-size: 18px;
  padding-bottom: 0.75rem;
`;

export const SWrapper = styled.div`
  display: flex;
  flex-direction: column;
  div + * {
    margin-top: 0.5rem;
  }
`;

export const SBottomWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
`;

export const SRow = styled.div`
  display: flex;
  justify-content: space-between;
  height: 100%;
  min-height: 0;
`;

export const SName = styled.span`
  color: ${palette.silver};
  font-family: 'Roboto-Regular';
  font-weight: 400;
  font-size: 14px;
  min-width: 5rem;
`;

export const SValue = styled.span`
  text-align: end;
  font-family: 'Roboto-Regular';
  font-weight: 400;
  font-size: 14px;
  min-height: 1rem;
`;

export const SSharedContainer = styled.div`
  display: flex;
  flex-direction: column;
  * + * {
    margin-top: 10px;
  }
  text-align: right;
  overflow: auto;
`;

export const SChecklistButton = styled.div`
  font-family: 'Roboto-Regular';
  display: flex;
  width: 100%;
  justify-content: space-between;
  padding: 1rem 1.5rem;
`;

export const SLine = styled.hr`
  margin: 1.25rem 0;
  width: 100%;
  border: 1px solid ${palette.tinyBorder};
`;
