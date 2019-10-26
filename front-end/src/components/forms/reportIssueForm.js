import React, {useState} from 'react'

// component imports
import InputField from '../inputField'

// module imports
import {reportIssue} from '../../modules/issueHandler'

const ReportIssueForm = ({store, history}) => {

    const [reportDetails, setReportDetails] = useState({
        description: '',
        type: 'Noise Pollution',
        username: '',
        dateSubmitted: 0,
        lat: 0,
        lng: 0,
        streetName : ''
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const setReportDescription = (e) => {
        const description = e.target.value
        setReportDetails({...reportDetails, description})
    }
    const setReportType = (e) => {
        const type = e.target.value
        setReportDetails({...reportDetails, type})
    }

    // const setReportPriority = (e) => {
    //     const priority = e.target.value
    //     setReportDetails({...reportDetails, priority})
    // }

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

    const submitIssueForm = (e) => {
        e.preventDefault()

        const _reportDetails = {
            ...reportDetails,
            username: store.getState().userReducer.user.username,
            dateSubmitted: Date.now()
            // type: (reportDetails.type === 'Other' ? otherType : reportDetails.type)
        }

        // submit the issue report to the api
        reportIssue(_reportDetails)
            .then((response) => {
                try {
                    history.push('/issues')
                } catch(err) {
                    setError('internal server error')
                }
            })
            .catch((err) => {
                setError(err.data)
            })
    }

    const setCurrentLocation = (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude

        setReportDetails({...reportDetails, lat, lng})

        setLoading(false)
    }

    const getUserLocation = (e) => {
        // get the user's current coordinates from the browser
        e.preventDefault()

        setLoading(true)

        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(setCurrentLocation)
        }
    }

    return (
        <>
            {loading ? (<div className='loading-blocked'><span>Loading...</span></div>) : null}
            {error ? <p>{error}</p> : null}
            <div className='flex report-container'>
                {/* manual report */}
                <div className='report'>
                    {/* form --- start */}
                    <form onSubmit={submitIssueForm} className='form'>
                        <h1 className='header centered'>Report Issue</h1>
                        <div className='input-fields h-centered-margin'>
                            <div className='row'>
                                <span className="input-label">Issue Description</span>
                                <textarea rows='4' cols='50' placeholder='Please enter the issue description...' style={{marginTop : '2em'}} value={reportDetails.description} onChange={setReportDescription}></textarea>
                            </div>
                            
                                {/* <InputField label={"Personal Priority"}  type={"text"} value={reportDetails.priority} onChange={setReportPriority}/> */}
                                {/* <InputField label={"Type of Issue"}  type={"text"} value={reportDetails.type} onChange={setReportType}/> */}
                            <div className='row'>
                                <span className="input-label">Issue Type</span>
                                <select className='input-select' value={reportDetails.type} onChange={setReportType}>
                                    <option value='Noise pollution'>Noise pollution</option>
                                    <option value='Speeding'>Speeding</option>
                                    <option value='Pothole'>Pothole</option>
                                    <option value='Litter'>Litter</option>
                                    {/* <option value='Other'>Other...</option> */}
                                </select>
                            </div>
                            {/* { reportDetails.type === 'Other' ? 
                                    (
                                        <div className='row'>
                                            <InputField label={"Type"} placeholder='Please enter another issue type' type={"text"} value={otherType} onChange={setOtherReportType}/>
                                        </div>
                                    )
                                    :
                                    null
                                } */}
                            <div className='row'>
                                <button onClick={getUserLocation}>Get Current Location</button>
                            </div>
                            <div className='input-double'>
                                        <InputField label={"Latitude"}  type={"text"} value={reportDetails.lat} onChange={setReportLat}/>
                                        <InputField label={"Longitude"}  type={"text"} value={reportDetails.lng} onChange={setReportLng}/>
                            </div>
                            <InputField label={"Street Name (Optional)"}  type={"text"} value={reportDetails.streetName} onChange={setStreetName}/>
                            <input className="submit-button" type='submit' value='Submit' />
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