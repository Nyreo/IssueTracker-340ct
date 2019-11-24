import React, {Component} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Fade from 'react-reveal/Fade';

import * as reportFormExample from '../../images/reportForm.png'
import * as reportMapExample from '../../images/reportMap.png'
import * as issueExample from '../../images/issueExample.png'

/* Icon imports */
import { faCircle, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'

export default class Home extends Component {

  constructor(props) {
    super(props)
    this.state = {
      pagination : 0
    }

    this.data = [
      (
        <div key='data1'>
           <Fade>
            <h1>Introduction</h1>
            <p>
              <b>Welcome!</b> This website serves the purpose of allowing members of the <b>local community </b> 
              to report issues that they come across. 
              <br/><br/><br/>
              Once an issue has been <b>reported</b>, a member of staff will 
              quickly assign it a <b>priority</b> and will <b>allocate</b> a member
              of staff to resolve the issue as promptly as possible.
              <br/><br/><br/>
              Once the issue has been resolved, you will receive an email update to
              notify you of the resolution.
            </p>
          </Fade>
        </div>
       
      ),
      (
        <div key='data2'>
          <Fade>
            <h1>Found an Issue?</h1>
            <p>
              Have you found an issue? If you want this issue to be resolved ASAP
              why not report it? To report your issue, visit the<a className='link' href='/issues/report'>REPORT</a>
              page.
              <br/><br/>
              Simply fill in the details of the issue and mark the location on the map!
            </p>
            <img src={reportFormExample} alt='report form'/>
            <img src={reportMapExample} alt='report map'/>
          </Fade>
        </div>
      ),
      <div key='data3'>
          <Fade>
            <h1>Looking for local issues?</h1>
            <p>
              Are you looking for local reported issues? why not head over to the 
              <a className='link' href='/issues'>ISSUES</a> page and have a look!
              <br/><br/>
              The issues page allows you to browse all reported issues and view
              their current status and community votes.
            </p>
            <img style={{width:'80%'}} src={issueExample} alt='example of issue'/>
          </Fade>
        </div>
    ]
  }

  renderPagination = () => {
    let circles = []
    for(let i = 0; i <= this.data.length -1; i++) 
    {
      const cn = (i === this.state.pagination ? 'active' : '')
      circles.push(
        (<FontAwesomeIcon key={`circle${i}`}className={cn} icon={faCircle}/>)
      )
    }
    return circles
  }
  
  increasePagination = () => {
    const pagination = (this.state.pagination < this.data.length - 1 ? this.state.pagination + 1 : 0)
    this.setState({pagination})
  }

  decreasePagination = () => {
    const pagination = (this.state.pagination > 0 ? this.state.pagination -1 : this.data.length - 1)
    this.setState({pagination})
  }

  componentDidMount() {
    document.title = this.props.title
  }

  render() {
    return (
      <>
        <div className='section relative shadow h-centered-margin home-cover'>
          <div className='ccentered padding-20'>
  
            {this.data[this.state.pagination]}
  
            <div className='page-circles'>
              <FontAwesomeIcon className='arrow' icon={faChevronLeft} onClick={() => this.decreasePagination()}/>
              {this.renderPagination()}
              <FontAwesomeIcon className='arrow' icon={faChevronRight} onClick={() => this.increasePagination()}/>
            </div>
          </div>
          
        </div>
      </>
    )
  }
}