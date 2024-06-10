import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import end from '../../assets/imgs/general/end-im-ok.svg';
import message from '../../assets/imgs/general/contact-im-ok.svg';
import Delete from '../../assets/imgs/iamokay/iamok-delete.svg';
import Edit from '../../assets/imgs/iamokay/iamok-edit.svg';
import { ImOkStatusType } from '../../utils/enums';
import {
  deleteIamOkMessage,
  fetchImOkDocument,
  setEndImOkResponse,
  toggleImOkBottomModal,
} from '../ImOkList/imOkSlice/actionCreators';
import { useAppSelector, useAppDispatch } from '../../hooks';
import {
  selectImOkDocument,
  selectImOkIsLoading,
  isImOkBottomModalOpen,
  setShowImOkBottomModal,
} from '../ImOkList/imOkSlice';
import Loader from '../../components/Loader/Loader';
import ImOkMessage from '../../components/ImOk/ImOkMessage';
import ImOkResponseButtonGroup from '../../components/ImOk/ImOkResponseButtonGroup';
import ImOkStatusMessage from '../../components/ImOk/ImOkStatusMessage';
import _ from 'lodash';
import { ImOkResponseList } from '../../components/ImOk/ImOkResponseList';
import { useConfirmation } from '../../utils/ConfirmationServiceContext/confirmationContext';
import { useLayoutContext } from '../../utils/customHooks/LayoutContext';
import { IamOkMessageMembersType } from '../../routes/ImOk';
import { useNavigate } from 'react-router-dom';
import { checkIfNotZeroMembers } from '../ImOkList/createMessageIamOkSummary.helpers';
import { selectUser } from '../Login/LoginSlice';
import { SOptions, SPage } from '../ImOkList/im-ok.styles';
import { translate } from '../../utils/translate';
import { Modal } from '../../components/Modal/Modal';
import MapModal from '../../components/MapModal/MapModal';
import { dateFormats, getDateFormatCustom } from '../../utils/date';
import { useTranslation } from 'react-i18next';

export interface IamOkLocationDataType {
  locationName: string;
  latitude: number;
  longitude: number;
  userName: string;
  lastupdated: string;
}

interface ModalStateType {
  isOpen: boolean;
  locationData?: IamOkLocationDataType;
}

const ImOkDocument = (props: {
  setShowDots: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { setShowDots } = props;
  const confirm = useConfirmation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    setTabsState,
    setMessage: setHeaderTitle,
    setSubTitle: setHeaderSubTitle,
  } = useLayoutContext();

  const [activeButton, setActiveButton] = useState(ImOkStatusType.NotOk);
  const MINUTE_MS = 10000;

  const [createMessagesModalOpen, setCreateMessagesModalOpen] = useState(false);
  const imOkDocument = useAppSelector(selectImOkDocument);
  const isLoading = useAppSelector(selectImOkIsLoading);
  const user = useAppSelector(selectUser);
  const hasIamOkayRole = user?.roles?.includes('ManageMuster');
  const everyOnCanStartIamok = user?.organizationMusterCreateSetting === 0;

  const shouldHideTheList = hasIamOkayRole
    ? false // don't hide if the user has the role
    : everyOnCanStartIamok // if the user has not the role  , check if  everyone can start iamok
    ? imOkDocument?.creatorid !== user?.id // if yes,  hide if the user is not the one who started the iaml
    : true; // if no, hide

  const showSettingsModal = useAppSelector(isImOkBottomModalOpen);

  const [messageHeight, setMessageHeight] = useState<number | undefined>();
  const [buttonsGroupHeight, setButtonsGroupRef] = useState<
    number | undefined
  >();

  const [messagToggled, setMessagToggled] = useState<boolean>(false);

  const measuredButtonGroupsRef = useCallback(node => {
    if (node !== null) {
      setButtonsGroupRef(node.getBoundingClientRect().height);
    }
  }, []);
  const measuredMessageRef = useCallback(
    node => {
      if (node !== null) {
        setMessageHeight(node.getBoundingClientRect().height);
      }
    },
    [messagToggled]
  );

  const settingsModal = [
    {
      name: 'imOk_end',
      callback: () => handleEnd(),
      icon: end,
      hidden: shouldHideTheList || imOkDocument?.ended,
    },
    {
      name: 'imOk_contact',
      callback: () => setCreateMessagesModalOpen(true),
      icon: message,
      hidden: shouldHideTheList || imOkDocument?.ended,
    },
    {
      name: 'messages_edit',
      callback: () => {
        navigate('edit');
        dispatch(toggleImOkBottomModal(false));
      },
      icon: Edit,
      hidden: shouldHideTheList || imOkDocument?.ended,
    },
    {
      name: 'messages_delete',
      callback: () => handleDelete(),
      icon: Delete,
      hidden: shouldHideTheList,
    },
  ];

  useEffect(() => {
    if (!imOkDocument?.ended) {
      const interval = setInterval(() => {
        fetchImOk();
      }, MINUTE_MS);

      return () => {
        clearInterval(interval);
      };
    }
  }, []);

  useEffect(() => {
    fetchImOk();
    return () => {
      setMapModalState({ isOpen: false });
    };
  }, []);

  useEffect(() => {
    setHeaderTitle(imOkDocument?.subject || translate(`imOk_title`));
    setHeaderSubTitle(
      imOkDocument?.groups.length
        ? imOkDocument?.groups[0]?.name || undefined
        : undefined
    );
    return () => {
      setHeaderTitle(undefined);
      setHeaderSubTitle(undefined);
    };
  }, [imOkDocument?.subject, imOkDocument?.groups]);

  const fetchImOk = async () => {
    const id = window.location.pathname.split('/').pop();
    await dispatch(fetchImOkDocument(id || ''));
  };

  const reloadData = () => {
    fetchImOk();
  };

  const handleEnd = () => {
    confirm({
      title: 'imOk_end_modal_title',
      description: 'imOk_end_modal_text',
      onSubmit: () => {
        imOkDocument && dispatch(setEndImOkResponse(`${imOkDocument.id}`));
        dispatch(toggleImOkBottomModal(false));
      },
      onCancel: () => {
        dispatch(toggleImOkBottomModal(false));
      },
      confirmText: 'imOk_end_modal',
      cancelText: 'cancel',
    });
  };
  const handleDelete = () => {
    confirm({
      title: 'messages_confirmation',
      description: 'imOk_delete_modal_description',
      onSubmit: () => {
        if (imOkDocument) {
          dispatch(deleteIamOkMessage(imOkDocument.id, navigate));
        }
        dispatch(toggleImOkBottomModal(false));
      },
      onCancel: () => {
        dispatch(toggleImOkBottomModal(false));
      },
      confirmText: 'delete',
      cancelText: 'cancel',
    });
  };

  const openCreateMessagesModal = () => {
    dispatch(toggleImOkBottomModal(false));
    setCreateMessagesModalOpen(false);
  };

  const usersNotOk = _.filter(imOkDocument?.users, user => user.imok === false);
  const usersOk = _.filter(imOkDocument?.users, user => user.imok);
  const usersNoStatus = _.filter(
    imOkDocument?.users,
    user => user.imok === null
  );

  const sendMessagesModalButtons = [
    {
      name: 'imOk_contact_all',
      callback: () => contactMemberByType('ALL'),
      hidden: false,
    },
    {
      name: 'imOk_contact_isNotOk',
      callback: () => contactMemberByType('NOT_OK'),
      hidden:
        usersNotOk.length === 1
          ? usersNotOk[0].userid === user?.id
          : usersNotOk.length === 0,
    },
    {
      name: 'imOk_contact_isOk',
      callback: () => contactMemberByType('OK'),
      hidden:
        usersOk.length === 1
          ? usersOk[0].userid === user?.id
          : usersOk.length === 0,
    },
    {
      name: 'imOk_contact_noStatus',
      callback: () => contactMemberByType('NO_STATUS'),
      hidden:
        usersNoStatus.length === 1
          ? usersNoStatus[0].userid === user?.id
          : usersNoStatus.length === 0,
    },
  ];

  const contactMemberByType = (type: IamOkMessageMembersType) => {
    dispatch(setShowImOkBottomModal(false));
    setCreateMessagesModalOpen(false);
    if (!checkIfNotZeroMembers(type, imOkDocument!)) {
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
    imOkDocument?.users,
    item => item.userid === user.id
  );
  const hideResponseButtonsForUser = !userFromList;
  const userIsImOkCreator = imOkDocument?.creatorid === user.id;

  const filteredShowSettingsModal = _.filter(
    settingsModal,
    item => !item.hidden
  );
  const filteredSendMessagesModalButtons = _.filter(
    sendMessagesModalButtons,
    item => !item.hidden
  );

  useLayoutEffect(() => {
    if (filteredShowSettingsModal.length === 0) {
      setShowDots(false);
    } else {
      setShowDots(true);
    }
  }, [filteredShowSettingsModal.length]);

  const [mapModalState, setMapModalState] = useState<ModalStateType>({
    isOpen: false,
  });

  const setMapIsOpen = (is: boolean) => {
    setMapModalState(prev => ({ ...prev, isOpen: is }));
  };

  const handleMapCLick = (data: IamOkLocationDataType) => {
    setMapModalState(prev => ({ ...prev, locationData: data }));
    setMapIsOpen(true);
  };

  const renderMapModal = () => {
    return (
      <>
        {mapModalState.isOpen && mapModalState.locationData && (
          <Modal isOpen={mapModalState.isOpen} setIsOpen={setMapIsOpen}>
            <MapModal
              address={mapModalState.locationData.locationName}
              latitude={mapModalState.locationData.latitude}
              longitude={mapModalState.locationData.longitude}
              type={mapModalState.locationData.userName}
              withoutRecalledLabel
              withDate
              recalled={true}
              sent={getDateFormatCustom(
                mapModalState.locationData.lastupdated,
                dateFormats.mothNameDateTime
              )}
            />
          </Modal>
        )}
      </>
    );
  };

  if (!imOkDocument && isLoading) return <Loader />;

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
      {imOkDocument && (
        <ImOkMessage
          onMessagedToggled={setMessagToggled}
          ref={measuredMessageRef}
          imOkDocument={imOkDocument}
        />
      )}
      {imOkDocument && (
        <ImOkResponseList
          messageHeight={messageHeight}
          activeButton={activeButton}
          setActiveButton={setActiveButton}
          imOkDocument={imOkDocument}
          handleMapCLick={handleMapCLick}
        />
      )}
      {!imOkDocument?.ended &&
        (userIsImOkCreator || !hideResponseButtonsForUser) && (
          <ImOkResponseButtonGroup
            contactMemberByType={contactMemberByType}
            imOkDocument={imOkDocument}
            reloadData={() => reloadData()}
            hideResponseButtonsForUser={hideResponseButtonsForUser}
            userFromList={userFromList}
            userIsImOkCreator={userIsImOkCreator}
            setCreateMessagesModalOpen={setCreateMessagesModalOpen}
            ref={measuredButtonGroupsRef}
          />
        )}
      {imOkDocument?.ended && (
        <ImOkStatusMessage ref={measuredButtonGroupsRef} />
      )}
      {renderMapModal()}
    </SPage>
  );
};

export default ImOkDocument;
