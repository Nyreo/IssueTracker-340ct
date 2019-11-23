import React, {Component} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Fade from 'react-reveal/Fade';

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
            <p>This website allows you, the user, to report any local issues you have discovered so that they can be identified and promptly dealt with.</p>
          </Fade>
        </div>
       
      ),
      (
        <div key='data2'>
          <Fade>
            <h1>Found an Issue?</h1>
            <p>Have you found an issue? Report it <a href='/issues/report'>HERE!</a></p>
          </Fade>
        </div>
      ),
      <div key='data3'>
          <Fade>
            <h1>Looking for local issues?</h1>
            <p>If you are looking for local issues in your area, click <a href='/issues'>HERE!</a></p>
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
        <div className='section shadow h-centered-margin'>
          <div className='ccentered relative padding-20'>
  
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