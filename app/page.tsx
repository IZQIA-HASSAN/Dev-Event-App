import React from 'react'
import  Explorebtn from "./components/ExploreBtn"
import EventCard from './components/EventCard'
import {events} from "./libs/Constants"


const page = () => {
  return (
    <section>
      <h1 className='text-center'>The Hub For every dev <br /> Event You Can't Miss </h1>
      <p className='mt-5 text-center'>Hackathons , Meetups and Conferences all in one place </p>
      <Explorebtn/>

      <div className='mt-20 '>
<h1>Featured Events</h1>

<ul className='events '>
  {events.map((event)=>(
  <li key={event.title}>
    <EventCard {...event}/>
  </li>
))}
</ul>

      </div>
    </section>
  )
}

export default page