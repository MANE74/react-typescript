const BASE_URL = `${process.env.REACT_APP_API_URL}`;

export interface GetImageLinkProps {
  imageName: string | null;
  size?: 'small' | 'medium' | 'large';
}
export const getImageLink = (props: GetImageLinkProps): string => {
  const { imageName, size } = props;
  if (!imageName) return '';

  const imageWithoutExtension = imageName.replace(/\.[^/.]+$/, '');
  const imageExtension = imageName.split('.').pop();
  return `${BASE_URL}/api/media/file/${imageWithoutExtension}${
    size ? '_' + size : ''
  }.${imageExtension}`;
};
