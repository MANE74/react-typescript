import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import _ from 'lodash';
import styled from 'styled-components';
import { useAppSelector } from '../../hooks';

import Loader from '../../components/Loader/Loader';
import { getIsLoading, getOrgs, getSelectedOrgs } from './broadcastSlice';
import { fetchOrganizations, setSelectedOrgsAction } from './broadcastSlice/actionCreators';
import { SelectOrgItem } from './SelectOrgItem';
import { translate } from '../../utils/translate';

export const SelectOrgsList = (props: any) => {
  const dispatch = useDispatch();
  const orgs = useAppSelector(getOrgs);
  const isLoading = useAppSelector(getIsLoading);
  const selectedOrgs = useAppSelector(getSelectedOrgs);
  const [orgList, setOrgList] = useState<any[]>([]);
  const [isSelectAll, setIsSelectAll] = useState<boolean>(false);

  useEffect(() => {
    setIsSelectAll(false)
    dispatch(fetchOrganizations());
  }, [dispatch]);

  useEffect(() => {
    const sortedOrgs = orgs.filter(o => !!o.name).sort((a, b) => (!a.parentId || b.parentId) && a.name.localeCompare(b.name))
    setOrgList(sortedOrgs);
  }, [orgs]);

  useEffect(() => {
    if (orgs.length > 0 && selectedOrgs.length === orgs.length) {
      setIsSelectAll(true);
    }else{
      setIsSelectAll(false);
    }
  }, [selectedOrgs]);

  useEffect(() => {
    setOrgList(
      orgs.filter(
        (x) =>
          _.toLower(x.name).search(_.toLower(props.searchText)) !== -1
      )
    );
  }, [props.searchText]);

  const onOrgClick = (selectedOrg: any) => {
    setIsSelectAll(false);
    const foundIndex = _.findIndex(selectedOrgs, function (org) {
      return org.id === selectedOrg.id;
    });
    const tempArr = [...selectedOrgs];
    if (foundIndex > -1) {
      tempArr.splice(foundIndex, 1);
    } else {
      tempArr.push(selectedOrg);
    }
    dispatch(setSelectedOrgsAction(tempArr));
  };

  const isSelectedUser = (selectedOrgs: any[], id: number) => {
    for (let i = 0; i < selectedOrgs.length; i++) {
      if (selectedOrgs[i].id === id) {
        return i > -1;
      }
    }
    return false;
  };

  const toggleSelectAll = () => {
    if (!isSelectAll) {
      selectAllOrgs();
    } else {
      unselectAllOrgs();
    }
    setIsSelectAll(!isSelectAll);
  }

  const unselectAllOrgs = () => {
    dispatch(setSelectedOrgsAction([]));
  }

  const selectAllOrgs = () => {
    const allOrgs = _.map(orgList, (org) => {
      return ({ id: org.id, name: org.name });
    });
    dispatch(setSelectedOrgsAction(allOrgs));
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <OrgList height={'69vh'}>
      <SelectOrgItem
        key={-1}
        org={{id: -1, name: `${translate('org_list_select_all')}`, title: ''}}
        isSelected={isSelectAll}
        onCardPress={() => toggleSelectAll()}
        style={{fontSize: '16px', fontWeight: 'bold'}}
      />
      {_.map(orgList, (org) => {
        return (
          <SelectOrgItem
            key={org.id}
            org={org}
            isSelected={isSelectedUser(selectedOrgs, org.id)}
            onCardPress={() =>
              onOrgClick({ id: org.id, name: org.name })
            }
          />
        );
      })}
    </OrgList>
  );
};

const OrgList = styled.div<any>`
  margin: 0 1rem;
  height: ${(props) => props.height};
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;
