import React from 'react';
import MapView, {PROVIDER_GOOGLE} from "react-native-maps";

class MapViewComponent extends React.PureComponent {
  render() {
    return (
      <MapView
        ref={this.props.mapRef}
        style={{ flex: 1 }}
        provider={PROVIDER_GOOGLE}
        initialRegion={this.props.initialRegion}
        region={this.props.region}
        onRegionChangeComplete={this.props.onRegionChangeComplete}
      >
        {this.props.children}
      </MapView>
    );
  }
}


export default MapViewComponent;
