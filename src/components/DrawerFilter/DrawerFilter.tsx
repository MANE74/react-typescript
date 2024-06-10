import * as React from 'react';
import { SourceItem } from '../../containers/News/newsSlice/types';
import { translate } from '../../utils/translate';
import {
  FilterContainer,
  FilterButton,
  FilterActions,
  FilterActionApply,
  FilterActionCancel,
  FilterButtonWrapper,
  FilterTitle,
} from './DrawerFilter.style';
import { ReactComponent as CheckIcon } from '../../assets/imgs/news/news_filter_check.svg';

interface IDrawerFilterProps {
  sources: SourceItem[];
  chosenSources: SourceItem[];
  setChooseSource: any;
  onApply: any;
  onCancel: any;
}

const DrawerFilter = (props: IDrawerFilterProps) => {
  const { sources, chosenSources, setChooseSource, onApply, onCancel } = props;
  const selectAllItem = {
    id: -1,
    name: translate('news_filter_all') as string,
  };

  React.useEffect(() => {
    if (sources.length === chosenSources.length + 1) {
      setChooseSource([...chosenSources, selectAllItem]);
    }
  }, [chosenSources]);

  const toggleSelection = (source: SourceItem) => {
    const sourceIds =
      chosenSources.length > 0 ? chosenSources.map((s) => s.id) : [];

    if (source.id !== -1 && sourceIds.includes(source.id)) {
      setChooseSource(
        chosenSources.filter((s) => ![-1, source.id].includes(s.id))
      );
    }

    if (source.id !== -1 && !sourceIds.includes(source.id)) {
      setChooseSource([...chosenSources, source]);
    }

    if (source.id === -1 && sourceIds.includes(-1)) {
      setChooseSource([]);
    }

    if (source.id === -1 && !sourceIds.includes(-1)) {
      setChooseSource([...sources]);
    }
  };

  return (
    <FilterContainer>
      <FilterTitle>{translate('news_choose_source')}</FilterTitle>

      <FilterButtonWrapper>
        {sources.map((source) => (
          <FilterButton
            key={source.name}
            onClick={() => toggleSelection(source)}
          >
            {source.name}
            {chosenSources.find((s) => s.id === source.id) ? <CheckIcon /> : ''}
          </FilterButton>
        ))}
      </FilterButtonWrapper>

      <FilterActions>
        <FilterActionCancel onClick={() => props.onCancel()}>
          <p>{translate('news_filter_cancel')}</p>
        </FilterActionCancel>

        <FilterActionApply onClick={() => props.onApply(chosenSources)}>
          <p>{translate('news_filter_apply')}</p>
        </FilterActionApply>
      </FilterActions>
    </FilterContainer>
  );
};

export default DrawerFilter;
