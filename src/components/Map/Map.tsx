import {
  useEffect,
  useRef,
  useState,
  cloneElement,
  isValidElement,
  Children,
  EffectCallback,
} from 'react';
import { createCustomEqual } from 'fast-equals';

interface MapProps extends google.maps.MapOptions {
  style: { [key: string]: string };
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onIdle?: (map: google.maps.Map) => void;
  ref?: any;
  inputRef?: any;
  onSearch?: (lat: number, lng: number) => void;
}

export const Map: React.FC<MapProps> = ({
  onClick,
  onIdle,
  children,
  style,
  inputRef,
  onSearch,
  ...options
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();

  useEffect(() => {
    if (ref.current && !map) {
      setMap(new window.google.maps.Map(ref.current, {}));
    }
  }, [ref, map]);

  const styledMapType = new google.maps.StyledMapType(
    [{ elementType: 'labels.icon', stylers: [{ visibility: 'off' }] }],
    { name: 'Styled Map' }
  );

  if (map) {
    map.mapTypes.set('styled_map', styledMapType);
    map.setMapTypeId('styled_map');
  }

  if (map && onSearch) {
    const searchBox = new window.google.maps.places.SearchBox(inputRef.current);
    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', () => {
      searchBox.setBounds(map.getBounds() as google.maps.LatLngBounds);
    });
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', () => {
      const places = searchBox.getPlaces();

      if (!places || places.length === 0) {
        return;
      }

      // For each place, get the icon, name and location.
      const bounds = new google.maps.LatLngBounds();

      places.forEach((place) => {
        if (!place.geometry || !place.geometry.location) {
          console.log('Returned place contains no geometry');
          return;
        }

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }

        onSearch(place.geometry.location.lat(), place.geometry.location.lng());
      });
      map.fitBounds(bounds);
    });
  }

  useEffect(() => {
    if (map) {
      ['click', 'idle'].forEach((eventName) =>
        google.maps.event.clearListeners(map, eventName)
      );

      if (onClick) {
        map.addListener('click', onClick);
      }

      if (onIdle) {
        map.addListener('idle', () => onIdle(map));
      }
    }
  }, [map, onClick, onIdle]);

  const deepCompareEqualsForMaps = createCustomEqual(
    (deepEqual) => (a: any, b: any) => {
      if (
        isLatLngLiteral(a) ||
        a instanceof google.maps.LatLng ||
        isLatLngLiteral(b) ||
        b instanceof google.maps.LatLng
      ) {
        return new google.maps.LatLng(a).equals(new google.maps.LatLng(b));
      }

      // TODO extend to other types

      // use fast-equals for other objects
      return deepEqual(a, b);
    }
  );

  function useDeepCompareMemoize(value: any) {
    const ref = useRef();

    if (!deepCompareEqualsForMaps(value, ref.current)) {
      ref.current = value;
    }

    return ref.current;
  }

  function useDeepCompareEffectForMaps(
    callback: EffectCallback,
    dependencies: any[]
  ) {
    useEffect(callback, dependencies.map(useDeepCompareMemoize));
  }

  function isLatLngLiteral(obj: any): obj is google.maps.LatLngLiteral {
    return (
      typeof obj === 'object' &&
      Number.isFinite(obj.lat) &&
      Number.isFinite(obj.lng)
    );
  }

  useDeepCompareEffectForMaps(() => {
    if (map) {
      map.setOptions(options);
    }
  }, [map, options]);

  return (
    <>
      <div ref={ref} style={style} />
      {Children.map(children, (child) => {
        if (isValidElement(child)) {
          // set the map prop on the child component
          return cloneElement(child, { map });
        }
      })}
    </>
  );
};
