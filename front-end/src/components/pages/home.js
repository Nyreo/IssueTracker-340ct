import React, {useState} from 'react'


const Home = ({userData}) => {

  // eslint-disable-next-line
  const [pagination, setPagination] = useState(0)

  const data = [
    {
      title: 'Introduction',
      content: 'This website allows you, the user, to report any local issues you have discovered so that they can be identified and promptly dealt with.'
    }
  ]

  return (
    <>
      <div className='section shadow h-centered-margin'>
        <h1>{data[pagination].title}</h1>
        <p>{data[pagination].content}</p>
      </div>
    </>
  )
}

export default Home