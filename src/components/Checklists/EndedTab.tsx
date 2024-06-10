import React from 'react';
import { TabProps } from '../../containers/Checklists/Checklists';
import { EmptyListFallback } from '../EmptyListFallback/EmptyListFallback';
import ChecklistItem from './ChecklistItem';
import emptyList from '../../assets/imgs/NotFound/no-result.svg'
interface EndedProps extends TabProps {}

function Ended(props: EndedProps) {
  const { checklists, onDotsClick } = props;
  return (
    <div>
      {checklists.map((item) => (
        <ChecklistItem
          checklist={item}
          key={item.id}
          onDotsClick={onDotsClick}
        />
      ))}
      {checklists.length === 0 &&
        <EmptyListFallback
          src={emptyList}
          listLength={checklists.length}
          isLoading={false}
          searchTerm={''}
          emptyListTx={'empty_checklists'}
          noSearchTx={'messages_not_found_search'}
        />}
    </div>
  );
}

export default Ended;
