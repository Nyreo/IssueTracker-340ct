import React, {useState} from 'react'
import { CSSTransitionGroup } from 'react-transition-group'

/* Icon imports */
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'

// component imports
import InputField from '../inputField'
import ErrorBox from '../utility/errorBox'

import CircularProgress from '@material-ui/core/CircularProgress';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// module imports
import {reportIssue} from '../../modules/issueHandler'

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

        setReportDetails({...reportDetails, lat, lng})
        setLoading(false)
    }

    const getUserLocation = (e) => {
        e.preventDefault()
        setLoading(true)

        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(setCurrentLocation)
        }
    }

    const nextFormPage = () => {
        if(JSON.stringify(initialReportDetails) === JSON.stringify(reportDetails) || reportDetails.description === '') {
            setNewError('please fill in the required fields...')
            return false
        } else {
            setPagination(1)
        }
    }

    const previousFormPage = () => {
        setPagination(0)
    }

    return (
        <>
            {loading ? (<div className='loading-blocked'><span><CircularProgress color='inherit'/></span></div>) : null}
            <div className='flex report-container'>
                {/* manual report */}
                <div className='report'>
                    {/* form --- start */}
                    <form onSubmit={submitIssueForm} className='form shadow'>
                        <h1 className='header centered'>Report Issue</h1>
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
                                 <button className='submit-button' onClick={() => nextFormPage()}>Next</button>
                                </>
                                :
                                <>
                                {/* location details */}
                                <h2 className='section-header'>Issue Location</h2>
                                {/* location - auto*/}
                                <div className='row'>
                                    <span className='input-label'>Automatically Get Location</span>
                                    <button className='input-button underline-input' onClick={getUserLocation}>Get Current Location</button>
                                </div>
                                {/* location - manual */}
                                <div className='input-double'>
                                            <InputField label={"Latitude"}  type={"text"} value={reportDetails.lat} onChange={setReportLat} required={true}/>
                                            <InputField label={"Longitude"}  type={"text"} value={reportDetails.lng} onChange={setReportLng} required={true}/>
                                </div>
                                
                                {/* streetName */}
                                <InputField label={"Street Name (Optional)"}  type={"text"} value={reportDetails.streetName} onChange={setStreetName} required={false}/>
                                <div className='input-double'>
                                    <div className='row'>
                                        {/* back button */}
                                        <button className='submit-button' onClick={() => previousFormPage()}>Back</button>
                                    </div>
                                    <div className='row'>
                                        {/* back button */}
                                        <button className='submit-button' type='submit'>Submit</button>
                                    </div>
                                </div>
                                </>
                            }
                        </div>
                    </form>
                    {/* form --- end */}
                </div>
                {/* google maps frame */}
                <div className='map h-centered-margin'>
                    <div className='frame'>
                        <img src='https://media.wired.com/photos/59269cd37034dc5f91bec0f1/master/pass/GoogleMapTA.jpg' alt='map'/>
                    </div>
                </div>
            </div>
            
        </>
    )
}

export default ReportIssueForm