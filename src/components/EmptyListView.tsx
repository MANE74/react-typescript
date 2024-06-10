import React from 'react'
import styled from 'styled-components'
import { translate } from "../utils/translate"

interface EmptyListViewProps {
  text: string
  icon: string
}

const EmptyListView = (props: EmptyListViewProps) => {
  const {icon, text} = props
  return (
    <EmptyListWrapper><Icon src={icon}/> <Text>{translate(text)}</Text></EmptyListWrapper>
  )
}

export default EmptyListView

const EmptyListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const Text = styled.p`
  max-width: 10rem;
  text-align: center;
  font-size: 1rem;
`;

export const Icon = styled.img`
  margin-top: -10rem;
  object-fit: cover;
  margin-bottom: 0.5rem;
`;