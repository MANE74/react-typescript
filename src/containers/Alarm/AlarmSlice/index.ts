import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../store';
import { AlarmState, EmergencyType } from './types';

const initialState: AlarmState = {
  types: [],
  isLoading: false,
  selectedType: null,
  selectedGroups: [],
  alarmCreateModel: null,
  selectedGroupType: [],
};

const alarmSlice = createSlice({
  name: 'alarm',
  initialState,
  reducers: {
    setTypes: (state, action: PayloadAction<EmergencyType[]>) => {
      state.types = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setSelectedGroups: (state, action: PayloadAction<number[]>) => {
      state.selectedGroups = action.payload;
    },
    clearSelectedGroups: (state) => {
      state.selectedGroups = initialState.selectedGroups;
    },
    setAlarmCreateModel: (state, action: PayloadAction<EmergencyType>) => {
      state.alarmCreateModel = action.payload;
    },
    setSelectedGroupType: (state, action: PayloadAction<number[]>) => {
      state.selectedGroupType = action.payload;
    },
    resetAlarmSlice: (state) => {
      state.types= [];
      state.isLoading= false;
      state.selectedType= null;
      state.selectedGroups= [];
      state.alarmCreateModel= null;
      state.selectedGroupType= [];
    }
  },
});

// export store actions
export const {
  setTypes,
  setIsLoading,
  setSelectedGroups,
  clearSelectedGroups,
  setAlarmCreateModel,
  setSelectedGroupType,
  resetAlarmSlice
} = alarmSlice.actions;

// data selecting could be seperated also
export const selectTypes = (state: RootState) => state.alarm.types;
export const selectTypeByID = (state: RootState, typeID: number) =>
  state.alarm.types?.find((type) => type.ID === typeID);
export const selectAlarmGroups = (state: RootState) =>
  state.alarm.selectedGroups;
export const isAlarmLoading = (state: RootState) => state.alarm.isLoading;
export const getSelectedGroupType = (state: RootState) =>
  state.alarm.selectedGroupType;
export const getAlarmCreateModel = (state: RootState) =>
  state.alarm.alarmCreateModel;

export default alarmSlice.reducer;
