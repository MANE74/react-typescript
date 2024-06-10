import React, { useEffect } from 'react';
import styled from 'styled-components';
import Loader from '../../components/Loader/Loader';
import { TutorialItem } from '../../components/TutorialItem/TutorialItem';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  selectIsVideoTutorialLoading,
  selectTutorialsImages,
  selectTutorialsList,
} from './supportSlice';
import { getTutorials } from './supportSlice/actionCreators';

export const VideoSupport = () => {
  const dispatch = useAppDispatch();

  const tutorialsList = useAppSelector(selectTutorialsList);
  const iconsList = useAppSelector(selectTutorialsImages);
  const isLoading = useAppSelector(selectIsVideoTutorialLoading);

  useEffect(() => {
    if (!tutorialsList) {
      dispatch(getTutorials());
    }
  }, [dispatch]);

  if (isLoading) return <Loader />;

  return (
    <SSection>
      <SListContainer>
        {tutorialsList &&
          tutorialsList.map((item, index) => (
            <TutorialItem
              key={item.id.toString()}
              icon={iconsList[index]}
              title={item.tutorialContents[0].title}
              link={item.id.toString()}
            />
          ))}
      </SListContainer>
    </SSection>
  );
};

const SSection = styled.section`
  padding: 1rem 6%;
  height: 100%;
`;

const SListContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: 1rem;
  row-gap: 1rem;
  place-items: center;
`;
