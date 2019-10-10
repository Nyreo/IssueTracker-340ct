import React from 'react'


const Home = ({userData}) => {
    return (
      <div>
        <h1>This is the home page you {(userData.user.username === 'joe') ? "god" : "n00b" }</h1>
      </div>
    )
  }

export default Home