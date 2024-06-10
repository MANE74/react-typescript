import * as React from 'react';
import styled from 'styled-components';
export interface ITextWithExtentionProps
  extends React.HTMLAttributes<HTMLDivElement> {
  text: string;
}

const SFlexContainer = styled.div`
  display: flex;
  min-width: 0;
`;

const STitle = styled.p`
  background-color: 'yellow';

  color: ${({ theme }) => theme.palette.text.documentPrimary};
  font-family: 'Roboto-Regular';

  font-size: 1rem;

  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;

  & + span {
    color: ${({ theme }) => theme.palette.text.documentPrimary};
    font-family: 'Roboto-Regular';
    font-size: 1rem;
  }
`;
const checkExtention = /(?:\.([^.]+))?$/;

// if you want to overide the style of the text just extend the component with styled

export const TextWithExtention = (props: ITextWithExtentionProps) => {
  const { text, className } = props;
  const [hasExtention] = React.useState<RegExpExecArray | null>(
    checkExtention.exec(text)
  );
  return (
    <>
      {hasExtention && hasExtention[0].length ? (
        <SFlexContainer className={className}>
          <STitle>{text.slice(0, -(hasExtention[0].length - 1))}</STitle>
          <span>{hasExtention[0].substring(1)}</span>
        </SFlexContainer>
      ) : (
        <STitle className={className}>{text}</STitle>
      )}
    </>
  );
};
