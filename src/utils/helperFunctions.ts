export const splitName = (name: string) => {
  const firstName = name.split(' ')[0];
  const lastName = name.split(' ')[1];

  return {
    firstName,
    lastName,
  };
};
