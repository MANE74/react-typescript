import React from 'react';
import CustomMarker from '../../../assets/imgs/general/custom-map-marker.svg';

export const Marker: React.FC<google.maps.MarkerOptions> = (options) => {
  const [marker, setMarker] = React.useState<google.maps.Marker>();

  var icon = {
    url: CustomMarker, // url
    scaledSize: new google.maps.Size(35, 35), // scaled size
  };

  React.useEffect(() => {
    if (!marker) {
      setMarker(
        new google.maps.Marker({
          icon: icon,
        })
      );
    }

    // remove marker from map on unmount
    return () => {
      if (marker) {
        marker.setMap(null);
      }
    };
  }, [marker]);

  React.useEffect(() => {
    if (marker) {
      marker.setOptions(options);
    }
  }, [marker, options]);

  return null;
};
