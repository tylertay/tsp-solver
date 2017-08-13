import React from 'react';
import { withGoogleMap, GoogleMap, Marker, DirectionsRenderer } from 'react-google-maps';

export const MyGoogleMap = withGoogleMap(props => {
  const labelMap = {};
  if (props.labels) {
    for (let i = 0; i < props.labels.length; i++) {
      labelMap[props.labels[i]] = i;
    }
  }
  return (
    <GoogleMap
      defaultZoom={12}
      defaultCenter={{ lat: 1.3553790, lng: 103.8400040 }}
      onClick={props.onMapClick}
    >
      {props.markers.map((marker, index) => (
        <Marker
          key={index}
          label={
            (typeof (props.labels[index]) !== 'undefined') ?
            (labelMap[index] + 1).toString() : ''
          }
          {...marker}
          onRightClick={() => props.onMarkerRightClick(index)}
        />
      ))}
      {
        (props.directions.length !== 0) &&
        <DirectionsRenderer
          directions={props.directions}
          options={{ suppressMarkers: true }}
        />
      }
    </GoogleMap>
  );
});
