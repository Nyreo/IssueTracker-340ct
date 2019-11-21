import React, {useState} from 'react'
import { CSSTransitionGroup } from 'react-transition-group'

/* Icon imports */
import { faCaretDown, faMapMarker } from '@fortawesome/free-solid-svg-icons'

// component imports
import InputField from '../inputField'
import ErrorBox from '../utility/errorBox'
import Map from '../map'

// out sourced ui imports
import CircularProgress from '@material-ui/core/CircularProgress';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Fade from 'react-reveal/Fade'

// module imports
import {reportIssue} from '../../modules/issueHandler'

// utils imports
import Location from '../../utils/functional/location'


const ReportedMarker = () => {
    return (
        <Fade down>
            <FontAwesomeIcon className='reported-marker' icon={faMapMarker}/>
        </Fade>
    )
}

const ReportIssueForm = ({store, history}) => {

    const initialReportDetails = {
        description: '',
        type: 'Noise Pollution',
        username: '',
        dateSubmitted: 0,
        lat: '',
        lng: '',
        streetName : ''
    }
    
    const [reportDetails, setReportDetails] = useState(initialReportDetails)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [pagination, setPagination] = useState(0)
    const [userLocation, setUserLocation] = useState([])

    const RenderErrorBox = () => {
        return (
          <ErrorBox message={error} closeMe={() => setError('')}/>
        );
      }

    const setReportDescription = (e) => {
        const description = e.target.value
        setReportDetails({...reportDetails, description})
    }
    const setReportType = (e) => {
        const type = e.target.value
        setReportDetails({...reportDetails, type})
    }

    const setReportLat = (e) => {
        const lat = e.target.value
        setReportDetails({...reportDetails, lat: Number(lat)})
    }

    const setReportLng = (e) => {
        const lng = e.target.value
        setReportDetails({...reportDetails, lng: Number(lng)})
    }

    const setStreetName = (e) =>{
        const streetName = e.target.value
        setReportDetails({...reportDetails, streetName})
    }
    
    const setNewError = (msg, duration=3000) => {
        setError(msg)
        setTimeout(() => {
            setError('')
        }, duration)
    }
    const submitIssueForm = (e) => {
        e.preventDefault()

        if(JSON.stringify(reportDetails) === JSON.stringify(initialReportDetails)) {
            setNewError('please make changes...')
        } else {
            const _reportDetails = {
                ...reportDetails,
                username: store.getState().userReducer.user.username,
                dateSubmitted: Date.now()
            }
    
            // submit the issue report to the api
            reportIssue(_reportDetails)
                .then(() => {
                    try {
                        history.push('/issues')
                    } catch(err) {
                        setNewError('internal server error')
                    }
                })
                .catch((err) => {
                    setNewError(err.data)
                })
        }
        
    }

    const setCurrentLocation = (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude

        setUserLocation([lat, lng])

        // setReportDetails({...reportDetails, lat, lng})
        setLoading(false)
    }

    const getUserLocation = (e) => {
        if(e) e.preventDefault()
        setLoading(true)

        Location.getCurrentLocation(setCurrentLocation)
    }

    const nextFormPage = (e) => {
        e.preventDefault()
        if(JSON.stringify(initialReportDetails) === JSON.stringify(reportDetails) || reportDetails.description === '') {
            setNewError('please fill in the required fields...')
            return false
        } else {
            getUserLocation()
            setPagination(1)
        }
    }

    const previousFormPage = (e) => {
        e.preventDefault()
        setPagination(0)
    }

    const mapClick = (e) => {
        
        const {lat, lng} = e
        setReportDetails({...reportDetails, lat, lng})
    }

    return (
        <>
            {loading ? (<div className='loading-blocked'><span><CircularProgress color='inherit'/></span></div>) : null}
            <div className='flex report-container'>
                {/* manual report */}
                <div className={pagination ? 'report flex-no-grow anim-all-400' : 'report flex-grow anim-all-400'}>
                    {/* form --- start */}
                    <form onSubmit={submitIssueForm} className='form shadow'>
                        <h1 className='header h-centered-margin'>Report Issue</h1>
                        <CSSTransitionGroup
                            transitionName="error-box"
                            transitionAppear={true}
                            transitionAppearTimeout={200}
                            transitionLeaveTimeout={200}
                            transitionEnterTimeout={200}
                        >{error ? RenderErrorBox() : null}</CSSTransitionGroup>

                        <div className='input-fields h-centered-margin'>
                            { pagination === 0 ? 
                                <>
                                 {/* issue details */}
                                 <h2 className='section-header'>Issue Details</h2>
                                 {/* description */}
                                 <div className='row'>
                                     <span className="input-label">Issue Description</span>
                                     <textarea required rows='4' cols='50' placeholder='Please enter the issue description...' style={{marginTop : '2em'}} value={reportDetails.description} onChange={setReportDescription}></textarea>
                                 </div>
                                 {/* type */}
                                 <div className='row'>
                                     <span className="input-label">Issue Type</span>
                                     {/* TODO: change this to custom dropdown component */}
                                     <select className='input-select' value={reportDetails.type} onChange={setReportType}>
                                         <option value='Noise pollution'>Noise pollution</option>
                                         <option value='Speeding'>Speeding</option>
                                         <option value='Pothole'>Pothole</option>
                                         <option value='Litter'>Litter</option>
                                     </select>
                                     <FontAwesomeIcon className='cust-drop-icon' icon={faCaretDown}/>
                                 </div>
                                <div style={{marginTop: '2em'}}>
                                    <button className='submit-button' onClick={nextFormPage}>Next</button>
                                </div>
                                
                                </>
                                :
                                <>
                                {/* location details */}
                                <h2 className='section-header'>Issue Location</h2>
                                <p className='hint'>** Click on the map to select the location of your issue or input the location manually.</p>
                                {/* location - manual */}
                                <div className='input-double'>
                                            <InputField label={"Latitude"}  type={"text"} value={reportDetails.lat} onChange={setReportLat} required={true}/>
                                            <InputField label={"Longitude"}  type={"text"} value={reportDetails.lng} onChange={setReportLng} required={true}/>
                                </div>
                                
                                {/* streetName */}
                                <InputField label={"Street Name (Optional)"}  type={"text"} value={reportDetails.streetName} onChange={setStreetName} required={false}/>
                                    <div style={{marginTop: '2em'}}>
                                        <button className='submit-button w-fill' onClick={previousFormPage}>Back</button>
                                        <button className='submit-button w-fill gap-top' type='submit'>Submit</button>
                                    </div>
                                </>
                            }
                        </div>
                    </form>
                    {/* form --- end */}
                </div>
                {/* google maps frame */}
                { pagination === 1 && userLocation.length > 0 ? 
                    <div className='map h-centered-margin fill gap-left shadow padding-20 anim-all-400'>
                    <div className='frame'>
                    <Map 
                        onClick={mapClick} 
                        singleMarker={reportDetails.lat && reportDetails.lng ?
                            <ReportedMarker lat={reportDetails.lat} lng={reportDetails.lng} /> : null} 
                        height={'100%'} 
                        userLocation={userLocation} 
                        zoom={9} 
                        hoverDistance={30}
                    />
                    </div>
                </div>
                :
                null
                }
                
            </div>
            
        </>
    )
}

export default ReportIssueForm