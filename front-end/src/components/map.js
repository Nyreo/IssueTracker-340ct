import React, {Component} from 'react'
import GoogleMapReact from 'google-map-react'

import Marker from './marker'

class Map extends Component {

	renderMarkers = () => {
		// renders the issues provided as markers
		const markers = this.props.issues.map(issue => {
			return (
				<Marker key={`marker${issue.id}`} text={issue.id}/>
			)
		})
		return markers
	}

	render() {
		return (
			<div style={{ height: '350px', width: '100%' }}>
				<GoogleMapReact
				bootstrapURLKeys={{ key: 'AIzaSyAjld9X9LpHG8qabXQAG95iwU_YWTQ9ej0' }}
				defaultCenter={this.props.center}
				defaultZoom={this.props.zoom}
				>
				{this.renderMarkers()}
				</GoogleMapReact>
			</div>
		)
	}
}
export default Map