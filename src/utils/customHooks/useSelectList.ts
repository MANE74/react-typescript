import { useEffect, useState } from 'react';

export interface SelectlistOptions {
  key?: string | undefined;
}

interface UseSelectlistParams {
  data: any[];
  multiStage?: boolean;
  options?: SelectlistOptions;
  initialSelected?: Set<number | string>;
}

export const useSelectlist = (params: UseSelectlistParams) => {
  let {
    data,
    options = {
      key: 'id',
    },
  } = params;
  const { multiStage = false, initialSelected } = params;

  const [selectedItems, setSelectedItems]: [
    Set<number | string>,
    (set: Set<number | string>) => void
  ] = useState(initialSelected ? initialSelected : new Set());

  const [stagedSelectedItems, setStagedSelectedItems]: [
    Set<number | string>,
    (set: Set<number | string>) => void
  ] = useState(initialSelected ? initialSelected : new Set());

  useEffect(() => {
    initialSelected && setSelectedItems(initialSelected);
    initialSelected && setStagedSelectedItems(initialSelected);
  }, [initialSelected]);

  if (!(data instanceof Array)) {
    data = [];
  }
  if (options === null) {
    options = {};
  }
  if (!options.key) {
    options.key = 'id';
  }
  // interface HandleSelectCallback {
  //   prev: boolean;
  //   current: boolean;
  // }

  const handleSelect = (
    key?: string | number
    // callback?: (params: HandleSelectCallback) => void
  ) => {
    if (multiStage) {
      setStagedSelectedItems(new Set(selectedItems));
      if (key) {
        if (stagedSelectedItems.has(key)) {
          stagedSelectedItems.delete(key);
          // callback && callback({ prev: true, current: false });
        } else {
          stagedSelectedItems.add(key);
          // callback && callback({ prev: false, current: true });
        }
        return setStagedSelectedItems(new Set(stagedSelectedItems));
      }
      if (stagedSelectedItems.size === data.length) {
        return setStagedSelectedItems(new Set());
      }
      setStagedSelectedItems(new Set(data.map(item => item[options.key!])));
      return;
    }

    if (key) {
      if (selectedItems.has(key)) {
        selectedItems.delete(key);
        // callback && callback({ prev: true, current: false });
      } else {
        selectedItems.add(key);
        // callback && callback({ prev: false, current: true });
      }
      return setSelectedItems(new Set(selectedItems));
    }
    if (selectedItems.size === data.length) {
      return setSelectedItems(new Set());
    }
    setSelectedItems(new Set(data.map(item => item[options.key!])));
  };

  return {
    isSelectedAll:
      data.length === 0 ? false : selectedItems.size === data.length,
    selectedItems,
    setSelectedItems,
    handleSelect,

    isStagedSelectedAll:
      data.length === 0 ? false : stagedSelectedItems.size === data.length,
    isNonStagedSelected:
      data.length === 0 ? true : stagedSelectedItems.size === 0,
    stagedSelectedItems,
    onFinishSelecting: (applied: boolean) => {
      if (applied) {
        setSelectedItems(new Set(stagedSelectedItems));
      } else {
        setStagedSelectedItems(new Set(selectedItems));
      }
    },
  };
};
