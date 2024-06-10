import { compact } from 'lodash';
import { RootState } from '../../../store';
import { Group } from '../../GroupsList/groupsSlice/types';
import { ChecklistFilters } from '../ChecklistFilter';

export const filterGroupChecklists = (
    state: RootState,
    filters: ChecklistFilters
  ): Group[] => {
    const {
        groups: allGroups,
    } = state.checklists;
  
    let clonedGroups: Group[] = [...allGroups];
    //let groupsForAccounts: Group[] = [...allGroups];
  
    if (filters.memberFilter !== undefined && filters.memberFilter.length !== 0) {
      if (
        filters.memberFilter.includes('NOT_MEMBER') &&
        filters.memberFilter.includes('MEMBER')
      ) {
      } else if (filters.memberFilter.includes('NOT_MEMBER')) {
        clonedGroups = clonedGroups.filter(g => !g.member);
        //groupsForAccounts = clonedGroups;
      } else if (filters.memberFilter.includes('MEMBER')) {
        clonedGroups = clonedGroups.filter(g => g.member);
        //groupsForAccounts = clonedGroups;
      }
    }
  
    if (
      filters.selectedData !== undefined &&
      filters.selectedData !== 'SELECTED_ALL' &&
      filters.selectedData !== 'UNSELECTED_ALL'
    ) {
      const filterIds = Array.from(filters.selectedData);
      clonedGroups = clonedGroups.filter(group => {
        const id = group.subOrganizationID || group.organizationID!;
        return filterIds.includes(id);
      });
      //groupsForAccounts = clonedGroups;
    }
  
    return clonedGroups;
  };