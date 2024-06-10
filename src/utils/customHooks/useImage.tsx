import { useEffect, useState } from 'react';
import { getImage, GetImageProps } from '../../apis/mediaAPI';

export const useImage = (props: GetImageProps) => {
  const { imageName, size, svg } = props;

  const [img, setImg] = useState<string>('');
  const [isImageLoading, setIsImageLoading] = useState<boolean>();

  let mounted = true;

  const getThatImage = async () => {
    setIsImageLoading(true);

    const image = await getImage({ imageName, size, svg }); 
    if (mounted) {
      setImg(image);
      setIsImageLoading(false);
    }

    return image;
  };
  useEffect(() => {
    getThatImage();
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      mounted = false;
      setIsImageLoading(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { isImageLoading, img };
};
