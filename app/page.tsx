import React from 'react'
import  Explorebtn from "./components/ExploreBtn"

const page = () => {
  return (
    <section>
      <h1 className='text-center'>The Hub For every dev <br /> Event You Can't Miss </h1>
      <p className='mt-5 text-center'>Hackathons , Meetups and Conferences all in one place </p>
      <Explorebtn/>

      <div className='mt-20 space-y-7'>
<h1>Featured Events</h1>

<ul className='events'></ul>
{[1,2,3,4,5].map((event)=>(
<li key={event}>Event {event}</li>
))}
      </div>
    </section>
  )
}

export default page