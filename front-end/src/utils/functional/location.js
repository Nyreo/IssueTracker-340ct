
const deg2rad = (value) => {
    return value * (Math.PI/180)
}

// haversine formula for calculating distance between two lat,lng coordinates
// calculates 'as the flow flys' distance between points, not complete accuracy
const distance = (lat1,lon1,lat2,lon2) => {
    const R = 6371; // radius of earth
    const dLat = deg2rad(lat2-lat1)
    const dLon = deg2rad(lon2-lon1)

    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c;
}

const getLocationFailure = () => {
    alert('There was an error or your request timed out.')
}

const getCurrentLocation = (success, fail=getLocationFailure) => {
    const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
    }
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, fail, options)
    }
}

export default {
    distance,
	getCurrentLocation
}