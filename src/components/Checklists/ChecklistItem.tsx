import React, { SyntheticEvent } from 'react';
import styled from 'styled-components';
import { ReactComponent as File } from '../../assets/imgs/checklists/file.svg';
import { ReactComponent as FileEnded } from '../../assets/imgs/checklists/file-ended.svg';
import { ReactComponent as FileTemplate } from '../../assets/imgs/checklists/file-template.svg';
import { ReactComponent as Dots } from '../../assets/imgs/general/option-dots.svg';
import { setActiveChecklist } from '../../containers/Checklists/checklistsSlice';
import { Checklist } from '../../containers/Checklists/checklistsSlice/types';
import { useAppDispatch } from '../../hooks';
import { palette } from '../../theme/colors';
import { ChecklistStatus } from '../../utils/enums';
import { useNavigate } from 'react-router-dom';
import { dateFormats, getDateFormatCustom } from '../../utils/date';
import { ReactComponent as ArrowRight } from '../../assets/imgs/checklists/arrow-right.svg';
import { ReactComponent as Groups } from '../../assets/imgs/checklists/groups.svg';
import { translate } from '../../utils/translate';

interface ChecklistItemProps {
  checklist: Checklist;
  onDotsClick: () => void;
  overview?: boolean;
}

function ChecklistItem(props: ChecklistItemProps) {
  const { checklist, onDotsClick, overview } = props;

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onClick = () => {
    navigate(`/checklist/${checklist.id}`, {
      state: { fromOverview: overview },
    });
  };

  const handleDotsClick = (e: SyntheticEvent) => {
    e.stopPropagation();
    dispatch(setActiveChecklist(checklist));
    onDotsClick();
  };

  const getGroupLength = () => {
    const length = checklist.sharedGroups.length;
    if (length === 1) {
      return `${length} ${translate('messages_groups').slice(0, -1)}`;
    }
    return `${length} ${translate('messages_groups')}`;
  };

  return (
    <>
      <SChecklistItem onClick={onClick}>
        <SRow>
          {checklist.status === ChecklistStatus.Ended ? (
            <FileEnded />
          ) : checklist.status === ChecklistStatus.NotStarted ? (
            <FileTemplate />
          ) : (
            <File />
          )}
          <SNameContainer>
            <p className="checklist">{checklist.name} </p>
            <div className="groups">
              <Groups />
              <p className="group">{getGroupLength()}</p>
            </div>
          </SNameContainer>
        </SRow>
        <SRow className="right">
          <div className="timeContainer">
            <p>
              {getDateFormatCustom(
                checklist.created,
                dateFormats.mothNameShortDateTimeNoComma24
              )}
            </p>
          </div>
          {overview ? (
            <ArrowRight style={{ filter: 'invert(1)' }} />
          ) : (
            <div className="dotsContainer">
              <Dots onClick={handleDotsClick} />
            </div>
          )}
        </SRow>
      </SChecklistItem>
      <SLine />
    </>
  );
}

export default ChecklistItem;

export const SChecklistItem = styled.div`
  min-height: 4rem;
  color: ${palette.white};
  text-decoration: none;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;

  .timeContainer {
    margin-right: 0.2rem;
    align-items: center;
    align-self: flex-start;
    p {
      font-family: 'Roboto-Regular';
      font-weight: 400;
      font-size: 12px;
    }
  }

  .dotsContainer {
    cursor: pointer;
    display: flex;
    align-self: flex-start;
  }
`;

const SRow = styled.div`
  display: flex;
  max-width: 69%;
  min-height: 2.375rem;
  align-items: center;

  .right {
    margin-bottom: auto;
  }
`;

const SNameContainer = styled.div`
  max-width: 75%;
  overflow-wrap: break-word;
  margin-left: 1.5rem;

  .checklist {
    font-family: 'Roboto-Regular';
    font-weight: 400;
    font-size: 14px;
  }

  .groups {
    margin-top: 4px;
    display: flex;
    align-items: center;
  }

  .group {
    padding-left: 4px;
    font-family: 'Roboto-Regular';
    color: ${palette.silver};
    font-weight: 400;
    font-size: 12px;
  }
`;

const SLine = styled.hr`
  margin: 0;
  width: 100%;
  border: 1px solid ${palette.tinyBorder};
`;
