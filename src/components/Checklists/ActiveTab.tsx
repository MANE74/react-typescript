import React from 'react';
import { TabProps } from '../../containers/Checklists/Checklists';
import ChecklistItem from './ChecklistItem';
import emptyList from '../../assets/imgs/NotFound/no-result.svg';
import { EmptyListFallback } from '../EmptyListFallback/EmptyListFallback';

interface ActiveProps extends TabProps {
  overview?: boolean;
}

function Active(props: ActiveProps) {
  const { checklists, onDotsClick, overview } = props;
  return (
    <div>
      {checklists.map((item) => (
        <ChecklistItem
          checklist={item}
          key={item.id}
          onDotsClick={onDotsClick}
          overview={overview}
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

export default Active;
