import { batch } from 'react-redux';
import { NavigateFunction } from 'react-router-dom';
import {
  setActiveChecklist,
  setChecklistItems,
  setChecklists,
  setGroups,
  setIsGroupsLoading,
  setIsLoading,
  setIsUsersLoading,
  setPreSelectedGroups,
  setUsers,
} from '.';
import {
  addComment,
  changeItemStatus,
  checklistContinue,
  createNewChecklist,
  deleteTemplate,
  editChecklist,
  endChecklist,
  getChecklist,
  getChecklistItems,
  getChecklists,
  saveItems,
  shareChecklist,
  startChecklist,
  unshareChecklist,
} from '../../../apis/checklistsAPI';
import { getGroups } from '../../../apis/groupsAPI';
import { GetGroupsQuery } from '../../../apis/groupsAPI/types';
import { getAllUsers, GetUserQuery } from '../../../apis/userAPI';
import { AppThunk } from '../../../store';

export const fetchUsers =
  (query?: GetUserQuery): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(setIsUsersLoading(true));
      const users = await getAllUsers(query);
      batch(() => {
        dispatch(setUsers(users));
        dispatch(setIsUsersLoading(false));
      });
    } catch (error) {
      console.log('error log ', error);

      dispatch(setIsUsersLoading(false));
    }
  };

export const fetchGroups =
  (query?: GetGroupsQuery): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(setIsGroupsLoading(true));
      const groups = await getGroups(query);
      batch(() => {
        dispatch(setGroups(groups));
        dispatch(setIsGroupsLoading(false));
      });
    } catch (error) {
      console.log('error log ', error);
      dispatch(setIsGroupsLoading(false));
    }
  };

export const createChecklist =
  (
    list: {
      sortIndex: number;
      name: string;
    }[],
    userIds: [],
    groupIds: [],
    onSuccess: () => void
  ): AppThunk =>
  async (dispatch, getState) => {
    try {
      const res = await createNewChecklist(
        getState().checklists.checklistName,
        userIds,
        groupIds
      );
      if (res) {
        dispatch(saveChecklistItems(res.id, list, onSuccess));
      }
    } catch (error) {
      console.log('error log ', error);
    }
  };

export const changeChecklistItemStatus =
  (id: number, itemId: number, completed: boolean): AppThunk =>
  async (dispatch, getState) => {
    try {
      const res = await changeItemStatus(id, itemId, completed);
      if (res) {
        let newItems = [...getState().checklists.checklistItems];
        const foundIndex = newItems.findIndex((e) => e.id === itemId);
        newItems[foundIndex] = res;

        dispatch(setChecklistItems(newItems));
      }
    } catch (error) {
      console.log('error log ', error);
    }
  };

export const saveChecklistItems =
  (
    id: number,
    items: { name: string; sortIndex: number }[],
    onSuccess: () => void
  ): AppThunk =>
  async (dispatch, getState) => {
    try {
      const res = await saveItems(id, items);
      if (res) {
        dispatch(fetchChecklists());
        onSuccess();
      }
    } catch (error) {
      console.log('error log ', error);
    }
  };

export const sendComment =
  (id: number, itemID: number, model: { text: string | null }): AppThunk =>
  async (dispatch) => {
    try {
      const res = await addComment(id, itemID, model);
      if (res) {
        dispatch(fetchChecklistItems(id));
      }
    } catch (error) {
      console.log('error log ', error);
    }
  };

export const fetchChecklists =
  (showLoading = true): AppThunk =>
  async (dispatch) => {
    try {
      showLoading && dispatch(setIsLoading(true));
      const checklists = await getChecklists();
      dispatch(setChecklists(checklists));
      showLoading && dispatch(setIsLoading(false));
    } catch (error) {
      console.log('error log ', error);
      showLoading && dispatch(setIsLoading(false));
    }
  };

export const fetchMoreChecklists = (): AppThunk => async (dispatch) => {
  try {
    const checklists = await getChecklists();
    dispatch(setChecklists(checklists));
  } catch (error) {
    console.log('error log ', error);
  }
};

export const fetchOneChecklist =
  (id: number): AppThunk =>
  async (dispatch) => {
    try {
      const checklist = await getChecklist(id);
      dispatch(setActiveChecklist(checklist));
    } catch (error) {
      console.log('error log ', error);
    }
  };

export const fetchChecklistItems =
  (id: number): AppThunk =>
  async (dispatch) => {
    dispatch(setIsLoading(true));
    try {
      const checklistItems = await getChecklistItems(id);
      if (checklistItems) {
        batch(() => {
          dispatch(setIsLoading(false));
          dispatch(setChecklistItems(checklistItems));
        });
      }
    } catch (error) {
      console.log('error log ', error);

      dispatch(setIsLoading(false));
    }
  };

export const fetchEndChecklist =
  (id: number, navigate: NavigateFunction): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(setIsLoading(true));
      await endChecklist(id);

      batch(() => {
        dispatch(setIsLoading(false));
        dispatch(fetchChecklists());
        navigate(`/checklist/${id}`);
        dispatch(fetchOneChecklist(Number(id)));
      });
    } catch (error) {
      console.log('error log ', error);

      dispatch(setIsLoading(false));
    }
  };

export const fetchDeleteTemplate =
  (id: number): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(setIsLoading(true));
      await deleteTemplate(id);

      batch(() => {
        dispatch(setIsLoading(false));
        dispatch(fetchChecklists());
      });
    } catch (error) {
      console.log('error log', error);
      dispatch(setIsLoading(false));
    }
  };

export const fetchContinueChecklist =
  (id: number, onSuccess: () => void): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(setIsLoading(true));
      await checklistContinue(id);

      batch(() => {
        dispatch(setIsLoading(false));
        dispatch(fetchChecklists());
      });
      onSuccess();
    } catch (error) {
      console.log('error log', error);
      dispatch(setIsLoading(false));
    }
  };

export const startChecklistAction =
  (id: number, groupIDs: number[], navigate: NavigateFunction): AppThunk =>
  async (dispatch, getState) => {
    try {
      var res = await startChecklist(
        id,
        groupIDs,
        getState().checklists.checklistName
      );
      if (res) {
          dispatch(fetchChecklists());
          navigate(`/checklist/${res.id}`)
      }
    } catch (error) {
      console.log('error log', error);
      dispatch(setIsLoading(false));
    }
  };

export const shareChecklistWithGroups =
  (id: number, groupIDs: number[], onSuccess: () => void): AppThunk =>
  (dispatch) => {
    dispatch(setIsLoading(true));
    var promises: any[] = [];
    groupIDs.forEach((groupID) => {
      promises.push(
        new Promise(async (resolve, reject) => {
          try {
            const res = await shareChecklist(id, groupID);
            resolve(res);
          } catch (error) {
            console.log(
              `error sharing with group: ${groupID}. Error: ${error}`
            );
            reject();
          }
        })
      );
    });
    Promise.allSettled(promises)
      .then(() => {
        dispatch(setIsLoading(false));
        onSuccess();
      })
      .catch((err) => console.log(err));
  };

  export const unshareChecklistWithGroups =
  (id: number, groupIDs: number[], onSuccess:()=>void): AppThunk =>
  (dispatch) => {
    dispatch(setIsLoading(true));
    var promises: any[] = [];
    groupIDs.forEach((groupID) => {
      promises.push(
        new Promise(async (resolve, reject) => {
          try {
            const res = await unshareChecklist(id, groupID);
            resolve(res);
          } catch (error) {
            console.log(
              `error sharing with group: ${groupID}. Error: ${error}`
            );
            reject();
          }
        })
      );
    });
    Promise.allSettled(promises)
      .then(() => {
        onSuccess()
        dispatch(setIsLoading(false));
      })
      .catch((err) => console.log(err));
  };

export const editChecklistItems =
  (checklistID: number, items: any[], onSuccess: () => void): AppThunk =>
  async (dispatch) => {
    try {
      await editChecklist(checklistID, items);
      onSuccess();
    } catch (error) {
      console.log('error log', error);
      dispatch(setIsLoading(false));
    }
    onSuccess();
  };

  export const editChecklistGroups =
  (checklistID: number, selectedGroupIds: number[], unselectedGroupsIds: number[], onSuccess: ()=>void): AppThunk =>
  async (dispatch) => {
    let resolved = 0
    dispatch(setIsGroupsLoading(true))
    
    const handleResolved = ()=>{
      resolved++;
      if(resolved == 2) {
        batch(()=>{
          dispatch(fetchChecklists());
          dispatch(fetchGroups({ menuitem: 'checklists' }));
          dispatch(setIsGroupsLoading(false))
          dispatch(setPreSelectedGroups([]))
        })
        onSuccess()
      }
    }

    dispatch(unshareChecklistWithGroups((checklistID), unselectedGroupsIds, handleResolved));
    dispatch(
      shareChecklistWithGroups((checklistID), selectedGroupIds, handleResolved)
    );
  };
