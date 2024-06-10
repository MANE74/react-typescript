import styled from 'styled-components';

const SPage = styled.section<any>`
  padding: 1.25rem;
  height: 100%;
  @supports (-webkit-touch-callout: none) {
    /* CSS specific to iOS devices */
    /* height: 100%;
    min-height: 100vh; */
  }

  padding-bottom: ${props => props.noBottomPadding && 0};
`;

interface PageProps {
  children: React.ReactNode;
  className?: string;
  noBottomPadding?: boolean;
}

export const Page = ({ children, className }: PageProps) => {
  return (
    <SPage className={className} noBottomPadding>
      {children}
    </SPage>
  );
};
