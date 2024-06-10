import React, { useCallback, useEffect, useState } from 'react';
import end from '../../assets/imgs/general/end-im-ok.svg';
import message from '../../assets/imgs/general/contact-im-ok.svg';
import Delete from '../../assets/imgs/iamokay/iamok-delete.svg';
import Edit from '../../assets/imgs/iamokay/iamok-edit.svg';
import { OnCallAlertStatusType } from '../../utils/enums';
import { useAppSelector, useAppDispatch } from '../../hooks';
import Loader from '../../components/Loader/Loader';
import _ from 'lodash';
import { getItem } from '../../utils/storage';
import { useConfirmation } from '../../utils/ConfirmationServiceContext/confirmationContext';
import {
  deleteOnCallAlertMessage,
  fetchOnCallAlertDocument,
  setOnCallAlertEnd,
  toggleOnCallAlertBottomModal,
} from '../OnCallAlertList/onCallAlertSlice/actionCreators';
import {
  isOnCallAlertBottomModalOpen,
  selectOnCallAlertDocument,
  selectOnCallAlertIsLoading,
  setShowOnCallAlertBottomModal,
} from '../OnCallAlertList/onCallAlertSlice';
import OnCallAlertMessage from '../../components/OnCallAlert/OnCallAlertMessage';
import { OnCallAlertResponseList } from '../../components/OnCallAlert/OnCallAlertResponseList';
import OnCallAlertStatusMessage from '../../components/OnCallAlert/OnCallAlertStatusMessage';
import OnCallAlertResponseButtonGroup from '../../components/OnCallAlert/OnCallAlertResponseButtonGroup';
import { useNavigate } from 'react-router-dom';
import { useLayoutContext } from '../../utils/customHooks/LayoutContext';
import { OnCallAlertkMessageMembersType } from '../../routes/OnCallAlert';
import { checkOnCallAlertIfNotZeroMembers } from '../OnCallAlertList/createMessageOnCallAlertSummary.helpers';
import { SOptions, SPage } from '../OnCallAlertList/on-call-alert.styles';
import { translate } from '../../utils/translate';

const OnCallAlertDocument = (props: {
  setShowDots: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { setShowDots } = props;
  const confirm = useConfirmation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    setTabsState,
    setMessage: setHeaderTitle,
    setSubTitle: setHeaderSubTitle,
  } = useLayoutContext();

  const [activeButton, setActiveButton] = useState(
    OnCallAlertStatusType.NotAvailable
  );
  const MINUTE_MS = 10000;
  const [createMessagesModalOpen, setCreateMessagesModalOpen] = useState(false);
  const onCallAlertDocument = useAppSelector(selectOnCallAlertDocument);
  const isLoading = useAppSelector(selectOnCallAlertIsLoading);
  const user = getItem('user');
  const hasOnCallAlertRole = user?.roles?.includes('OnCallAlerts');

  const showSettingsModal = useAppSelector(isOnCallAlertBottomModalOpen);

  const [messageHeight, setMessageHeight] = useState<number | undefined>();
  const [buttonsGroupHeight, setButtonsGroupRef] = useState<
    number | undefined
  >();

  const [messagToggled, setMessagToggled] = useState<boolean>(false);

  const measuredButtonGroupsRef = useCallback((node) => {
    if (node !== null) {
      setButtonsGroupRef(node.getBoundingClientRect().height);
    }
  }, []);
  const measuredMessageRef = useCallback(
    (node) => {
      if (node !== null) {
        setMessageHeight(node.getBoundingClientRect().height);
      }
    },
    [messagToggled]
  );

  const settingsModal = [
    {
      name: 'onCallAlert_end',
      callback: () => handleEnd(),
      icon: end,
      hidden:
        !hasOnCallAlertRole ||
        onCallAlertDocument?.senderId !== user?.id ||
        onCallAlertDocument?.ended,
    },
    {
      name: 'imOk_contact',
      callback: () => setCreateMessagesModalOpen(true),
      icon: message,
      hidden:
        !hasOnCallAlertRole ||
        onCallAlertDocument?.senderId !== user?.id ||
        onCallAlertDocument?.ended,
    },
    {
      name: 'messages_edit',
      callback: () => {
        navigate('edit');
        dispatch(toggleOnCallAlertBottomModal(false));
      },
      icon: Edit,
      hidden:
        !hasOnCallAlertRole ||
        onCallAlertDocument?.senderId !== user?.id ||
        onCallAlertDocument?.ended,
    },
    {
      name: 'messages_delete',
      callback: () => handleDelete(),
      icon: Delete,
      hidden: !hasOnCallAlertRole || onCallAlertDocument?.senderId !== user?.id,
    },
  ];

  useEffect(() => {
    if (!onCallAlertDocument?.ended) {
      const interval = setInterval(() => {
        fetchOnCallAlert();
      }, MINUTE_MS);

      return () => clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    fetchOnCallAlert();
  }, []);

  useEffect(() => {
    setHeaderTitle(
      onCallAlertDocument?.subject || translate('onCallAlert_screen')
    );
    setHeaderSubTitle(onCallAlertDocument?.groupName || undefined);
    return () => {
      setHeaderTitle(undefined);
      setHeaderSubTitle(undefined);
    };
  }, [onCallAlertDocument?.subject, onCallAlertDocument?.groupName]);

  const fetchOnCallAlert = async () => {
    const id = window.location.pathname.split('/').pop();
    dispatch(fetchOnCallAlertDocument(Number(id)));
  };
  const reloadData = () => {
    fetchOnCallAlert();
  };

  const handleEnd = () => {
    confirm({
      title: 'confirmLeaveGroupTitle',
      description: 'onCallAlert_endText',
      onSubmit: () => {
        onCallAlertDocument &&
          dispatch(setOnCallAlertEnd(onCallAlertDocument.id));
        dispatch(toggleOnCallAlertBottomModal(false));
      },
      onCancel: () => {
        dispatch(toggleOnCallAlertBottomModal(false));
      },
      confirmText: 'imOk_end_modal',
      cancelText: 'cancel',
    });
  };

  const handleDelete = () => {
    confirm({
      title: 'messages_confirmation',
      description: 'onCallAlert_delete_modal_description',
      onSubmit: () => {
        if (onCallAlertDocument) {
          dispatch(deleteOnCallAlertMessage(onCallAlertDocument.id, navigate));
        }
        dispatch(toggleOnCallAlertBottomModal(false));
      },
      onCancel: () => {
        dispatch(toggleOnCallAlertBottomModal(false));
      },
      confirmText: 'delete',
      cancelText: 'cancel',
    });
  };

  const openCreateMessagesModal = () => {
    dispatch(toggleOnCallAlertBottomModal(false));
    setCreateMessagesModalOpen(false);
  };

  const usersNotAvailable = _.filter(
    onCallAlertDocument?.users,
    (user) => user.status === OnCallAlertStatusType.NotAvailable
  );
  const usersAvailable = _.filter(
    onCallAlertDocument?.users,
    (user) => user.status === OnCallAlertStatusType.Available
  );
  const usersNoStatus = _.filter(
    onCallAlertDocument?.users,
    (user) => user.status === OnCallAlertStatusType.NoStatus
  );

  const sendMessagesModalButtons = [
    {
      name: 'imOk_contact_all',
      callback: () => contactMemberByType('ALL'),
      hidden: false,
    },
    {
      name: 'onCallAlert_contact_no_participate',
      callback: () => contactMemberByType('NOT_AVAILANLE'),
      hidden: usersNotAvailable.length === 0,
    },
    {
      name: 'onCallAlert_contact_can_participate',
      callback: () => contactMemberByType('AVIALABLE'),
      hidden: usersAvailable.length === 0,
    },
    {
      name: 'onCallAlert_contact_noAnswer',
      callback: () => contactMemberByType('NO_STATUS'),
      hidden: usersNoStatus.length === 0,
    },
  ];

  const contactMemberByType = (type: OnCallAlertkMessageMembersType) => {
    dispatch(setShowOnCallAlertBottomModal(false));
    setCreateMessagesModalOpen(false);
    if (!checkOnCallAlertIfNotZeroMembers(type, onCallAlertDocument!)) {
      setTabsState(false);
      navigate(`createMessageSummary/${type}`);
    } else {
      confirm({
        title: 'cec_noMembers',
        description: 'cec_noMembers',
        onSubmit: () => {},
        confirmText: 'done',
        cancelText: 'cancel',
      });
    }
  };

  const userFromList = _.find(
    onCallAlertDocument?.users,
    (item) => item.userId === user.id
  );

  const hideResponseButtonsForUser = !userFromList;
  const userIsImOkCreator = onCallAlertDocument?.senderId === user.id;

  const filteredShowSettingsModal = _.filter(
    settingsModal,
    (item) => !item.hidden
  );
  const filteredSendMessagesModalButtons = _.filter(
    sendMessagesModalButtons,
    (item) => !item.hidden
  );

  useEffect(() => {
    if (filteredShowSettingsModal.length === 0) {
      setShowDots(false);
    } else {
      setShowDots(true);
    }
  }, [filteredShowSettingsModal.length]);

  if (!onCallAlertDocument && isLoading) return <Loader />;

  return (
    <SPage $paddingBottom={buttonsGroupHeight}>
      <SOptions
        isOpen={showSettingsModal || createMessagesModalOpen}
        setIsOpen={() => openCreateMessagesModal()}
        setTabBar
        items={
          createMessagesModalOpen
            ? filteredSendMessagesModalButtons
            : filteredShowSettingsModal
        }
      />
      {onCallAlertDocument && (
        <OnCallAlertMessage
          onMessagedToggled={setMessagToggled}
          ref={measuredMessageRef}
          onCallAlertDocument={onCallAlertDocument}
        />
      )}
      {onCallAlertDocument && (
        <OnCallAlertResponseList
          messageHeight={messageHeight}
          activeButton={activeButton}
          setActiveButton={setActiveButton}
          onCallAlertDocument={onCallAlertDocument}
        />
      )}

      {!onCallAlertDocument?.ended &&
        (userIsImOkCreator || !hideResponseButtonsForUser) && (
          <OnCallAlertResponseButtonGroup
            contactMemberByType={contactMemberByType}
            onCallAlertDocument={onCallAlertDocument}
            reloadData={() => reloadData()}
            hideResponseButtonsForUser={hideResponseButtonsForUser}
            userFromList={userFromList}
            userIsImOkCreator={userIsImOkCreator}
            setCreateMessagesModalOpen={setCreateMessagesModalOpen}
            ref={measuredButtonGroupsRef}
          />
        )}
      {onCallAlertDocument?.ended && (
        <OnCallAlertStatusMessage ref={measuredButtonGroupsRef} />
      )}
    </SPage>
  );
};

export default OnCallAlertDocument;
