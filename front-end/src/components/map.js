import React, {Component} from 'react'
import GoogleMapReact from 'google-map-react'

import Marker from './marker'

const InfoBox = (props) => {

	const dateReported = new Date(props.issue.dateSubmitted).toLocaleDateString()

	return (
		<div className='info-box shadow'>
			{/* <div><b>Description</b>: {props.issue.description}</div> */}
			<div><b>Status</b>: {props.issue.status}</div>
			<div><b>Date Reported</b>: {dateReported}</div>
			<div style={{display:'block', paddingTop:'10px'}}>Click for more details!</div>
		</div>
		)
  }

class Map extends Component {

	static defaultProps = {
		center: {lat: 40.73, lng: -73.93}, 
		zoom: 12
	 }

	state = {
		issue: {},
		lat : '',
		lng: '',
		zoom: this.props.zoom,
		hover: false,
		clicked:  false,
		currentPosition: false,
		infoBox: false,
		height : this.props.height ? this.props.height : '350px'
	}

	renderMarkers = () => {
		// renders the issues provided as markers
		const markers = this.props.issues.map(issue => {
			return (
				<Marker 
					key={`marker${issue.id}`} 
					lat={issue.lat} 
					lng={issue.lng} 
					issue={issue}
					hover={this.state.hover}
					onClick={() => this.onClick()}
					/>
			)
		})
		return markers
	}

	onChildMouseEnter = (_, childProps) => {
		if (childProps.issue === undefined) return null
		else {
		  this.setState({
			issue: childProps.issue,
			lat: childProps.lat,
			lng: childProps.lng,
			hover: true
		  })
		}
	  }

	  onChildMouseLeave = (_, childProps) => {
		if (childProps.issue === undefined) return null
		else {
		  this.setState({
			issue: {},
			lat: "",
			lng: "",
			hover: false
		  })
		}
	  }

	  onClick = () => {
		//   console.log(this.state.issue)
		  this.setState({
			  clicked: !this.state.clicked
		  })
		  this.props.onMapClick(this.state.issue)
	  }

	render() {

		// console.log(this.props.issues)

		const infoBox = this.state.hover ? <InfoBox lat={this.state.lat} lng={this.state.lng} issue={this.state.issue}/> : null

		// const currentPin = this.state.currentPin ? <CurrentPin lat={this.props.}
		return (
			<div style={{ height: this.state.height, width: '100%' }}>
				<GoogleMapReact
					bootstrapURLKeys={{ key: 'AIzaSyAjld9X9LpHG8qabXQAG95iwU_YWTQ9ej0' }}
					defaultCenter={this.props.center}
					defaultZoom={this.props.zoom}
					center={this.props.userLocation}
					onChildMouseEnter={this.onChildMouseEnter}
					onChildMouseLeave={this.onChildMouseLeave}
					onClick={this.props.onClick}
				>
				{this.props.issues ? this.renderMarkers() : null}
				{infoBox}
				{this.props.singleMarker}
				{this.props.currentMarker}
				</GoogleMapReact>
			</div>
		)
	}
}
export default Map