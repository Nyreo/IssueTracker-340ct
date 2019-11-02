import React, {useState} from 'react'


const Home = ({userData}) => {

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
      {/* <div className='section shadow h-centered-margin'>
        <h1>What do I do if I have found an issue?</h1>
        <p>Simply sign up for an account and visit the report issue page where you will
          find a form that can be filled out with the details of the issue you have discovered.
        </p>
      </div> */}
    </>
  )
}

export default Home