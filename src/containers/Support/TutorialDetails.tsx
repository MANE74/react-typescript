import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Tutorial, _getTutorialDetail } from '../../apis/mediaAPI';
import { useAppDispatch, useAppSelector } from '../../hooks';

import parse from 'html-react-parser';
import { CollapsibleCard } from '../../components/CollapsibleCard/CollapsibleCard';
import styled from 'styled-components';
import { translate } from '../../utils/translate';
import { palette } from '../../theme/colors';
import { selectTutorials, selectTutorialSubTutorial } from './supportSlice';
import { getTutorials } from './supportSlice/actionCreators';
import { Button } from '../../components/Button/Button';
import { getHtmlready, tutorialLinks } from './helper';
import Loader from '../../components/Loader/Loader';
import { useConfirmation } from '../../utils/ConfirmationServiceContext/confirmationContext';
import BigFloatButton from '../../components/BigFloatButton/BigFloatButton';
import { getItem } from '../../utils/storage';

export const TutorialDetails = () => {
  let { id } = useParams();
  const confirm = useConfirmation();
  const dispatch = useAppDispatch();
  const navigation = useNavigate();

  const subTutorials = useAppSelector(selectTutorialSubTutorial(+id!));
  const tutorials = useAppSelector(selectTutorials);

  const [tutorial, setTutorial] = useState<Tutorial>();
  const [tutorialContent, setTutorialContent] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const language = getItem('language');

  const goToFeatureHandler = () => {
    tutorial?.menuItemName && navigation(tutorialLinks[tutorial?.menuItemName]);
  };

  const init = async () => {
    if (id && +id) {
      try {
        setIsLoading(true);
        const _tutorial = await _getTutorialDetail({ id: +id, language });
        setTutorial(_tutorial);
        setTutorialContent(getHtmlready(_tutorial.tutorialContents[0].content));
        setIsLoading(false);
      } catch (e) {
        setIsLoading(false);
        confirm({
          title: 'warning',
          description: 'general_network_error',
          onSubmit: () => {
            init();
          },
          confirmText: 'retry',
        });
      }
    }
    if (!tutorials) {
      dispatch(getTutorials());
    }
  };

  useEffect(() => {
    init();
  }, []);

  if (isLoading) return <Loader />;

  return (
    <SSection>
      <STutorialDetails>
        <STitle>{translate('profile_support_tutorials')}:</STitle>
        {tutorialContent && (
          <SHTMLWrapper> {parse(tutorialContent)}</SHTMLWrapper>
        )}
        {subTutorials &&
          subTutorials.map((item) => (
            <>
              <CollapsibleCard
                key={item.id.toString()}
                title={item.tutorialContents[0].title}
              >
                <SHTMLWrapper>
                  {item.tutorialContents[0].content &&
                    parse(getHtmlready(item.tutorialContents[0].content)!)}
                </SHTMLWrapper>
              </CollapsibleCard>
            </>
          ))}
        <StretchedDiv />
        <BigFloatButton
          style={{
            backgroundColor: palette.unitedNationsBlue,
            color: palette.white,
          }}
          onClick={goToFeatureHandler}
          tx="profile_support_go_to_feature"
        />
      </STutorialDetails>
    </SSection>
  );
};

const SSection = styled.section`
  padding: 0 1rem;
  height: 100%;
`;

const STutorialDetails = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;

  padding: 1rem 0 5rem;

  /* vertical scrolling + hide scroller bar  */
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const STitle = styled.h1`
  margin-bottom: 0.625rem;
  font-family: 'Roboto-Medium';
  font-size: 1.125rem;
  color: ${palette.white};
`;

const SHTMLWrapper = styled.div`
  color: ${palette.silver};
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  .video-wrapper {
    width: 100%;
    height: 12rem;

    video {
      width: 100%;
      height: 100%;
      border-radius: 14px;
    }
  }
`;

const StretchedDiv = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
`;
