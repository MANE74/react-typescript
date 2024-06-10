interface MessageHeaderProps {
  name: string;
  recievingGroups: string;
  forwarded?: boolean;
}

export const MessageHeader = (props: MessageHeaderProps) => {
  const { name, recievingGroups, forwarded = false } = props;
  return (
    <div>
      <p>{forwarded && 'Forwarded'}</p>
      <h3>{name}</h3>
      <p>{recievingGroups}</p>
    </div>
  );
};
