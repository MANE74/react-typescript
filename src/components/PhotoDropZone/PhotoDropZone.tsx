import React, { useCallback, useState } from 'react';
import Dropzone from 'react-dropzone';
import { SDropZoneBox } from './PhotoDropZone.style';
export interface IPhotoDropZoneProps {
  onSelectPhoto?: (photoFormData: FormData) => void;
}

export const PhotoDropZone = (props: IPhotoDropZoneProps) => {
  const { onSelectPhoto } = props;

  const [photoFile, setPhotoFile] = useState();

  const onDrop = useCallback(acceptedFiles => {
    const _photoFile = acceptedFiles[0] as File;
    console.log(_photoFile);
    setPhotoFile(_photoFile);
    const formData = new FormData();
    formData.append('image', {
      name: _photoFile.name,
      value: _photoFile.arrayBuffer,
      // fileName: _photoFile.fileName,
      // name: _photoFile.fileName,
    });
    // formData.append("file", {
    //   type: _photoFile[0].type,
    // });

    //   uri: _photoFile[0].uri,
    //   type: _photoFile[0].type,
    //   file: _photoFile[0].fileName,
    //   data: _photoFile[0].data
  }, []);

  return (
    // <div style={{ backgroundColor: "orange" }}>
    <Dropzone accept={'image/jpeg, image/png'} onDrop={onDrop}>
      {({ getRootProps, getInputProps }) => (
        <div {...getRootProps()}>
          <SDropZoneBox>
            <input {...getInputProps()} />
            <p>Drag 'n' drop some files here, or click to select files</p>
          </SDropZoneBox>
        </div>
      )}
    </Dropzone>
    // </div>
  );
};
