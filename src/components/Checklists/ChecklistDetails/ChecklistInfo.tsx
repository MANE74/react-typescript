import React from 'react';
import { Checklist } from '../../../containers/Checklists/checklistsSlice/types';
import { SName } from '../../../containers/GroupDetail';
import { GroupDetail } from '../../../containers/GroupDetail/groupDetailSlice/types';
import { getDateFormatCustom, dateFormats } from '../../../utils/date';
import { ChecklistStatus } from '../../../utils/enums';
import { translate } from '../../../utils/translate';
import { SHeader } from '../../FilterOrSelectBottomSheet/styles';
import {
  SBottomWrapper,
  SChecklistSettings,
  SChecklistSettingsWrapper,
  SRow,
  SSharedContainer,
  SValue,
  SWrapper,
  SLine,
} from './ChecklistDetails';

interface ChecklistInfoProps {
  data: Checklist;
  foundSharedGroups: GroupDetail[];
}

function ChecklistInfo(props: ChecklistInfoProps) {
  const { foundSharedGroups, data } = props;
  const {
    name,
    status,
    created,
    owner,
    totalTasks,
    lastEdited,
    lastEditor,
    ended,
  } = data;
  return (
    <SChecklistSettingsWrapper className="wrapper">
      <SChecklistSettings>
        <>
          <SHeader>{name}</SHeader>
          <SWrapper>
            {status === ChecklistStatus.Started && (
              <SRow>
                <SName>{translate(`modal_template_name`)}</SName>
                <SValue>{name}</SValue>
              </SRow>
            )}
            <SRow>
              <SName>{translate(`modal_item_count`)}</SName>
              <SValue>{totalTasks}</SValue>
            </SRow>
            <SRow>
              <SName>{translate(`modal_modified`)}</SName>
              {lastEdited ? (
                <SValue>
                  <p>
                    {getDateFormatCustom(
                      lastEdited!,
                      dateFormats.yearMonthDayTimeNoComma24
                    )}
                    {` ${translate(`groups_sortBy`).substring(5, 7)} ${
                      lastEditor?.displayName
                    }`}
                  </p>
                </SValue>
              ) : (
                <SValue>{translate('checklist_not_edited')}</SValue>
              )}
            </SRow>
            <SRow>
              <SName>{translate(`modal_creator`)}</SName>
              <SValue>{owner.displayName}</SValue>
            </SRow>
            {ended && (
              <SRow>
                <SName>{translate(`modal_ended`)}</SName>
                <SValue>
                  {getDateFormatCustom(
                    ended!,
                    dateFormats.yearMonthDayTimeNoComma24
                  )}
                </SValue>
              </SRow>
            )}
            <SRow>
              <SName>{translate(`modal_created`)}</SName>
              <SValue>
                {getDateFormatCustom(
                  created,
                  dateFormats.yearMonthDayTimeNoComma24
                )}
              </SValue>
            </SRow>
          </SWrapper>
        </>
        <SLine />
        <SBottomWrapper>
          <SRow>
            <SName>{translate(`modal_shared_with`)}</SName>
            <SSharedContainer>
              {foundSharedGroups.map((e,i) => (
                <SValue key={i}>{e.name}</SValue>
              ))}
            </SSharedContainer>
          </SRow>
        </SBottomWrapper>
      </SChecklistSettings>
    </SChecklistSettingsWrapper>
  );
}

export default ChecklistInfo;
