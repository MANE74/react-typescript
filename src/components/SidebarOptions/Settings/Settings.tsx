import React, { useEffect, useState } from 'react';
import { Layout } from '../../Layout/Layout';
import SettingsItem from './SettingsItem';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { useNavigate } from 'react-router-dom';
import Loader from '../../Loader/Loader';
import {
  selectUser,
  selectUserMenuItems,
} from '../../../containers/Login/LoginSlice';
import { Page } from '../../Page/Page';
import BigFloatButton from '../../BigFloatButton/BigFloatButton';
import {
  getUserAccountInfo,
  saveSettings,
} from './settingsSlice/actionCreators';
import { selectIsSettingsLoading, selectSettings } from './settingsSlice';
import { SettingsType } from './settingsSlice/types';
import _ from 'lodash';

export interface SettingsSection {
  visable: boolean;
  id: number;
  name: string;
  checked: boolean;
  callback: (arg0: boolean) => void;
}

function Settings() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const menuItems = useAppSelector(selectUserMenuItems);
  const user = useAppSelector(selectUser);
  const settings = useAppSelector(selectSettings);
  const isLoading = useAppSelector(selectIsSettingsLoading);

  const [settingsState, setSettingsState] = useState<SettingsType>({
    notifyChecklists: false,
    notifyDocuments: false,
    notifyWithEmail: false,
  });
  const [settingsStateInitial, setSettingsStateInitial] =
    useState<SettingsType>({
      notifyChecklists: false,
      notifyDocuments: false,
      notifyWithEmail: false,
    });
  // Should get this with local storage I guess
  //const [tutorials, setTutorials] = useState(false);

  useEffect(() => {
    if (user) dispatch(getUserAccountInfo(user.id));
  }, []);

  useEffect(() => {
    if (settings) {
      setSettingsState(settings);
      setSettingsStateInitial(settings);
    }
  }, [settings]);

  const emailCb = (notifyWithEmail: boolean) => {
    setSettingsState({ ...settingsState, notifyWithEmail: !notifyWithEmail });
  };

  const checklistsCb = (notifyChecklists: boolean) => {
    setSettingsState({ ...settingsState, notifyChecklists: !notifyChecklists });
  };

  const docsCb = (notifyDocuments: boolean) => {
    setSettingsState({
      ...settingsState,
      notifyDocuments: !notifyDocuments,
    });
  };

  // const tutorialCb = (turOffTutorial: boolean) => {
  //   setTutorials(!turOffTutorial);
  // };

  const showChecklistSetting =
    menuItems?.find((e) => e.technicalName === 'checklists') !== undefined;
  const showDocumentSetting =
    menuItems?.find((e) => e.technicalName === 'documents') !== undefined;

  const settingsItems: SettingsSection[] = [
    {
      visable: true,
      id: 0,
      name: 'sidebar_settings_notifyByEmail',
      checked: settingsState.notifyWithEmail,
      callback: emailCb,
    },
    /* hidden for now untill the client provide new tutorials  */
    // {
    //   visable: true,
    //   id: 1,
    //   name: 'sidebar_settings_tutorial',
    //   checked: tutorials,
    //   callback: tutorialCb,
    // },
    {
      visable: showChecklistSetting,
      id: 2,
      name: 'sidebar_settings_allowNews',
      checked: settingsState.notifyChecklists,
      callback: checklistsCb,
    },
    {
      visable: showDocumentSetting,
      id: 3,
      name: 'sidebar_settings_allowDocsNotifications',
      checked: settingsState.notifyDocuments,
      callback: docsCb,
    },
  ];

  const save = () => {
    dispatch(saveSettings(settingsState, () => navigate('/sidebar')));
  };

  if (isLoading) {
    return (
      <Layout isMessageLayout message="settings" to="/sidebar">
        <Page>
          <Loader />
        </Page>
      </Layout>
    );
  }

  return (
    <Layout isMessageLayout message="settings" to="/sidebar" showBottomTabs>
      <Page>
        {settingsItems.map((item, key) => (
          <SettingsItem
            visable={item.visable}
            name={item.name}
            id={item.id}
            checked={item.checked}
            key={key}
            callback={item.callback}
          />
        ))}
        <div style={{ flex: 1 }} />
        {!_.isEqual(settingsStateInitial, settingsState) && (
          <BigFloatButton tx="save" onClick={save} extraPadding />
        )}
      </Page>
    </Layout>
  );
}

export default Settings;
