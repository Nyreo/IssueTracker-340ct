import React, {useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Fade from 'react-reveal/Fade';

/* Icon imports */
import { faCircle, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'

const Home = ({userData}) => {

  // eslint-disable-next-line
  const [pagination, setPagination] = useState(0)

  const data = [
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
          <p>Have you found an issue? Report it here!</p>
        </Fade>
      </div>
    ),
    <div key='data3'>
        <Fade>
          <h1>Looking for local issues?</h1>
          <p>If you are looking for local issues in your area, click HERE!</p>
        </Fade>
      </div>
  ]

  const renderPagination = () => {
    let circles = []
    for(let i = 0; i <= data.length -1; i++) 
    {
      const cn = (i === pagination ? 'active' : '')
      circles.push(
        (<FontAwesomeIcon key={`circle${i}`}className={cn} icon={faCircle}/>)
      )
    }
    return circles
  }

  const increasePagination = () => {
    if(pagination < data.length - 1) {
      setPagination(pagination + 1)
    } else {setPagination(0)}
  }

  const decreasePagination = () => {
    if(pagination > 0) {
      setPagination(pagination - 1)
    } else {setPagination(data.length - 1)}
  }

  return (
    <>
      <div className='section shadow h-centered-margin'>
        <div className='ccentered relative padding-20'>

          {data[pagination]}

          <div className='page-circles'>
            <FontAwesomeIcon className='arrow' icon={faChevronLeft} onClick={() => decreasePagination()}/>
            {renderPagination()}
            <FontAwesomeIcon className='arrow' icon={faChevronRight} onClick={() => increasePagination()}/>
          </div>
        </div>
        
      </div>
    </>
  )
}

export default Home